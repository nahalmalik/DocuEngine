// public/js/pages/document-form.js

const DocumentForm = {
    documentId: null,
    type: 'quotation',
    items: [],
    products: [],

    getTypeFromUrl() {
        const hash = window.location.hash;
        if (hash.includes('?type=')) return hash.split('?type=')[1];
        return 'quotation';
    },

    getIdFromUrl() {
        const match = window.location.hash.match(/\/edit\/(\d+)/);
        return match ? match[1] : null;
    },

    async render() {
        this.type = this.getTypeFromUrl();
        this.documentId = this.getIdFromUrl();
        const title = this.type === 'receipt' ? 'Delivery Challan' : this.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        return `
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6">
                <div class="bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden">
                    <div class="px-8 py-6 border-b border-borderDivider bg-card text-textPrimary flex justify-between items-center">
                        <h2 class="text-2xl font-black tracking-tight">${this.documentId ? 'Edit' : 'Create'} ${title}</h2>
                        <button onclick="window.location.hash='#/documents?type=${this.type}'" class="text-textSecondary hover:text-textPrimary bg-bgMain/50 p-2 rounded-full transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>

                    <form id="doc-form" class="p-8 space-y-10" onsubmit="DocumentForm.save(event)">
                        <!-- Basic Info -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div class="space-y-2">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest">Customer <span class="text-brand-red">*</span></label>
                                <select id="doc-customer" required class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold">
                                    <option value="">Select Customer</option>
                                </select>
                            </div>
                            <div class="space-y-2 ${this.type === 'invoice' || this.type === 'receipt' ? '' : 'hidden'}">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest">PO Number ${this.type === 'invoice' ? '<span class="text-brand-red">*</span>' : ''}</label>
                                <input type="text" id="doc-po-number" ${this.type === 'invoice' ? 'required' : ''} class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="${this.type === 'invoice' ? 'Required PO No.' : 'Optional PO No.'}">
                            </div>
                            <div class="space-y-2">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest">Issue Date <span class="text-brand-red">*</span></label>
                                <input type="date" id="doc-date" required class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold">
                            </div>
                            <div class="space-y-2 ${this.type === 'invoice' ? '' : 'hidden'}">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest">Due Date</label>
                                <input type="date" id="doc-due-date" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold">
                            </div>
                        </div>

                        <!-- Items Table -->
                        <div class="space-y-6">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xl font-black text-textPrimary tracking-tight">Line Items</h3>
                                <button type="button" onclick="DocumentForm.addItem()" class="px-6 py-2.5 bg-brand-red text-white rounded-xl hover:bg-brand-redHover transition-all text-sm font-bold shadow-sm">Add New Item</button>
                            </div>
                            <div class="overflow-x-auto rounded-2xl border border-borderDivider">
                                <table class="min-w-[900px] divide-y divide-borderDivider">
                                    <thead class="bg-bgMain">
                                        <tr>
                                            <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Item Details</th>
                                            <th class="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs font-black text-textSecondary uppercase tracking-widest w-24">Qty</th>
                                            <th class="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-black text-textSecondary uppercase tracking-widest w-24 ${this.type === 'receipt' ? 'hidden' : ''}">Tax %</th>
                                            <th class="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-black text-textSecondary uppercase tracking-widest w-40 ${this.type === 'receipt' ? 'hidden' : ''}">Unit Price</th>
                                            <th class="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-black text-textSecondary uppercase tracking-widest w-40 ${this.type === 'receipt' ? 'hidden' : ''}">Line Total</th>
                                            <th class="px-4 py-3 sm:px-6 sm:py-4 text-center w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="items-body" class="divide-y divide-borderDivider bg-white"></tbody>
                                    <tfoot class="${this.type === 'receipt' ? 'hidden' : ''} bg-bgMain/50">
                                        <tr>
                                            <td colspan="4" class="px-4 py-4 sm:px-6 sm:py-6 text-right text-sm font-black text-textSecondary uppercase tracking-widest">Grand Total:</td>
                                            <td class="px-4 py-4 sm:px-6 sm:py-6 text-right text-2xl font-black text-brand-red">
                                                Rs. <span id="grand-total">0.00</span>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <!-- Notes and Terms -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div class="space-y-2">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest">Notes</label>
                                <textarea id="doc-notes" rows="4" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl outline-none focus:ring-2 focus:ring-brand-red transition-all font-semibold"></textarea>
                            </div>
                            <div class="space-y-2 ${this.type === 'purchase_order' ? 'hidden' : ''}">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest">Terms & Conditions</label>
                                <textarea id="doc-terms" rows="4" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl outline-none focus:ring-2 focus:ring-brand-red transition-all font-semibold"></textarea>
                            </div>
                        </div>

                        <!-- Footer Actions -->
                        <div class="flex justify-end pt-10 border-t border-borderDivider">
                            <button type="submit" class="px-12 py-4 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brand-redHover transition-all shadow-xl shadow-brand-red/20 transform hover:-translate-y-1">
                                ${this.documentId ? 'Update' : 'Save'} ${title}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    async init() {
        const customersRes = await API.get('/customers');
        const select = document.getElementById('doc-customer');
        customersRes.data.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.company_name}</option>`;
        });

        // Fetch products for the item selector
        try {
            const productsRes = await API.get('/products');
            this.products = productsRes.data || [];
        } catch (error) {
            console.error('Failed to load products', error);
        }

        if (this.documentId) {
            const endpoint = this.type === 'purchase_order' ? 'purchase-orders' : this.type + 's';
            const res = await API.get(`/${endpoint}/${this.documentId}`);
            const doc = res.data;
            document.getElementById('doc-customer').value = doc.customer_id;
            document.getElementById('doc-date').value = doc.issue_date;
            if (document.getElementById('doc-po-number')) document.getElementById('doc-po-number').value = doc.po_number || '';
            if (document.getElementById('doc-due-date')) document.getElementById('doc-due-date').value = doc.due_date || '';
            document.getElementById('doc-notes').value = doc.notes || '';
            if (document.getElementById('doc-terms')) document.getElementById('doc-terms').value = doc.terms_conditions || '';

            doc.items.forEach(item => this.addItem(item));
        } else {
            document.getElementById('doc-date').value = new Date().toISOString().split('T')[0];
            this.addItem(); // default row
        }
    },

    addItem(data = null) {
        const id = Date.now();
        const row = document.createElement('tr');
        row.id = `item-${id}`;

        let productOptions = '<option value="">-- Select Product --</option>';
        this.products.forEach(p => {
            productOptions += `<option value="${p.id}" ${data?.product_id == p.id ? 'selected' : ''}>${p.name}</option>`;
        });

        row.innerHTML = `
            <td class="px-6 py-4 space-y-2">
                <select onchange="DocumentForm.onProductChange(${id}, this.value)" class="item-product w-full px-3 py-2 bg-bgMain text-textPrimary border border-borderDivider rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red font-semibold transition-all">
                    ${productOptions}
                </select>
                <input type="text" placeholder="Item Name" value="${data?.item_name || ''}" class="item-name w-full px-3 py-2 bg-white text-textPrimary border border-borderDivider rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red font-bold transition-all">
                <textarea placeholder="Description" class="item-description w-full px-3 py-2 bg-white text-textSecondary border border-borderDivider rounded-lg text-xs outline-none focus:ring-2 focus:ring-brand-red transition-all">${data?.description || ''}</textarea>
            </td>
            <td class="px-6 py-4 text-center">
                <input type="number" step="0.01" value="${data?.quantity || '1.00'}" onchange="DocumentForm.calculateRow(${id})" class="item-qty w-20 px-2 py-2 bg-white text-textPrimary border border-borderDivider rounded-lg text-sm text-center font-bold focus:ring-2 focus:ring-brand-red">
            </td>
            <td class="px-6 py-4 text-right ${this.type === 'receipt' ? 'hidden' : ''}">
                <input type="number" step="0.01" value="${data?.tax_rate ?? '0.00'}" onchange="DocumentForm.calculateRow(${id})" class="item-tax w-20 px-2 py-2 bg-white text-textPrimary border border-borderDivider rounded-lg text-sm text-right font-bold focus:ring-2 focus:ring-brand-red" placeholder="Tax %">
            </td>
            <td class="px-6 py-4 text-right ${this.type === 'receipt' ? 'hidden' : ''}">
                <div class="flex items-center justify-end gap-1">
                    <span class="text-xs font-bold text-textSecondary">Rs.</span>
                    <input type="number" step="0.01" value="${data?.unit_price || '0.00'}" onchange="DocumentForm.calculateRow(${id})" class="item-price w-32 px-2 py-2 bg-white text-textPrimary border border-borderDivider rounded-lg text-sm text-right font-bold focus:ring-2 focus:ring-brand-red">
                </div>
            </td>
            <td class="px-6 py-4 text-right font-black text-textPrimary ${this.type === 'receipt' ? 'hidden' : ''}">
                <span class="text-xs text-textSecondary mr-1">Rs.</span>
                <span id="total-${id}">${data?.line_total || '0.00'}</span>
            </td>
            <td class="px-6 py-4 text-center">
                <button type="button" onclick="DocumentForm.removeItem(${id})" class="text-brand-red hover:text-brand-redHover p-2 hover:bg-brand-red/10 rounded-full transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
            </td>
        `;
        document.getElementById('items-body').appendChild(row);
    },

    onProductChange(id, productId) {
        if (!productId) return;
        const product = this.products.find(p => p.id == productId);
        if (product) {
            const row = document.getElementById(`item-${id}`);
            const nameInput = row.querySelector('.item-name');
            const descInput = row.querySelector('.item-description');
            const priceInput = row.querySelector('.item-price');
            const taxInput = row.querySelector('.item-tax');

            if (nameInput) nameInput.value = product.name;
            if (descInput) descInput.value = product.description || '';
            if (this.type !== 'receipt' && priceInput) {
                priceInput.value = product.unit_price || 0;
            }
            if (this.type !== 'receipt' && taxInput) {
                taxInput.value = product.tax_rate ?? 0;
            }
            this.calculateRow(id);
        }
    },

    removeItem(id) {
        const row = document.getElementById(`item-${id}`);
        if (row) {
            row.remove();
            this.updateGrandTotal();
        }
    },

    calculateRow(id) {
        const row = document.getElementById(`item-${id}`);
        const qty = parseFloat(row.querySelector('.item-qty')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        const taxRate = parseFloat(row.querySelector('.item-tax')?.value) || 0;
        const subtotal = qty * price;
        const taxAmount = subtotal * (taxRate / 100);
        const total = (subtotal + taxAmount).toFixed(2);
        const totalElem = document.getElementById(`total-${id}`);
        if (totalElem) totalElem.textContent = total;

        this.updateGrandTotal();
    },

    updateGrandTotal() {
        let grandTotal = 0;
        document.querySelectorAll('[id^="total-"]').forEach(span => {
            grandTotal += parseFloat(span.textContent) || 0;
        });
        const gtElem = document.getElementById('grand-total');
        if (gtElem) gtElem.textContent = grandTotal.toFixed(2);
    },

    async save(e) {
        e.preventDefault();
        const items = [];
        document.querySelectorAll('#items-body tr').forEach(row => {
            items.push({
                product_id: row.querySelector('select').value || null,
                item_name: row.querySelector('.item-name')?.value || '',
                description: row.querySelector('.item-description')?.value || '',
                quantity: row.querySelector('.item-qty')?.value || 0,
                tax_rate: row.querySelector('.item-tax')?.value || 0,
                unit_price: row.querySelector('.item-price')?.value || 0
            });
        });

        const data = {
            customer_id: document.getElementById('doc-customer').value,
            issue_date: document.getElementById('doc-date').value,
            po_number: document.getElementById('doc-po-number')?.value || null,
            due_date: document.getElementById('doc-due-date')?.value || null,
            notes: document.getElementById('doc-notes').value,
            terms_conditions: document.getElementById('doc-terms')?.value || null,
            items
        };

        try {
            const endpoint = this.type === 'purchase_order' ? 'purchase-orders' : this.type + 's';
            if (this.documentId) await API.put(`/${endpoint}/${this.documentId}`, data);
            else await API.post(`/${endpoint}`, data);

            App.showToast('Document saved successfully');
            window.location.hash = `#/documents?type=${this.type}`;
        } catch (error) {
            App.showToast('Failed to save document', 'error');
        }
    }
};
