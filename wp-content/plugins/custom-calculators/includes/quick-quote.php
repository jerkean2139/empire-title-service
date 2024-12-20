<?php

function quick_quote_shortcode() {
    ob_start();
    ?>
    <form id="quick-quote">
        <label for="purchase_price">Purchase Price ($):</label>
        <input type="number" id="purchase_price" name="purchase_price" required>
        
        <label for="title_fee_rate">Title Fee Rate (%):</label>
        <input type="number" id="title_fee_rate" name="title_fee_rate" step="0.1" required>
        
        <button type="button" onclick="calculateQuickQuote()">Calculate</button>
        
        <p id="result"></p>
    </form>

    <script>
        function calculateQuickQuote() {
            const purchasePrice = parseFloat(document.getElementById('purchase_price').value);
            const titleFeeRate = parseFloat(document.getElementById('title_fee_rate').value) / 100;

            if (isNaN(purchasePrice) || isNaN(titleFeeRate)) {
                alert('Please fill in all fields.');
                return;
            }

            const titleFee = purchasePrice * titleFeeRate;

            document.getElementById('result').innerText = `Estimated Title Fee: $${titleFee.toFixed(2)}`;
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('quick_quote', 'quick_quote_shortcode');
