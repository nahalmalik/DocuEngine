<?php
// api/models/User.php

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email AND deleted_at IS NULL");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT id, name, email, role FROM users WHERE id = :id AND deleted_at IS NULL");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)");
        $stmt->execute([
            'name' => $data['name'],
            'email' => $data['email'],
            'password_hash' => $data['password_hash']
        ]);
        return $this->db->lastInsertId();
    }

    public function setVerifyToken($userId, $token) {
        $stmt = $this->db->prepare("UPDATE users SET verify_token = :token WHERE id = :id");
        return $stmt->execute(['token' => $token, 'id' => $userId]);
    }

    public function findByVerifyToken($token) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE verify_token = :token AND deleted_at IS NULL");
        $stmt->execute(['token' => $token]);
        return $stmt->fetch();
    }

    public function verifyById($userId) {
        $stmt = $this->db->prepare("UPDATE users SET email_verified = 1, verify_token = NULL WHERE id = :id");
        return $stmt->execute(['id' => $userId]);
    }

    public function setResetToken($userId, $token, $expiresAt) {
        $stmt = $this->db->prepare("UPDATE users SET reset_token = :token, reset_expires = :expires WHERE id = :id");
        return $stmt->execute(['token' => $token, 'expires' => $expiresAt, 'id' => $userId]);
    }

    public function findByResetToken($token) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE reset_token = :token AND deleted_at IS NULL");
        $stmt->execute(['token' => $token]);
        return $stmt->fetch();
    }

    public function updatePassword($userId, $passwordHash) {
        $stmt = $this->db->prepare("UPDATE users SET password_hash = :ph, reset_token = NULL, reset_expires = NULL WHERE id = :id");
        return $stmt->execute(['ph' => $passwordHash, 'id' => $userId]);
    }
}
