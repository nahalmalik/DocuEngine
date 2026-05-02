<?php
// api/models/Customer.php

class Customer {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM customers WHERE user_id = :user_id AND deleted_at IS NULL ORDER BY company_name ASC");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll();
    }

    public function getById($id, $user_id) {
        $stmt = $this->db->prepare("SELECT * FROM customers WHERE id = :id AND user_id = :user_id AND deleted_at IS NULL");
        $stmt->execute(['id' => $id, 'user_id' => $user_id]);
        return $stmt->fetch();
    }

    public function create($data, $user_id) {
        $sql = "INSERT INTO customers (user_id, company_name, contact_person, email, phone, billing_address, shipping_address, tax_number) 
                VALUES (:user_id, :company_name, :contact_person, :email, :phone, :billing_address, :shipping_address, :tax_number)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'company_name' => $data['company_name'],
            'contact_person' => $data['contact_person'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'billing_address' => $data['billing_address'] ?? null,
            'shipping_address' => $data['shipping_address'] ?? null,
            'tax_number' => $data['tax_number'] ?? null,
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data, $user_id) {
        $sql = "UPDATE customers SET 
                company_name = :company_name, 
                contact_person = :contact_person, 
                email = :email, 
                phone = :phone, 
                billing_address = :billing_address, 
                shipping_address = :shipping_address, 
                tax_number = :tax_number 
                WHERE id = :id AND user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'id' => $id,
            'user_id' => $user_id,
            'company_name' => $data['company_name'],
            'contact_person' => $data['contact_person'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'billing_address' => $data['billing_address'] ?? null,
            'shipping_address' => $data['shipping_address'] ?? null,
            'tax_number' => $data['tax_number'] ?? null,
        ]);
    }

    public function delete($id, $user_id) {
        $stmt = $this->db->prepare("UPDATE customers SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND user_id = :user_id");
        return $stmt->execute(['id' => $id, 'user_id' => $user_id]);
    }
}
