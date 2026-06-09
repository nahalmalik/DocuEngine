// public/js/pages/login.js

const Login = {
    render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-bgMain py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <!-- Background decorative elements -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 bg-brand-red blur-[120px] rounded-full pointer-events-none"></div>
                <div class="absolute bottom-0 right-0 w-[500px] h-[300px] opacity-10 bg-brand-dark blur-[100px] rounded-full pointer-events-none"></div>
                
                <div class="max-w-md w-full bg-card border border-borderDivider p-10 rounded-3xl shadow-2xl fade-in relative z-10" id="auth-container">
                    
                    <!-- Login View -->
                    <div id="login-view">
                        <div>
                            <div class="mx-auto h-16 w-16 text-brand-red flex items-center justify-center rounded-2xl bg-brand-red/5 border border-brand-red/10 shadow-inner">
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h2 class="mt-8 text-center text-4xl font-black text-brand-dark tracking-tighter">
                                InvoQuote
                            </h2>
                            <p class="mt-2 text-center text-sm font-semibold text-textSecondary uppercase tracking-widest">
                                Sign in to your portal
                            </p>
                        </div>
                        <form id="loginForm" class="mt-10 space-y-6">
                            <div class="space-y-1">
                                <label for="email-address" class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Email address</label>
                                <input id="email-address" name="email" type="email" required class="appearance-none block w-full px-4 py-4 border border-borderDivider bg-bgMain/50 text-textPrimary rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all font-semibold" placeholder="you@company.com">
                            </div>
                            <div class="space-y-1">
                                <label for="password" class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Password</label>
                                <input id="password" name="password" type="password" required class="appearance-none block w-full px-4 py-4 border border-borderDivider bg-bgMain/50 text-textPrimary rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all font-semibold" placeholder="••••••••">
                            </div>

                            <div class="pt-4">
                                <button type="submit" class="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-brand-red hover:bg-brand-redHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all shadow-xl shadow-brand-red/20 transform hover:-translate-y-1">
                                    Sign in Now
                                </button>
                            </div>
                        </form>
                        <div class="mt-8 flex flex-col space-y-4 items-center text-sm">
                            <a href="#/forgot" id="forgot-link" class="text-textSecondary hover:text-brand-red font-bold transition-colors">Forgot your password?</a>
                            <div class="w-10 h-px bg-borderDivider"></div>
                            <a href="#" id="show-register" class="text-textSecondary font-medium">New here? <span class="text-brand-red font-black hover:text-brand-redHover">Create an account</span></a>
                        </div>
                    </div>

                    <!-- Register View -->
                    <div id="register-view" class="hidden">
                        <div>
                            <div class="mx-auto h-16 w-16 text-brand-dark flex items-center justify-center rounded-2xl bg-brand-dark/5 border border-brand-dark/10 shadow-inner">
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            </div>
                            <h2 class="mt-8 text-center text-4xl font-black text-brand-dark tracking-tighter">
                                Join Us
                            </h2>
                            <p class="mt-2 text-center text-sm font-semibold text-textSecondary uppercase tracking-widest">
                                Start managing professionally
                            </p>
                        </div>
                        <form id="registerForm" class="mt-10 space-y-5">
                            <div class="space-y-1">
                                <label for="reg-name" class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Full Name</label>
                                <input id="reg-name" name="name" type="text" required class="appearance-none block w-full px-4 py-3.5 border border-borderDivider bg-bgMain/50 text-textPrimary rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark sm:text-sm transition-all font-semibold" placeholder="Full Name">
                            </div>
                            <div class="space-y-1">
                                <label for="reg-email" class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Email address</label>
                                <input id="reg-email" name="email" type="email" required class="appearance-none block w-full px-4 py-3.5 border border-borderDivider bg-bgMain/50 text-textPrimary rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark sm:text-sm transition-all font-semibold" placeholder="Email Address">
                            </div>
                            <div class="space-y-1">
                                <label for="reg-password" class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Password</label>
                                <input id="reg-password" name="password" type="password" required minlength="6" class="appearance-none block w-full px-4 py-3.5 border border-borderDivider bg-bgMain/50 text-textPrimary rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark sm:text-sm transition-all font-semibold" placeholder="Min 6 characters">
                            </div>
                            <div class="space-y-1">
                                <label for="reg-confirm-password" class="block text-xs font-black text-textSecondary uppercase tracking-widest ml-1">Confirm Password</label>
                                <input id="reg-confirm-password" name="confirm-password" type="password" required minlength="6" class="appearance-none block w-full px-4 py-3.5 border border-borderDivider bg-bgMain/50 text-textPrimary rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark sm:text-sm transition-all font-semibold" placeholder="Confirm Password">
                            </div>

                            <div class="pt-4">
                                <button type="submit" class="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-brand-dark hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all shadow-xl shadow-black/20 transform hover:-translate-y-1">
                                    Create My Account
                                </button>
                            </div>
                        </form>
                        <div class="mt-8 text-center">
                            <a href="#" id="show-login" class="text-sm text-textSecondary font-medium transition-colors">Member already? <span class="text-brand-dark font-black hover:underline">Sign in</span></a>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    init() {
        // Toggle Views
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.classList.add('hidden');
            registerView.classList.remove('hidden');
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.classList.add('hidden');
            loginView.classList.remove('hidden');
        });

        // Login Handler
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email-address').value;
            const password = document.getElementById('password').value;

            const btn = e.target.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Signing in...';
            btn.disabled = true;

            try {
                await Auth.login(email, password);
                App.showToast('Login successful!');
                window.location.hash = '#/dashboard';
            } catch (error) {
                App.showToast(error.message || 'Login failed', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        // Register Handler
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                App.showToast('Passwords do not match', 'error');
                return;
            }

            const btn = e.target.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Signing up...';
            btn.disabled = true;

                try {
                await Auth.register(name, email, password);
                App.showToast('Registration successful! Please check your email to verify your account');
                window.location.hash = '#/login';
            } catch (error) {
                App.showToast(error.message || 'Registration failed', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
};
