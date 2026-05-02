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
        if (!Auth.isAuthenticated() && hash !== '#/login') {
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
            default:
                await this.renderLayout('<div class="p-8 text-center"><h1 class="text-2xl">404 - Page Not Found</h1></div>');
        }
    },

    async renderLayout(content) {
        this.container.innerHTML = `
            ${await Navbar.render()}
            <main class="flex-grow overflow-auto p-4 md:p-8 fade-in">
                ${content}
            </main>
            <footer class="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
                <div class="text-center text-slate-400 text-sm font-medium">
                    <p class="text-lg font-bold text-white">DocuEngine</p>
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

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        
        toastMsg.textContent = message;
        toastMsg.className = `bg-slate-800 border-l-4 shadow-lg rounded px-4 py-3 min-w-[300px] text-white ${type === 'error' ? 'border-red-500' : 'border-teal-500'}`;
        
        toast.classList.remove('translate-x-full');
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 3000);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
