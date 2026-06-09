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
            <div class="max-w-2xl mx-auto bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden fade-in">
                <div class="px-8 py-6 border-b border-borderDivider bg-brand-dark text-white flex justify-between items-center">
                    <h2 class="text-2xl font-black tracking-tight">${action} Product</h2>
                    <button onclick="window.location.hash='#/products'" class="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
                
                <form id="product-form" class="p-8 space-y-8" onsubmit="ProductForm.save(event)">
                    <div class="grid grid-cols-1 gap-8">
                        <div class="grid grid-cols-2 gap-8">
                            <div class="space-y-1">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">SKU (Unique Identifier)</label>
                                <input type="text" id="prod-sku" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="e.g. PRD-001">
                            </div>
                            <div class="space-y-1">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Product Name <span class="text-brand-red">*</span></label>
                                <input type="text" id="prod-name" required class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Item Name">
                            </div>
                        </div>
                        
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Description</label>
                            <textarea id="prod-desc" rows="3" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Details about the product..."></textarea>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-8">
                            <div class="space-y-1">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Unit Price (Rs.) <span class="text-brand-red">*</span></label>
                                <input type="number" step="0.01" min="0" id="prod-price" required class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-bold" placeholder="0.00">
                            </div>
                            <div class="space-y-1">
                                <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Standard Tax Rate (%)</label>
                                <input type="number" step="0.01" min="0" id="prod-tax" value="0" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-bold" placeholder="0.00">
                            </div>
                        </div>

                        <div class="bg-bgMain p-4 rounded-xl border border-borderDivider">
                            <label class="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" id="prod-active" checked class="w-6 h-6 text-brand-red rounded-lg border-borderDivider focus:ring-brand-red transition-all">
                                <span class="text-sm font-black text-brand-dark uppercase tracking-widest group-hover:text-brand-red transition-colors">Product is available for use</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-end pt-6 border-t border-borderDivider ${action === 'View' ? 'hidden' : ''}">
                        <button type="submit" class="bg-brand-red text-white px-10 py-3.5 rounded-2xl hover:bg-brand-redHover transition-all shadow-xl shadow-brand-red/20 font-black uppercase tracking-widest transform hover:-translate-y-1">
                            Save Product Record
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
