// public/js/pages/document-form.js

const DocumentForm = {
    items: [],
    products: [],
    customers: [],
    documentId: null,
    type: 'quotation',

    getTypeFromUrl() {
        const hash = window.location.hash;
        if (hash.includes('?type=')) {
            return hash.split('?type=')[1];
        }
        return 'quotation';
    },

    getIdFromUrl() {
        const hash = window.location.hash;
        const match = hash.match(/\/edit\/(\d+)/);
        return match ? match[1] : null;
    },

    getEndpointPath(type) {
        if (type === 'purchase_order') return 'purchase-orders';
        return type + 's';
    },

    formatTitle(type) {
        if (type === 'receipt') return 'Delivery Challan';
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },

    async render() {
        this.type = this.getTypeFromUrl();
        this.documentId = this.getIdFromUrl();
        const action = this.documentId ? 'Edit' : 'Create';
        const title = `${action} ${this.formatTitle(this.type)}`;

        return `
            <div class="max-w-5xl mx-auto bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden fade-in">
                <div class="px-6 py-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-100">${title}</h2>
                    <button onclick="window.location.hash='#/documents?type=${this.type}'" class="text-slate-400 hover:text-slate-300">
                        Back to List
                    </button>
                </div>
                
                <form id="document-form" class="p-6 space-y-8" onsubmit="DocumentForm.save(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Customer <span class="text-red-500">*</span></label>
                            <select id="doc-customer" required class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                                <option value="">Select Customer...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Issue Date <span class="text-red-500">*</span></label>
                            <input type="date" id="doc-date" required class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Status</label>
                            <select id="doc-status" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow">
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-end mb-4">
                            <h3 class="text-lg font-medium text-slate-100">Line Items</h3>
                            <button type="button" onclick="DocumentForm.addItem()" class="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors">
                                + Add Item
                            </button>
                        </div>
                        
                        <div class="overflow-x-auto border border-slate-700 rounded-lg">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-900/50 text-slate-300 text-sm">
                                    <tr>
                                        <th class="p-3 border-b border-slate-700 font-medium">Product / Description</th>
                                        <th class="p-3 border-b border-slate-700 font-medium w-24">Qty</th>
                                        <th class="p-3 border-b border-slate-700 font-medium w-32 ${this.type === 'receipt' ? 'hidden' : ''}">Price</th>
                                        <th class="p-3 border-b border-slate-700 font-medium w-24 ${this.type === 'receipt' ? 'hidden' : ''}">Tax %</th>
                                        <th class="p-3 border-b border-slate-700 font-medium w-32 ${this.type === 'receipt' ? 'hidden' : ''}">Total</th>
                                        <th class="p-3 border-b border-slate-700 font-medium w-16"></th>
                                    </tr>
                                </thead>
                                <tbody id="doc-items-container" class="divide-y divide-gray-100">
                                    <!-- Items injected here -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                                <textarea id="doc-notes" rows="3" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"></textarea>
                            </div>
                            <div class="${this.type === 'purchase_order' ? 'hidden' : ''}">
                                <label class="block text-sm font-medium text-slate-300 mb-1">Terms & Conditions</label>
                                <textarea id="doc-terms" rows="3" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"></textarea>
                            </div>
                            <div class="${this.type === 'purchase_order' ? '' : 'hidden'} space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-1">Received By</label>
                                    <input id="doc-received-by" type="text" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="Name of receiver">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-1">Stamp Text</label>
                                    <input id="doc-stamp-text" type="text" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" placeholder="Stamp / received confirmation">
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-900/50 p-6 rounded-lg border border-slate-700 h-fit space-y-3 ${this.type === 'receipt' ? 'hidden' : ''}">
                            <div class="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span id="summary-subtotal">$0.00</span>
                            </div>
                            <div class="flex justify-between text-slate-400">
                                <span>Tax Total</span>
                                <span id="summary-tax">$0.00</span>
                            </div>
                            <div class="border-t border-slate-700 pt-3 flex justify-between text-lg font-bold text-white">
                                <span>Grand Total</span>
                                <span id="summary-grand">$0.00</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4 border-t border-slate-700">
                        <button type="submit" class="bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                            Save ${this.formatTitle(this.type)}
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    async init() {
        this.items = [];
        this.products = [];
        this.customers = [];

        try {
            const [custRes, prodRes] = await Promise.all([
                API.get('/customers'),
                API.get('/products')
            ]);
            this.customers = custRes.data || [];
            this.products = prodRes.data || [];

            const custSelect = document.getElementById('doc-customer');
            this.customers.forEach(c => {
                custSelect.innerHTML += `<option value="${c.id}">${c.company_name}</option>`;
            });

            // Set default date to today
            document.getElementById('doc-date').valueAsDate = new Date();

            if (this.documentId) {
                await this.loadDocument();
            } else {
                this.addItem(); // add one empty row
            }
        } catch (error) {
            console.error('Failed to init form', error);
            App.showToast('Failed to load dependencies', 'error');
        }
    },

    async loadDocument() {
        try {
            const endpoint = this.getEndpointPath(this.type);
            const response = await API.get(`/${endpoint}/${this.documentId}`);
            const doc = response.data;

            document.getElementById('doc-customer').value = doc.customer_id;
            document.getElementById('doc-date').value = doc.issue_date;
            document.getElementById('doc-status').value = doc.status;
            document.getElementById('doc-notes').value = doc.notes || '';
            document.getElementById('doc-terms').value = doc.terms_conditions || '';
            if (document.getElementById('doc-received-by')) {
                document.getElementById('doc-received-by').value = doc.received_by || '';
            }
            if (document.getElementById('doc-stamp-text')) {
                document.getElementById('doc-stamp-text').value = doc.stamp_text || '';
            }

            this.items = doc.items || [];
            this.renderItems();
        } catch (error) {
            App.showToast('Failed to load document data', 'error');
        }
    },

    addItem() {
        this.items.push({
            id: Date.now(), // temp id
            product_id: '',
            item_name: '',
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate: 0
        });
        this.renderItems();
    },

    removeItem(index) {
        this.items.splice(index, 1);
        this.renderItems();
    },

    handleProductChange(index, productId) {
        const product = this.products.find(p => p.id == productId);
        if (product) {
            this.items[index].product_id = product.id;
            this.items[index].item_name = product.name;
            this.items[index].description = product.description || '';
            this.items[index].unit_price = product.unit_price;
            this.items[index].tax_rate = product.tax_rate;
            this.renderItems();
        }
    },

    updateItem(index, field, value) {
        this.items[index][field] = value;
        this.calculateTotals();
    },

    renderItems() {
        const container = document.getElementById('doc-items-container');
        container.innerHTML = '';

        let productOptions = '<option value="">Custom Item...</option>';
        this.products.forEach(p => {
            productOptions += `<option value="${p.id}">${p.name}</option>`;
        });

        this.items.forEach((item, index) => {
            const lineTotal = (item.quantity * item.unit_price) * (1 + (item.tax_rate / 100));

            container.innerHTML += `
                <tr class="group">
                    <td class="p-2">
                        <select onchange="DocumentForm.handleProductChange(${index}, this.value)" class="w-full p-1.5 mb-1 bg-slate-50 text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500">
                            ${productOptions.replace(`value="${item.product_id}"`, `value="${item.product_id}" selected`)}
                        </select>
                        <input type="text" placeholder="Item Name" value="${item.item_name}" oninput="DocumentForm.updateItem(${index}, 'item_name', this.value)" required class="w-full p-1.5 bg-slate-50 text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500">
                    </td>
                    <td class="p-2">
                        <input type="number" min="1" step="1" value="${item.quantity}" oninput="DocumentForm.updateItem(${index}, 'quantity', this.value)" required class="w-full p-1.5 bg-slate-50 text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500">
                    </td>
                    <td class="p-2 ${this.type === 'receipt' ? 'hidden' : ''}">
                        <input type="number" step="0.01" value="${item.unit_price}" oninput="DocumentForm.updateItem(${index}, 'unit_price', this.value)" class="w-full p-1.5 bg-slate-50 text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500">
                    </td>
                    <td class="p-2 ${this.type === 'receipt' ? 'hidden' : ''}">
                        <input type="number" step="0.01" value="${item.tax_rate}" oninput="DocumentForm.updateItem(${index}, 'tax_rate', this.value)" class="w-full p-1.5 bg-slate-50 text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500">
                    </td>
                    <td class="p-2 text-right font-medium text-slate-300 ${this.type === 'receipt' ? 'hidden' : ''}">
                        $${lineTotal.toFixed(2)}
                    </td>
                    <td class="p-2 text-center">
                        <button type="button" onclick="DocumentForm.removeItem(${index})" class="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </td>
                </tr>
            `;
        });

        this.calculateTotals();
    },

    calculateTotals() {
        let subtotal = 0;
        let tax = 0;

        this.items.forEach(item => {
            const qty = parseInt(item.quantity) || 0;
            const price = parseFloat(item.unit_price) || 0;
            const taxRate = parseFloat(item.tax_rate) || 0;

            const lineSub = qty * price;
            const lineTax = lineSub * (taxRate / 100);

            subtotal += lineSub;
            tax += lineTax;
        });

        const grand = subtotal + tax;

        document.getElementById('summary-subtotal').textContent = '$' + subtotal.toFixed(2);
        document.getElementById('summary-tax').textContent = '$' + tax.toFixed(2);
        document.getElementById('summary-grand').textContent = '$' + grand.toFixed(2);
    },

    async save(e) {
        e.preventDefault();

        if (this.items.length === 0) {
            App.showToast('Please add at least one line item', 'error');
            return;
        }

        const data = {
            customer_id: document.getElementById('doc-customer').value,
            issue_date: document.getElementById('doc-date').value,
            status: document.getElementById('doc-status').value,
            notes: document.getElementById('doc-notes').value,
            terms_conditions: document.getElementById('doc-terms').value,
            received_by: document.getElementById('doc-received-by') ? document.getElementById('doc-received-by').value : null,
            stamp_text: document.getElementById('doc-stamp-text') ? document.getElementById('doc-stamp-text').value : null,
            items: this.items.map((item, index) => ({
                product_id: item.product_id || null,
                item_name: item.item_name,
                description: item.description || null,
                quantity: parseInt(item.quantity),
                unit_price: parseFloat(item.unit_price),
                tax_rate: parseFloat(item.tax_rate) || 0,
                sort_order: index
            }))
        };

        try {
            const endpoint = this.getEndpointPath(this.type);

            if (this.documentId) {
                await API.put(`/${endpoint}/${this.documentId}`, data);
                App.showToast('Document updated successfully');
            } else {
                await API.post(`/${endpoint}`, data);
                App.showToast('Document created successfully');
            }

            window.location.hash = `#/documents?type=${this.type}`;
        } catch (error) {
            console.error(error);
            App.showToast('Failed to save document', 'error');
        }
    }
};
