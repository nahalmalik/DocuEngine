// public/js/app.js

const App = {
    container: document.getElementById('app'),

    init() {
        window.addEventListener('hashchange', () => this.route());
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
        this.container.className = 'flex-grow flex flex-col h-full overflow-hidden bg-slate-900';

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
    },

    async renderLayout(content) {
        this.container.innerHTML = `
            ${await Navbar.render()}
            <div id="app-back-button" class="absolute top-4 left-4 z-50">
                <button onclick="App.goBack()" class="inline-flex items-center gap-2 bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg shadow-sm">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6L8 10l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Back
                </button>
            </div>
            <main class="flex-grow overflow-auto p-4 md:p-8 fade-in">
                ${content}
            </main>
            <footer class="bg-slate-900 border-t border-slate-800 mt-auto">
                <!-- Install App Banner -->
                <div id="install-banner" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4">
                    <div class="flex items-center justify-between max-w-7xl mx-auto">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Install InvoQuote App</p>
                                <p class="text-xs opacity-90">Get the full experience with our mobile and desktop apps</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="App.showInstallPopup()" class="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                                Install Now
                            </button>
                            <button onclick="App.hideInstallBanner()" class="text-white opacity-70 hover:opacity-100 p-1">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="text-center text-slate-400 text-sm font-medium py-4">
                    <p class="text-lg font-bold text-white">InvoQuote</p>
                    <p>Smart Invoice & Document Management System</p>
                    <p class="mt-2">&copy; 2026 | Developed by Nahal Malik</p>
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
        toastMsg.className = `bg-slate-800 border-l-4 shadow-lg rounded px-4 py-3 min-w-[300px] text-white ${type === 'error' ? 'border-red-500' : 'border-teal-500'}`;
        
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
    },

    hideInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
