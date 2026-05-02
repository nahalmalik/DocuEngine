<?php
require_once __DIR__ . '/config/config.php';
echo json_encode([
    'BASE_URL' => BASE_URL,
    'HTTP_HOST' => $_SERVER['HTTP_HOST'] ?? 'NOT SET',
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'NOT SET'
]);
