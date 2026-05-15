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
            <div class="max-w-7xl mx-auto space-y-6 fade-in p-6 bg-slate-800 rounded-xl shadow-sm border border-slate-700">
                <div class="flex justify-between items-center border-b border-slate-700 pb-4">
                    <h1 class="text-2xl font-bold text-slate-100">${title}s</h1>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-slate-900/50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Serial Number</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer / Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="documents-table-body" class="bg-slate-800 divide-y divide-gray-200">
                            <tr><td colspan="4" class="px-6 py-4 text-center text-sm text-slate-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-700">
                    <button onclick="window.location.hash='#/documents/create?type=${type}'" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add New
                    </button>
                </div>

                <!-- Share Modal -->
                <div id="share-modal" class="hidden fixed inset-0 bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                    <div class="relative top-20 mx-auto p-5 border border-slate-700 w-96 shadow-2xl rounded-xl bg-slate-800">
                        <div class="mt-3 text-center">
                            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            </div>
                            <h3 class="text-xl leading-6 font-bold text-white">Share Document</h3>
                            <div class="mt-4 px-2 py-3 space-y-3">
                                <button id="share-email-btn" class="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                    Email PDF Link
                                </button>
                                <button id="share-whatsapp-btn" class="w-full flex items-center justify-center gap-3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    WhatsApp PDF Link
                                </button>
                                <button onclick="document.getElementById('share-modal').classList.add('hidden')" class="w-full bg-slate-700 text-slate-300 p-3 rounded-lg hover:bg-slate-600 transition-colors">
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

    async init() {
        const hash = window.location.hash;
        if (hash.includes('#/documents/create') || hash.includes('#/documents/edit')) {
            return await DocumentForm.init();
        }

        const type = this.getTypeFromUrl();
        await this.loadData(type);
    },

    getEndpointPath(type) {
        if (type === 'purchase_order') return 'purchase-orders';
        return type + 's';
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

                html += `
                    <tr class="hover:bg-slate-900/50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${docNumber}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${doc.customer?.company_name || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-400">${doc.issue_date}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button onclick="Documents.downloadPdf(${doc.id}, '${type}')" class="text-indigo-400 hover:text-indigo-300 font-bold border border-indigo-400/30 px-3 py-1 rounded">Download PDF</button>
                            <button onclick="Documents.openShareModal(${doc.id}, '${type}')" class="text-green-500 hover:text-green-400 font-medium">Share</button>
                            <a href="#/documents/edit/${doc.id}?type=${type}" class="text-blue-400 hover:text-blue-300 font-medium">Update</a>
                            ${type === 'quotation' ? `<button onclick="Documents.convertQuotation(${doc.id})" class="text-amber-400 hover:text-amber-300 font-medium">Convert</button>` : ''}
                            <button onclick="Documents.deleteDocument(${doc.id}, '${type}')" class="text-red-500 hover:text-red-700 font-medium">Delete</button>
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

    downloadPdf(id, type) {
        const token = localStorage.getItem('token');
        const baseUrl = API.getBaseUrl();
        const isMobile = API.isCapacitor;

        // Use 'download' for mobile to trigger the Android DownloadListener we added
        const action = isMobile ? 'download' : 'view';
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
