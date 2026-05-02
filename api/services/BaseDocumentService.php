<?php
// api/services/BaseDocumentService.php

class BaseDocumentService {
    private $db;
    private $mainTable;
    private $itemTable;
    private $documentPrefix;

    public function __construct($mainTable, $itemTable, $documentPrefix) {
        $this->db = Database::getConnection();
        $this->mainTable = $mainTable;
        $this->itemTable = $itemTable;
        $this->documentPrefix = $documentPrefix;
    }

    public function getAll($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->mainTable} WHERE user_id = :user_id ORDER BY created_at DESC");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll();
    }

    public function getById($id, $user_id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->mainTable} WHERE id = :id AND user_id = :user_id");
        $stmt->execute(['id' => $id, 'user_id' => $user_id]);
        $document = $stmt->fetch();
        
        if ($document) {
            $stmtItems = $this->db->prepare("SELECT * FROM {$this->itemTable} WHERE {$this->getForeignKeyName()} = :doc_id ORDER BY sort_order ASC");
            $stmtItems->execute(['doc_id' => $id]);
            $document['items'] = $stmtItems->fetchAll();

            // Fetch customer details
            $stmtCust = $this->db->prepare("SELECT * FROM customers WHERE id = :customer_id");
            $stmtCust->execute(['customer_id' => $document['customer_id']]);
            $document['customer'] = $stmtCust->fetch();
        }
        
        return $document;
    }

    public function create($data, $user_id) {
        $calculation = $this->calculateTotals($data['items'] ?? []);
        $totals = $calculation['totals'];
        
        $numberField = $this->getNumberFieldName();
        $docNumber = $data[$numberField] ?? $this->generateNextNumber($user_id);

        $sql = "INSERT INTO {$this->mainTable} (user_id, customer_id, {$numberField}, issue_date, status, subtotal, tax_total, discount_total, grand_total, notes, terms_conditions) 
                VALUES (:user_id, :customer_id, :doc_num, :issue_date, :status, :subtotal, :tax_total, :discount_total, :grand_total, :notes, :terms)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'customer_id' => $data['customer_id'],
            'doc_num' => $docNumber,
            'issue_date' => $data['issue_date'],
            'status' => $data['status'] ?? 'draft',
            'subtotal' => $totals['subtotal'],
            'tax_total' => $totals['tax_total'],
            'discount_total' => $totals['discount_total'],
            'grand_total' => $totals['grand_total'],
            'notes' => $data['notes'] ?? null,
            'terms' => $data['terms_conditions'] ?? null
        ]);

        $docId = $this->db->lastInsertId();

        $this->insertItems($docId, $calculation['items']);

        return $this->getById($docId, $user_id);
    }

    public function update($id, $data, $user_id) {
        $calculation = $this->calculateTotals($data['items'] ?? []);
        $totals = $calculation['totals'];

        $sql = "UPDATE {$this->mainTable} SET 
                customer_id = :customer_id, 
                issue_date = :issue_date, 
                status = :status, 
                subtotal = :subtotal, 
                tax_total = :tax_total, 
                discount_total = :discount_total, 
                grand_total = :grand_total, 
                notes = :notes, 
                terms_conditions = :terms 
                WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'id' => $id,
            'user_id' => $user_id,
            'customer_id' => $data['customer_id'],
            'issue_date' => $data['issue_date'],
            'status' => $data['status'] ?? 'draft',
            'subtotal' => $totals['subtotal'],
            'tax_total' => $totals['tax_total'],
            'discount_total' => $totals['discount_total'],
            'grand_total' => $totals['grand_total'],
            'notes' => $data['notes'] ?? null,
            'terms' => $data['terms_conditions'] ?? null
        ]);

        // Replace items
        $stmtDelete = $this->db->prepare("DELETE FROM {$this->itemTable} WHERE {$this->getForeignKeyName()} = :doc_id");
        $stmtDelete->execute(['doc_id' => $id]);

        $this->insertItems($id, $calculation['items']);

        return $this->getById($id, $user_id);
    }

    public function delete($id, $user_id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->mainTable} WHERE id = :id AND user_id = :user_id");
        return $stmt->execute(['id' => $id, 'user_id' => $user_id]);
    }

    private function insertItems($docId, $items) {
        $fkName = $this->getForeignKeyName();
        $sql = "INSERT INTO {$this->itemTable} ({$fkName}, product_id, item_name, description, quantity, unit_price, tax_rate, discount_amount, line_total, sort_order) 
                VALUES (:doc_id, :product_id, :item_name, :description, :quantity, :unit_price, :tax_rate, :discount_amount, :line_total, :sort_order)";
        
        $stmt = $this->db->prepare($sql);
        
        foreach ($items as $item) {
            $stmt->execute([
                'doc_id' => $docId,
                'product_id' => $item['product_id'] ?? null,
                'item_name' => $item['item_name'],
                'description' => $item['description'] ?? null,
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'tax_rate' => $item['tax_rate'] ?? 0,
                'discount_amount' => $item['discount_amount'] ?? 0,
                'line_total' => $item['line_total'],
                'sort_order' => $item['sort_order']
            ]);
        }
    }

    private function calculateTotals($items) {
        $subtotal = 0;
        $tax_total = 0;
        $discount_total = 0;
        $grand_total = 0;

        $processedItems = [];

        foreach ($items as $index => $item) {
            $qty = (int)$item['quantity'];
            $price = (float)$item['unit_price'];
            $discount = (float)($item['discount_amount'] ?? 0);
            $taxRate = (float)($item['tax_rate'] ?? 0);

            $lineSubtotal = ($qty * $price) - $discount;
            $lineTax = $lineSubtotal * ($taxRate / 100);
            $lineTotal = $lineSubtotal + $lineTax;

            $subtotal += ($qty * $price);
            $discount_total += $discount;
            $tax_total += $lineTax;
            $grand_total += $lineTotal;

            $item['line_total'] = $lineTotal;
            $item['sort_order'] = $index;
            $processedItems[] = $item;
        }

        return [
            'totals' => [
                'subtotal' => $subtotal,
                'tax_total' => $tax_total,
                'discount_total' => $discount_total,
                'grand_total' => $grand_total,
            ],
            'items' => $processedItems
        ];
    }

    private function getForeignKeyName() {
        // e.g. "quotations" -> "quotation_id"
        // "purchase_orders" -> "purchase_order_id"
        return rtrim($this->mainTable, 's') . '_id';
    }

    private function getNumberFieldName() {
        // e.g. "quotations" -> "quotation_number"
        if ($this->mainTable === 'purchase_orders') {
            return 'po_number';
        }
        return rtrim($this->mainTable, 's') . '_number';
    }

    private function generateNextNumber($user_id) {
        $field = $this->getNumberFieldName();
        $stmt = $this->db->prepare("SELECT {$field} FROM {$this->mainTable} WHERE user_id = :user_id ORDER BY id DESC LIMIT 1");
        $stmt->execute(['user_id' => $user_id]);
        $last = $stmt->fetchColumn();
        
        if ($last) {
            preg_match('/(\d+)$/', $last, $matches);
            if (!empty($matches[1])) {
                $num = intval($matches[1]) + 1;
                return $this->documentPrefix . str_pad($num, 4, '0', STR_PAD_LEFT);
            }
        }
        return $this->documentPrefix . '0001';
    }
}
