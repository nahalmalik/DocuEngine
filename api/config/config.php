<?php
// api/config/config.php

define('APP_NAME', 'Document Engine');
define('APP_ENV', 'development'); // 'development' or 'production'

// Base URL Configuration - DYNAMIC DETECTION
if (APP_ENV === 'development') {
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";

    // Use the IP address if accessed remotely, otherwise localhost
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    // If it's localhost but we know we're on a local network, we can force it,
    // but HTTP_HOST should be correct if the phone used the IP to connect.
    define('BASE_URL', $protocol . "://" . $host . "/quotation-system");
} else {
    define('BASE_URL', 'https://your-production-domain.com');
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'document_engine');

// JWT Secret Key
define('JWT_SECRET', 'your_super_secret_key_change_in_production');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');
