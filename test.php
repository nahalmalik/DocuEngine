<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

try {
    $options = new Options();
    $options->set('isRemoteEnabled', true);
    $options->set('isHtml5ParserEnabled', true);
    
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml('hello world');
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    echo "Success!";
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage();
}
