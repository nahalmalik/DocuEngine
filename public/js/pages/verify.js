// public/js/pages/verify.js

const VerifyPage = {
    render() {
    return `
        <div class="h-full flex items-center justify-center">

            <div class="w-full max-w-md">

                <div class="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-10 text-center space-y-6">

                    <p class="text-indigo-400 tracking-[0.25em] text-sm">
                        INVOQUOTE
                    </p>

                    <div id="verify-content">

                        <div class="flex justify-center mb-6">
                            <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>

                        <h1 class="text-2xl font-bold text-white">
                            Verifying your email
                        </h1>

                        <p class="text-slate-400 text-sm mt-2">
                            Please wait while we activate your account.
                        </p>

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
    <div class="space-y-6">

        <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
        </div>

        <h1 class="text-2xl font-bold text-white">
            Email Verified Successfully
        </h1>

        <p class="text-slate-400 text-sm">
            Your account has been activated. You can now login and start using InvoQuote.
        </p>

        <a href="#/login"
           class="inline-flex justify-center w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Go to Login
        </a>

    </div>
`;
            } catch (err) {
                verifyContent.innerHTML = `
    <div class="space-y-6">

        <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>
        </div>

        <h1 class="text-2xl font-bold text-white">
            Verification Failed
        </h1>

        <p class="text-slate-400 text-sm">
            ${err.message || 'The verification link is invalid or expired.'}
        </p>

        <a href="#/login"
           class="inline-flex justify-center w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors">
            Back to Login
        </a>

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
