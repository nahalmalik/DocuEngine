<?php
require 'api/config/config.php';
require 'api/config/database.php';
$db = Database::getConnection();
$db->exec('ALTER TABLE settings MODIFY setting_value LONGTEXT');
echo "Altered table successfully";
