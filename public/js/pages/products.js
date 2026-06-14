// public/js/pages/products.js

const Products = {
    async render() {
        const hash = window.location.hash;
        if (hash.includes('#/products/add') || hash.includes('#/products/edit') || hash.includes('#/products/view')) {
            return await ProductForm.render();
        }

        return `
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden">
                <div class="flex justify-between items-center border-b border-borderDivider pb-5">
                    <h1 class="text-3xl font-black text-textPrimary tracking-tighter">Products Catalog</h1>
                </div>

                <div class="overflow-x-auto rounded-2xl border border-borderDivider">
                    <table class="min-w-[720px] divide-y divide-borderDivider">
                        <thead class="bg-bgMain">
                            <tr>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">SKU</th>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Product Description</th>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Unit Price</th>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-black text-textSecondary uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="products-table-body" class="bg-white divide-y divide-borderDivider">
                            <tr><td colspan="4" class="px-4 py-6 sm:px-6 sm:py-8 text-center text-sm text-textSecondary animate-pulse">Fetching inventory items...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-8 pt-6 border-t border-borderDivider flex justify-end">
                    <button onclick="window.location.hash='#/products/add'" class="bg-brand-red text-white px-8 py-3 rounded-xl hover:bg-brand-redHover transition-all shadow-lg shadow-brand-red/20 font-black uppercase tracking-widest flex items-center gap-2 transform hover:-translate-y-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add New Product
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        const hash = window.location.hash;
        if (hash.includes('#/products/add') || hash.includes('#/products/edit') || hash.includes('#/products/view')) {
            return await ProductForm.init();
        }

        try {
            const response = await API.get('/products');

            if (!response || response._nonJson) {
                throw new Error('Could not parse server response');
            }

            const products = response.data || response;
            const tbody = document.getElementById('products-table-body');
            
            if (!products || !Array.isArray(products) || products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-textSecondary">No products found.</td></tr>';
                return;
            }

            let html = '';
            products.forEach(prod => {
                html += `
                    <tr class="hover:bg-bgMain/30 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-black text-textPrimary uppercase tracking-tighter">${prod.sku || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-textPrimary">${prod.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-textSecondary">Rs. ${parseFloat(prod.unit_price).toFixed(2)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-4">
                            <a href="#/products/view/${prod.id}" class="text-textPrimary hover:text-brand-red transition-colors">View</a>
                            <a href="#/products/edit/${prod.id}" class="text-brand-red hover:text-brand-redHover transition-colors">Update</a>
                            <button onclick="Products.deleteProduct(${prod.id})" class="text-textSecondary hover:text-red-600 transition-colors">Delete</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (error) {
            console.error('Failed to load products', error);
            App.showToast('Failed to load products', 'error');
        }
    },

    async deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                App.showToast('Product deleted successfully');
                this.init(); // reload
            } catch (error) {
                App.showToast('Failed to delete product', 'error');
            }
        }
    }
};
