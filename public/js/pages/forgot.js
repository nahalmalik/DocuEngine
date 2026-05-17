// public/js/pages/forgot.js

const ForgotPage = {
    render() {
        return `
            <div class="max-w-md mx-auto p-6">
                <h1 class="text-2xl font-bold text-white mb-2">Forgot Password</h1>
                <p class="text-sm text-slate-400 mb-4">Enter your account email and we'll send password reset instructions.</p>
                <form id="forgotForm" class="space-y-4">
                    <div>
                        <label class="text-sm text-slate-300">Email</label>
                        <input id="forgot-email" type="email" required class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white" />
                    </div>
                    <div>
                        <button type="submit" class="bg-indigo-600 px-4 py-2 rounded text-white">Send Reset Email</button>
                    </div>
                </form>
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
