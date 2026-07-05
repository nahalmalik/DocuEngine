// public/js/pages/reset.js

const ResetPage = {
    render() {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const token = params.get('token') || '';

        return `
            <div class="min-h-screen flex items-center justify-center bg-bgMain py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full bg-card border border-borderDivider p-8 rounded-3xl shadow-2xl fade-in">

                    <h1 class="text-2xl font-bold text-black mb-2">Reset Password</h1>

                    <p class="text-sm text-black mb-4">
                        Enter a new password for your account.
                    </p>

                    <form id="resetForm" class="space-y-4">
                        <input type="hidden" id="reset-token" value="${token}" />

                        <div>
                            <label class="text-sm text-black">New Password</label>
                            <input
                                id="reset-password"
                                type="password"
                                required
                                minlength="6"
                                class="w-full px-4 py-3 rounded-2xl border border-borderDivider bg-bgMain/50 text-black focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all"
                            />
                        </div>

                        <div>
                            <label class="text-sm text-black">Confirm Password</label>
                            <input
                                id="reset-confirm"
                                type="password"
                                required
                                minlength="6"
                                class="w-full px-4 py-3 rounded-2xl border border-borderDivider bg-bgMain/50 text-black focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                class="w-full bg-brand-red text-white py-3 rounded-2xl font-bold hover:bg-brand-redHover focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            >
                                Update Password
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        `;
    },

    init() {
        document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = document.getElementById('reset-token').value;
            const pw = document.getElementById('reset-password').value;
            const pwc = document.getElementById('reset-confirm').value;

            if (pw !== pwc) {
                App.showToast('Passwords do not match', 'error');
                return;
            }

            try {
                await API.post('/auth/reset', { token, password: pw });
                App.showToast('Password updated successfully');
                window.location.hash = '#/login';
            } catch (err) {
                App.showToast(err.message || 'Failed to reset password', 'error');
            }
        });
    }
};