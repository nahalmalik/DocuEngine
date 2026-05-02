<?php
// api/controllers/QuotationController.php

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../services/BaseDocumentService.php';

class QuotationController {
    private $service;

    public function __construct() {
        AuthService::requireAuth();
        $this->service = new BaseDocumentService('quotations', 'quotation_items', 'QT-');
    }

    public function index() {
        $user = AuthService::getAuthUser();
        $docs = $this->service->getAll($user['user_id']);
        Response::success($docs);
    }

    public function show($id) {
        $user = AuthService::getAuthUser();
        $doc = $this->service->getById($id, $user['user_id']);
        if ($doc) {
            Response::success($doc);
        } else {
            Response::error('Quotation not found', 404);
        }
    }

    public function create() {
        $user = AuthService::getAuthUser();
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['customer_id']) || empty($data['issue_date'])) {
            Response::error('Customer and Issue Date are required', 400);
        }

        $doc = $this->service->create($data, $user['user_id']);
        Response::success($doc, 201);
    }

    public function update($id) {
        $user = AuthService::getAuthUser();
        $data = json_decode(file_get_contents('php://input'), true);
        
        $existing = $this->service->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Quotation not found', 404);
        }

        $doc = $this->service->update($id, $data, $user['user_id']);
        Response::success($doc);
    }

    public function delete($id) {
        $user = AuthService::getAuthUser();
        $existing = $this->service->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Quotation not found', 404);
        }
        
        $this->service->delete($id, $user['user_id']);
        Response::success(['message' => 'Quotation deleted successfully']);
    }
    public function convert($id) {
        $user = AuthService::getAuthUser();
        $quote = $this->service->getById($id, $user['user_id']);
        if (!$quote) {
            Response::error('Quotation not found', 404);
        }

        $invoiceService = new BaseDocumentService('invoices', 'invoice_items', 'INV-');
        
        $data = [
            'customer_id' => $quote['customer_id'],
            'issue_date' => date('Y-m-d'),
            'due_date' => date('Y-m-d', strtotime('+30 days')),
            'status' => 'draft',
            'notes' => $quote['notes'],
            'terms_conditions' => $quote['terms_conditions'],
            'items' => []
        ];

        foreach ($quote['items'] as $item) {
            $data['items'][] = [
                'product_id' => $item['product_id'],
                'item_name' => $item['item_name'],
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'tax_rate' => $item['tax_rate'],
                'sort_order' => $item['sort_order'] ?? 0
            ];
        }

        $newInvoice = $invoiceService->create($data, $user['user_id']);
        Response::success($newInvoice, 201);
    }
}
