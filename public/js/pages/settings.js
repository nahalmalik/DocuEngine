// public/js/pages/settings.js

const Settings = {
    async render() {
        return `
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div class="flex justify-between items-center border-b border-slate-700 pb-4">
                    <h1 class="text-2xl font-bold text-slate-100">Settings</h1>
                </div>

                <form id="settings-form" class="space-y-6 mt-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Company Name</label>
                            <input type="text" id="company_name" name="company_name" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Company Email</label>
                            <input type="email" id="company_email" name="company_email" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Company Phone</label>
                            <input type="text" id="company_phone" name="company_phone" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-slate-300">Company Address</label>
                            <textarea id="company_address" name="company_address" rows="3" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Bank Account Title</label>
                            <input type="text" id="bank_account_title" name="bank_account_title" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Bank Account Number</label>
                            <input type="text" id="bank_account_number" name="bank_account_number" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Bank Name</label>
                            <input type="text" id="bank_name" name="bank_name" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Bank Branch</label>
                            <input type="text" id="bank_branch" name="bank_branch" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300">Company NTN</label>
                            <input type="text" id="company_ntn" name="company_ntn" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-slate-300">Company Logo (Image File)</label>
                            <input type="file" id="company_logo_file" accept="image/*" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                            <input type="hidden" id="company_logo" name="company_logo">
                            <img id="logo_preview" src="" class="mt-2 h-16 hidden">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-slate-300">Authorized Signature (Image File)</label>
                            <input type="file" id="company_signature_file" accept="image/*" class="mt-1 block w-full rounded-md bg-slate-50 text-slate-900 border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                            <input type="hidden" id="company_signature" name="company_signature">
                            <img id="signature_preview" src="" class="mt-2 h-16 hidden">
                        </div>
                    </div>
                    <div class="border-t border-slate-700 pt-4 flex justify-end">
                        <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">Save Settings</button>
                    </div>
                </form>
            </div>
        `;
    },

    async init() {
        try {
            const response = await API.get('/settings');
            const settings = response.data;
            
            // Assuming settings API returns an object or array of key-value
            // Let's handle both
            let s = {};
            if (Array.isArray(settings)) {
                settings.forEach(item => s[item.setting_key] = item.setting_value);
            } else {
                s = settings;
            }

            if (s.company_name) document.getElementById('company_name').value = s.company_name;
            if (s.company_email) document.getElementById('company_email').value = s.company_email;
            if (s.company_phone) document.getElementById('company_phone').value = s.company_phone;
            if (s.company_address) document.getElementById('company_address').value = s.company_address;
            
            if (s.bank_account_title) document.getElementById('bank_account_title').value = s.bank_account_title;
            if (s.bank_account_number) document.getElementById('bank_account_number').value = s.bank_account_number;
            if (s.bank_name) document.getElementById('bank_name').value = s.bank_name;
            if (s.bank_branch) document.getElementById('bank_branch').value = s.bank_branch;
            if (s.company_ntn) document.getElementById('company_ntn').value = s.company_ntn;
            if (s.company_logo) {
                document.getElementById('company_logo').value = s.company_logo;
                const preview = document.getElementById('logo_preview');
                preview.src = s.company_logo;
                preview.classList.remove('hidden');
            }
            if (s.company_signature) {
                document.getElementById('company_signature').value = s.company_signature;
                const preview = document.getElementById('signature_preview');
                preview.src = s.company_signature;
                preview.classList.remove('hidden');
            }

            const getBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            document.getElementById('company_logo_file').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const b64 = await getBase64(file);
                    document.getElementById('company_logo').value = b64;
                    const preview = document.getElementById('logo_preview');
                    preview.src = b64;
                    preview.classList.remove('hidden');
                }
            });

            document.getElementById('company_signature_file').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const b64 = await getBase64(file);
                    document.getElementById('company_signature').value = b64;
                    const preview = document.getElementById('signature_preview');
                    preview.src = b64;
                    preview.classList.remove('hidden');
                }
            });

            document.getElementById('settings-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                btn.disabled = true;
                btn.innerHTML = 'Saving...';
                
                const data = {
                    company_name: document.getElementById('company_name').value,
                    company_email: document.getElementById('company_email').value,
                    company_phone: document.getElementById('company_phone').value,
                    company_address: document.getElementById('company_address').value,
                    bank_account_title: document.getElementById('bank_account_title').value,
                    bank_account_number: document.getElementById('bank_account_number').value,
                    bank_name: document.getElementById('bank_name').value,
                    bank_branch: document.getElementById('bank_branch').value,
                    company_ntn: document.getElementById('company_ntn').value,
                    company_logo: document.getElementById('company_logo').value,
                    company_signature: document.getElementById('company_signature').value
                };

                try {
                    await API.post('/settings', data);
                    App.showToast('Settings saved successfully');
                } catch (error) {
                    App.showToast('Failed to save settings', 'error');
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = 'Save Settings';
                }
            });

        } catch (error) {
            console.error('Failed to load settings', error);
            App.showToast('Failed to load settings', 'error');
        }
    }
};
