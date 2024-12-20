jQuery(document).ready(function ($) {
    // Show the next step in the form
    function showStep(stepId) {
        $('.step-visible').removeClass('step-visible').addClass('step-hidden'); // Hide current step
        $(stepId).removeClass('step-hidden').addClass('step-visible'); // Show next step
    }

    // Handle the "Are you a real estate agent?" question
    $('input[name="is_agent"]').on('change', function () {
        const isAgent = $(this).val() === 'yes';
        if (isAgent) {
            showStep('#step-2'); // Show Step 2
        } else {
            $('#popup-modal').addClass('hidden'); // Close modal if not an agent
        }
    });

    // Handle the "Add Logo and Info" question
    $('input[name="add_logo"]').on('change', function () {
        const addLogo = $(this).val() === 'yes';
        if (addLogo) {
            showStep('#step-3'); // Show Step 3
        } else {
            $('#popup-modal').addClass('hidden'); // Close modal if no uploads
        }
    });

    // Handle popup form submission
    $('#popup-form').on('submit', function (e) {
        e.preventDefault();

        const firstName = $('#first-name').val();
        const email = $('#email').val();
        const isAgent = $('input[name="is_agent"]:checked').val() === 'yes';
        const addLogo = $('input[name="add_logo"]:checked').val() === 'yes';

        // Placeholder logic for PDF preview
        $('#popup-modal').addClass('hidden'); // Hide modal
        console.log({
            firstName,
            email,
            isAgent,
            addLogo,
        });
        alert('Generating PDF... (PDF logic goes here)');
    });

    // Close the popup modal on Cancel
    $('#close-popup').on('click', function () {
        $('#popup-modal').addClass('hidden'); // Hide modal
    });

    // Open the popup modal when clicking Print or Save
    $('.output-button').on('click', function (e) {
        e.preventDefault(); // Prevent default behavior
        $('#popup-modal').removeClass('hidden'); // Show modal
    });

    // Calculate button logic
    $('#calculate-btn').on('click', function (e) {
        e.preventDefault(); // Prevent default behavior

        // Get input values
        const salePrice = parseFloat($('#sale-price').val().replace(/[$,]/g, '')) || 0;
        const mortgagePayoff = parseFloat($('#mortgage-payoff').val().replace(/[$,]/g, '')) || 0;
        const realtorCommission = parseFloat($('#realtor-commission').val()) || 0;
        const taxesDue = parseFloat($('#taxes-due').val().replace(/[$,]/g, '')) || 0;
        const additionalCosts = parseFloat($('#additional-costs').val().replace(/[$,]/g, '')) || 0;

        // Calculate title insurance (0.75% of sale price)
        const titleInsurance = Math.round((0.75 / 100) * salePrice);

        // Fixed Empire Fees
        const empireFees = 200 + 50 + 35 + 25 + 25 + 150;

        // Total Empire Fees Subtotal
        const totalEmpireFees = empireFees + titleInsurance;

        // Calculate commission
        const commission = (realtorCommission / 100) * salePrice;

        // Total expenses
        const totalExpenses = mortgagePayoff + commission + taxesDue + additionalCosts + totalEmpireFees;

        // Calculate net proceeds
        const netProceeds = salePrice - totalExpenses;

        // Update the Empire Fees Subtotal and Title Insurance Slot
        $('#title-insurance-fee').text(`$${titleInsurance.toLocaleString()}`);
        $('#empire-subtotal').text(`$${totalEmpireFees.toLocaleString()}`);

        // Update the output section
        $('#calculator-output').html(`
            <p><strong>Net Proceeds:</strong> $${netProceeds.toLocaleString()}</p>
            <p><strong>Total Expenses:</strong> $${totalExpenses.toLocaleString()}</p>
            <ul>
                <li>Mortgage Payoff: $${mortgagePayoff.toLocaleString()}</li>
                <li>Realtor Commission: $${commission.toLocaleString()}</li>
                <li>Real Estate Taxes Due: $${taxesDue.toLocaleString()}</li>
                <li>Empire Fees Subtotal: $${totalEmpireFees.toLocaleString()}</li>
                <li>Additional Costs: $${additionalCosts.toLocaleString()}</li>
            </ul>
            <div class="button-group">
                <button id="print-pdf" class="output-button" type="button">View/Print PDF</button>
                <button id="save-pdf" class="output-button" type="button">Save as PDF</button>
            </div>
        `);

        // Add event listeners for the Print and Save buttons
        $('.output-button').on('click', function (e) {
            e.preventDefault();
            $('#popup-modal').removeClass('hidden'); // Show the popup modal
        });
    });
});
