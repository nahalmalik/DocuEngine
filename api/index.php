<?php
// api/index.php

// 1. HANDLE CORS FIRST
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. ERROR LOGGING
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');

// Global catch-all for fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'error' => 'Fatal PHP Error',
            'details' => $error['message']
        ]);
        exit;
    }
});

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Router.php';

// Include Autoloader from Composer if exists
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

$router = new Router();

// Auth
$router->post('/v1/auth/login', 'AuthController@login');
$router->post('/v1/auth/register', 'AuthController@register');
$router->post('/v1/auth/logout', 'AuthController@logout');
$router->get('/v1/auth/check', 'AuthController@check');
// Email verification & password reset
$router->get('/v1/auth/verify', 'AuthController@verify');
$router->post('/v1/auth/request-reset', 'AuthController@requestReset');
$router->post('/v1/auth/reset', 'AuthController@reset');

// Customers
$router->get('/v1/customers', 'CustomerController@index');
$router->post('/v1/customers', 'CustomerController@create');
$router->get('/v1/customers/{id}', 'CustomerController@show');
$router->put('/v1/customers/{id}', 'CustomerController@update');
$router->delete('/v1/customers/{id}', 'CustomerController@delete');

// Products
$router->get('/v1/products', 'ProductController@index');
$router->post('/v1/products', 'ProductController@create');
$router->get('/v1/products/{id}', 'ProductController@show');
$router->put('/v1/products/{id}', 'ProductController@update');
$router->delete('/v1/products/{id}', 'ProductController@delete');

// Quotations
$router->get('/v1/quotations', 'QuotationController@index');
$router->get('/v1/quotations/{id}', 'QuotationController@show');
$router->post('/v1/quotations', 'QuotationController@create');
$router->post('/v1/quotations/{id}/convert', 'QuotationController@convert');
$router->put('/v1/quotations/{id}', 'QuotationController@update');
$router->delete('/v1/quotations/{id}', 'QuotationController@delete');

// Invoices
$router->get('/v1/invoices', 'InvoiceController@index');
$router->get('/v1/invoices/{id}', 'InvoiceController@show');
$router->post('/v1/invoices', 'InvoiceController@create');
$router->put('/v1/invoices/{id}', 'InvoiceController@update');
$router->delete('/v1/invoices/{id}', 'InvoiceController@delete');

// Purchase Orders
$router->get('/v1/purchase-orders', 'PurchaseOrderController@index');
$router->get('/v1/purchase-orders/{id}', 'PurchaseOrderController@show');
$router->post('/v1/purchase-orders', 'PurchaseOrderController@create');
$router->put('/v1/purchase-orders/{id}', 'PurchaseOrderController@update');
$router->delete('/v1/purchase-orders/{id}', 'PurchaseOrderController@delete');

// Receipts
$router->get('/v1/receipts', 'ReceiptController@index');
$router->get('/v1/receipts/{id}', 'ReceiptController@show');
$router->post('/v1/receipts', 'ReceiptController@create');
$router->put('/v1/receipts/{id}', 'ReceiptController@update');
$router->delete('/v1/receipts/{id}', 'ReceiptController@delete');

// PDF
$router->get('/v1/pdf/{id}', 'PdfController@generate');

// Dashboard
$router->get('/v1/dashboard/stats', 'DashboardController@stats');

// Settings
$router->get('/v1/settings', 'SettingController@index');
$router->post('/v1/settings', 'SettingController@update');

// Dispatch
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$router->dispatch($method, $uri);
