// public/js/app.js

const App = {
    container: document.getElementById('app'),

    init() {
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('appinstalled', () => {
            try {
                localStorage.setItem('install_banner_closed', '1');
            } catch (e) {}
            try { this.hideInstallBanner(); } catch (e) {}
        });
        this.route();
    },

    async route() {
        let hash = window.location.hash || '#/';
        
        // Simple routing
        const isPublicRoute =
         hash.startsWith('#/login') ||
         hash.startsWith('#/forgot') ||
         hash.startsWith('#/reset') ||
         hash.startsWith('#/verify');
        if (!Auth.isAuthenticated() && !isPublicRoute) {
    window.location.hash = '#/login';
    return;
}

        this.container.innerHTML = '';
        this.container.className = 'flex-grow flex flex-col h-full overflow-hidden bg-bgMain';

        switch (true) {
            case hash === '#/login':
                this.renderLogin();
                break;
            case hash === '#/' || hash === '#/dashboard':
                await this.renderLayout(Dashboard.render());
                Dashboard.init();
                break;
            case hash.startsWith('#/documents'):
                await this.renderLayout(await Documents.render());
                Documents.init();
                break;
            case hash.startsWith('#/preview'):
                await this.renderLayout(PreviewPage.render());
                PreviewPage.init();
                break;
            case hash.startsWith('#/verify'):
                await this.renderLayout(VerifyPage.render());
                VerifyPage.init();
                break;
            case hash.startsWith('#/forgot'):
                await this.renderLayout(ForgotPage.render());
                ForgotPage.init();
                break;
            case hash.startsWith('#/reset'):
                await this.renderLayout(ResetPage.render());
                ResetPage.init();
                break;
            case hash.startsWith('#/customers'):
                await this.renderLayout(await Customers.render());
                Customers.init();
                break;
            case hash.startsWith('#/products'):
                await this.renderLayout(await Products.render());
                Products.init();
                break;
            case hash.startsWith('#/settings'):
                await this.renderLayout(await Settings.render());
                Settings.init();
                break;
            case hash.startsWith('#/contact'):
                await this.renderLayout(await ContactPage.render());
                ContactPage.init();
                break;
            default:
                await this.renderLayout('<div class="p-8 text-center"><h1 class="text-2xl">404 - Page Not Found</h1></div>');
        }
        // Update install banner visibility after routing
        try { this.manageInstallBanner(); } catch (e) {}
    },

    async renderLayout(content) {
        this.container.innerHTML = `
            ${await Navbar.render()}
            <div id="app-back-button" class="absolute top-2 left-2 z-50">
    <button
        onclick="App.goBack()"
        class="flex items-center justify-center
               w-7 h-7
               bg-brand-red text-white
               hover:bg-black
               border border-brand-red
               rounded-md
               transition-colors"
    >
        <svg class="w-3 h-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6L8 10l4 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
        </svg>
    </button>
</div>
            <main class="flex-grow overflow-auto p-4 md:p-8 fade-in">
                ${content}
            </main>
    <footer class="static bg-black border-t border-brand-red/40">

    <!-- Install App Banner (hidden by default; shown conditionally) -->
    <div id="install-banner" class="hidden bg-brand-red text-white py-2 px-4 shadow-lg">
        <div class="flex items-center justify-between max-w-7xl mx-auto">

            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
                    </svg>
                </div>

                <div>
                    <p class="text-xs font-bold">Install InvoQuote App</p>
                    <p class="text-[10px] opacity-80">Get full experience</p>
                </div>
            </div>

            <div class="flex items-center space-x-2">
                <button onclick="App.showInstallPopup()"
                    class="bg-white text-brand-red px-2 py-1 rounded-md text-xs font-bold hover:bg-gray-100 transition-colors">
                    Install
                </button>

                <button onclick="App.hideInstallBanner()"
                    class="text-white opacity-70 hover:opacity-100">
                    ✕
                </button>
            </div>

        </div>
    </div>

    <!-- Footer Content -->
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col items-center text-center">

        <p class="text-lg font-bold text-white tracking-wide">
            InvoQuote
        </p>

        <p class="text-gray-400 text-xs mt-1">
            Smart Invoice & Document System
        </p>

        <div class="w-10 h-0.5 bg-brand-red rounded-full my-2"></div>

        <p class="text-gray-500 text-[11px]">
            © 2026 | DeviQo Software Options
        </p>

    </div>

</footer>
        `;
    },

    renderLogin() {
        this.container.innerHTML = Login.render();
        Login.init();
    },

    goBack() {
        try {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.hash = '#/dashboard';
            }
        } catch (e) {
            window.location.hash = '#/dashboard';
        }
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        
        toastMsg.textContent = message;
        toastMsg.className = `bg-card border-l-4 shadow-lg rounded px-4 py-3 min-w-[300px] text-textPrimary ${type === 'error' ? 'border-red-500' : 'border-brand-red'}`;
        
        toast.classList.remove('translate-x-full');
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 3000);
    },

    showInstallPopup() {
        const modal = document.getElementById('install-modal');
        const mobilePanel = document.getElementById('install-mobile-panel');
        const desktopPanel = document.getElementById('install-desktop-panel');
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

        if (isMobile) {
            mobilePanel.classList.remove('hidden');
            desktopPanel.classList.add('hidden');
        } else {
            desktopPanel.classList.remove('hidden');
            mobilePanel.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    },

    hideInstallPopup() {
        const modal = document.getElementById('install-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        try {
            localStorage.setItem('install_banner_closed', '1');
        } catch (e) {}
    },

    hideInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) {
            banner.classList.add('hidden');
        }
        try {
            localStorage.setItem('install_banner_closed', '1');
        } catch (e) {}
    },

    isAppInstalled() {
        try {
            if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
            if (navigator.standalone) return true; // iOS
            // Some browsers support getInstalledRelatedApps
            if (navigator.getInstalledRelatedApps) return false; // can't synchronously determine here
        } catch (e) {}
        return false;
    },

    shouldShowInstallBanner() {
        try {
            if (localStorage.getItem('install_banner_closed') === '1') return false;
        } catch (e) {}
        if (this.isAppInstalled()) return false;
        return true;
    },

    manageInstallBanner() {
        // Show banner only on dashboard/root route and only once (until closed or installed)
        const hash = window.location.hash || '#/';
        const banner = document.getElementById('install-banner');
        if (!banner) return;

        if ((hash === '#/' || hash === '#/dashboard') && this.shouldShowInstallBanner()) {
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
