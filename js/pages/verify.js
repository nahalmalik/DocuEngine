// public/js/pages/verify.js

const VerifyPage = {
    render() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-bgMain py-12 px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-md">
                <div class="bg-card border border-borderDivider rounded-3xl shadow-2xl p-8 text-center space-y-6">
                    <p class="text-brand-red tracking-[0.25em] text-sm uppercase font-black">INVOQUOTE</p>
                    <div id="verify-content">
                        <div class="flex justify-center mb-6">
                            <div class="w-12 h-12 border-4 border-brand-red/30 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h1 class="text-2xl font-bold text-textPrimary">Verifying your email</h1>
                        <p class="text-textSecondary text-sm mt-2">Please wait while we activate your account.</p>
                    </div>
                    <button id="verify-again" class="hidden mt-4 w-full bg-bgMain text-textSecondary py-2 rounded-xl border border-borderDivider">Try Again</button>
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
                <div class="rounded-3xl border border-borderDivider bg-card p-6 text-textSecondary">
                    <p class="text-sm leading-7">No verification token was found in the link. Please use the link sent to your email.</p>
                </div>
            `;
            return;
        }

        const runVerify = async () => {
                verifyContent.innerHTML = `
                <div class="rounded-3xl border border-borderDivider bg-card p-6 text-textSecondary">
                    <p class="text-sm leading-7">Verifying your email now. Please wait...</p>
                </div>
            `;

            try {
                const result = await API.get(`/auth/verify?token=${encodeURIComponent(token)}`);
                verifyContent.innerHTML = `
    <div class="space-y-6">

            <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center">
                <svg class="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
        </div>

        <h1 class="text-2xl font-bold text-textPrimary">Email Verified Successfully</h1>

        <p class="text-textSecondary text-sm">Your account has been activated. You can now login and start using InvoQuote.</p>

        <a href="#/login" class="inline-flex justify-center w-full rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-redHover transition-colors">Go to Login</a>

    </div>
`;
            } catch (err) {
                verifyContent.innerHTML = `
    <div class="space-y-6">

        <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center">
                <svg class="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>
        </div>

        <h1 class="text-2xl font-bold text-textPrimary">Verification Failed</h1>

        <p class="text-textSecondary text-sm">${err.message || 'The verification link is invalid or expired.'}</p>

        <a href="#/login"
           class="inline-flex justify-center w-full rounded-xl border border-borderDivider bg-card px-5 py-3 text-sm font-semibold text-textPrimary hover:bg-borderDivider transition-colors">
            Back to Login
        </a>

    </div>
`;
                        const againBtn = document.getElementById('verify-again');
                        if (againBtn) {
                            againBtn.classList.remove('hidden');
                            againBtn.onclick = runVerify;
                        }
            }
        };

        runVerify();
    }
};
window.VerifyPage = VerifyPage;
