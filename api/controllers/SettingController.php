<?php
// api/controllers/SettingController.php

require_once __DIR__ . '/../services/AuthService.php';

class SettingController {
    public function index() {
        $user = AuthService::requireAuth();
        $db = Database::getConnection();
        
        $stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user['user_id']]);
        
        $settings = [];
        while ($row = $stmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        Response::success($settings);
    }

    public function update() {
        $user = AuthService::requireAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!is_array($data)) {
            Response::error('Invalid data payload', 400);
        }

        $db = Database::getConnection();
        
        // Define storage path for images
        $storagePath = __DIR__ . '/../../storage/images/';
        if (!is_dir($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $baseUrl = defined('BASE_URL') ? rtrim(BASE_URL, '/') : ($protocol . '://' . $host . '/quotation-system');

        foreach ($data as $key => $value) {
            // Check if the value is a Base64 image
            if (is_string($value) && preg_match('/^data:image\/(\w+);base64,/', $value, $type)) {
                $base64Data = substr($value, strpos($value, ',') + 1);
                $ext = strtolower($type[1]);
                if (in_array($ext, ['png', 'jpg', 'jpeg', 'gif'])) {
                    $decodedData = base64_decode($base64Data);
                    if ($decodedData !== false) {
                        $filename = $key . '_' . $user['user_id'] . '_' . time() . '.' . $ext;
                        $filePath = $storagePath . $filename;
                        file_put_contents($filePath, $decodedData);
                        
                        // Replace the Base64 string with the actual file URL
                        $value = $baseUrl . '/storage/images/' . $filename;
                    }
                }
            }

            $stmt = $db->prepare("INSERT INTO settings (user_id, setting_key, setting_value) 
                                  VALUES (:user_id, :setting_key, :setting_value)
                                  ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmt->execute([
                'user_id' => $user['user_id'],
                'setting_key' => $key,
                'setting_value' => $value
            ]);
        }
        
        Response::success(['message' => 'Settings updated successfully']);
    }
}
