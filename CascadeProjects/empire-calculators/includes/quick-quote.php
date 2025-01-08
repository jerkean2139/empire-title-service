<?php
function quick_quote_shortcode() {
    ob_start();
    ?>
    <div class="calculator-wrapper quick-quote">
        <h3>Title Fees Quick Quote</h3>
        <form id="quick-quote" class="calculator-form">
            <div class="form-group">
                <label for="property_value">Property Value ($)</label>
                <input type="number" id="property_value" name="property_value" required>
            </div>
            
            <div class="form-group">
                <label for="transaction_type">Transaction Type</label>
                <select id="transaction_type" name="transaction_type">
                    <option value="purchase">Purchase</option>
                    <option value="refinance">Refinance</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="property_type">Property Type</label>
                <select id="property_type" name="property_type">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                </select>
            </div>
            
            <button type="button" class="calculate-btn" onclick="calculateQuickQuote()">Calculate</button>
            
            <div id="quick-quote-result" class="result-section"></div>
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('quick_quote', 'quick_quote_shortcode');
