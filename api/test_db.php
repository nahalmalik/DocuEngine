<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';

try {
    $db = Database::getConnection();
    Response::success(['message' => 'Database connection successful']);
} catch (Exception $e) {
    Response::error('Database connection failed: ' . $e->getMessage(), 500);
}
