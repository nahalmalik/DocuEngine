<?php
// api/controllers/CustomerController.php

require_once __DIR__ . '/../models/Customer.php';
require_once __DIR__ . '/../services/AuthService.php';

class CustomerController {
    private $customerModel;

    public function __construct() {
        AuthService::requireAuth(); // All routes need auth
        $this->customerModel = new Customer();
    }

    public function index() {
        $user = AuthService::getAuthUser();
        $customers = $this->customerModel->getAll($user['user_id']);
        Response::success($customers);
    }

    public function show($id) {
        $user = AuthService::getAuthUser();
        $customer = $this->customerModel->getById($id, $user['user_id']);
        if ($customer) {
            Response::success($customer);
        } else {
            Response::error('Customer not found', 404);
        }
    }

    public function create() {
        $user = AuthService::getAuthUser();
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['company_name'])) {
            Response::error('Company name is required', 400);
        }

        $id = $this->customerModel->create($data, $user['user_id']);
        $customer = $this->customerModel->getById($id, $user['user_id']);
        Response::success($customer, 201);
    }

    public function update($id) {
        $user = AuthService::getAuthUser();
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['company_name'])) {
            Response::error('Company name is required', 400);
        }

        $existing = $this->customerModel->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Customer not found', 404);
        }

        $this->customerModel->update($id, $data, $user['user_id']);
        $customer = $this->customerModel->getById($id, $user['user_id']);
        Response::success($customer);
    }

    public function delete($id) {
        $user = AuthService::getAuthUser();
        $existing = $this->customerModel->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Customer not found', 404);
        }
        
        $this->customerModel->delete($id, $user['user_id']);
        Response::success(['message' => 'Customer deleted successfully']);
    }
}
