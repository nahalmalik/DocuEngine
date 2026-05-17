// public/js/components/navbar.js

const Navbar = {
    settingsCache: null,
    
    async render() {
        const user = Auth.getUser();
        
        let logoHtml = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;
        let companyName = 'InvoQuote';

        if (user) {
            try {
                if (!this.settingsCache) {
                    const res = await API.get('/settings');
                    this.settingsCache = {};
                    if (Array.isArray(res.data)) {
                        res.data.forEach(item => this.settingsCache[item.setting_key] = item.setting_value);
                    } else {
                        this.settingsCache = res.data || {};
                    }
                }
                
                if (this.settingsCache.company_name) {
                    companyName = this.settingsCache.company_name;
                }
                if (this.settingsCache.company_logo) {
                    logoHtml = `<img src="${this.settingsCache.company_logo}" alt="Logo" class="h-8 w-auto max-w-[150px] object-contain bg-slate-800 rounded p-1">`;
                }
            } catch (e) {
                console.error("Failed to load settings for navbar", e);
            }
        }

        return `
            <nav class="bg-slate-800 border-b border-slate-700 text-slate-100 shadow-md">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 font-bold text-xl tracking-wider flex items-center gap-3 text-indigo-400">
                                ${logoHtml}
                                <span class="hidden sm:inline text-white">${companyName}</span>
                            </div>
                            <div class="ml-4 sm:ml-10 flex items-baseline space-x-2 sm:space-x-4">
                                <a href="#/dashboard" class="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-slate-700 transition-colors">Dashboard</a>
                                <a href="#/settings" class="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-slate-700 transition-colors">Settings</a>
                            </div>
                        </div>
                        <div class="flex items-center ml-2 space-x-2">
                            <span class="hidden lg:inline mr-4 text-sm text-slate-300">${user ? user.name : ''}</span>
                            <button onclick="Auth.logout()" class="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-slate-700 hover:bg-slate-600 border border-slate-600 transition-colors">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
};
