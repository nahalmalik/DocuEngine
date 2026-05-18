<?php
// api/controllers/AuthController.php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../services/MailService.php';

class AuthController {
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::error('Email and password required', 400);
        }

        $userModel = new User();
        $user = $userModel->findByEmail($data['email']);

        if ($user && password_verify($data['password'], $user['password_hash'])) {
            if (isset($user['email_verified']) && (int)$user['email_verified'] !== 1) {
                Response::error('Email not verified. Please check your inbox.', 403);
            }
            $payload = [
                'user_id' => $user['id'],
                'role' => $user['role'],
                'exp' => time() + (60 * 60 * 24 * 7) // 7 days
            ];
            $token = AuthService::generateToken($payload);
            
            Response::success([
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            Response::error('Invalid credentials', 401);
        }
    }

    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            Response::error('Name, email, and password are required', 400);
        }

        // Validate password length
        if (strlen($data['password']) < 6) {
            Response::error('Password must be at least 6 characters long', 400);
        }

        $userModel = new User();

        // Check if email already exists
        $existingUser = $userModel->findByEmail($data['email']);
        if ($existingUser) {
            Response::error('Email is already registered', 409);
        }

        // Hash password
        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

        // Create user
        $userId = $userModel->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password_hash' => $passwordHash
        ]);

        if ($userId) {
            // Generate verification token and send email
            $verifyToken = bin2hex(random_bytes(16));
            $userModel->setVerifyToken($userId, $verifyToken);

            $verifyUrl = BASE_URL . '/public/#/verify?token=' . urlencode($verifyToken);
            $subject = APP_NAME . ' - Verify Your Email';
            $message = "Hello,\n\nPlease verify your email by clicking the link below:\n" . $verifyUrl . "\n\nIf you did not register, please ignore this email.\n";
            MailService::send($data['email'], $subject, $message, false);

            Response::success(['message' => 'Registration successful. Please check your email to verify your account.'], 201);
        } else {
            Response::error('Failed to register user', 500);
        }
    }

    public function verify() {
        $token = $_GET['token'] ?? null;
        if (!$token) Response::error('Missing token', 400);

        $userModel = new User();
        $user = $userModel->findByVerifyToken($token);
        if (!$user) Response::error('Invalid or expired token', 400);

        $userModel->verifyById($user['id']);
        Response::success(['message' => 'Email verified. You may now login.']);
    }

    public function requestReset() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['email'])) Response::error('Email required', 400);

        $userModel = new User();
        $user = $userModel->findByEmail($data['email']);
        if (!$user) Response::error('If that email exists an instruction has been sent', 200);

        $token = bin2hex(random_bytes(16));
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour
        $userModel->setResetToken($user['id'], $token, $expires);

        $resetUrl = BASE_URL . '/public/#/reset?token=' . urlencode($token);
        $subject = APP_NAME . ' - Password Reset';
        $message = "Hello,\n\nTo reset your password click the link below:\n" . $resetUrl . "\n\nThis link will expire in 1 hour.\n";
        MailService::send($data['email'], $subject, $message, false);

        Response::success(['message' => 'If that email exists an instruction has been sent']);
    }

    public function reset() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['token']) || empty($data['password'])) Response::error('Token and new password required', 400);

        $userModel = new User();
        $user = $userModel->findByResetToken($data['token']);
        if (!$user) Response::error('Invalid token', 400);

        if (empty($user['reset_expires']) || strtotime($user['reset_expires']) < time()) {
            Response::error('Token expired', 400);
        }

        if (strlen($data['password']) < 6) Response::error('Password must be at least 6 characters', 400);

        $newHash = password_hash($data['password'], PASSWORD_BCRYPT);
        $userModel->updatePassword($user['id'], $newHash);
        Response::success(['message' => 'Password updated successfully']);
    }

    public function check() {
        $authUser = AuthService::requireAuth();
        $userModel = new User();
        $user = $userModel->findById($authUser['user_id']);
        if ($user) {
            Response::success(['user' => $user]);
        } else {
            Response::error('User not found', 404);
        }
    }

    public function logout() {
        // Since JWT is stateless, logout is mostly handled client-side by deleting the token.
        // For added security, you could implement a token blacklist here.
        Response::success(['message' => 'Logged out successfully']);
    }
}
