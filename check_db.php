<?php
require 'api/config/config.php';
require 'api/config/database.php';
$db = Database::getConnection();
$stmt = $db->query('SHOW COLUMNS FROM settings');
foreach($stmt as $row) {
    print_r($row);
}
