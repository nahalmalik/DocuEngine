<?php
// api/controllers/ReceiptController.php

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../services/BaseDocumentService.php';

class ReceiptController {
    private $service;

    public function __construct() {
        AuthService::requireAuth();
        $this->service = new BaseDocumentService('receipts', 'receipt_items', 'REC-');
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
            Response::error('Receipt not found', 404);
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
            Response::error('Receipt not found', 404);
        }

        $doc = $this->service->update($id, $data, $user['user_id']);
        Response::success($doc);
    }

    public function delete($id) {
        $user = AuthService::getAuthUser();
        $existing = $this->service->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Receipt not found', 404);
        }
        
        $this->service->delete($id, $user['user_id']);
        Response::success(['message' => 'Receipt deleted successfully']);
    }
}
