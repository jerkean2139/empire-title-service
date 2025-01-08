// Calculator Factory
class CalculatorFactory {
    static createCalculator(type) {
        switch(type) {
            case 'seller':
                return new SellerCalculator();
            case 'buyer':
                return new BuyerCalculator();
            case 'refinance':
                return new RefinanceCalculator();
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const calculatorCards = document.querySelectorAll('.calculator-card');
    const container = document.getElementById('calculator-container');
    const mainContent = document.querySelector('.container.mt-5');

    calculatorCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const calculatorType = card.dataset.calculator;
            try {
                mainContent.classList.add('d-none');
                container.classList.remove('d-none');
                const calculator = CalculatorFactory.createCalculator(calculatorType);
                container.innerHTML = calculator.render();
                calculator.bindEvents();

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
});
