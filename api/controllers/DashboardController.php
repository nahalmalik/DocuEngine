<?php
// api/controllers/DashboardController.php

require_once __DIR__ . '/../services/AuthService.php';

class DashboardController {
    public function stats() {
        AuthService::requireAuth(); // Ensure user is authenticated

        $db = Database::getConnection();

        // 1. Total Customers
        $stmt = $db->query("SELECT COUNT(*) as count FROM customers WHERE deleted_at IS NULL");
        $customersCount = $stmt->fetch()['count'];

        // 2. Total Products
        $stmt = $db->query("SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL");
        $productsCount = $stmt->fetch()['count'];

        // 3. Total Quotations
        $stmt = $db->query("SELECT COUNT(*) as count FROM documents WHERE document_type = 'quotation' AND deleted_at IS NULL");
        $quotationsCount = $stmt->fetch()['count'];

        // 4. Total Invoices
        $stmt = $db->query("SELECT COUNT(*) as count FROM documents WHERE document_type = 'invoice' AND deleted_at IS NULL");
        $invoicesCount = $stmt->fetch()['count'];

        Response::success([
            'customers' => $customersCount,
            'products' => $productsCount,
            'quotations' => $quotationsCount,
            'invoices' => $invoicesCount
        ]);
    }
}
