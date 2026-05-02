<?php
// api/controllers/ProductController.php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../services/AuthService.php';

class ProductController {
    private $productModel;

    public function __construct() {
        AuthService::requireAuth();
        $this->productModel = new Product();
    }

    public function index() {
        $user = AuthService::getAuthUser();
        $products = $this->productModel->getAll($user['user_id']);
        Response::success($products);
    }

    public function show($id) {
        $user = AuthService::getAuthUser();
        $product = $this->productModel->getById($id, $user['user_id']);
        if ($product) {
            Response::success($product);
        } else {
            Response::error('Product not found', 404);
        }
    }

    public function create() {
        $user = AuthService::getAuthUser();
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) {
            Response::error('Product name is required', 400);
        }

        $id = $this->productModel->create($data, $user['user_id']);
        $product = $this->productModel->getById($id, $user['user_id']);
        Response::success($product, 201);
    }

    public function update($id) {
        $user = AuthService::getAuthUser();
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) {
            Response::error('Product name is required', 400);
        }

        $existing = $this->productModel->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Product not found', 404);
        }

        $this->productModel->update($id, $data, $user['user_id']);
        $product = $this->productModel->getById($id, $user['user_id']);
        Response::success($product);
    }

    public function delete($id) {
        $user = AuthService::getAuthUser();
        $existing = $this->productModel->getById($id, $user['user_id']);
        if (!$existing) {
            Response::error('Product not found', 404);
        }
        
        $this->productModel->delete($id, $user['user_id']);
        Response::success(['message' => 'Product deleted successfully']);
    }
}
