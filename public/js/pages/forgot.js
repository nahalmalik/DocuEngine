// public/js/pages/forgot.js

const ForgotPage = {
    render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-bgMain py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full bg-card border border-borderDivider p-8 rounded-3xl shadow-2xl fade-in">
                    <h1 class="text-2xl font-bold text-textPrimary mb-2">Forgot Password</h1>
                    <p class="text-sm text-textSecondary mb-4">Enter your account email and we'll send password reset instructions.</p>
                    <form id="forgotForm" class="space-y-4">
                        <div>
                            <label class="text-sm text-textSecondary">Email</label>
                            <input id="forgot-email" type="email" required class="w-full px-4 py-3 rounded-2xl border border-borderDivider bg-bgMain/50 text-textPrimary" />
                        </div>
                        <div>
                            <button type="submit" class="w-full bg-brand-red text-white py-3 rounded-2xl font-bold">Send Reset Email</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    init() {
        document.getElementById('forgotForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            try {
                await API.post('/auth/request-reset', { email });
                App.showToast('If that email exists, instructions have been sent');
                window.location.hash = '#/login';
            } catch (err) {
                App.showToast(err.message || 'Failed to send reset email', 'error');
            }
        });
    }
};
