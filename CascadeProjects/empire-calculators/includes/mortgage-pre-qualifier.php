<?php
function mortgage_pre_qualifier_shortcode() {
    ob_start();
    ?>
    <div class="calculator-wrapper mortgage-pre-qualifier">
        <h3>Mortgage Pre-Qualification Calculator</h3>
        <form id="mortgage-pre-qualifier" class="calculator-form">
            <div class="form-group">
                <label for="annual_income">Annual Income ($)</label>
                <input type="number" id="annual_income" name="annual_income" required>
            </div>
            
            <div class="form-group">
                <label for="monthly_debt">Monthly Debt Payments ($)</label>
                <input type="number" id="monthly_debt" name="monthly_debt" required>
            </div>
            
            <div class="form-group">
                <label for="down_payment">Down Payment ($)</label>
                <input type="number" id="down_payment" name="down_payment" required>
            </div>
            
            <div class="form-group">
                <label for="interest_rate">Interest Rate (%)</label>
                <input type="number" id="interest_rate" name="interest_rate" step="0.1" value="6.5" required>
            </div>
            
            <div class="form-group">
                <label for="loan_term">Loan Term (Years)</label>
                <select id="loan_term" name="loan_term">
                    <option value="30">30 Years</option>
                    <option value="15">15 Years</option>
                </select>
            </div>
            
            <button type="button" class="calculate-btn" onclick="calculateMortgage()">Calculate</button>
            
            <div id="mortgage-result" class="result-section"></div>
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('mortgage_pre_qualifier', 'mortgage_pre_qualifier_shortcode');
