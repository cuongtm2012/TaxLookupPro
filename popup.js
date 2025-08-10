class VietQRTaxLookup {
    constructor() {
        this.apiUrl = 'https://api.vietqr.io/v2/business';
        this.init();
    }

    init() {
        // DOM elements
        this.taxForm = document.getElementById('taxForm');
        this.taxInput = document.getElementById('taxInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.spinner = document.getElementById('spinner');
        this.btnText = document.querySelector('.btn-text');
        this.results = document.getElementById('results');
        this.resultsContent = document.getElementById('resultsContent');
        this.errorMessage = document.getElementById('errorMessage');

        // Event listeners
        this.taxForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.taxInput.addEventListener('input', () => this.clearMessages());
        this.taxInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });

        // Load saved input on popup open
        this.loadSavedInput();
    }

    async loadSavedInput() {
        try {
            const result = await chrome.storage.local.get(['lastTaxInput']);
            if (result.lastTaxInput) {
                this.taxInput.value = result.lastTaxInput;
            }
        } catch (error) {
            console.log('Could not load saved input:', error);
        }
    }

    async saveInput(input) {
        try {
            await chrome.storage.local.set({ lastTaxInput: input });
        } catch (error) {
            console.log('Could not save input:', error);
        }
    }

    clearMessages() {
        this.errorMessage.classList.add('hidden');
        this.results.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.results.classList.add('hidden');
    }

    showResults() {
        this.results.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
    }

    setLoading(isLoading) {
        this.submitBtn.disabled = isLoading;
        if (isLoading) {
            this.spinner.classList.remove('hidden');
            this.btnText.textContent = 'Looking up...';
        } else {
            this.spinner.classList.add('hidden');
            this.btnText.textContent = 'Submit';
        }
    }

    validateTaxCode(taxCode) {
        // Vietnamese tax code is typically 10-13 digits
        const taxCodeRegex = /^\d{10,13}$/;
        return taxCodeRegex.test(taxCode);
    }

    parseTaxCodes(input) {
        return input
            .split(';')
            .map(code => code.trim())
            .filter(code => code.length > 0);
    }

    async lookupTaxCode(taxCode) {
        try {
            const response = await fetch(`${this.apiUrl}/${taxCode}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();

            if (response.status === 200 && data.code === '00') {
                return {
                    success: true,
                    data: data.data,
                    taxCode: taxCode
                };
            } else if (response.status === 429) {
                return {
                    success: false,
                    error: 'Rate limit exceeded. Please wait before making more requests.',
                    taxCode: taxCode,
                    isRateLimit: true
                };
            } else if (data.code === '01') {
                return {
                    success: false,
                    error: 'Invalid tax code format',
                    taxCode: taxCode
                };
            } else if (data.code === '02') {
                return {
                    success: false,
                    error: 'Tax code not found',
                    taxCode: taxCode
                };
            } else {
                return {
                    success: false,
                    error: data.desc || 'Unknown error occurred',
                    taxCode: taxCode
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Network error: ${error.message}`,
                taxCode: taxCode
            };
        }
    }

    renderResult(result) {
        const resultDiv = document.createElement('div');

        if (result.success) {
            resultDiv.className = 'company-result';
            const data = result.data;
            
            resultDiv.innerHTML = `
                <div class="tax-id">Tax ID: ${result.taxCode}</div>
                <div class="company-name">${this.escapeHtml(data.name || 'N/A')}</div>
                ${data.internationalName ? `<div class="company-detail"><strong>International:</strong> ${this.escapeHtml(data.internationalName)}</div>` : ''}
                ${data.shortName ? `<div class="company-detail"><strong>Short Name:</strong> ${this.escapeHtml(data.shortName)}</div>` : ''}
                <div class="company-detail"><strong>Address:</strong> ${this.escapeHtml(data.address || 'N/A')}</div>
            `;
        } else {
            resultDiv.className = 'error-result';
            resultDiv.innerHTML = `
                <div class="tax-id">Tax ID: ${result.taxCode}</div>
                <div class="company-detail">Error: ${this.escapeHtml(result.error)}</div>
            `;
        }

        return resultDiv;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async handleSubmit(e) {
        e.preventDefault();

        const input = this.taxInput.value.trim();
        if (!input) {
            this.showError('Please enter at least one tax ID.');
            return;
        }

        // Save input for next time
        await this.saveInput(input);

        const taxCodes = this.parseTaxCodes(input);
        if (taxCodes.length === 0) {
            this.showError('Please enter valid tax IDs separated by semicolons.');
            return;
        }

        // Validate tax codes
        const invalidCodes = taxCodes.filter(code => !this.validateTaxCode(code));
        if (invalidCodes.length > 0) {
            this.showError(`Invalid tax code format: ${invalidCodes.join(', ')}. Tax codes should be 10-13 digits.`);
            return;
        }

        // Limit number of tax codes to prevent abuse
        if (taxCodes.length > 10) {
            this.showError('Please limit your search to 10 tax codes at a time.');
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        try {
            // Process tax codes with a small delay to avoid rate limiting
            const results = [];
            let hasRateLimit = false;

            for (let i = 0; i < taxCodes.length; i++) {
                if (i > 0) {
                    // Add a small delay between requests to be respectful to the API
                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                const result = await this.lookupTaxCode(taxCodes[i]);
                results.push(result);

                if (result.isRateLimit) {
                    hasRateLimit = true;
                    break; // Stop processing if we hit rate limit
                }
            }

            // Display results
            this.resultsContent.innerHTML = '';
            
            if (results.length === 0) {
                this.showError('No results to display.');
                return;
            }

            results.forEach(result => {
                const resultElement = this.renderResult(result);
                this.resultsContent.appendChild(resultElement);
            });

            this.showResults();

            // Show rate limit warning if applicable
            if (hasRateLimit) {
                const warningDiv = document.createElement('div');
                warningDiv.className = 'rate-limit-warning';
                warningDiv.textContent = 'Rate limit reached. Some tax codes were not processed. Please wait a moment before trying again.';
                this.resultsContent.appendChild(warningDiv);
            }

        } catch (error) {
            this.showError(`An unexpected error occurred: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }
}

// Initialize the application when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new VietQRTaxLookup();
});
