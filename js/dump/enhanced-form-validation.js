/**
 * Enhanced Form Validation
 * Provides improved form validation with better UX and error handling
 */

const FormValidator = (function() {
    // Store forms that have been initialized
    const initializedForms = new Set();
    
    // Default validation messages
    const defaultMessages = {
        required: "This field is required",
        email: "Please enter a valid email address",
        phone: "Please enter a valid phone number",
        minLength: "This field must be at least {min} characters",
        maxLength: "This field cannot exceed {max} characters",
        pattern: "Please enter a valid format",
        match: "Fields do not match",
        number: "Please enter a valid number",
        file: "Please select a valid file"
    };
    
    /**
     * Initialize validation on a form
     */
    function initForm(formSelector, options = {}) {
        const form = document.querySelector(formSelector);
        if (!form || initializedForms.has(form)) return;
        
        console.log(`🔍 Initializing form validation for ${formSelector}`);
        
        // Mark as initialized
        initializedForms.add(form);
        
        // Merge options with defaults
        const settings = Object.assign({
            validateOnInput: true,
            showSuccessState: true,
            scrollToError: true,
            errorClass: 'cyber-input-error',
            successClass: 'cyber-input-success',
            errorTextClass: 'error-message',
            submitHandler: null,
            messages: {}
        }, options);
        
        // Store settings on form element
        form._validationSettings = settings;
        
        // Merge custom messages with defaults
        const messages = Object.assign({}, defaultMessages, settings.messages);
        
        // Add submit handler
        form.addEventListener('submit', function(e) {
            const isValid = validateForm(form);
            
            // If validation fails, prevent submission
            if (!isValid) {
                e.preventDefault();
                
                // Scroll to first error
                if (settings.scrollToError) {
                    const firstError = form.querySelector('.' + settings.errorClass);
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstError.focus();
                    }
                }
                
                return false;
            }
            
            // If validation passes and we have a custom handler
            if (settings.submitHandler && typeof settings.submitHandler === 'function') {
                e.preventDefault();
                settings.submitHandler(form);
                return false;
            }
        });
        
        // Add input validation if enabled
        if (settings.validateOnInput) {
            form.querySelectorAll('input, textarea, select').forEach(input => {
                ['input', 'blur', 'change'].forEach(event => {
                    input.addEventListener(event, function() {
                        validateInput(input, messages);
                    });
                });
            });
        }
        
        // Setup special validations
        setupPasswordStrengthMeter(form);
        setupFileValidation(form);
        
        return {
            validate: () => validateForm(form),
            reset: () => resetForm(form),
            getValues: () => getFormValues(form)
        };
    }
    
    /**
     * Validate an entire form
     */
    function validateForm(form) {
        const settings = form._validationSettings || {};
        const messages = Object.assign({}, defaultMessages, settings.messages || {});
        let isValid = true;
        
        // Validate each input
        form.querySelectorAll('input, textarea, select').forEach(input => {
            // Skip disabled elements
            if (input.disabled) return;
            
            const inputValid = validateInput(input, messages);
            if (!inputValid) {
                isValid = false;
            }
        });
        
        // Check for custom validation rules defined by data-custom-validate
        form.querySelectorAll('[data-custom-validate]').forEach(field => {
            const ruleName = field.getAttribute('data-custom-validate');
            if (customValidators[ruleName]) {
                const result = customValidators[ruleName](field, form);
                if (!result.valid) {
                    showError(field, result.message);
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate a single input field
     */
    function validateInput(input, messages) {
        // Get form's settings or use defaults
        const form = input.closest('form');
        const settings = form && form._validationSettings || {};
        const errorClass = settings.errorClass || 'cyber-input-error';
        const successClass = settings.successClass || 'cyber-input-success';
        
        // Skip validation if the field has no name or is disabled
        if (!input.name || input.disabled) return true;
        
        // Skip fields not to be validated
        if (input.classList.contains('no-validate')) return true;
        
        // Get field value appropriately
        let value = input.value;
        if (input.type === 'checkbox') {
            value = input.checked;
        } else if (input.type === 'radio') {
            const checked = form.querySelector(`input[name="${input.name}"]:checked`);
            value = checked ? checked.value : '';
        } else if (input.type === 'file') {
            value = input.files;
        }
        
        // Get validation rules
        const isRequired = input.required;
        const minLength = input.getAttribute('minlength');
        const maxLength = input.getAttribute('maxlength');
        const pattern = input.getAttribute('pattern');
        const equalTo = input.getAttribute('data-equal-to');
        const inputType = input.type;
        
        // Clear previous states
        clearInputState(input);
        
        // Required validation
        if (isRequired && (value === '' || value === false || (Array.isArray(value) && value.length === 0))) {
            showError(input, messages.required);
            return false;
        }
        
        // Skip other validations for empty optional fields
        if (value === '') return true;
        
        // Type validations
        if (inputType === 'email' && !validateEmail(value)) {
            showError(input, messages.email);
            return false;
        }
        
        if (inputType === 'tel' && !validatePhone(value)) {
            showError(input, messages.phone);
            return false;
        }
        
        if (inputType === 'number' && isNaN(value)) {
            showError(input, messages.number);
            return false;
        }
        
        // Min length validation
        if (minLength && value.length < parseInt(minLength)) {
            showError(input, messages.minLength.replace('{min}', minLength));
            return false;
        }
        
        // Max length validation
        if (maxLength && value.length > parseInt(maxLength)) {
            showError(input, messages.maxLength.replace('{max}', maxLength));
            return false;
        }
        
        // Pattern validation
        if (pattern && !new RegExp(pattern).test(value)) {
            showError(input, input.getAttribute('data-pattern-message') || messages.pattern);
            return false;
        }
        
        // Equal to validation
        if (equalTo) {
            const matchInput = document.getElementById(equalTo);
            if (matchInput && value !== matchInput.value) {
                showError(input, messages.match);
                return false;
            }
        }
        
        // File validations
        if (inputType === 'file' && value.length > 0) {
            const maxSize = input.getAttribute('data-max-size');
            const fileTypes = input.getAttribute('data-file-types');
            
            if (maxSize) {
                const maxSizeBytes = parseInt(maxSize) * 1024 * 1024; // Convert MB to bytes
                for (let i = 0; i < value.length; i++) {
                    if (value[i].size > maxSizeBytes) {
                        showError(input, `File size cannot exceed ${maxSize}MB`);
                        return false;
                    }
                }
            }
            
            if (fileTypes) {
                const allowedTypes = fileTypes.split(',').map(t => t.trim());
                for (let i = 0; i < value.length; i++) {
                    const fileExt = value[i].name.split('.').pop().toLowerCase();
                    if (!allowedTypes.includes(fileExt)) {
                        showError(input, `Only ${fileTypes} files are allowed`);
                        return false;
                    }
                }
            }
        }
        
        // Custom HTML5 validation
        if (input.validity && !input.validity.valid) {
            showError(input, input.validationMessage);
            return false;
        }
        
        // Show success state if enabled
        if (settings.showSuccessState) {
            input.classList.add(successClass);
            
            // Add check mark icon
            if (!input.nextElementSibling?.classList.contains('success-icon')) {
                const icon = document.createElement('span');
                icon.className = 'success-icon';
                icon.innerHTML = '✓';
                icon.style.cssText = 'color: #4CAF50; position: absolute; right: 10px; top: 50%; transform: translateY(-50%);';
                input.parentNode.style.position = 'relative';
                input.parentNode.appendChild(icon);
            }
        }
        
        return true;
    }
    
    /**
     * Show error message for an input
     */
    function showError(input, message) {
        // Get form's settings or use defaults
        const form = input.closest('form');
        const settings = form && form._validationSettings || {};
        const errorClass = settings.errorClass || 'cyber-input-error';
        const errorTextClass = settings.errorTextClass || 'error-message';
        
        // Add error class
        input.classList.add(errorClass);
        
        // Create error message element if not exists
        let errorEl = input.parentNode.querySelector('.' + errorTextClass);
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = errorTextClass;
            errorEl.style.cssText = 'color: #FF5252; font-size: 0.8rem; margin-top: 5px;';
            
            // Insert after the input
            input.parentNode.insertBefore(errorEl, input.nextSibling);
        }
        
        // Set error message
        errorEl.textContent = message;
        
        // Make input accessible
        input.setAttribute('aria-invalid', 'true');
        const errorId = input.id + '-error';
        errorEl.id = errorId;
        input.setAttribute('aria-describedby', errorId);
    }
    
    /**
     * Clear validation state for an input
     */
    function clearInputState(input) {
        // Get form's settings or use defaults
        const form = input.closest('form');
        const settings = form && form._validationSettings || {};
        const errorClass = settings.errorClass || 'cyber-input-error';
        const successClass = settings.successClass || 'cyber-input-success';
        const errorTextClass = settings.errorTextClass || 'error-message';
        
        // Remove classes
        input.classList.remove(errorClass, successClass);
        
        // Remove error message
        const errorEl = input.parentNode.querySelector('.' + errorTextClass);
        if (errorEl) {
            errorEl.parentNode.removeChild(errorEl);
        }
        
        // Remove success icon
        const successIcon = input.parentNode.querySelector('.success-icon');
        if (successIcon) {
            successIcon.parentNode.removeChild(successIcon);
        }
        
        // Reset ARIA attributes
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    }
    
    /**
     * Reset form validation state
     */
    function resetForm(form) {
        form.querySelectorAll('input, textarea, select').forEach(input => {
            clearInputState(input);
        });
        form.reset();
    }
    
    /**
     * Get form values as an object
     */
    function getFormValues(form) {
        const values = {};
        const formData = new FormData(form);
        
        formData.forEach((value, key) => {
            // Handle arrays (multiple values with same name)
            if (values[key]) {
                if (!Array.isArray(values[key])) {
                    values[key] = [values[key]];
                }
                values[key].push(value);
            } else {
                values[key] = value;
            }
        });
        
        return values;
    }
    
    /**
     * Setup password strength meter
     */
    function setupPasswordStrengthMeter(form) {
        const passwordInputs = form.querySelectorAll('input[type="password"][data-password-strength]');
        
        passwordInputs.forEach(input => {
            // Create meter container if not exists
            let meterContainer = input.parentNode.querySelector('.password-strength-meter');
            if (!meterContainer) {
                meterContainer = document.createElement('div');
                meterContainer.className = 'password-strength-meter';
                meterContainer.style.cssText = 'width: 100%; height: 5px; background-color: #ddd; margin-top: 5px;';
                
                // Create meter bar
                const meterBar = document.createElement('div');
                meterBar.className = 'meter-bar';
                meterBar.style.cssText = 'height: 100%; width: 0; transition: width 0.3s, background-color 0.3s;';
                meterContainer.appendChild(meterBar);
                
                // Create strength text
                const strengthText = document.createElement('div');
                strengthText.className = 'strength-text';
                strengthText.style.cssText = 'font-size: 0.8rem; margin-top: 5px;';
                meterContainer.appendChild(strengthText);
                
                // Insert after the input
                input.parentNode.insertBefore(meterContainer, input.nextSibling);
            }
            
            // Update meter on input
            input.addEventListener('input', function() {
                updatePasswordStrength(input);
            });
        });
    }
    
    /**
     * Update password strength meter
     */
    function updatePasswordStrength(input) {
        const password = input.value;
        const meterBar = input.parentNode.querySelector('.meter-bar');
        const strengthText = input.parentNode.querySelector('.strength-text');
        
        if (!meterBar || !strengthText) return;
        
        // Calculate strength score (0-100)
        let score = 0;
        
        // Length score (max 25)
        score += Math.min(password.length * 2, 25);
        
        // Complexity score
        if (/[A-Z]/.test(password)) score += 10; // uppercase
        if (/[a-z]/.test(password)) score += 10; // lowercase
        if (/[0-9]/.test(password)) score += 10; // numbers
        if (/[^A-Za-z0-9]/.test(password)) score += 15; // special chars
        
        // Variety score
        const uniqueChars = new Set(password.split('')).size;
        score += Math.min(uniqueChars * 2, 30);
        
        // Update meter
        meterBar.style.width = score + '%';
        
        // Set color and text based on score
        let color, text;
        if (score < 30) {
            color = '#FF5252';
            text = 'Weak';
        } else if (score < 60) {
            color = '#FFD740';
            text = 'Moderate';
        } else if (score < 80) {
            color = '#29B6F6';
            text = 'Strong';
        } else {
            color = '#66BB6A';
            text = 'Very Strong';
        }
        
        meterBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
        
        // Store score in data attribute
        input.setAttribute('data-strength-score', score);
    }
    
    /**
     * Setup file validation with preview
     */
    function setupFileValidation(form) {
        const fileInputs = form.querySelectorAll('input[type="file"][data-show-preview]');
        
        fileInputs.forEach(input => {
            // Create preview container if not exists
            let previewContainer = input.parentNode.querySelector('.file-preview');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.className = 'file-preview';
                previewContainer.style.cssText = 'margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;';
                
                // Insert after the input
                input.parentNode.insertBefore(previewContainer, input.nextSibling);
            }
            
            // Update preview on file selection
            input.addEventListener('change', function() {
                updateFilePreview(input);
            });
        });
    }
    
    /**
     * Update file preview
     */
    function updateFilePreview(input) {
        const previewContainer = input.parentNode.querySelector('.file-preview');
        if (!previewContainer) return;
        
        // Clear previous previews
        previewContainer.innerHTML = '';
        
        // Check if files are selected
        if (!input.files || input.files.length === 0) return;
        
        // Create previews for each file
        Array.from(input.files).forEach(file => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.style.cssText = 'position: relative; width: 100px; height: 100px;';
            
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                img.file = file;
                previewItem.appendChild(img);
                
                // Create file reader to load preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                // For non-image files, show icon
                const icon = document.createElement('div');
                icon.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f1f1f1; border-radius: 5px;';
                
                // Set icon based on file type
                let iconText = '📄';
                if (file.type.includes('pdf')) iconText = '📕';
                else if (file.type.includes('word')) iconText = '📝';
                else if (file.type.includes('excel')) iconText = '📊';
                else if (file.type.includes('video')) iconText = '🎬';
                else if (file.type.includes('audio')) iconText = '🎵';
                
                icon.textContent = iconText;
                icon.title = file.name;
                previewItem.appendChild(icon);
            }
            
            // Add file name
            const fileName = document.createElement('div');
            fileName.style.cssText = 'font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;';
            fileName.textContent = file.name;
            previewItem.appendChild(fileName);
            
            // Add to preview container
            previewContainer.appendChild(previewItem);
        });
    }
    
    /**
     * Email validation helper
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Phone validation helper
     */
    function validatePhone(phone) {
        // Basic phone validation (allows various formats)
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return re.test(String(phone).trim());
    }
    
    // Custom validators that can be extended
    const customValidators = {
        // Example: Check if user is at least 18 years old
        minimumAge: function(field, form) {
            const dob = new Date(field.value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            return {
                valid: age >= 18,
                message: "You must be at least 18 years old"
            };
        },
        
        // Add more custom validators as needed
    };
    
    // Public API
    return {
        init: initForm,
        validate: validateForm,
        getValues: getFormValues,
        addCustomValidator: function(name, fn) {
            customValidators[name] = fn;
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all forms with data-validate attribute
    document.querySelectorAll('form[data-validate]').forEach(form => {
        FormValidator.init('#' + form.id);
    });
    
    // Initialize registration form with custom options
    if (document.getElementById('registration-form')) {
        FormValidator.init('#registration-form', {
            validateOnInput: true,
            showSuccessState: true,
            submitHandler: function(form) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Processing... <span class="spinner"></span>';
                
                // Simulate AJAX submission (replace with actual AJAX)
                setTimeout(() => {
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = '<div class="success-icon">✓</div> Registration successful! Check your email for confirmation.';
                    successMessage.style.cssText = 'background-color: rgba(0, 243, 255, 0.1); border-left: 4px solid #00f3ff; padding: 15px; margin: 20px 0; display: flex; align-items: center;';
                    
                    // Add success icon styling
                    const successIcon = successMessage.querySelector('.success-icon');
                    successIcon.style.cssText = 'background-color: #00f3ff; color: #090918; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;';
                    
                    // Insert before the form
                    form.parentNode.insertBefore(successMessage, form);
                    
                    // Reset form
                    form.reset();
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 1500);
            }
        });
    }
    
    // Initialize contact form
    if (document.getElementById('contact-form')) {
        FormValidator.init('#contact-form', {
            // Custom configuration here
        });
    }
});
