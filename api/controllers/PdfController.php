<?php
// api/controllers/PdfController.php

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../services/BaseDocumentService.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

class PdfController {

    private function getBase64($url) {
        if (empty($url)) return '';

        // Extract filename from URL
        $filename = basename(parse_url($url, PHP_URL_PATH));

        // Define search paths for the image
        $rootDir = realpath(__DIR__ . '/../../');
        $paths = [
            $rootDir . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . $filename,
            __DIR__ . '/../../storage/images/' . $filename,
            'C:/xampp/htdocs/quotation-system/storage/images/' . $filename
        ];

        foreach ($paths as $path) {
            if (!empty($path) && file_exists($path) && is_file($path)) {
                // Skip images larger than 5MB
                if (filesize($path) > 5 * 1024 * 1024) continue;

                $data = @file_get_contents($path);
                if ($data === false) continue;

                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                if (!in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'svg'])) $ext = 'png';

                return 'data:image/' . $ext . ';base64,' . base64_encode($data);
            }
        }
        return '';
    }

    public function generate($id) {
        // Increase memory limit for PDF generation
        ini_set('memory_limit', '1024M');
        set_time_limit(300); // 5 minutes

        try {
            $user = AuthService::getAuthUser();
            if (!$user) Response::error('Unauthorized', 401);

            $type = $_GET['type'] ?? 'quotation';
            $tableMap = [
                'quotation' => ['quotations', 'quotation_items', 'QT-'],
                'invoice' => ['invoices', 'invoice_items', 'INV-'],
                'purchase_order' => ['purchase_orders', 'purchase_order_items', 'PO-'],
                'receipt' => ['receipts', 'receipt_items', 'REC-']
            ];

            if (!isset($tableMap[$type])) Response::error('Invalid type', 400);

            $config = $tableMap[$type];
            $documentService = new BaseDocumentService($config[0], $config[1], $config[2]);
            $document = $documentService->getById($id, $user['user_id']);

            if (!$document) Response::error('Not found', 404);

            $document['document_number'] = $document[$type === 'purchase_order' ? 'po_number' : $type . '_number'];

            // Format filename based on document number
            $safeNumber = str_replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|', ' '], '_', $document['document_number']);
            $downloadFileName = $type . '_' . $safeNumber . '.pdf';

            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE user_id = :user_id");
            $stmt->execute(['user_id' => $document['user_id']]);
            $settings = [];
            while ($row = $stmt->fetch()) $settings[$row['setting_key']] = $row['setting_value'];

            $logo = $this->getBase64($settings['company_logo'] ?? '');
            $signature = $this->getBase64($settings['company_signature'] ?? '');

            $html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>
                body { font-family: "Helvetica", sans-serif; font-size: 13px; color: #333; }
                .header { width: 100%; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .logo { max-width: 140px; max-height: 70px; }
                .company-details { float: right; text-align: right; }
                .doc-title { text-transform: uppercase; font-size: 22px; font-weight: bold; margin-bottom: 5px; }
                .details-table { width: 100%; margin-bottom: 20px; }
                .details-table td { vertical-align: top; width: 50%; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f8f8f8; font-weight: bold; }
                .totals { float: right; width: 250px; }
                .totals-table { width: 100%; border-collapse: collapse; }
                .totals-table td { padding: 6px; text-align: right; border: 1px solid #ddd; }
                .footer { margin-top: 40px; clear: both; }
                .sig-img { max-width: 120px; max-height: 60px; }
            </style></head><body>';

            $html .= '<table class="header"><tr><td style="width: 50%">';
            if ($logo) $html .= '<img src="'.$logo.'" class="logo"><br>';
            $html .= '<h2 style="margin:5px 0 0 0;">'.htmlspecialchars($settings['company_name'] ?? 'Your Company').'</h2></td><td class="company-details"><strong>'.htmlspecialchars($settings['company_name'] ?? '').'</strong><br>'.nl2br(htmlspecialchars($settings['company_address'] ?? '')).'<br>'.htmlspecialchars($settings['company_phone'] ?? '').'</td></tr></table>';

            $docTitle = ($type === 'receipt') ? 'DELIVERY CHALLAN' : strtoupper(str_replace('_', ' ', $type));
            $html .= '<table class="details-table"><tr><td><strong>Bill To:</strong><br>'.htmlspecialchars($document['customer']['company_name'] ?? '').'<br>'.nl2br(htmlspecialchars($document['customer']['billing_address'] ?? '')).'</td><td style="text-align: right;"><div class="doc-title">'.$docTitle.'</div><strong>No:</strong> '.htmlspecialchars($document['document_number']).'<br><strong>Date:</strong> '.htmlspecialchars($document['issue_date']).'</td></tr></table>';

            $html .= '<table class="items-table"><thead><tr><th style="width: 5%">#</th><th>Product</th><th>Description</th><th style="width: 10%">Qty</th>';
            if ($type !== 'receipt') $html .= '<th style="width: 15%">Price (Rs.)</th><th style="width: 15%">Total (Rs.)</th>';
            $html .= '</tr></thead><tbody>';
            foreach ($document['items'] as $i => $item) {
                $html .= '<tr><td>'.($i+1).'</td><td>'.htmlspecialchars($item['item_name']).'</td><td><small>'.nl2br(htmlspecialchars($item['description'])).'</small></td><td>'.$item['quantity'].'</td>';
                if ($type !== 'receipt') $html .= '<td>'.number_format($item['unit_price'], 2).'</td><td>'.number_format($item['line_total'], 2).'</td>';
                $html .= '</tr>';
            }
            $html .= '</tbody></table>';

            if ($type !== 'receipt') {
                $html .= '<div class="totals"><table class="totals-table"><tr><td>Subtotal:</td><td>Rs. '.number_format($document['subtotal'], 2).'</td></tr><tr><td>Tax:</td><td>Rs. '.number_format($document['tax_total'], 2).'</td></tr><tr><td style="font-size:15px"><strong>Total:</strong></td><td style="font-size:15px"><strong>Rs. '.number_format($document['grand_total'], 2).'</strong></td></tr></table></div>';
            }

            $html .= '<div class="footer">';
            if (!empty($document['notes'])) $html .= '<strong>Notes:</strong><br>'.nl2br(htmlspecialchars($document['notes'])).'<br><br>';
            if ($type !== 'purchase_order' && !empty($document['terms_conditions'])) $html .= '<strong>Terms:</strong><br>'.nl2br(htmlspecialchars($document['terms_conditions'])).'<br><br>';

            if ($type === 'receipt') {
                $html .= '<table style="width: 100%; margin-top: 40px; border:0;"><tr><td style="width: 45%; text-align: left; border:0;"><strong>Received By & Stamp:</strong><br><br><br><br>____________________</td><td style="width: 10%; border:0;"></td><td style="width: 45%; text-align: right; border:0;"><strong>Company Signature:</strong><br>';
                if ($signature) $html .= '<img src="'.$signature.'" class="sig-img"><br>';
                $html .= '____________________</td></tr></table>';
            } else {
                $html .= '<div style="margin-top: 40px; float: right; text-align: right;"><strong>Authorized Signature</strong><br>';
                if ($signature) $html .= '<img src="'.$signature.'" class="sig-img"><br>';
                $html .= '____________________</div>';
            }
            $html .= '</div></body></html>';

            $dompdf = new Dompdf([
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => false,
                'debugKeepTemp' => false,
                'fontCache' => __DIR__ . '/../../storage/dompdf_font_cache'
            ]);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            if (isset($_GET['action'])) {
                if (ob_get_level()) ob_end_clean();

                $isDownload = ($_GET['action'] === 'download');
                $disposition = $isDownload ? 'attachment' : 'inline';

                // Clear any potential previous output
                if (!headers_sent()) {
                    header('Content-Type: application/pdf');
                    header('Content-Disposition: ' . $disposition . '; filename="' . $downloadFileName . '"');
                }

                // Use stream for better memory management
                $dompdf->stream($downloadFileName, ["Attachment" => $isDownload]);
                exit;
            }

            Response::json(['status' => 'success', 'url' => BASE_URL . '/api/v1/pdf/' . $id . '?type=' . $type . '&token=' . urlencode($_GET['token'] ?? '') . '&action=view']);
        } catch (Exception $e) { Response::error($e->getMessage(), 500); }
    }
}
