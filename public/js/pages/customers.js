// public/js/pages/customers.js

const Customers = {
    async render() {
        const hash = window.location.hash;
        if (hash.includes('#/customers/add') || hash.includes('#/customers/edit') || hash.includes('#/customers/view')) {
            return await CustomerForm.render();
        }

        return `
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div class="flex justify-between items-center border-b border-slate-700 pb-4">
                    <h1 class="text-2xl font-bold text-slate-100">Customers</h1>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-slate-900/50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Company / Contact</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created Date</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="customers-table-body" class="bg-slate-800 divide-y divide-gray-200">
                            <tr><td colspan="4" class="px-6 py-4 text-center text-sm text-slate-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-700">
                    <button onclick="window.location.hash='#/customers/add'" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add New Customer
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        const hash = window.location.hash;
        if (hash.includes('#/customers/add') || hash.includes('#/customers/edit') || hash.includes('#/customers/view')) {
            return await CustomerForm.init();
        }

        try {
            const response = await API.get('/customers');
            const customers = response.data;
            const tbody = document.getElementById('customers-table-body');
            
            if (!customers || customers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-slate-400">No customers found.</td></tr>';
                return;
            }

            let html = '';
            customers.forEach(cust => {
                html += `
                    <tr class="hover:bg-slate-900/50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${cust.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-white">${cust.company_name} <br><span class="text-slate-400 text-xs">${cust.contact_person || 'N/A'}</span></td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${cust.created_at ? cust.created_at.split(' ')[0] : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <a href="#/customers/view/${cust.id}" class="text-indigo-600 hover:text-indigo-900">View</a>
                            <a href="#/customers/edit/${cust.id}" class="text-blue-600 hover:text-blue-900">Update</a>
                            <button onclick="Customers.deleteCustomer(${cust.id})" class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (error) {
            console.error('Failed to load customers', error);
            App.showToast('Failed to load customers', 'error');
        }
    },

    async deleteCustomer(id) {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                await API.delete(`/customers/${id}`);
                App.showToast('Customer deleted successfully');
                this.init(); // reload
            } catch (error) {
                App.showToast('Failed to delete customer', 'error');
            }
        }
    }
};
