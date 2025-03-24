/**
 * Enhanced Registration Form Interactions
 * Improves visual feedback and animations
 */
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced form progress tracking
    const formProgress = document.querySelector('.form-progress');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const formSteps = document.querySelectorAll('.form-step');
    
    // Initialize progress based on current step
    function updateProgressBar() {
        let currentStep = 1;
        formSteps.forEach(step => {
            if (step.classList.contains('active')) {
                currentStep = parseInt(step.getAttribute('data-step'));
            }
        });
        
        if (formProgress) {
            formProgress.setAttribute('data-current-step', currentStep);
        }
    }
    
    // Call initially and on step change
    updateProgressBar();
    
    // Add blinking cursor to form sections
    const formSectionHeaders = document.querySelectorAll('.form-section-header h3');
    formSectionHeaders.forEach(header => {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.innerHTML = '&nbsp;';
        header.appendChild(cursor);
    });
    
    // Add typing effect to section headers when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('typing-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    formSectionHeaders.forEach(header => observer.observe(header));
    
    // Add hover effects to event cards
    const eventCards = document.querySelectorAll('.event-checkbox-card');
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 255, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!card.classList.contains('selected')) {
                card.style.transform = '';
                card.style.boxShadow = '';
            } else {
                card.style.transform = 'translateY(-3px)';
            }
        });
    });
    
    // Add data visualization for order summary
    function enhanceOrderSummary() {
        const summaryItems = document.querySelectorAll('.summary-item');
        
        summaryItems.forEach((item, index) => {
            const pricePart = item.querySelector('.summary-item-price');
            if (pricePart && pricePart.textContent.includes('₹')) {
                const priceValue = parseInt(pricePart.textContent.replace('₹', ''));
                
                // Create a small bar visualization
                const barContainer = document.createElement('div');
                barContainer.className = 'price-visualization';
                barContainer.style.width = '100%';
                barContainer.style.height = '3px';
                barContainer.style.background = 'rgba(255,255,255,0.1)';
                barContainer.style.marginTop = '5px';
                barContainer.style.position = 'relative';
                
                const bar = document.createElement('div');
                bar.style.position = 'absolute';
                bar.style.top = '0';
                bar.style.left = '0';
                bar.style.height = '100%';
                bar.style.width = '0';
                bar.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))';
                bar.style.transition = 'width 1s ease';
                
                barContainer.appendChild(bar);
                item.appendChild(barContainer);
                
                // Animate the bar width based on price
                setTimeout(() => {
                    // Get max price for scaling
                    let maxPrice = 0;
                    document.querySelectorAll('.summary-item-price').forEach(el => {
                        if (el.textContent.includes('₹')) {
                            const val = parseInt(el.textContent.replace('₹', ''));
                            if (val > maxPrice) maxPrice = val;
                        }
                    });
                    
                    const widthPercent = Math.max((priceValue / maxPrice) * 100, 10); // At least 10% width
                    bar.style.width = widthPercent + '%';
                }, 100 + (index * 100)); // Staggered animation
            }
        });
        
        // Enhance total amount with pulsing effect
        const totalAmount = document.querySelector('.summary-total-price');
        if (totalAmount) {
            totalAmount.style.animation = 'pulseBrighter 2s infinite alternate';
            
            // Add keyframes if they don't exist
            if (!document.querySelector('#pulse-keyframes')) {
                const style = document.createElement('style');
                style.id = 'pulse-keyframes';
                style.textContent = `
                    @keyframes pulseBrighter {
                        from { text-shadow: 0 0 5px rgba(0, 255, 255, 0.7); }
                        to { text-shadow: 0 0 15px rgba(0, 255, 255, 0.9), 0 0 5px rgba(255, 0, 255, 0.5); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // Update order summary visualization whenever it changes
    const mutationObserver = new MutationObserver(enhanceOrderSummary);
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    
    if (orderSummaryItems) {
        mutationObserver.observe(orderSummaryItems, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // Run initial visualization for summary
    enhanceOrderSummary();
    
    // Fix step transition animation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const overlay = document.querySelector('.step-transition-overlay');
    
    function animateTransition() {
        if (!overlay) return;
        
        overlay.classList.add('active');
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 600);
    }
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').getAttribute('data-step'));
            // Only animate if validation passes (we'll check before showing animation)
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Animate transition only if we're actually going to change steps
            if (currentStep !== nextStep && validateCurrentStep(this)) {
                animateTransition();
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', animateTransition);
    });
    
    function validateCurrentStep(button) {
        const currentStep = parseInt(button.closest('.form-step').getAttribute('data-step'));
        
        // This is just a placeholder - the actual validation is in form-validation.js
        // We're just checking if that validation would pass
        const validateStep = window.validateStep || function() { return true; };
        return validateStep(currentStep);
    }
});
