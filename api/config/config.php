<?php
// api/config/config.php

define('APP_NAME', 'Document Engine');
define('APP_ENV', 'production'); // 'development' or 'production'

// Base URL Configuration
if (APP_ENV === 'development') {
    define('BASE_URL', 'http://docu.bizhubpakistan.com');
} else {
    define('BASE_URL', 'http://docu.bizhubpakistan.com');
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
