<?php
// api/test_pdf_simple.php - Simple PDF test without timeout issues

@ini_set('max_execution_time', 300);
set_time_limit(300);

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

header('Content-Type: application/json');

try {
    // Simple test HTML
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>PDF Generation Test</h1>
        <p><strong>✓ System is working!</strong></p>
        <p>Generated: ' . date('Y-m-d H:i:s') . '</p>
        <p>Base URL: ' . BASE_URL . '</p>
        
        <h2>Test Table</h2>
        <table>
            <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
            <tr>
                <td>Product A</td>
                <td>$10.00</td>
                <td>5</td>
                <td>$50.00</td>
            </tr>
            <tr>
                <td>Product B</td>
                <td>$20.00</td>
                <td>3</td>
                <td>$60.00</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>$110.00</strong></td>
            </tr>
        </table>
    </body>
    </html>';

    $options = new Options();
    $options->set('isRemoteEnabled', false);
    $options->set('isHtml5ParserEnabled', true);
    
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    
    $output = $dompdf->output();
    
    // Output as download
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="test.pdf"');
    header('Content-Length: ' . strlen($output));
    echo $output;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'PDF Test Failed',
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
