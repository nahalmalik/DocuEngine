// public/js/pages/product-form.js

const ProductForm = {
    productId: null,

    getIdFromUrl() {
        const hash = window.location.hash;
        const match = hash.match(/\/(edit|view)\/(\d+)/);
        return match ? match[2] : null;
    },

    async render() {
        this.productId = this.getIdFromUrl();
        const action = this.productId ? (window.location.hash.includes('/view/') ? 'View' : 'Edit') : 'Create';

        return `
            <div class="max-w-2xl mx-auto bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden fade-in">
                <div class="px-6 py-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-100">${action} Product</h2>
                    <button onclick="window.location.hash='#/products'" class="text-slate-400 hover:text-slate-300">
                        Back to List
                    </button>
                </div>
                
                <form id="product-form" class="p-6 space-y-6" onsubmit="ProductForm.save(event)">
                    <div class="grid grid-cols-1 gap-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">SKU</label>
                                <input type="text" id="prod-sku" class="w-full px-4 py-2 bg-slate-50 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Product Name <span class="text-red-500">*</span></label>
                                <input type="text" id="prod-name" required class="w-full px-4 py-2 bg-slate-50 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea id="prod-desc" rows="3" class="w-full px-4 py-2 bg-slate-50 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Unit Price (Rs.) <span class="text-red-500">*</span></label>
                                <input type="number" step="0.01" min="0" id="prod-price" required class="w-full px-4 py-2 bg-slate-50 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Tax Rate (%)</label>
                                <input type="number" step="0.01" min="0" id="prod-tax" value="0" class="w-full px-4 py-2 bg-slate-50 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                            </div>
                        </div>

                        <div>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="prod-active" checked class="w-5 h-5 text-indigo-600 rounded border-slate-600 focus:ring-indigo-500">
                                <span class="text-sm font-medium text-slate-300">Product is Active</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4 border-t border-slate-700 ${action === 'View' ? 'hidden' : ''}">
                        <button type="submit" class="bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    async init() {
        const isView = window.location.hash.includes('/view/');
        if (isView) {
            const inputs = document.querySelectorAll('#product-form input, #product-form textarea');
            inputs.forEach(input => input.disabled = true);
        }
        if (this.productId) {
            try {
                const response = await API.get(`/products/${this.productId}`);
                const prod = response.data;
                document.getElementById('prod-sku').value = prod.sku || '';
                document.getElementById('prod-name').value = prod.name;
                document.getElementById('prod-desc').value = prod.description || '';
                document.getElementById('prod-price').value = prod.unit_price;
                document.getElementById('prod-tax').value = prod.tax_rate || '0';
                document.getElementById('prod-active').checked = prod.is_active == 1;
            } catch (error) {
                App.showToast('Failed to load product data', 'error');
            }
        }
    },

    async save(e) {
        e.preventDefault();
        
        const data = {
            sku: document.getElementById('prod-sku').value,
            name: document.getElementById('prod-name').value,
            description: document.getElementById('prod-desc').value,
            unit_price: parseFloat(document.getElementById('prod-price').value),
            tax_rate: parseFloat(document.getElementById('prod-tax').value) || 0,
            is_active: document.getElementById('prod-active').checked ? 1 : 0
        };

        try {
            if (this.productId) {
                await API.put(`/products/${this.productId}`, data);
                App.showToast('Product updated successfully');
            } else {
                await API.post('/products', data);
                App.showToast('Product created successfully');
            }
            window.location.hash = '#/products';
        } catch (error) {
            App.showToast('Failed to save product', 'error');
        }
    }
};
