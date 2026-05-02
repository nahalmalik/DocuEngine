<?php
// api/models/Product.php

class Product {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE user_id = :user_id AND deleted_at IS NULL ORDER BY name ASC");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll();
    }

    public function getById($id, $user_id) {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id AND user_id = :user_id AND deleted_at IS NULL");
        $stmt->execute(['id' => $id, 'user_id' => $user_id]);
        return $stmt->fetch();
    }

    public function create($data, $user_id) {
        $sql = "INSERT INTO products (user_id, sku, name, description, unit_price, tax_rate, is_active) 
                VALUES (:user_id, :sku, :name, :description, :unit_price, :tax_rate, :is_active)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'sku' => $data['sku'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'unit_price' => $data['unit_price'] ?? 0.00,
            'tax_rate' => $data['tax_rate'] ?? 0.00,
            'is_active' => $data['is_active'] ?? 1,
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data, $user_id) {
        $sql = "UPDATE products SET 
                sku = :sku, 
                name = :name, 
                description = :description, 
                unit_price = :unit_price, 
                tax_rate = :tax_rate, 
                is_active = :is_active 
                WHERE id = :id AND user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'id' => $id,
            'user_id' => $user_id,
            'sku' => $data['sku'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'unit_price' => $data['unit_price'] ?? 0.00,
            'tax_rate' => $data['tax_rate'] ?? 0.00,
            'is_active' => $data['is_active'] ?? 1,
        ]);
    }

    public function delete($id, $user_id) {
        $stmt = $this->db->prepare("UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND user_id = :user_id");
        return $stmt->execute(['id' => $id, 'user_id' => $user_id]);
    }
}
