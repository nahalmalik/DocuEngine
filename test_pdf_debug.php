<?php
// test_pdf_debug.php - Diagnostic script for PDF generation

require_once __DIR__ . '/api/config/config.php';
require_once __DIR__ . '/api/config/database.php';
require_once __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

echo "<h1>PDF Generation Test</h1>";

try {
    // Check DOMPDF installation
    echo "<h2>✓ DOMPDF is installed</h2>";
    
    // Test simple PDF generation
    $options = new Options();
    $options->set('isRemoteEnabled', true);
    $options->set('isHtml5ParserEnabled', true);
    
    $dompdf = new Dompdf($options);
    
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Test PDF</title>
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>✓ PDF Generation Test Successful</h1>
        <p>Timestamp: ' . date('Y-m-d H:i:s') . '</p>
        <p>Server: ' . BASE_URL . '</p>
        <p>Environment: ' . APP_ENV . '</p>
    </body>
    </html>';
    
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    
    // Output as download
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="test_pdf.pdf"');
    echo $dompdf->output();
    
} catch (Exception $e) {
    echo "<h2 style='color: red;'>✗ Error: " . htmlspecialchars($e->getMessage()) . "</h2>";
    echo "<p>Stack Trace:</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
?>
