<?php
// api/services/AuthService.php

class AuthService {
    public static function generateToken($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function validateToken($token) {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) {
            return false;
        }
        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signature = $tokenParts[2];
        
        $validSignature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));
        
        if (hash_equals($base64UrlSignature, $signature)) {
            $payloadData = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
            // Check expiration if added
            if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
                return false;
            }
            return $payloadData;
        }
        return false;
    }

    public static function getAuthUser() {
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
        } else {
            $headers = [];
        }
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $payloadData = self::validateToken($token);
            if ($payloadData && isset($payloadData['user_id']) && is_numeric($payloadData['user_id'])) {
                $db = Database::getConnection();
                $stmt = $db->prepare('SELECT id FROM users WHERE id = :id AND deleted_at IS NULL');
                $stmt->execute(['id' => $payloadData['user_id']]);
                if ($stmt->fetch()) {
                    return $payloadData;
                }
            }
            return false;
        }

        if (isset($_GET['token'])) {
            $payloadData = self::validateToken($_GET['token']);
            if ($payloadData && isset($payloadData['user_id']) && is_numeric($payloadData['user_id'])) {
                $db = Database::getConnection();
                $stmt = $db->prepare('SELECT id FROM users WHERE id = :id AND deleted_at IS NULL');
                $stmt->execute(['id' => $payloadData['user_id']]);
                if ($stmt->fetch()) {
                    return $payloadData;
                }
            }
            return false;
        }

        return false;
    }

    public static function requireAuth() {
        $user = self::getAuthUser();
        if (!$user || empty($user['user_id'])) {
            Response::error('Unauthorized', 401);
        }
        return $user;
    }
}
