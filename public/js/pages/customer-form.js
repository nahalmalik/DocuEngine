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
            <div class="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden fade-in">
                <div class="px-8 py-6 border-b border-borderDivider bg-card text-textPrimary flex justify-between items-center">
                    <h2 class="text-2xl font-black tracking-tight">${action} Client Profile</h2>
                    <button onclick="window.location.hash='#/customers'" class="text-textSecondary hover:text-textPrimary bg-bgMain/50 p-2 rounded-full transition-all">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
                
                <form id="customer-form" class="p-8 space-y-10" onsubmit="CustomerForm.save(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Company / Business Name <span class="text-brand-red">*</span></label>
                            <input type="text" id="cust-company" required class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Legal Entity Name">
                        </div>
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Primary Contact Person</label>
                            <input type="text" id="cust-contact" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Name of representative">
                        </div>
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" id="cust-email" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="billing@client.com">
                        </div>
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Phone Number</label>
                            <input type="text" id="cust-phone" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="+92 ...">
                        </div>
                        <div class="space-y-1 md:col-span-2">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Tax Registration Number (NTN/VAT)</label>
                            <input type="text" id="cust-tax" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Official Tax ID">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Billing Address</label>
                            <textarea id="cust-billing" rows="3" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Registered billing address"></textarea>
                        </div>
                        <div class="space-y-1">
                            <label class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Shipping / Delivery Address</label>
                            <textarea id="cust-shipping" rows="3" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition-all font-semibold" placeholder="Physical delivery location"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end pt-6 border-t border-borderDivider ${action === 'View' ? 'hidden' : ''}">
                        <button type="submit" class="bg-brand-red text-white px-10 py-3.5 rounded-2xl hover:bg-brand-redHover transition-all shadow-xl shadow-brand-red/20 font-black uppercase tracking-widest transform hover:-translate-y-1">
                            Save Client Record
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
