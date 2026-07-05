// public/js/pages/dashboard.js

const Dashboard = {
    render() {
        return `
            <div class="max-w-7xl mx-auto space-y-8 fade-in p-6">
                <div class="flex justify-between items-center border-b border-borderDivider pb-5">
                    <h1 class="text-3xl font-black text-textPrimary tracking-tight">Modules Dashboard</h1>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    
                    <a href="#/documents?type=quotation" class="bg-card p-6 sm:p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Quotations</h2>
                    </a>

                    <a href="#/documents?type=invoice" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Invoices</h2>
                    </a>

                    <a href="#/documents?type=purchase_order" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Purchase Orders</h2>
                    </a>

                    <a href="#/documents?type=receipt" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Delivery Challans</h2>
                    </a>

                    <a href="#/customers" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Customers</h2>
                    </a>

                    <a href="#/products" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Products</h2>
                    </a>

                    <a href="#/settings" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Settings</h2>
                    </a>

                    <a href="#/contact" class="bg-card p-8 rounded-2xl shadow-sm border border-borderDivider flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:border-brand-red/30 transition-all cursor-pointer group">
                        <div class="p-4 rounded-2xl bg-brand-red/5 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.95a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold text-textPrimary">Contact Us</h2>
                    </a>

                </div>
                  
            </div>
        `;
    },

    async init() {
        // No fetching needed for the static 7-module dashboard
    }
};
