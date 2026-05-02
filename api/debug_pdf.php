<?php
// api/debug_pdf.php - Debug endpoint for PDF generation

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

header('Content-Type: application/json');

$response = [
    'system_check' => [],
    'dompdf_test' => null,
    'sample_document' => null,
    'errors' => []
];

try {
    // 1. Check DOMPDF
    $response['system_check']['dompdf_installed'] = class_exists('Dompdf\Dompdf');
    $response['system_check']['base_url'] = BASE_URL;
    $response['system_check']['database_connection'] = 'OK';
    
    // 2. Test simple PDF
    try {
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml('<h1>Test</h1>');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $response['dompdf_test'] = 'Success - Simple PDF generated';
    } catch (Exception $e) {
        $response['errors'][] = 'DOMPDF Error: ' . $e->getMessage();
    }
    
    // 3. Check sample quotation
    try {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id FROM quotations LIMIT 1");
        $quotation = $stmt->fetch();
        
        if ($quotation) {
            $response['sample_document'] = [
                'id' => $quotation['id'],
                'type' => 'quotation',
                'test_url' => BASE_URL . '/api/v1/pdf/' . $quotation['id'] . '?type=quotation&action=view'
            ];
        } else {
            $response['sample_document'] = 'No quotations found in database';
        }
    } catch (Exception $e) {
        $response['errors'][] = 'Database Query Error: ' . $e->getMessage();
    }
    
    // 4. Check storage directory
    $storageDir = __DIR__ . '/../storage/pdfs/';
    $response['system_check']['storage_directory'] = [
        'path' => $storageDir,
        'exists' => is_dir($storageDir),
        'writable' => is_writable($storageDir)
    ];
    
} catch (Exception $e) {
    $response['errors'][] = 'General Error: ' . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
