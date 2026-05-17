// public/js/pages/verify.js

const VerifyPage = {
    render() {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const token = params.get('token') || '';
        return `
            <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <p class="text-sm uppercase tracking-[0.24em] text-indigo-400">InvoQuote</p>
                            <h1 class="mt-4 text-3xl font-bold text-white">Verify Your Email</h1>
                            <p class="mt-2 text-slate-400">Complete verification to activate your account and continue.</p>
                        </div>
                        <div class="text-right">
                            <span class="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">Secure</span>
                        </div>
                    </div>

                    <div class="space-y-6" id="verify-content">
                        <div class="rounded-3xl border border-slate-700 bg-slate-950/40 p-6 text-slate-300">
                            <p class="text-sm leading-7">We are verifying your account. If the link is valid, your email will be confirmed shortly.</p>
                        </div>
                        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <button id="verify-again" class="hidden w-full md:w-auto inline-flex justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">Try again</button>
                            <a href="#/login" class="w-full md:w-auto inline-flex justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors">Back to Login</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    init() {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const token = params.get('token');
        const verifyContent = document.getElementById('verify-content');
        const verifyAgain = document.getElementById('verify-again');

        if (!token) {
            verifyContent.innerHTML = `
                <div class="rounded-3xl border border-slate-700 bg-rose-950/40 p-6 text-rose-300">
                    <p class="text-sm leading-7">No verification token was found in the link. Please use the link sent to your email.</p>
                </div>
            `;
            return;
        }

        const runVerify = async () => {
            verifyContent.innerHTML = `
                <div class="rounded-3xl border border-slate-700 bg-slate-950/40 p-6 text-slate-300">
                    <p class="text-sm leading-7">Verifying your email now. Please wait...</p>
                </div>
            `;

            try {
                const result = await API.get(`/auth/verify?token=${encodeURIComponent(token)}`);
                verifyContent.innerHTML = `
                    <div class="rounded-3xl border border-slate-700 bg-emerald-950/40 p-6 text-emerald-300">
                        <h2 class="text-xl font-semibold text-white mb-2">Email Verified</h2>
                        <p class="text-sm leading-7">${result.data.message}</p>
                    </div>
                `;
            } catch (err) {
                verifyContent.innerHTML = `
                    <div class="rounded-3xl border border-slate-700 bg-rose-950/40 p-6 text-rose-300">
                        <h2 class="text-xl font-semibold text-white mb-2">Verification Failed</h2>
                        <p class="text-sm leading-7">${err.message || 'The token is invalid or expired. Please request a new verification email.'}</p>
                    </div>
                `;
                verifyAgain.classList.remove('hidden');
                verifyAgain.addEventListener('click', runVerify);
            }
        };

        runVerify();
    }
};
window.VerifyPage = VerifyPage;
