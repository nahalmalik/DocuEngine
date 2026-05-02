<?php
// api/controllers/AuthController.php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../services/AuthService.php';

class AuthController {
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::error('Email and password required', 400);
        }

        $userModel = new User();
        $user = $userModel->findByEmail($data['email']);

        if ($user && password_verify($data['password'], $user['password_hash'])) {
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
            // Auto login after registration
            $user = $userModel->findById($userId);
            
            $payload = [
                'user_id' => $user['id'],
                'role' => $user['role'],
                'exp' => time() + (60 * 60 * 24 * 7) // 7 days
            ];
            $token = AuthService::generateToken($payload);
            
            Response::success([
                'message' => 'Registration successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ], 201);
        } else {
            Response::error('Failed to register user', 500);
        }
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
