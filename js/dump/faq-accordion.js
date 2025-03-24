/**
 * FAQ Accordion Functionality
 * Provides unified behavior for all FAQ sections across the site
 */

document.addEventListener('DOMContentLoaded', function() {
    initFaqAccordion();
});

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    // Find all FAQ question elements
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // If no FAQ questions found, exit
    if (!faqQuestions.length) return;
    
    // Initialize: Hide all answers initially
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.display = 'none';
    });
    
    // Add click event listeners to each question
    faqQuestions.forEach(question => {
        // Add accessibility attributes
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        // Get the corresponding answer element
        const answer = question.nextElementSibling;
        if (answer && answer.classList.contains('faq-answer')) {
            // Add unique ID to answer for accessibility
            const answerId = 'faq-answer-' + Math.random().toString(36).substring(2, 10);
            answer.id = answerId;
            
            // Link question to answer with ARIA
            question.setAttribute('aria-controls', answerId);
            
            // Add click handler
            question.addEventListener('click', function() {
                // Toggle active state
                this.classList.toggle('active');
                
                // Update aria-expanded attribute
                const isExpanded = this.classList.contains('active');
                this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                
                // Toggle answer visibility with smooth animation
                if (isExpanded) {
                    answer.style.display = 'block';
                    // Optional: Add smooth height animation
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    // Optional: Animate closing
                    answer.style.maxHeight = '0';
                    // Hide after transition
                    setTimeout(() => {
                        if (!this.classList.contains('active')) {
                            answer.style.display = 'none';
                        }
                    }, 300); // Match your CSS transition duration
                }
            });
        }
    });
    
    // Check URL hash for deep linking to specific FAQ item
    if (window.location.hash && window.location.hash.includes('faq-')) {
        const targetQuestion = document.querySelector(window.location.hash);
        if (targetQuestion && targetQuestion.classList.contains('faq-question')) {
            // Open the targeted question
            setTimeout(() => targetQuestion.click(), 100);
            // Scroll to it
            setTimeout(() => targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
        }
    }
}
