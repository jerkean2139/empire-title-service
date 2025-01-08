export class SellerCalculator {
    constructor() {
        this.results = {};
    }

    calculate() {
        // Get input values and remove any non-numeric characters except decimal
        const salePrice = parseFloat(document.getElementById('sale-price').value.replace(/[^0-9.]/g, '')) || 0;
        const existingMortgage = parseFloat(document.getElementById('existing-mortgage').value.replace(/[^0-9.]/g, '')) || 0;
        const commissionRate = parseFloat(document.getElementById('commission').value) || 0;
        const commission = (salePrice * (commissionRate / 100));
        const propertyTaxes = parseFloat(document.getElementById('property-taxes').value.replace(/[^0-9.]/g, '')) || 0;
        const otherFees = parseFloat(document.getElementById('other-fees').value.replace(/[^0-9.]/g, '')) || 0;

        console.log('Calculation values:', {
            salePrice,
            commissionRate,
            commission,
            calculation: `${salePrice} * (${commissionRate} / 100) = ${commission}`
        });

        // Fixed fees
        const settlementFee = 350;
        const searchFee = 175;
        const recordingFee = 100;

        // Calculate title insurance
        const titleInsurance = this.calculateTitleInsurance(salePrice);

        // Calculate total expenses
        const totalExpenses = existingMortgage + commission + titleInsurance + 
                            settlementFee + searchFee + recordingFee + 
                            propertyTaxes + otherFees;

        // Calculate net proceeds
        const netProceeds = salePrice - totalExpenses;

        // Update results display
        this.updateResults({
            salePrice,
            existingMortgage,
            commission,
            titleInsurance,
            settlementFee,
            searchFee,
            recordingFee,
            propertyTaxes,
            otherFees,
            totalExpenses,
            netProceeds
        });

        // Show results section
        document.querySelector('.results-section').classList.remove('initially-hidden');
        document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
    }

    updateResults(results) {
        // Store results for PDF generation
        this.results = results;

        // Update all result fields
        document.getElementById('result-sale-price').textContent = this.formatCurrency(results.salePrice);
        document.getElementById('result-total-credits').textContent = this.formatCurrency(results.salePrice);
        document.getElementById('result-mortgage').textContent = this.formatCurrency(results.existingMortgage);
        document.getElementById('result-commission').textContent = this.formatCurrency(results.commission);
        document.getElementById('result-title-insurance').textContent = this.formatCurrency(results.titleInsurance);
        document.getElementById('result-settlement-fee').textContent = this.formatCurrency(results.settlementFee);
        document.getElementById('result-search-fee').textContent = this.formatCurrency(results.searchFee);
        document.getElementById('result-recording-fee').textContent = this.formatCurrency(results.recordingFee);
        document.getElementById('result-property-taxes').textContent = this.formatCurrency(results.propertyTaxes);
        document.getElementById('result-other-fees').textContent = this.formatCurrency(results.otherFees);
        document.getElementById('result-total-expenses').textContent = this.formatCurrency(results.totalExpenses);
        document.getElementById('result-net-proceeds').textContent = this.formatCurrency(results.netProceeds);

        // Update commission preview
        const commissionPreview = document.querySelector('.commission-preview');
        if (commissionPreview) {
            commissionPreview.textContent = `Commission Amount: ${this.formatCurrency(results.commission)}`;
        }
    }

    camelToKebab(string) {
        return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    calculateTitleInsurance(salePrice) {
        // Title insurance calculation logic
        let rate;
        if (salePrice <= 100000) {
            rate = 5.75;
        } else if (salePrice <= 110000) {
            rate = 5.50;
        } else if (salePrice <= 120000) {
            rate = 5.25;
        } else if (salePrice <= 130000) {
            rate = 5.00;
        } else if (salePrice <= 140000) {
            rate = 4.75;
        } else if (salePrice <= 150000) {
            rate = 4.50;
        } else if (salePrice <= 160000) {
            rate = 4.25;
        } else if (salePrice <= 170000) {
            rate = 4.00;
        } else if (salePrice <= 180000) {
            rate = 3.75;
        } else if (salePrice <= 190000) {
            rate = 3.50;
        } else if (salePrice <= 200000) {
            rate = 3.25;
        } else {
            rate = 3.00;
        }
        return (salePrice * rate) / 1000;
    }

    render() {
        return `
            <div class="calculator-container">
                <div class="calculator-col">
                    <div class="calculator-form">
                        <h2>Seller Net Sheet Calculator</h2>
                        <p class="lead mb-4">Calculate your estimated proceeds from selling your property</p>
                        
                        <div class="form-group">
                            <label for="sale-price">Sale Price</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="text" 
                                       id="sale-price" 
                                       class="form-control currency-input" 
                                       placeholder="Enter sale price">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="existing-mortgage">Existing Mortgage Balance</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="text" 
                                       id="existing-mortgage" 
                                       class="form-control currency-input" 
                                       placeholder="Enter mortgage balance">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="commission">Real Estate Commission Rate (%)</label>
                            <div class="input-group">
                                <input type="text" 
                                       id="commission" 
                                       class="form-control" 
                                       placeholder="Enter commission rate">
                                <span class="input-group-text">%</span>
                            </div>
                            <div class="commission-preview mt-2 text-muted"></div>
                        </div>

                        <div class="form-group">
                            <label for="property-taxes">Property Taxes Due</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="text" 
                                       id="property-taxes" 
                                       class="form-control currency-input" 
                                       placeholder="Enter property taxes">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="other-fees">Other Fees</label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="text" 
                                       id="other-fees" 
                                       class="form-control currency-input" 
                                       placeholder="Enter other fees">
                            </div>
                        </div>

                        <button class="btn btn-primary calculate-btn">
                            Calculate Net Proceeds
                        </button>
                    </div>
                </div>

                <div class="calculator-col">
                    <div class="results-section initially-hidden">
                        <h3>Seller Net Sheet Results</h3>
                        
                        <div class="cd-section">
                            <h4>A. Transaction Information</h4>
                            <div class="cd-table">
                                <div class="cd-row">
                                    <span>Sale Price</span>
                                    <span id="result-sale-price">$0.00</span>
                                </div>
                                <div class="cd-row cd-total">
                                    <span>Total Credits</span>
                                    <span id="result-total-credits">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div class="cd-section">
                            <h4>B. Loan Payoff</h4>
                            <div class="cd-table">
                                <div class="cd-row">
                                    <span>First Mortgage Payoff</span>
                                    <span id="result-mortgage">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div class="cd-section">
                            <h4>C. Settlement Charges</h4>
                            <div class="cd-table">
                                <div class="cd-row">
                                    <span>Real Estate Commission</span>
                                    <span id="result-commission">$0.00</span>
                                </div>
                                <div class="cd-row">
                                    <span>Title Insurance Premium</span>
                                    <span id="result-title-insurance">$0.00</span>
                                </div>
                                <div class="cd-row">
                                    <span>Settlement Fee</span>
                                    <span id="result-settlement-fee">$0.00</span>
                                </div>
                                <div class="cd-row">
                                    <span>Title Search Fee</span>
                                    <span id="result-search-fee">$0.00</span>
                                </div>
                                <div class="cd-row">
                                    <span>Recording Fee</span>
                                    <span id="result-recording-fee">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div class="cd-section">
                            <h4>D. Additional Charges</h4>
                            <div class="cd-table">
                                <div class="cd-row">
                                    <span>Property Taxes</span>
                                    <span id="result-property-taxes">$0.00</span>
                                </div>
                                <div class="cd-row">
                                    <span>Other Fees</span>
                                    <span id="result-other-fees">$0.00</span>
                                </div>
                                <div class="cd-row cd-total">
                                    <span>Total Expenses</span>
                                    <span id="result-total-expenses">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div class="cd-section">
                            <h4>E. Net Proceeds</h4>
                            <div class="cd-table">
                                <div class="cd-row cd-grand-total">
                                    <span>Estimated Net Proceeds</span>
                                    <span id="result-net-proceeds">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary save-btn mt-4">
                            <i class="fas fa-save"></i> Save/Print Results
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Format currency inputs and calculate in real-time
        const currencyInputs = document.querySelectorAll('.currency-input');
        currencyInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9.]/g, '');
                if (value) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        e.target.value = this.formatCurrency(numValue);
                        this.calculate(); // Calculate on every input change
                    }
                }
            });

            // Also calculate on blur to catch any manual edits
            input.addEventListener('blur', () => this.calculate());
        });

        // Handle commission rate input
        const commissionInput = document.getElementById('commission');
        if (commissionInput) {
            commissionInput.addEventListener('input', () => {
                let value = commissionInput.value.replace(/[^0-9.]/g, '');
                if (value) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        // Don't format as currency, just keep the number
                        commissionInput.value = numValue;
                        this.calculate();
                    }
                }
            });
        }

        // Bind calculate button
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }

        // Bind save/print button
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => window.showModal());
        }

        // Bind form submission
        const form = document.getElementById('info-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                this.generatePDF(formData);
            });
        }
    }

    generatePDF(formData) {
        console.log('Starting PDF generation...');
        try {
            console.log('Creating new PDF document...');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const margin = 20;
            let y = margin;

            // Add Empire Title logo/header
            doc.setFontSize(20);
            doc.text('Empire Title', margin, y);
            y += 10;

            doc.setFontSize(16);
            doc.text('Seller Net Sheet', margin, y);
            y += 10;

            // Add date
            doc.setFontSize(12);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
            y += 15;

            // Add contact information if provided
            if (formData) {
                doc.text(`Name: ${formData.get('name')}`, margin, y);
                y += 7;
                doc.text(`Email: ${formData.get('email')}`, margin, y);
                y += 7;
                
                if (formData.get('isAgent') === 'yes') {
                    doc.text(`Company: ${formData.get('company')}`, margin, y);
                    y += 7;
                    doc.text(`Phone: ${formData.get('phone')}`, margin, y);
                    y += 7;
                }
            }
            y += 8;

            // Add transaction details
            const addLine = (label, value) => {
                doc.text(label, margin, y);
                doc.text(value, 150, y);
                y += 7;
            };

            doc.setFont(undefined, 'bold');
            doc.text('A. Transaction Information', margin, y);
            y += 10;
            doc.setFont(undefined, 'normal');

            addLine('Sale Price:', this.formatCurrency(this.results.salePrice));
            addLine('Total Credits:', this.formatCurrency(this.results.salePrice));

            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('B. Loan Payoff', margin, y);
            y += 10;
            doc.setFont(undefined, 'normal');

            addLine('First Mortgage Payoff:', this.formatCurrency(this.results.existingMortgage));

            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('C. Settlement Charges', margin, y);
            y += 10;
            doc.setFont(undefined, 'normal');

            addLine('Real Estate Commission:', this.formatCurrency(this.results.commission));
            addLine('Title Insurance Premium:', this.formatCurrency(this.results.titleInsurance));
            addLine('Settlement Fee:', this.formatCurrency(this.results.settlementFee));
            addLine('Title Search Fee:', this.formatCurrency(this.results.searchFee));
            addLine('Recording Fee:', this.formatCurrency(this.results.recordingFee));

            y += 3;
            doc.setFont(undefined, 'bold');
            doc.text('D. Additional Charges', margin, y);
            y += 10;
            doc.setFont(undefined, 'normal');

            addLine('Property Taxes:', this.formatCurrency(this.results.propertyTaxes));
            addLine('Other Fees:', this.formatCurrency(this.results.otherFees));

            y += 10;
            doc.setFont(undefined, 'bold');
            addLine('Total Expenses:', this.formatCurrency(this.results.totalExpenses));
            addLine('Estimated Net Proceeds:', this.formatCurrency(this.results.netProceeds));

            console.log('Saving PDF...');
            doc.save('seller-net-sheet.pdf');
            window.closeModal();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please check the console for details.');
        }
    }
}
