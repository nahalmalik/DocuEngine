// public/js/pages/products.js

const Products = {
    async render() {
        const hash = window.location.hash;
        if (hash.includes('#/products/add') || hash.includes('#/products/edit') || hash.includes('#/products/view')) {
            return await ProductForm.render();
        }

        return `
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div class="flex justify-between items-center border-b border-slate-700 pb-4">
                    <h1 class="text-2xl font-bold text-slate-100">Products</h1>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-slate-900/50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">SKU</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="products-table-body" class="bg-slate-800 divide-y divide-gray-200">
                            <tr><td colspan="4" class="px-6 py-4 text-center text-sm text-slate-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-700">
                    <button onclick="window.location.hash='#/products/add'" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium flex items-center gap-2">
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
            const products = response.data;
            const tbody = document.getElementById('products-table-body');
            
            if (!products || products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-slate-400">No products found.</td></tr>';
                return;
            }

            let html = '';
            products.forEach(prod => {
                html += `
                    <tr class="hover:bg-slate-900/50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${prod.sku || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-white">${prod.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">$${parseFloat(prod.unit_price).toFixed(2)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <a href="#/products/view/${prod.id}" class="text-indigo-600 hover:text-indigo-900">View</a>
                            <a href="#/products/edit/${prod.id}" class="text-blue-600 hover:text-blue-900">Update</a>
                            <button onclick="Products.deleteProduct(${prod.id})" class="text-red-600 hover:text-red-900">Delete</button>
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
