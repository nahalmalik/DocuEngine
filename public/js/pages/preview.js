// public/js/pages/preview.js

const PreviewPage = {
    render() {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const id = params.get('id');
        const type = params.get('type') || 'quotation';
        const token = localStorage.getItem('token');
        const baseUrl = API.getBaseUrl();
        const cacheBust = Date.now();

        const pdfViewUrl = `${baseUrl}/pdf/${id}?type=${type}&token=${encodeURIComponent(token)}&action=view&_=${cacheBust}`;
        const pdfDownloadUrl = `${baseUrl}/pdf/${id}?type=${type}&token=${encodeURIComponent(token)}&action=download&_=${cacheBust}`;

        return `
            <div class="max-w-6xl mx-auto p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h1 class="text-2xl font-bold text-white">PDF Preview</h1>
                        <p class="text-sm text-slate-400">Previewing ${type} #${id}</p>
                    </div>
                    <div class="flex gap-2">
                        <a href="${pdfDownloadUrl}" target="_blank" class="inline-flex items-center justify-center rounded-lg border border-indigo-500 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">Download PDF</a>
                        <button onclick="window.location.hash='#/documents?type=${type}'" class="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors">Back to list</button>
                    </div>
                </div>
                <div class="h-[80vh] rounded-xl border border-slate-700 bg-black overflow-hidden">
                    <iframe src="${pdfViewUrl}" class="w-full h-full bg-white" frameborder="0"></iframe>
                </div>
            </div>
        `;
    },

    init() {
        // nothing to bind for now; iframe does the work
    }
};
