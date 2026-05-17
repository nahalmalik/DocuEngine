// public/js/pages/login.js

const Login = {
    render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <!-- Background decorative elements -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 bg-indigo-500 blur-[120px] rounded-full pointer-events-none"></div>
                <div class="absolute bottom-0 right-0 w-[500px] h-[300px] opacity-20 bg-teal-500 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div class="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl fade-in relative z-10" id="auth-container">
                    
                    <!-- Login View -->
                    <div id="login-view">
                        <div>
                            <div class="mx-auto h-12 w-12 text-indigo-400 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h2 class="mt-6 text-center text-3xl font-bold text-white tracking-tight">
                                Welcome back
                            </h2>
                            <p class="mt-2 text-center text-sm text-slate-400">
                                Sign in to <span class="text-indigo-400 font-semibold">InvoQuote</span>
                            </p>
                        </div>
                        <form id="loginForm" class="mt-8 space-y-5">
                            <div>
                                <label for="email-address" class="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                                <input id="email-address" name="email" type="email" required class="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="you@example.com">
                            </div>
                            <div>
                                <label for="password" class="block text-sm font-medium text-slate-300 mb-1">Password</label>
                                <input id="password" name="password" type="password" required class="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="••••••••">
                            </div>

                            <div class="pt-2">
                                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5">
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <div class="mt-4 flex justify-between items-center text-sm">
                            <a href="#/forgot" id="forgot-link" class="text-slate-400 hover:text-white">Forgot password?</a>
                            <a href="#" id="show-register" class="text-slate-400 hover:text-white">Don't have an account? <span class="text-indigo-400 font-medium hover:text-indigo-300">Create one</span></a>
                        </div>
                    </div>

                    <!-- Register View -->
                    <div id="register-view" class="hidden">
                        <div>
                            <div class="mx-auto h-12 w-12 text-teal-400 flex items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            </div>
                            <h2 class="mt-6 text-center text-3xl font-bold text-white tracking-tight">
                                Create an account
                            </h2>
                            <p class="mt-2 text-center text-sm text-slate-400">
                                Join <span class="text-indigo-400 font-semibold">InvoQuote</span>
                            </p>
                        </div>
                        <form id="registerForm" class="mt-8 space-y-4">
                            <div>
                                <label for="reg-name" class="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input id="reg-name" name="name" type="text" required class="appearance-none relative block w-full px-4 py-2.5 border border-slate-600 bg-slate-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors" placeholder="John Doe">
                            </div>
                            <div>
                                <label for="reg-email" class="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                                <input id="reg-email" name="email" type="email" required class="appearance-none relative block w-full px-4 py-2.5 border border-slate-600 bg-slate-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors" placeholder="you@example.com">
                            </div>
                            <div>
                                <label for="reg-password" class="block text-sm font-medium text-slate-300 mb-1">Password</label>
                                <input id="reg-password" name="password" type="password" required minlength="6" class="appearance-none relative block w-full px-4 py-2.5 border border-slate-600 bg-slate-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors" placeholder="Min 6 characters">
                            </div>
                            <div>
                                <label for="reg-confirm-password" class="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                                <input id="reg-confirm-password" name="confirm-password" type="password" required minlength="6" class="appearance-none relative block w-full px-4 py-2.5 border border-slate-600 bg-slate-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors" placeholder="Confirm Password">
                            </div>

                            <div class="pt-2">
                                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transform hover:-translate-y-0.5">
                                    Sign up
                                </button>
                            </div>
                        </form>
                        <div class="mt-6 text-center">
                            <a href="#" id="show-login" class="text-sm text-slate-400 hover:text-white transition-colors">Already have an account? <span class="text-teal-400 font-medium hover:text-teal-300">Sign in</span></a>
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
