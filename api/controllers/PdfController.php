<?php
// api/controllers/PdfController.php

@ini_set('max_execution_time', 300);
set_time_limit(300);

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../services/BaseDocumentService.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

class PdfController {
    private function imageToBase64($imagePath) {
        if (empty($imagePath)) {
            return null;
        }

        // If already a data URI, keep it as-is
        if (strpos($imagePath, 'data:') === 0) {
            return $imagePath;
        }

        // If it's a remote URL, skip it to avoid blocking DOMPDF
        if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return null;
        }

        // Resolve relative project paths
        $localPath = $imagePath;
        if (!file_exists($localPath)) {
            $localPath = __DIR__ . '/../../' . ltrim($imagePath, '/');
        }

        if (!file_exists($localPath)) {
            return null;
        }

        $imageData = base64_encode(file_get_contents($localPath));
        $mimeType = mime_content_type($localPath) ?: 'image/png';
        return 'data:' . $mimeType . ';base64,' . $imageData;
    }

    public function generate($id) {
        try {
            // Handle token from URL for direct link access
            $user = AuthService::getAuthUser();
            if (!$user) {
                Response::error('Unauthorized access to PDF', 401);
            }

            $type = $_GET['type'] ?? 'quotation';

            $tableMap = [
                'quotation' => ['quotations', 'quotation_items', 'QT-'],
                'invoice' => ['invoices', 'invoice_items', 'INV-'],
                'purchase_order' => ['purchase_orders', 'purchase_order_items', 'PO-'],
                'receipt' => ['receipts', 'receipt_items', 'REC-']
            ];

            if (!isset($tableMap[$type])) {
                Response::error('Invalid document type', 400);
            }

            $config = $tableMap[$type];
            $documentService = new BaseDocumentService($config[0], $config[1], $config[2]);
            $document = $documentService->getById($id, $user['user_id']);

            if (!$document) {
                Response::error('Document not found', 404);
            }

            // Normalize document fields
            $document['document_type'] = $type;
            $document['document_number'] = $document[$type === 'purchase_order' ? 'po_number' : $type . '_number'];

            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE user_id = :user_id");
            $stmt->execute(['user_id' => $document['user_id']]);
            $settings = [];
            while ($row = $stmt->fetch()) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }

            $companyName = $settings['company_name'] ?? 'Your Company';
            $companyAddress = $settings['company_address'] ?? '';
            $companyPhone = $settings['company_phone'] ?? '';
            $companyEmail = $settings['company_email'] ?? '';

            // Convert images to base64 data URIs to avoid remote loading
            $logoUrl = '';
            $logoSetting = $settings['company_logo'] ?? '';
            if ($logoSetting) {
                // Convert to base64 if it's a local file
                $logoBase64 = $this->imageToBase64($logoSetting);
                if ($logoBase64) {
                    $logoUrl = $logoBase64;
                }
            }
            
            $signatureUrl = '';
            $signatureSetting = $settings['company_signature'] ?? '';
            if ($signatureSetting) {
                // Convert to base64 if it's a local file or already a data URI
                $signatureBase64 = $this->imageToBase64($signatureSetting);
                if ($signatureBase64) {
                    $signatureUrl = $signatureBase64;
                }
            }

            $receivedBy = '';
            $stampText = '';
            if ($type === 'purchase_order') {
                $receivedBy = $document['received_by'] ?? '';
                $stampText = $document['stamp_text'] ?? '';
            }

            $html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>
                    body { font-family: "Helvetica", sans-serif; font-size: 14px; color: #333; }
                    .header { width: 100%; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { max-width: 150px; max-height: 80px; }
                    .company-details { float: right; text-align: right; }
                    .doc-title { text-transform: uppercase; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                    .details-table { width: 100%; margin-bottom: 30px; }
                    .details-table td { vertical-align: top; width: 50%; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    .items-table th { background-color: #f5f5f5; font-weight: bold; }
                    .totals { float: right; width: 300px; margin-top: 20px; }
                    .totals-table { width: 100%; border-collapse: collapse; }
                    .totals-table td { padding: 8px; text-align: right; border: 1px solid #ddd; }
                    .totals-table td:first-child { font-weight: bold; background-color: #f5f5f5; }
                    .footer { margin-top: 50px; clear: both; }
                    .signature-block { display: flex; justify-content: space-between; gap: 20px; margin-top: 40px; }
                    .signature-box { width: 48%; padding: 12px; border: 1px solid #ddd; min-height: 160px; }
                    .signature-label { font-weight: bold; margin-bottom: 6px; display: block; }
                    .signature { max-width: 150px; max-height: 80px; margin-top: 10px; }
                    .signature-image { max-width: 150px; max-height: 80px; margin-top: 10px; }
                </style></head><body>
                <table class="header"><tr><td style="width: 50%">';
            if ($logoUrl) $html .= '<img src="' . htmlspecialchars($logoUrl) . '" class="logo"><br>';
            $html .= '<h2 style="margin:5px 0 0 0;">' . htmlspecialchars($companyName) . '</h2></td><td class="company-details"><strong>' . htmlspecialchars($companyName) . '</strong><br>' . nl2br(htmlspecialchars($companyAddress)) . '<br>' . htmlspecialchars($companyPhone) . '<br>' . htmlspecialchars($companyEmail) . '</td></tr></table>';

            $docTitle = htmlspecialchars($document['document_type']);
            $docTitle = ($type === 'receipt') ? 'DELIVERY CHALLAN' : strtoupper(str_replace('_', ' ', $docTitle));

            $html .= '<table class="details-table"><tr><td><strong>Bill To:</strong><br>' . htmlspecialchars($document['customer']['company_name'] ?? '') . '<br>' . nl2br(htmlspecialchars($document['customer']['billing_address'] ?? '')) . '</td><td style="text-align: right;"><div class="doc-title">' . $docTitle . '</div><strong>No:</strong> ' . htmlspecialchars($document['document_number']) . '<br><strong>Date:</strong> ' . htmlspecialchars($document['issue_date']) . '<br>';
            if (!empty($document['due_date'])) $html .= '<strong>Due Date:</strong> ' . htmlspecialchars($document['due_date']) . '<br>';
            $html .= '</td></tr></table><table class="items-table"><thead><tr>';

            if ($type === 'receipt') {
                $html .= '<th style="width: 5%">#</th><th style="width: 30%">Product Name</th><th style="width: 50%">Description</th><th style="width: 15%; text-align: center;">Qty</th>';
            } else {
                $html .= '<th style="width: 5%">#</th><th style="width: 25%">Product Name</th><th style="width: 25%">Description</th><th style="width: 10%; text-align: center;">Qty</th><th style="width: 12%; text-align: right;">Unit Price</th><th style="width: 8%; text-align: right;">Tax %</th><th style="width: 15%; text-align: right;">Amount</th>';
            }

            $html .= '</tr></thead><tbody>';
            $count = 1;
            foreach ($document['items'] as $item) {
                $html .= '<tr><td style="text-align: center;">' . $count++ . '</td><td><strong>' . htmlspecialchars($item['item_name']) . '</strong></td><td><small>' . nl2br(htmlspecialchars($item['description'] ?? '')) . '</small></td><td style="text-align: center;">' . number_format($item['quantity'], 2) . '</td>';
                if ($type !== 'receipt') {
                    $html .= '<td style="text-align: right;">' . number_format($item['unit_price'], 2) . '</td><td style="text-align: right;">' . number_format($item['tax_rate'], 2) . '%</td><td style="text-align: right;">' . number_format($item['line_total'], 2) . '</td>';
                }
                $html .= '</tr>';
            }
            $html .= '</tbody></table>';

            if ($type !== 'receipt') {
                $html .= '<div class="totals"><table class="totals-table"><tr><td>Subtotal:</td><td>' . number_format($document['subtotal'], 2) . '</td></tr><tr><td>Tax:</td><td>' . number_format($document['tax_total'], 2) . '</td></tr>';
                if ($document['discount_total'] > 0) $html .= '<tr><td>Discount:</td><td>-' . number_format($document['discount_total'], 2) . '</td></tr>';
                $html .= '<tr><td style="font-size: 18px;"><strong>Total:</strong></td><td style="font-size: 18px;"><strong>' . number_format($document['grand_total'], 2) . '</strong></td></tr></table></div>';
            }

            $html .= '<div class="footer">';
            if (!empty($document['notes'])) $html .= '<strong>Notes:</strong><br>' . nl2br(htmlspecialchars($document['notes'])) . '<br><br>';
            if (!empty($document['terms_conditions']) && $type !== 'purchase_order') $html .= '<strong>Terms & Conditions:</strong><br>' . nl2br(htmlspecialchars($document['terms_conditions'])) . '<br><br>';

            if ($type === 'purchase_order') {
                $html .= '<div class="signature-block">';
                $html .= '<div class="signature-box" style="text-align:left;">';
                $html .= '<div class="signature-label">Received By</div>' . nl2br(htmlspecialchars($receivedBy ?: '_______________________')) . '<br><br>';
                $html .= '<div class="signature-label">Stamp</div>';
                if (!empty($stampText)) {
                    $html .= '<div>' . nl2br(htmlspecialchars($stampText)) . '</div>';
                } elseif ($signatureUrl) {
                    $html .= '<img src="' . htmlspecialchars($signatureUrl) . '" class="signature-image"><br>';
                } else {
                    $html .= '<div style="width:150px; height:80px; border:1px dashed #999; display:inline-block;"></div>';
                }
                $html .= '</div>';
                $html .= '<div class="signature-box" style="text-align:right;">';
                $html .= '<div class="signature-label">Authorized Signature</div>';
                if ($signatureUrl) {
                    $html .= '<img src="' . htmlspecialchars($signatureUrl) . '" class="signature-image"><br>';
                } else {
                    $html .= '<br><br><br>_______________________<br>';
                }
                $html .= '</div>';
                $html .= '</div>';
            } else {
                $html .= '<div style="margin-top: 40px; float: right; text-align: right;"><strong>Authorized Signature</strong><br>';
                if ($signatureUrl) $html .= '<img src="' . htmlspecialchars($signatureUrl) . '" class="signature"><br>';
                else $html .= '<br><br><br>_______________________<br>';
                $html .= '</div>';
            }

            $html .= '<div style="clear: both;"></div></div></body></html>';

            // Configure DOMPDF with optimizations
            $options = new Options();
            $options->set('isRemoteEnabled', false);  // Disable remote to prevent timeout
            $options->set('isHtml5ParserEnabled', true);
            $options->set('defaultFont', 'Helvetica');
            $options->set('dpi', 96);
            $options->set('enable_php', false);
            $options->set('enable_javascript', false);
            
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            
            // Render with timeout protection
            try {
                $dompdf->render();
            } catch (Exception $renderEx) {
                error_log('DOMPDF Render Error: ' . $renderEx->getMessage());
                throw new Exception('PDF rendering timeout or error. Try again.');
            }

            $output = $dompdf->output();
            $filename = strtoupper($document['document_type']) . '_' . $document['document_number'] . '.pdf';

            // STREAM DIRECTLY if action=view is requested
            if (isset($_GET['action']) && $_GET['action'] === 'view') {
                if (ob_get_level()) ob_end_clean();
                header('Content-Type: application/pdf');
                header('Content-Disposition: inline; filename="' . $filename . '"');
                header('Content-Length: ' . strlen($output));
                echo $output;
                exit;
            }

            // Save to storage
            $storagePath = __DIR__ . '/../../storage/pdfs/';
            if (!is_dir($storagePath)) mkdir($storagePath, 0777, true);
            file_put_contents($storagePath . $filename, $output);

            Response::json([
                'status' => 'success',
                'url' => BASE_URL . '/api/v1/pdf/' . $id . '?type=' . $type . '&token=' . rawurlencode($_GET['token'] ?? '') . '&action=view'
            ]);
        } catch (Exception $e) {
            error_log('PDF Generation Error: ' . $e->getMessage());
            Response::error('PDF generation failed: ' . $e->getMessage(), 500);
        }
    }
}
