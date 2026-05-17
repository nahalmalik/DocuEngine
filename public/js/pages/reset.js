// public/js/pages/reset.js

const ResetPage = {
    render() {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const token = params.get('token') || '';
        return `
            <div class="max-w-md mx-auto p-6">
                <h1 class="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p class="text-sm text-slate-400 mb-4">Enter a new password for your account.</p>
                <form id="resetForm" class="space-y-4">
                    <input type="hidden" id="reset-token" value="${token}" />
                    <div>
                        <label class="text-sm text-slate-300">New Password</label>
                        <input id="reset-password" type="password" required minlength="6" class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white" />
                    </div>
                    <div>
                        <label class="text-sm text-slate-300">Confirm Password</label>
                        <input id="reset-confirm" type="password" required minlength="6" class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white" />
                    </div>
                    <div>
                        <button type="submit" class="bg-indigo-600 px-4 py-2 rounded text-white">Update Password</button>
                    </div>
                </form>
            </div>
        `;
    },
    init() {
        document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = document.getElementById('reset-token').value;
            const pw = document.getElementById('reset-password').value;
            const pwc = document.getElementById('reset-confirm').value;
            if (pw !== pwc) { App.showToast('Passwords do not match', 'error'); return; }
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
