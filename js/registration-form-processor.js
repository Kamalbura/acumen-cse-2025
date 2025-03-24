/**
 * Registration Form Processor
 * Handles the ACUMEN 2025 registration form logic and submission
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    console.log('Initializing registration form processor');
    
    // Constants for event pricing
    const EVENT_PRICES = {
        // Technical events
        'paper_presentation': 300,
        'poster_presentation': 250,
        'project_expo': 500,
        'ai_imagination': 800,
        'shark_tank': 400,
        
        // Coding events
        'code_to_escape': 250,
        'bid_n_code': 300,
        'jail_break': 300,
        'code_relay': 400,
        'syntax_sleuth': 250,
        
        // Gaming events
        'call_of_duty': 200,
        'free_fire': 200,
        
        // Non-technical events
        'treasure_hunt': 300,
        'squid_gaming': 200,
        'auction_war': 150,
        'movie_hunt': 150,
        'sherlock_holmes': 200,
        'human_snakes_ladders': 250,
        'three_legged_maze': 200
    };
    
    // Event categories for organization
    const EVENT_CATEGORIES = {
        'technical': [
            'paper_presentation', 
            'poster_presentation', 
            'project_expo', 
            'ai_imagination', 
            'shark_tank'
        ],
        'coding': [
            'code_to_escape', 
            'bid_n_code', 
            'jail_break', 
            'code_relay', 
            'syntax_sleuth'
        ],
        'gaming': [
            'call_of_duty', 
            'free_fire'
        ],
        'non-technical': [
            'treasure_hunt', 
            'squid_gaming', 
            'auction_war', 
            'movie_hunt', 
            'sherlock_holmes', 
            'human_snakes_ladders', 
            'three_legged_maze'
        ]
    };
    
    // Events that require teams
    const TEAM_EVENTS = [
        'project_expo', 
        'ai_imagination', 
        'shark_tank', 
        'code_relay', 
        'treasure_hunt', 
        'human_snakes_ladders'
    ];
    
    // Multi-step form navigation
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Show a specific step and update indicators
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Show the target step
        document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
        
        // Update step indicators
        stepIndicators.forEach(indicator => {
            const indicatorStep = parseInt(indicator.getAttribute('data-step'));
            
            indicator.classList.remove('active', 'completed');
            
            if (indicatorStep === stepNumber) {
                indicator.classList.add('active');
            } else if (indicatorStep < stepNumber) {
                indicator.classList.add('completed');
                indicator.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                indicator.innerHTML = indicatorStep;
            }
        });
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').getAttribute('data-step'));
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                // If going to the confirmation step, populate summary
                if (nextStep === 4) {
                    populateSummary();
                }
                
                showStep(nextStep);
            }
        });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            showStep(prevStep);
        });
    });
    
    // Calculate total amount based on selected events
    function calculateTotalAmount() {
        const selectedEvents = document.querySelectorAll('.event-checkbox input:checked');
        let total = 0;
        
        const orderSummaryItems = document.getElementById('orderSummaryItems');
        orderSummaryItems.innerHTML = '';
        
        selectedEvents.forEach(checkbox => {
            const eventValue = checkbox.value;
            const eventName = checkbox.closest('.event-checkbox').querySelector('.event-name').textContent.trim();
            const eventPrice = EVENT_PRICES[eventValue] || 200; // Default to 200 if not found
            
            total += eventPrice;
            
            // Add to order summary
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <div class="summary-item-name">${eventName}</div>
                <div class="summary-item-price">₹${eventPrice}</div>
            `;
            orderSummaryItems.appendChild(summaryItem);
        });
        
        // Update total amount
        const totalAmountDisplay = document.getElementById('totalAmount');
        totalAmountDisplay.textContent = `₹${total}`;
        
        return total;
    }
    
    // Populate summary page
    function populateSummary() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const fullName = `${firstName} ${lastName}`;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const college = document.getElementById('college').value;
        
        const selectedEvents = document.querySelectorAll('.event-checkbox input:checked');
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Update summary fields
        document.getElementById('summaryName').textContent = fullName;
        document.getElementById('summaryEmail').textContent = email;
        document.getElementById('summaryPhone').textContent = phone;
        document.getElementById('summaryCollege').textContent = college;
        document.getElementById('summaryEventCount').textContent = `${selectedEvents.length} events selected`;
        
        // Format payment method for display
        let paymentMethodDisplay = '';
        switch(paymentMethod) {
            case 'upi':
                paymentMethodDisplay = 'UPI Payment';
                break;
            case 'cash':
                paymentMethodDisplay = 'Cash at Venue';
                break;
            case 'bank':
                paymentMethodDisplay = 'Bank Transfer';
                break;
            default:
                paymentMethodDisplay = paymentMethod;
        }
        
        document.getElementById('summaryPayment').textContent = paymentMethodDisplay;
        
        // Get total from previous step
        const total = document.getElementById('totalAmount').textContent;
        document.getElementById('summaryTotal').textContent = total;
    }
    
    // Event checkbox styling and interaction
    const eventCheckboxes = document.querySelectorAll('.event-checkbox');
    if (eventCheckboxes.length > 0) {
        eventCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('click', function(e) {
                // Don't handle clicks on the checkbox itself (already handled by label click)
                if (e.target.type === 'checkbox') return;
                
                const input = this.querySelector('input');
                input.checked = !input.checked;
                
                if (input.checked) {
                    this.classList.add('selected');
                } else {
                    this.classList.remove('selected');
                }
                
                // Update total after selection changes
                calculateTotalAmount();
                
                // Show/hide team information section based on selected events
                updateTeamSectionVisibility();
            });
            
            // Initialize checkbox state based on input
            const input = checkbox.querySelector('input');
            if (input.checked) {
                checkbox.classList.add('selected');
            }
        });
    }
    
    // Update team section visibility based on event selection
    function updateTeamSectionVisibility() {
        const teamInfoSection = document.getElementById('teamInfoSection');
        if (!teamInfoSection) return;
        
        const hasTeamEvent = Array.from(document.querySelectorAll('.event-checkbox input:checked'))
            .some(checkbox => TEAM_EVENTS.includes(checkbox.value));
            
        teamInfoSection.style.display = hasTeamEvent ? 'block' : 'none';
        
        // Update team name field requirement based on team events
        const teamNameField = document.getElementById('teamName');
        if (teamNameField) {
            teamNameField.required = hasTeamEvent;
            
            // Update the label class for styling
            const teamNameLabel = document.querySelector('label[for="teamName"]');
            if (teamNameLabel) {
                if (hasTeamEvent) {
                    teamNameLabel.classList.add('required');
                } else {
                    teamNameLabel.classList.remove('required');
                }
            }
        }
    }
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input');
            
            // Update UI
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Check the radio button
            radio.checked = true;
            
            // Show/hide relevant payment details
            const paymentMethod = radio.value;
            document.getElementById('upiDetails').style.display = paymentMethod === 'upi' ? 'flex' : 'none';
            document.getElementById('cashDetails').style.display = paymentMethod === 'cash' ? 'block' : 'none';
            document.getElementById('bankDetails').style.display = paymentMethod === 'bank' ? 'block' : 'none';
            
            // Show/hide transaction ID field
            const transactionIdGroup = document.getElementById('transactionId').closest('.form-group');
            transactionIdGroup.style.display = (paymentMethod === 'upi' || paymentMethod === 'bank') ? 'block' : 'none';
        });
    });
    
    // Copy UPI ID to clipboard
    document.getElementById('copyUpiId')?.addEventListener('click', function() {
        const upiId = 'acumen2025@okaxis';
        navigator.clipboard.writeText(upiId).then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = 'Copy';
            }, 2000);
        });
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Final validation
        if (!document.getElementById('termsAgreement').checked) {
            alert('Please agree to the Terms & Conditions to proceed.');
            return;
        }
        
        // Show processing indicator
        document.getElementById('processingIndicator').classList.add('active');
        
        // Prepare the form data for Google Form
        const formData = prepareFormData();
        
        // Send to Google Form (if configured)
        submitToGoogleForm(formData).then(() => {
            // Show success message
            form.style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');
            
            // Generate and display registration ID
            const registrationId = generateRegistrationId();
            document.getElementById('registrationId').textContent = registrationId;
            
            // Hide processing indicator
            document.getElementById('processingIndicator').classList.remove('active');
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }).catch(error => {
            console.error('Form submission failed:', error);
            alert('There was a problem with your registration. Please try again later or contact us directly.');
            document.getElementById('processingIndicator').classList.remove('active');
        });
    });
    
    // Prepare form data for submission
    function prepareFormData() {
        // Collect basic user data
        const formData = new FormData();
        
        // Basic fields
        formData.append('entry.123456789', document.getElementById('firstName').value);
        formData.append('entry.987654321', document.getElementById('lastName').value);
        formData.append('entry.111222333', document.getElementById('email').value);
        formData.append('entry.444555666', document.getElementById('phone').value);
        formData.append('entry.777888999', document.getElementById('college').value);
        formData.append('entry.000111222', document.getElementById('department').value);
        formData.append('entry.333444555', document.getElementById('year').value);
        
        // Collect selected events
        const selectedEvents = [];
        document.querySelectorAll('.event-checkbox input:checked').forEach(checkbox => {
            selectedEvents.push(checkbox.value);
        });
        formData.append('entry.666777888', selectedEvents.join(', '));
        
        // Team info if applicable
        if (document.getElementById('teamInfoSection').style.display !== 'none') {
            formData.append('entry.999888777', document.getElementById('teamName').value);
            formData.append('entry.222333444', document.getElementById('teamSize').value);
            formData.append('entry.555666777', document.getElementById('teamCaptain').value);
        }
        
        // Payment info
        formData.append('entry.123321123', document.getElementById('transactionId').value || 'N/A');
        formData.append('paymentMethod', document.querySelector('input[name="paymentMethod"]:checked').value);
        
        return formData;
    }
    
    // Submit data to Google Form
    async function submitToGoogleForm(formData) {
        const googleFormUrl = form.getAttribute('data-google-form-url');
        
        if (!googleFormUrl || googleFormUrl.includes('YOUR_GOOGLE_FORM_ID')) {
            console.warn('No valid Google Form URL provided, skipping form submission');
            return Promise.resolve(); // Resolve immediately in development
        }
        
        // Return a promise that resolves when the form is submitted
        return new Promise((resolve, reject) => {
            // Create a hidden iframe for submission
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden-form-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Create a dummy form to submit the data
            const dummyForm = document.createElement('form');
            dummyForm.method = 'POST';
            dummyForm.action = googleFormUrl;
            dummyForm.target = 'hidden-form-iframe';
            
            // Append all form fields
            for (const [key, value] of formData.entries()) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                dummyForm.appendChild(input);
            }
            
            // Append form to document
            document.body.appendChild(dummyForm);
            
            // Handle iframe load event (submission complete)
            iframe.addEventListener('load', function() {
                // Remove temporary DOM elements
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    document.body.removeChild(dummyForm);
                }, 100);
                
                resolve();
            });
            
            // Handle errors
            iframe.addEventListener('error', function() {
                document.body.removeChild(iframe);
                document.body.removeChild(dummyForm);
                reject(new Error('Form submission failed'));
            });
            
            // Submit the form
            dummyForm.submit();
        });
    }
    
    // Generate a unique registration ID
    function generateRegistrationId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ACU-${timestamp}-${random}`;
    }
    
    // Calculate initial total on page load
    calculateTotalAmount();
    
    // Initialize team section visibility
    updateTeamSectionVisibility();
    
    // Add mobile-specific optimizations
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
        
        // Make inputs larger on mobile for easier interaction
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.style.fontSize = '16px'; // Prevent iOS zoom on focus
            input.style.padding = '14px 15px';
        });
        
        // Ensure proper scroll positioning on input focus
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                // Slight delay to ensure keyboard is open
                setTimeout(() => this.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
            });
        });
    }
    
    // Make validateStep function globally available for other scripts
    window.validateStep = function(stepNumber) {
        // ... existing validation logic ...
        return isValid;
    };
    
    // Fix event selection handling
    const eventCheckboxes = document.querySelectorAll('input[type="checkbox"][name="entry.666777888"]');
    if (eventCheckboxes.length > 0) {
        eventCheckboxes.forEach(checkbox => {
            // ... existing code ...
            
            // Update the team info section visibility on change
            checkbox.addEventListener('change', function() {
                updateTeamSectionVisibility();
                calculateTotalAmount();
            });
        });
    }
    
    // Update team section visibility based on event selection
    function updateTeamSectionVisibility() {
        const teamInfoSection = document.getElementById('teamInfoSection');
        if (!teamInfoSection) return;
        
        // Fix the selector to precisely target team events
        const hasTeamEvent = Array.from(
            document.querySelectorAll('input[name="entry.666777888"]:checked')
        ).some(checkbox => checkbox.getAttribute('data-team') === 'true');
            
        teamInfoSection.style.display = hasTeamEvent ? 'block' : 'none';
        
        // ... rest of the function ...
    }
    
    // Fix Google Form submission to ensure it works correctly
    async function submitToGoogleForm(formData) {
        const googleFormUrl = form.getAttribute('data-google-form-url');
        
        if (!googleFormUrl || googleFormUrl.includes('YOUR_GOOGLE_FORM_ID')) {
            console.warn('No valid Google Form URL provided, skipping form submission');
            return Promise.resolve(); // Resolve immediately in development
        }
        
        // ... rest of the submission function ...
    }
    
    // ... rest of the implementation ...
});
