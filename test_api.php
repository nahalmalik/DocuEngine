<?php
require_once __DIR__ . '/api/config/config.php';
require_once __DIR__ . '/api/config/database.php';
require_once __DIR__ . '/api/utils/Response.php';
require_once __DIR__ . '/api/controllers/PdfController.php';

$_GET['type'] = 'quotation';
// Mock AuthService
require_once __DIR__ . '/api/services/AuthService.php';

// Try to get token from login
$db = Database::getConnection();
$stmt = $db->query("SELECT * FROM quotations LIMIT 1");
$quotation = $stmt->fetch();
$quotationId = $quotation ? $quotation['id'] : 1;
$userId = $quotation ? $quotation['user_id'] : 1;

$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();

if ($user) {
    $_GET['token'] = AuthService::generateToken(['user_id' => $user['id'], 'email' => $user['email']]);
}

$stmt = $db->query("SELECT id FROM quotations LIMIT 1");
$quotation = $stmt->fetch();
$quotationId = $quotation ? $quotation['id'] : 1;

$controller = new PdfController();
try {
    $controller->generate($quotationId);
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage();
}
