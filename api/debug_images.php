<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/services/AuthService.php';

header('Content-Type: text/plain');

$user = AuthService::getAuthUser();
if (!$user) {
    die("Unauthorized. Please add ?token=YOUR_TOKEN to URL");
}

$db = Database::getConnection();
$stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE user_id = :user_id AND setting_key IN ('company_logo', 'company_signature')");
$stmt->execute(['user_id' => $user['user_id']]);
$settings = $stmt->fetchAll();

echo "USER ID: " . $user['user_id'] . "\n\n";

foreach ($settings as $s) {
    echo "KEY: " . $s['setting_key'] . "\n";
    echo "VALUE: " . $s['setting_value'] . "\n";

    $filename = basename($s['setting_value']);
    $path = __DIR__ . '/../storage/images/' . $filename;

    echo "LOOKING FOR FILENAME: " . $filename . "\n";
    echo "FULL PATH: " . realpath($path) . "\n";
    echo "EXISTS: " . (file_exists($path) ? "YES" : "NO") . "\n";
    echo "IS FILE: " . (is_file($path) ? "YES" : "NO") . "\n";
    if (file_exists($path)) {
        echo "SIZE: " . filesize($path) . " bytes\n";
    }
    echo "--------------------------\n";
}

echo "\nDIRECTORY LISTING OF storage/images/:\n";
$files = scandir(__DIR__ . '/../storage/images/');
print_r($files);
