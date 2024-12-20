<?php

function mortgage_pre_qualifier_shortcode() {
    ob_start();
    ?>
    <form id="mortgage-pre-qualifier">
        <label for="income">Monthly Income ($):</label>
        <input type="number" id="income" name="income" required>
        
        <label for="expenses">Monthly Expenses ($):</label>
        <input type="number" id="expenses" name="expenses" required>
        
        <label for="loan_term">Loan Term (Years):</label>
        <input type="number" id="loan_term" name="loan_term" required>
        
        <label for="interest_rate">Interest Rate (%):</label>
        <input type="number" id="interest_rate" name="interest_rate" step="0.1" required>
        
        <button type="button" onclick="calculateMortgage()">Calculate</button>
        
        <p id="result"></p>
    </form>

    <script>
        function calculateMortgage() {
            const income = parseFloat(document.getElementById('income').value);
            const expenses = parseFloat(document.getElementById('expenses').value);
            const loanTerm = parseFloat(document.getElementById('loan_term').value) * 12;
            const interestRate = parseFloat(document.getElementById('interest_rate').value) / 100 / 12;

            if (isNaN(income) || isNaN(expenses) || isNaN(loanTerm) || isNaN(interestRate)) {
                alert('Please fill in all fields.');
                return;
            }

            const affordablePayment = (income - expenses) * 0.28;
            const maxLoan = affordablePayment / interestRate * (1 - Math.pow(1 + interestRate, -loanTerm));

            document.getElementById('result').innerText = `Maximum Loan Amount: $${maxLoan.toFixed(2)}`;
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('mortgage_pre_qualifier', 'mortgage_pre_qualifier_shortcode');
