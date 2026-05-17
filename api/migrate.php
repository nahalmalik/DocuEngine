<?php
// Simple migration runner for local development
// Usage: php migrate.php [filename.sql]

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

function runSqlFile($pdo, $filePath) {
    echo "Running migration: $filePath\n";
    $sql = file_get_contents($filePath);
    if ($sql === false) {
        echo "Failed to read $filePath\n";
        return false;
    }

    try {
        $pdo->exec($sql);
        echo "OK\n";
        return true;
    } catch (PDOException $e) {
        echo "Error executing $filePath: " . $e->getMessage() . "\n";
        return false;
    }
}

$pdo = Database::getConnection();

$arg = $argv[1] ?? null;
$migrationsDir = __DIR__ . '/migrations';

if ($arg) {
    $target = realpath($migrationsDir . DIRECTORY_SEPARATOR . $arg) ?: realpath($arg);
    if (!$target || !file_exists($target)) {
        echo "Migration file not found: $arg\n";
        exit(1);
    }
    $ok = runSqlFile($pdo, $target);
    exit($ok ? 0 : 2);
}

$files = glob($migrationsDir . '/*.sql');
sort($files, SORT_STRING);
if (empty($files)) {
    echo "No migration files found in $migrationsDir\n";
    exit(0);
}

$failed = 0;
foreach ($files as $f) {
    $ok = runSqlFile($pdo, $f);
    if (!$ok) $failed++;
}

if ($failed) {
    echo "Completed with $failed failed migrations.\n";
    exit(2);
}

echo "All migrations executed successfully.\n";
exit(0);
