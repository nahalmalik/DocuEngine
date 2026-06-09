// public/js/pages/documents.js

const Documents = {
    async render() {
        const hash = window.location.hash;
        if (hash.includes('#/documents/create') || hash.includes('#/documents/edit')) {
            return await DocumentForm.render();
        }

        const type = this.getTypeFromUrl();
        const title = this.formatTitle(type);

        return `
        
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden">
                <div class="flex justify-between items-center border-b border-borderDivider pb-5">
                    <h1 class="text-3xl font-black text-brand-dark tracking-tighter">${title}s Registry</h1>
                </div>

                <div class="overflow-hidden rounded-2xl border border-borderDivider">
                    <table class="min-w-full divide-y divide-borderDivider">
                        <thead class="bg-bgMain">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Serial Number</th>
                                <th class="px-6 py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Customer / Subject</th>
                                <th class="px-6 py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Issue Date</th>
                                <th class="px-6 py-4 text-right text-xs font-black text-textSecondary uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="documents-table-body" class="bg-white divide-y divide-borderDivider">
                            <tr><td colspan="4" class="px-6 py-8 text-center text-sm text-textSecondary animate-pulse">Accessing document records...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-8 pt-6 border-t border-borderDivider flex justify-end">
                    <button onclick="window.location.hash='#/documents/create?type=${type}'" class="bg-brand-red text-white px-8 py-3 rounded-xl hover:bg-brand-redHover transition-all shadow-lg shadow-brand-red/20 font-black uppercase tracking-widest flex items-center gap-2 transform hover:-translate-y-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Create New ${type === 'receipt' ? 'Challan' : 'Document'}
                    </button>
                </div>

                <!-- Share Modal -->
                <div id="share-modal" class="hidden fixed inset-0 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all">
                    <div class="relative top-20 mx-auto p-8 border border-borderDivider w-full max-w-md shadow-2xl rounded-3xl bg-white fade-in">
                        <div class="text-center">
                            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-red/5 mb-6 border border-brand-red/10">
                                <svg class="h-8 w-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            </div>
                            <h3 class="text-2xl font-black text-brand-dark tracking-tighter">Share Document</h3>
                            <p class="mt-2 text-textSecondary text-sm font-medium">Select a platform to share the document link.</p>
                            <div class="mt-8 space-y-4">
                                <button id="share-email-btn" class="w-full flex items-center justify-center gap-3 bg-brand-dark text-white p-4 rounded-2xl hover:bg-black transition-all font-black uppercase tracking-widest shadow-xl shadow-black/10">
                                    Send via Email
                                </button>
                                <button id="share-whatsapp-btn" class="w-full flex items-center justify-center gap-3 bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 transition-all font-black uppercase tracking-widest shadow-xl shadow-green-600/10">
                                    Send via WhatsApp
                                </button>
                                <button onclick="document.getElementById('share-modal').classList.add('hidden')" class="w-full bg-bgMain text-textSecondary p-4 rounded-2xl hover:bg-borderDivider transition-all font-bold">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getTypeFromUrl() {
        const hash = window.location.hash;
        if (hash.includes('?type=')) {
            return hash.split('?type=')[1];
        }
        return 'quotation';
    },

    formatTitle(type) {
        if (type === 'receipt') return 'Delivery Challan';
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },

    getEndpointPath(type) {
        if (type === 'purchase_order') return 'purchase-orders';
        return type + 's';
    },

    async init() {
        const hash = window.location.hash;
        if (hash.includes('#/documents/create') || hash.includes('#/documents/edit')) {
            return await DocumentForm.init();
        }

        const type = this.getTypeFromUrl();
        await this.loadData(type);
    },

    getDocumentNumber(doc, type) {
        if (type === 'purchase_order') return doc.po_number;
        return doc[type + '_number'];
    },

    async loadData(type) {
        try {
            const endpoint = this.getEndpointPath(type);
            const response = await API.get(`/${endpoint}`);
            const documents = response.data;
            const tbody = document.getElementById('documents-table-body');
            
            if (!documents || documents.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-slate-400">No records found.</td></tr>';
                return;
            }

            const token = localStorage.getItem('token');
            const baseUrl = API.getBaseUrl();
            const isMobile = API.isCapacitor;

            let html = '';
            documents.forEach(doc => {
                const docNumber = this.getDocumentNumber(doc, type);
                const allowEditDelete = !['invoice', 'receipt'].includes(type);

                html += `
                    <tr class="hover:bg-bgMain/30 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-black text-brand-dark uppercase tracking-tighter">${docNumber}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-textPrimary">
                            <div class="flex flex-col">
                                <span>${doc.customer?.company_name || 'N/A'}</span>
                                <span class="text-xs text-textSecondary font-medium">${doc.notes ? doc.notes.substring(0, 30) + '...' : ''}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-textSecondary">${doc.issue_date}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-2">

    <button onclick="Documents.previewPdf(${doc.id}, '${type}')"
        class="text-brand-dark hover:text-brand-red border border-brand-dark/20 px-3 py-1.5 rounded-lg transition-all">
        Preview
    </button>

    <button onclick="Documents.downloadPdf(${doc.id}, '${type}')"
        class="bg-brand-dark text-white hover:bg-brand-red px-3 py-1.5 rounded-lg transition-all shadow-sm">
        Download
    </button>

    <button onclick="Documents.openShareModal(${doc.id}, '${type}')"
        class="text-slate-400 hover:text-green-600 transition-colors">
        Share
    </button>

    ${allowEditDelete ? `
        <a href="#/documents/edit/${doc.id}?type=${type}"
            class="text-slate-400 hover:text-blue-600 transition-colors">
            Update
        </a>

        <button onclick="Documents.deleteDocument(${doc.id}, '${type}')"
            class="text-slate-400 hover:text-brand-red transition-colors">
            Delete
        </button>
    ` : ''}

    ${type === 'quotation'
        ? `<button onclick="Documents.convertQuotation(${doc.id})"
            class="text-amber-600 hover:text-amber-700 transition-colors">
            Convert
        </button>`
        : ''}

</td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (error) {
            console.error('Failed to load documents', error);
            App.showToast('Failed to load records', 'error');
        }
    },

    async deleteDocument(id, type) {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                const endpoint = this.getEndpointPath(type);
                await API.delete(`/${endpoint}/${id}`);
                App.showToast('Document deleted successfully');
                this.init();
            } catch (error) {
                App.showToast('Failed to delete document', 'error');
            }
        }
    },

    openShareModal(id, type) {
        const modal = document.getElementById('share-modal');
        modal.classList.remove('hidden');

        const token = localStorage.getItem('token');
        const baseUrl = API.getBaseUrl();
        const shareUrl = `${baseUrl}/pdf/${id}?type=${type}&token=${encodeURIComponent(token)}&action=view`;

        document.getElementById('share-email-btn').onclick = () => {
            const mailUrl = `mailto:?subject=Document Share&body=Here is your document: ${shareUrl}`;
            window.open(mailUrl, '_system');
            modal.classList.add('hidden');
        };

        document.getElementById('share-whatsapp-btn').onclick = () => {
            const waUrl = `https://wa.me/?text=${encodeURIComponent('Here is your document: ' + shareUrl)}`;
            window.open(waUrl, '_system');
            modal.classList.add('hidden');
        };
    },

    previewPdf(id, type) {
        // Navigate to the dedicated preview page
        window.location.hash = `#/preview?id=${id}&type=${type}`;
    },

    downloadPdf(id, type) {
        const token = localStorage.getItem('token');
        const baseUrl = API.getBaseUrl();
        const isMobile = API.isCapacitor;

        const action = 'download';
        const cacheBust = Date.now();
        let pdfUrl = `${baseUrl}/pdf/${id}?type=${type}&token=${encodeURIComponent(token)}&action=${action}&_=${cacheBust}`;

        if (pdfUrl.startsWith('../')) {
            const origin = window.location.origin;
            const path = window.location.pathname.split('/').slice(0, -2).join('/');
            pdfUrl = origin + path + pdfUrl.substring(2);
        }

        if (isMobile) {
            // This will now be caught by the DownloadListener in MainActivity.java
            window.location.href = pdfUrl;
        } else {
            window.open(pdfUrl, '_blank');
        }
    },

    async convertQuotation(id) {
        if (!confirm('Convert this quotation into an invoice?')) {
            return;
        }

        try {
            await API.post(`/quotations/${id}/convert`);
            App.showToast('Quotation converted to invoice successfully');
            window.location.hash = '#/documents?type=invoice';
        } catch (error) {
            console.error('Failed to convert quotation', error);
            App.showToast('Failed to convert quotation', 'error');
        }
    },

    downloadPdfFallback(pdfUrl, id, type) {
        // Create a hidden link element and trigger download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `document_${id}.pdf`);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
