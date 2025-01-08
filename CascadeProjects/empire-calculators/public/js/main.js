import { SellerCalculator } from './calculators/SellerCalculator.js';

// Calculator Factory
class CalculatorFactory {
    static createCalculator(type) {
        switch(type) {
            case 'seller':
                return new SellerCalculator();
            case 'buyer':
                return new SellerCalculator(); // Temporary until we implement BuyerCalculator
            case 'refinance':
                return new SellerCalculator(); // Temporary until we implement RefinanceCalculator
            default:
                throw new Error(`Unknown calculator type: ${type}`);
        }
    }
}

// Base Calculator Class
class Calculator {
    constructor() {
        this.results = {};
    }

    calculate() {
        throw new Error('Calculate method must be implemented');
    }

    render() {
        throw new Error('Render method must be implemented');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    bindEvents() {
        throw new Error('BindEvents method must be implemented');
    }
}

// Make modal functions globally available
window.showModal = function() {
    document.getElementById('modal-backdrop').classList.remove('d-none');
}

window.closeModal = function() {
    document.getElementById('modal-backdrop').classList.add('d-none');
}

// Handle logo upload
window.handleLogoUpload = function(input) {
    const preview = document.querySelector('.logo-preview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Logo preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const calculatorCards = document.querySelectorAll('.calculator-card');
    const container = document.getElementById('calculator-container');
    const mainContent = document.querySelector('.container.mt-5');

    // Initialize calculator cards
    calculatorCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const calculatorType = card.dataset.calculator;
            try {
                mainContent.classList.add('d-none');
                container.classList.remove('d-none');
                // Make calculator instance globally available
                window.calculator = CalculatorFactory.createCalculator(calculatorType);
                container.innerHTML = window.calculator.render();
                window.calculator.bindEvents();

                // Add back button
                const backBtn = document.createElement('button');
                backBtn.className = 'btn btn-link mb-4';
                backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Calculators';
                backBtn.addEventListener('click', () => {
                    mainContent.classList.remove('d-none');
                    container.classList.add('d-none');
                });
                container.insertBefore(backBtn, container.firstChild);
            } catch (error) {
                console.error(error);
                container.innerHTML = '<div class="alert alert-danger">Error loading calculator</div>';
            }
        });
    });

    // Initialize modal form
    const infoForm = document.getElementById('info-form');
    if (infoForm) {
        // Handle agent fields visibility
        const agentRadios = document.querySelectorAll('input[name="isAgent"]');
        const agentFields = document.getElementById('agent-fields');
        
        agentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (agentFields) {
                    agentFields.classList.toggle('hidden', e.target.value !== 'yes');
                    
                    // Update required attributes based on visibility
                    const requiredFields = agentFields.querySelectorAll('input[required]');
                    requiredFields.forEach(field => {
                        field.required = e.target.value === 'yes';
                    });
                }
            });
        });

        // Handle logo field visibility
        const logoRadios = document.querySelectorAll('input[name="addLogo"]');
        const logoField = document.getElementById('logo-field');
        
        logoRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (logoField) {
                    logoField.classList.toggle('hidden', e.target.value !== 'yes');
                }
            });
        });

        // Handle form submission
        infoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                if (window.calculator) {
                    window.calculator.generatePDF(formData);
                }
                window.closeModal();
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('There was an error generating the PDF. Please try again.');
            }
        });
    }
});
