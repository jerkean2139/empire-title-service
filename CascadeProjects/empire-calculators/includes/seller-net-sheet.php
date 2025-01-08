<?php
function seller_net_sheet_shortcode() {
    ob_start();
    ?>
    <div class="calculator-wrapper seller-net-sheet">
        <h3>Seller Net Sheet Calculator</h3>
        <form id="seller-net-sheet" class="calculator-form">
            <div class="form-group">
                <label for="sale_price">Sale Price ($)</label>
                <input type="number" id="sale_price" name="sale_price" required>
            </div>
            
            <div class="form-group">
                <label for="existing_mortgage">Existing Mortgage Balance ($)</label>
                <input type="number" id="existing_mortgage" name="existing_mortgage" required>
            </div>
            
            <div class="form-group">
                <label for="commission_rate">Commission Rate (%)</label>
                <input type="number" id="commission_rate" name="commission_rate" step="0.1" value="6" required>
            </div>
            
            <div class="form-group">
                <label for="property_taxes">Property Taxes ($)</label>
                <input type="number" id="property_taxes" name="property_taxes" required>
            </div>
            
            <button type="button" class="calculate-btn" onclick="calculateSellerNet()">Calculate</button>
            
            <div id="seller-net-result" class="result-section"></div>
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('seller_net_sheet', 'seller_net_sheet_shortcode');
