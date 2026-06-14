// public/js/components/navbar.js

const Navbar = {
    settingsCache: null,

    async render() {
        const user = Auth.getUser();

        let logoHtml = `<svg class="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
        </svg>`;

        let companyName = 'InvoQuote';

        if (user) {
            try {
                if (!this.settingsCache) {
                    const res = await API.get('/settings');
                    this.settingsCache = {};

                    if (Array.isArray(res.data)) {
                        res.data.forEach(item => {
                            this.settingsCache[item.setting_key] = item.setting_value;
                        });
                    } else {
                        this.settingsCache = res.data || {};
                    }
                }

                if (this.settingsCache.company_name) {
                    companyName = this.settingsCache.company_name;
                }

                if (this.settingsCache.company_logo) {
                    logoHtml = `
                        <img src="${this.settingsCache.company_logo}"
                             alt="Logo"
                             class="h-7 w-auto max-w-[120px] object-contain rounded bg-white/10 p-1">
                    `;
                }
            } catch (e) {
                console.error("Failed to load settings for navbar", e);
            }
        }

        return `
            <nav class="bg-black border-b border-brand-red/40 text-white shadow-sm sticky top-0 z-40">

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div class="flex items-center justify-between h-16">

                        <!-- LEFT -->
                        <div class="flex items-center gap-3">

                            ${logoHtml}

                            <!-- company name (optional visible on left too) -->
                            <span class="hidden sm:inline text-white font-bold tracking-tight">
                                ${companyName}
                            </span>

                            <a href="#/dashboard"
                               class="ml-4 px-2 py-1 text-xs font-semibold rounded-md
                                      text-white/80 hover:text-white
                                      hover:bg-brand-red/20 transition">
                                Dashboard
                            </a>

                            <a href="#/settings"
                               class="px-2 py-1 text-xs font-semibold rounded-md
                                      text-white/80 hover:text-white
                                      hover:bg-brand-red/20 transition">
                                Settings
                            </a>

                        </div>


                        <!-- RIGHT -->
                        <div class="flex items-center gap-2">

                            <span class="hidden lg:inline text-[11px] uppercase tracking-widest text-gray-400">
                                ${user ? user.name : ''}
                            </span>

                            <button onclick="Auth.logout()"
                                class="px-3 py-1 text-xs font-bold rounded-md
                                       bg-brand-red text-white
                                       hover:bg-red-700 transition">
                                Logout
                            </button>

                        </div>

                    </div>
                </div>

            </nav>
        `;
    }
};