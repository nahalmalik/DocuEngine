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
                        <h1 class="text-2xl font-bold text-textPrimary">PDF Preview</h1>
                        <p class="text-sm text-textSecondary">Previewing ${type} #${id}</p>
                    </div>
                    <div class="flex gap-2">
                        <a href="${pdfDownloadUrl}" target="_blank" class="inline-flex items-center justify-center rounded-lg border border-brand-red bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-redHover transition-colors">Download PDF</a>
                        <button onclick="window.location.hash='#/documents?type=${type}'" class="inline-flex items-center justify-center rounded-lg border border-borderDivider bg-bgMain px-4 py-2 text-sm font-medium text-textPrimary hover:bg-borderDivider transition-colors">Back to list</button>
                    </div>
                </div>
                <div class="h-[80vh] rounded-xl border border-borderDivider bg-card overflow-hidden">
                    <iframe src="${pdfViewUrl}" class="w-full h-full bg-white" frameborder="0"></iframe>
                </div>
            </div>
        `;
    },

    init() {
        // nothing to bind for now; iframe does the work
    }
};
