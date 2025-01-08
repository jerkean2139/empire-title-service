function calculateSellerNet() {
    const salePrice = parseFloat(document.getElementById('sale_price').value);
    const existingMortgage = parseFloat(document.getElementById('existing_mortgage').value);
    const commissionRate = parseFloat(document.getElementById('commission_rate').value) / 100;
    const propertyTaxes = parseFloat(document.getElementById('property_taxes').value);

    if ([salePrice, existingMortgage, commissionRate, propertyTaxes].some(isNaN)) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    const commission = salePrice * commissionRate;
    const netProceeds = salePrice - existingMortgage - commission - propertyTaxes;

    const resultHtml = `
        <h4>Results:</h4>
        <p>Sale Price: $${salePrice.toLocaleString()}</p>
        <p>Commission: $${commission.toLocaleString()}</p>
        <p>Existing Mortgage: $${existingMortgage.toLocaleString()}</p>
        <p>Property Taxes: $${propertyTaxes.toLocaleString()}</p>
        <p class="net-proceeds">Estimated Net Proceeds: $${netProceeds.toLocaleString()}</p>
    `;

    document.getElementById('seller-net-result').innerHTML = resultHtml;
}

function calculateMortgage() {
    const annualIncome = parseFloat(document.getElementById('annual_income').value);
    const monthlyDebt = parseFloat(document.getElementById('monthly_debt').value);
    const downPayment = parseFloat(document.getElementById('down_payment').value);
    const interestRate = parseFloat(document.getElementById('interest_rate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loan_term').value);

    if ([annualIncome, monthlyDebt, downPayment, interestRate].some(isNaN)) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    const monthlyIncome = annualIncome / 12;
    const maxMonthlyPayment = (monthlyIncome * 0.28) - monthlyDebt;
    const monthlyRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;

    const maxLoanAmount = (maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numberOfPayments))) / monthlyRate;
    const maxHomePrice = maxLoanAmount + downPayment;

    const resultHtml = `
        <h4>Results:</h4>
        <p>Maximum Monthly Payment: $${maxMonthlyPayment.toLocaleString()}</p>
        <p>Maximum Loan Amount: $${maxLoanAmount.toLocaleString()}</p>
        <p class="max-price">Maximum Home Price: $${maxHomePrice.toLocaleString()}</p>
    `;

    document.getElementById('mortgage-result').innerHTML = resultHtml;
}

function calculateQuickQuote() {
    const propertyValue = parseFloat(document.getElementById('property_value').value);
    const transactionType = document.getElementById('transaction_type').value;
    const propertyType = document.getElementById('property_type').value;

    if (isNaN(propertyValue)) {
        alert('Please enter a valid property value');
        return;
    }

    // These are example rates - adjust according to your actual title fee structure
    let titleInsuranceRate = propertyType === 'residential' ? 0.00575 : 0.00625;
    let baseFee = transactionType === 'purchase' ? 500 : 400;

    const titleInsurance = propertyValue * titleInsuranceRate;
    const searchFee = 150;
    const recordingFees = 100;
    const totalFees = titleInsurance + baseFee + searchFee + recordingFees;

    const resultHtml = `
        <h4>Estimated Title Fees:</h4>
        <p>Title Insurance: $${titleInsurance.toLocaleString()}</p>
        <p>Base Fee: $${baseFee.toLocaleString()}</p>
        <p>Search Fee: $${searchFee.toLocaleString()}</p>
        <p>Recording Fees: $${recordingFees.toLocaleString()}</p>
        <p class="total-fees">Total Estimated Fees: $${totalFees.toLocaleString()}</p>
    `;

    document.getElementById('quick-quote-result').innerHTML = resultHtml;
}
