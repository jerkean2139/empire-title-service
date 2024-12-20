<div class="calculator-container">
    <h2 class="section-title">Seller Net Sheet Calculator</h2>
    <div class="calculator-grid">
        <!-- Left Side: Input Fields -->
        <div class="calculator-inputs">
            <form id="seller-net-sheet-form">
                <label for="sale-price">Purchase Price:</label>
                <input type="text" id="sale-price" name="sale_price" placeholder="$0" required>

                <label for="mortgage-payoff">Mortgage Payoff:</label>
                <input type="text" id="mortgage-payoff" name="mortgage_payoff" placeholder="$0" required>

                <label for="realtor-commission">Realtor Commission (%):</label>
                <input type="number" id="realtor-commission" name="realtor_commission" placeholder="0" required>

                <label for="taxes-due">Real Estate Taxes Due:</label>
                <input type="text" id="taxes-due" name="taxes_due" placeholder="$0">

                <label for="additional-costs">Additional Costs:</label>
                <input type="text" id="additional-costs" name="additional_costs" placeholder="$0">

                <fieldset>
                    <legend>Empire Fees</legend>
                    <ul id="empire-fees-list">
                        <li>Closing Fee: <span class="fee-amount">$200</span></li>
                        <li>Recording Fee: <span class="fee-amount">$50</span></li>
                        <li>Sales Affidavit: <span class="fee-amount">$35</span></li>
                        <li>Wire Fee: <span class="fee-amount">$25</span></li>
                        <li>Courier Fee: <span class="fee-amount">$25</span></li>
                        <li>Endorsements: <span class="fee-amount">$150</span></li>
                        <li>Title Insurance: <span id="title-insurance-fee" class="fee-amount">$0</span></li>
                    </ul>
                    <p class="subtotal">Empire Fees Subtotal: <strong id="empire-subtotal">$0</strong></p>
                </fieldset>
                <button id="calculate-btn" type="button">Calculate</button>
            </form>
        </div>

        <!-- Right Side: Output Section -->
        <div id="calculator-output" class="calculator-output">
            <p>Enter details on the left to calculate net proceeds.</p>
            <div class="button-group">
                <button id="print-pdf" class="output-button" type="button">View/Print PDF</button>
                <button id="save-pdf" class="output-button" type="button">Save as PDF</button>
            </div>
        </div>
    </div>
</div>

<div id="popup-modal" class="popup hidden">
    <div class="popup-content">
        <h2>Save/Print Details</h2>
        <form id="popup-form">
            <!-- Step 1: Basic Info -->
            <div id="step-1" class="step-visible">
                <label for="first-name">First Name:</label>
                <input type="text" id="first-name" name="first_name" placeholder="Enter your first name" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>

                <label>Are you a real estate agent?</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="is_agent" value="yes" required> Yes
                    </label>
                    <label>
                        <input type="radio" name="is_agent" value="no"> No
                    </label>
                </div>
            </div>

            <!-- Step 2: Agent Question -->
            <div id="step-2" class="step-hidden">
                <label>Would you like to add your Logo, Image, and Contact Info?</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="add_logo" value="yes"> Yes
                    </label>
                    <label>
                        <input type="radio" name="add_logo" value="no"> No
                    </label>
                </div>
            </div>

            <!-- Step 3: Upload Fields -->
            <div id="step-3" class="step-hidden">
                <label for="agent-phone">Phone Number:</label>
                <input type="text" id="agent-phone" name="agent_phone" placeholder="Enter your phone number">

                <label for="agent-logo">Upload Your Logo:</label>
                <input type="file" id="agent-logo" name="agent_logo" accept="image/*">

                <label for="agent-image">Upload Your Picture:</label>
                <input type="file" id="agent-image" name="agent_image" accept="image/*">
            </div>

            <button type="submit" id="submit-popup">Continue</button>
        </form>
        <span id="close-popup">Cancel</span>
    </div>
</div>
