// public/js/pages/customer-form.js

const CustomerForm = {
    customerId: null,

    getIdFromUrl() {
        const hash = window.location.hash;
        const match = hash.match(/\/(edit|view)\/(\d+)/);
        return match ? match[2] : null;
    },

    async render() {
        this.customerId = this.getIdFromUrl();
        const action = this.customerId ? 'Edit' : 'Create';

        return `
            <div class="max-w-3xl mx-auto bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden fade-in">
                <div class="px-6 py-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-100">${action} Customer</h2>
                    <button onclick="window.location.hash='#/customers'" class="text-slate-400 hover:text-slate-300">
                        Back to List
                    </button>
                </div>
                
                <form id="customer-form" class="p-6 space-y-6" onsubmit="CustomerForm.save(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Company Name <span class="text-red-500">*</span></label>
                            <input type="text" id="cust-company" required class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Contact Person</label>
                            <input type="text" id="cust-contact" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input type="email" id="cust-email" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                            <input type="text" id="cust-phone" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Tax Number / VAT</label>
                            <input type="text" id="cust-tax" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Billing Address</label>
                            <textarea id="cust-billing" rows="3" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Shipping Address</label>
                            <textarea id="cust-shipping" rows="3" class="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4 border-t border-slate-700 ${action === 'View' ? 'hidden' : ''}">
                        <button type="submit" class="bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    async init() {
        const isView = window.location.hash.includes('/view/');
        if (isView) {
            const inputs = document.querySelectorAll('#customer-form input, #customer-form textarea');
            inputs.forEach(input => input.disabled = true);
        }
        if (this.customerId) {
            try {
                const response = await API.get(`/customers/${this.customerId}`);
                const cust = response.data;
                document.getElementById('cust-company').value = cust.company_name;
                document.getElementById('cust-contact').value = cust.contact_person || '';
                document.getElementById('cust-email').value = cust.email || '';
                document.getElementById('cust-phone').value = cust.phone || '';
                document.getElementById('cust-tax').value = cust.tax_number || '';
                document.getElementById('cust-billing').value = cust.billing_address || '';
                document.getElementById('cust-shipping').value = cust.shipping_address || '';
            } catch (error) {
                App.showToast('Failed to load customer data', 'error');
            }
        }
    },

    async save(e) {
        e.preventDefault();
        
        const data = {
            company_name: document.getElementById('cust-company').value,
            contact_person: document.getElementById('cust-contact').value,
            email: document.getElementById('cust-email').value,
            phone: document.getElementById('cust-phone').value,
            tax_number: document.getElementById('cust-tax').value,
            billing_address: document.getElementById('cust-billing').value,
            shipping_address: document.getElementById('cust-shipping').value
        };

        try {
            if (this.customerId) {
                await API.put(`/customers/${this.customerId}`, data);
                App.showToast('Customer updated successfully');
            } else {
                await API.post('/customers', data);
                App.showToast('Customer created successfully');
            }
            window.location.hash = '#/customers';
        } catch (error) {
            App.showToast('Failed to save customer', 'error');
        }
    }
};
