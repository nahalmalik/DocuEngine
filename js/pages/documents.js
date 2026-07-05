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
        
            <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6 fade-in p-4 sm:p-6 bg-card rounded-2xl shadow-xl border border-borderDivider overflow-hidden">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-borderDivider pb-4 sm:pb-5 gap-4">
                    <h1 class="text-2xl sm:text-3xl font-black text-textPrimary tracking-tighter">${title}s Registry</h1>
                    <button onclick="window.location.hash='#/documents/create?type=${type}'" class="w-full sm:w-auto bg-brand-red text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:bg-brand-redHover transition-all shadow-lg shadow-brand-red/20 font-black uppercase tracking-widest flex items-center justify-center gap-2 transform hover:-translate-y-1 text-sm sm:text-base">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        New ${type === 'receipt' ? 'Challan' : 'Document'}
                    </button>
                </div>

                <div class="overflow-x-auto -mx-4 sm:mx-0 rounded-2xl border-0 sm:border border-borderDivider">
                    <table class="min-w-full divide-y divide-borderDivider">
                        <thead class="bg-bgMain">
                            <tr>
                                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-black text-textSecondary uppercase tracking-widest">Number</th>
                                <th class="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-black text-textSecondary uppercase tracking-widest">Details</th>
                                <th class="hidden sm:table-cell px-6 py-4 text-left text-xs font-black text-textSecondary uppercase tracking-widest">Date</th>
                                <th class="px-4 sm:px-6 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-black text-textSecondary uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="documents-table-body" class="bg-white divide-y divide-borderDivider">
                            <tr><td colspan="4" class="px-6 py-8 text-center text-sm text-textSecondary animate-pulse">Accessing document records...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Share Modal -->
                <div id="share-modal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all">
                    <div class="relative top-20 mx-auto p-8 border border-borderDivider w-full max-w-md shadow-2xl rounded-3xl bg-white fade-in">
                        <div class="text-center">
                            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-red/5 mb-6 border border-brand-red/10">
                                <svg class="h-8 w-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            </div>
                            <h3 class="text-2xl font-black text-textPrimary tracking-tighter">Share Document</h3>
                            <p class="mt-2 text-textSecondary text-sm font-medium">Select a platform to share the document link.</p>
                            <div class="mt-8 space-y-4">
                                <button id="share-email-btn" class="w-full flex items-center justify-center gap-3 bg-brand-red text-white p-4 rounded-2xl hover:bg-brand-redHover transition-all font-black uppercase tracking-widest shadow-xl shadow-brand-red/10">
                                    Send via Email
                                </button>
                                <button id="share-whatsapp-btn" class="w-full flex items-center justify-center gap-3 bg-bgMain/50 text-textPrimary p-4 rounded-2xl hover:bg-borderDivider transition-all font-black uppercase tracking-widest shadow-xl shadow-black/5">
                                    Send via WhatsApp
                                </button>
                                <button onclick="document.getElementById('share-modal').classList.add('hidden')" class="w-full bg-bgMain text-textSecondary p-4 rounded-2xl hover:bg-borderDivider transition-all font-bold">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PO Number Modal -->
                <div id="po-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div onclick="event.stopPropagation()" class="w-full max-w-lg rounded-3xl bg-card border border-borderDivider shadow-2xl p-6">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h2 class="text-xl font-semibold text-textPrimary">Convert Quotation to Invoice</h2>
                                <p class="mt-2 text-textSecondary text-sm">Add a PO number now or leave it blank to convert without one.</p>
                            </div>
                            <button onclick="Documents.hidePONumberModal()" class="text-textSecondary hover:text-textPrimary">✕</button>
                        </div>
                        <div class="mt-6 space-y-4">
                            <label class="block text-sm font-semibold text-textSecondary">PO Number</label>
                            <input id="po-number-input" type="text" placeholder="Enter PO Number (optional)" class="w-full px-4 py-3 bg-bgMain text-textPrimary border border-borderDivider rounded-2xl outline-none focus:ring-2 focus:ring-brand-red transition-all" />
                            <p class="text-xs text-textSecondary">Leave this field empty to skip PO number on the invoice.</p>
                        </div>
                        <div class="mt-6 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
                            <button onclick="Documents.hidePONumberModal()" class="w-full sm:w-auto rounded-full border border-borderDivider bg-card px-4 py-3 text-sm text-textPrimary hover:bg-bgMain">Cancel</button>
                            <button id="po-modal-confirm" class="w-full sm:w-auto rounded-full bg-brand-red px-4 py-3 text-sm font-semibold text-white hover:bg-brand-redHover">Convert Invoice</button>
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

            if (!response || response._nonJson) {
                throw new Error('Could not parse server response');
            }

            const documents = response.data || response;
            const tbody = document.getElementById('documents-table-body');
            
            if (!documents || !Array.isArray(documents) || documents.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-textSecondary">No records found.</td></tr>';
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
                        <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-black text-textPrimary uppercase tracking-tighter">
                            ${docNumber}
                            <div class="sm:hidden text-[10px] text-textSecondary font-bold mt-1">${doc.issue_date}</div>
                        </td>
                        <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-textPrimary">
                            <div class="flex flex-col">
                                <span class="truncate max-w-[120px] sm:max-w-xs">${doc.customer?.company_name || 'N/A'}</span>
                                <span class="text-[10px] sm:text-xs text-textSecondary font-medium truncate max-w-[120px] sm:max-w-xs">${doc.notes ? doc.notes.substring(0, 30) + '...' : ''}</span>
                            </div>
                        </td>
                        <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-bold text-textSecondary">${doc.issue_date}</td>
                        <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-bold">
                            <div class="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-2">
                                <div class="flex items-center gap-2">
                                    <button onclick="Documents.previewPdf(${doc.id}, '${type}')"
                                        class="text-textPrimary hover:text-brand-red border border-borderDivider px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-[10px] sm:text-sm">
                                        Preview
                                    </button>
                                    <button onclick="Documents.downloadPdf(${doc.id}, '${type}')"
                                        class="bg-brand-red text-white hover:bg-brand-redHover px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all shadow-sm text-[10px] sm:text-sm">
                                        Get PDF
                                    </button>
                                </div>

                                <div class="flex items-center gap-3">
                                    <button onclick="Documents.openShareModal(${doc.id}, '${type}')"
                                        class="text-textSecondary hover:text-brand-red transition-colors text-[10px] sm:text-sm">
                                        Share
                                    </button>

                                    ${allowEditDelete ? `
                                        <a href="#/documents/edit/${doc.id}?type=${type}"
                                            class="text-textSecondary hover:text-brand-red transition-colors text-[10px] sm:text-sm">
                                            Edit
                                        </a>
                                        <button onclick="Documents.deleteDocument(${doc.id}, '${type}')"
                                            class="text-textSecondary hover:text-red-600 transition-colors text-[10px] sm:text-sm">
                                            Del
                                        </button>
                                    ` : ''}

                                    ${type === 'quotation'
                                        ? `<button onclick="Documents.convertQuotation(${doc.id})"
                                            class="text-brand-red hover:text-brand-redHover transition-colors text-[10px] sm:text-sm font-black uppercase">
                                            Convert
                                        </button>`
                                        : ''}
                                </div>
                            </div>
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
        const poNumber = await this.openPONumberModal();
        if (poNumber === undefined) {
            return;
        }

        try {
            await API.post(`/quotations/${id}/convert`, { po_number: poNumber });
            App.showToast('Quotation converted to invoice successfully');
            window.location.hash = '#/documents?type=invoice';
        } catch (error) {
            console.error('Failed to convert quotation', error);
            App.showToast('Failed to convert quotation', 'error');
        }
    },

    openPONumberModal() {
        return new Promise((resolve) => {
            const modal = document.getElementById('po-modal');
            const input = document.getElementById('po-number-input');
            const confirmButton = document.getElementById('po-modal-confirm');

            if (!modal || !input || !confirmButton) {
                resolve(null);
                return;
            }

            modal.classList.remove('hidden');
            input.value = '';
            input.focus();

            const closeModal = () => {
                modal.classList.add('hidden');
                confirmButton.removeEventListener('click', onConfirm);
                if (cancelButton) {
                    cancelButton.removeEventListener('click', onCancel);
                }
                modal.removeEventListener('click', onCancel);
            };

            const onConfirm = () => {
                const value = input.value.trim();
                closeModal();
                resolve(value || null);
            };

            const onCancel = () => {
                closeModal();
                resolve(undefined);
            };

            const cancelButton = modal.querySelector('button[onclick="Documents.hidePONumberModal()"]');
            confirmButton.addEventListener('click', onConfirm);
            cancelButton.addEventListener('click', onCancel);
            modal.addEventListener('click', onCancel);
        });
    },

    hidePONumberModal() {
        const modal = document.getElementById('po-modal');
        if (modal) {
            modal.classList.add('hidden');
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
