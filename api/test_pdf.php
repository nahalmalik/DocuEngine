<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dompdf\Dompdf;

try {
    $dompdf = new Dompdf();
    $dompdf->loadHtml('<h1>Test PDF</h1><p>If you see this, Dompdf is working.</p>');
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    $dompdf->stream("test.pdf", ["Attachment" => false]);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
