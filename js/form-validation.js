/**
 * Form Validation Script for ACUMEN 2025 Registration
 * Handles all validation and error handling for the registration form
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    console.log('Initializing form validation for registration form');

    // Input validation rules
    const validationRules = {
        firstName: {
            required: true,
            pattern: /^[A-Za-z\s]{2,}$/,
            message: 'Please enter a valid first name (minimum 2 letters)'
        },
        lastName: {
            required: true,
            pattern: /^[A-Za-z\s]{2,}$/,
            message: 'Please enter a valid last name (minimum 2 letters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit phone number'
        },
        college: {
            required: true,
            minLength: 3,
            message: 'Please enter your college/university name (min 3 characters)'
        },
        department: {
            required: true,
            message: 'Please select your department'
        },
        year: {
            required: true,
            message: 'Please select your year of study'
        },
        teamName: {
            conditionalRequired: true,
            minLength: 3,
            message: 'Please enter a team name (min 3 characters)'
        },
        transactionId: {
            conditionalRequired: true,
            minLength: 6,
            message: 'Transaction ID is required for UPI/Bank transfers'
        }
    };
    
    // Validate a single field
    function validateField(fieldId, rules) {
        const field = document.getElementById(fieldId);
        if (!field) return true;
        
        const errorElement = document.getElementById(fieldId + 'Error');
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
        
        // Check if conditionally required
        if (rules.conditionalRequired) {
            if (fieldId === 'teamName') {
                // Use more reliable selector for team events
                const teamEventSelected = Array.from(
                    document.querySelectorAll('input[type="checkbox"][data-team="true"]:checked')
                ).length > 0;
                
                if (teamEventSelected && !field.value.trim()) {
                    isValid = false;
                    errorMessage = rules.message;
                }
            } else if (fieldId === 'transactionId') {
                // Check if UPI or bank transfer is selected
                const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
                if ((paymentMethod === 'upi' || paymentMethod === 'bank') && !field.value.trim()) {
                    isValid = false;
                    errorMessage = rules.message;
                }
            }
        } 
        // Standard validation checks
        else if (rules.required && !field.value.trim()) {
            isValid = false;
            errorMessage = rules.message;
        } else if (rules.pattern && !rules.pattern.test(field.value.trim())) {
            isValid = false;
            errorMessage = rules.message;
        } else if (rules.minLength && field.value.trim().length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message;
        }
        
        // Display error if invalid
        if (!isValid && errorElement) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
        
        return isValid;
    }
    
    // Validate all fields in a step
    function validateStep(stepNumber) {
        let isValid = true;
        
        switch(stepNumber) {
            case 1:
                // Validate personal information
                for (const fieldId of ['firstName', 'lastName', 'email', 'phone', 'college', 'department', 'year']) {
                    if (!validateField(fieldId, validationRules[fieldId])) {
                        isValid = false;
                    }
                }
                break;
                
            case 2:
                // Validate event selection
                const selectedEvents = document.querySelectorAll('input[name="entry.666777888"]:checked');
                const eventsError = document.getElementById('eventsError');
                
                if (selectedEvents.length === 0) {
                    isValid = false;
                    eventsError.classList.add('show');
                } else {
                    eventsError.classList.remove('show');
                }
                
                // Validate team name if team events selected
                if (!validateField('teamName', validationRules.teamName)) {
                    isValid = false;
                }
                break;
                
            case 3:
                // Validate payment information
                if (!validateField('transactionId', validationRules.transactionId)) {
                    isValid = false;
                }
                break;
                
            case 4:
                // Validate terms agreement
                const termsAgreement = document.getElementById('termsAgreement');
                const termsError = document.getElementById('termsError');
                
                if (!termsAgreement.checked) {
                    isValid = false;
                    termsError.classList.add('show');
                } else {
                    termsError.classList.remove('show');
                }
                break;
        }
        
        return isValid;
    }
    
    // Add validation to form steps
    const nextButtons = document.querySelectorAll('.next-step');
    if (nextButtons.length) {
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = parseInt(this.closest('.form-step').getAttribute('data-step'));
                if (!validateStep(currentStep)) {
                    // Prevent going to next step if validation fails
                    return false;
                }
                // Otherwise, the step change will continue normally
            });
        });
    }
    
    // Add form submission validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate the current step (which should be the final step)
        if (!validateStep(4)) {
            return false;
        }
        
        // Show processing indicator
        document.getElementById('processingIndicator').classList.add('active');
        
        // Here you would normally submit the form via AJAX
        // For this example, we'll simulate a successful submission
        setTimeout(function() {
            // Hide processing indicator
            document.getElementById('processingIndicator').classList.remove('active');
            
            // Show success message
            form.style.display = 'none';
            
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');
            
            // Generate a random registration ID
            const registrationId = 'ACU-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            document.getElementById('registrationId').textContent = registrationId;
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
    
    // Initialize field validations on input
    Object.keys(validationRules).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldId, validationRules[fieldId]);
            });
        }
    });
});
