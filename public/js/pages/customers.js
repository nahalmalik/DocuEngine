// public/js/pages/customers.js

const Customers = {
    async render() {
        const hash = window.location.hash;
        if (hash.includes('#/customers/add') || hash.includes('#/customers/edit') || hash.includes('#/customers/view')) {
            return await CustomerForm.render();
        }

        return `
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden">
                <div class="flex justify-between items-center border-b border-borderDivider pb-5">
                    <h1 class="text-3xl font-black text-textPrimary tracking-tighter">Business Directory</h1>
                </div>

                <div class="overflow-x-auto rounded-2xl border border-borderDivider">
                    <table class="min-w-[720px] divide-y divide-borderDivider">
                        <thead class="bg-bgMain">
                            <tr>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Client ID</th>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Company / Principal Contact</th>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Onboarded</th>
                                <th class="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-black text-textSecondary uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="customers-table-body" class="bg-white divide-y divide-borderDivider">
                            <tr><td colspan="4" class="px-4 py-6 sm:px-6 sm:py-8 text-center text-sm text-textSecondary animate-pulse">Accessing client database...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-8 pt-6 border-t border-borderDivider flex justify-end">
                    <button onclick="window.location.hash='#/customers/add'" class="bg-brand-red text-white px-8 py-3 rounded-xl hover:bg-brand-redHover transition-all shadow-lg shadow-brand-red/20 font-black uppercase tracking-widest flex items-center gap-2 transform hover:-translate-y-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add New Client
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

            if (!response || response._nonJson) {
                throw new Error('Could not parse server response');
            }

            const customers = response.data || response;
            const tbody = document.getElementById('customers-table-body');
            
            if (!customers || !Array.isArray(customers) || customers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-textSecondary">No customers found.</td></tr>';
                return;
            }

            let html = '';
            customers.forEach(cust => {
                html += `
                    <tr class="hover:bg-bgMain/30 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-black text-textPrimary uppercase tracking-tighter">#${cust.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-textPrimary">
                            <div class="flex flex-col">
                                <span>${cust.company_name}</span>
                                <span class="text-xs text-textSecondary font-medium">${cust.contact_person || 'N/A'}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-textSecondary">${cust.created_at ? cust.created_at.split(' ')[0] : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-4">
                            <a href="#/customers/view/${cust.id}" class="text-textPrimary hover:text-brand-red transition-colors">View</a>
                            <a href="#/customers/edit/${cust.id}" class="text-brand-red hover:text-brand-redHover transition-colors">Update</a>
                            <button onclick="Customers.deleteCustomer(${cust.id})" class="text-textSecondary hover:text-red-600 transition-colors">Delete</button>
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
