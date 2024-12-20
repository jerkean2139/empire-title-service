<?php

function seller_net_sheet_shortcode() {
    ob_start();
    ?>
    <form id="seller-net-sheet">
        <label for="sale_price">Sale Price ($):</label>
        <input type="number" id="sale_price" name="sale_price" required>
        
        <label for="commission_rate">Commission Rate (%):</label>
        <input type="number" id="commission_rate" name="commission_rate" step="0.1" required>
        
        <label for="closing_costs">Closing Costs ($):</label>
        <input type="number" id="closing_costs" name="closing_costs" required>
        
        <button type="button" onclick="calculateNet()">Calculate</button>
        
        <p id="result"></p>
    </form>

    <script>
        function calculateNet() {
            const salePrice = parseFloat(document.getElementById('sale_price').value);
            const commissionRate = parseFloat(document.getElementById('commission_rate').value) / 100;
            const closingCosts = parseFloat(document.getElementById('closing_costs').value);

            if (isNaN(salePrice) || isNaN(commissionRate) || isNaN(closingCosts)) {
                alert('Please fill in all fields.');
                return;
            }

            const commission = salePrice * commissionRate;
            const net = salePrice - commission - closingCosts;

            document.getElementById('result').innerText = `Estimated Net Proceeds: $${net.toFixed(2)}`;
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('seller_net_sheet', 'seller_net_sheet_shortcode');
