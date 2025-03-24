/**
 * Scroll Animations
 * Adds performant scroll-based animations to enhance the user experience
 */

const ScrollAnimations = (function() {
    // Track animation elements
    let animationElements = [];
    
    // Options
    const options = {
        threshold: 0.15,  // Percentage of element visible to trigger animation
        once: true,       // Only animate once
    };
    
    // Initialize animations
    function init() {
        console.log('🎬 Initializing scroll animations');
        
        // Gather all elements to animate
        collectAnimatableElements();
        
        // Set up intersection observer
        setupObserver();
        
        // Add scroll-triggered classes
        addScrollClasses();
        
        // Add viewport-aware animations
        addViewportAwareAnimations();
        
        // Handle initial state
        handleInitialState();
    }
    
    /**
     * Collect all elements that should be animated
     */
    function collectAnimatableElements() {
        // Elements with fade-in class
        const fadeElements = document.querySelectorAll('.fade-in');
        
        // Elements with stagger-children class
        const staggerContainers = document.querySelectorAll('.stagger-children');
        
        // Section titles
        const sectionTitles = document.querySelectorAll('.section-title');
        
        // Add elements to collection
        animationElements = [
            ...Array.from(fadeElements), 
            ...Array.from(staggerContainers),
            ...Array.from(sectionTitles)
        ];
    }
    
    /**
     * Set up intersection observer for animations
     */
    function setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If element is in view
                if (entry.isIntersecting) {
                    // Add visible class
                    entry.target.classList.add('visible', 'in-viewport');
                    
                    // Unobserve if we only want to animate once
                    if (options.once) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    // Remove in-viewport class when out of view
                    entry.target.classList.remove('in-viewport');
                    
                    // Only remove visible class if not set to animate once
                    if (!options.once) {
                        entry.target.classList.remove('visible');
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: options.threshold
        });
        
        // Observe all animation elements
        animationElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * Add scroll-triggered classes for parallax effects
     */
    function addScrollClasses() {
        window.addEventListener('scroll', debounce(() => {
            // Add scroll-active class based on scroll position
            const scrollPosition = window.scrollY;
            
            // Add class to body if scrolled past hero
            if (scrollPosition > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
            
            // Add class to navbar
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (scrollPosition > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }, 10));
    }
    
    /**
     * Add animation states based on viewport position
     */
    function addViewportAwareAnimations() {
        // Find all elements with glitch-text class
        const glitchTexts = document.querySelectorAll('.glitch-text');
        
        // Set up observer for glitch elements
        const glitchObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Enable animations when in view
                    entry.target.classList.add('in-viewport');
                } else {
                    // Disable animations when out of view
                    entry.target.classList.remove('in-viewport');
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        });
        
        // Observe all glitch text elements
        glitchTexts.forEach(el => {
            glitchObserver.observe(el);
        });
    }
    
    /**
     * Handle initial animation state
     */
    function handleInitialState() {
        // Check if elements are already in view on page load
        setTimeout(() => {
            animationElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // If element is in the viewport
                if (rect.top <= windowHeight * (1 - options.threshold)) {
                    el.classList.add('visible');
                    if (options.once) {
                        // Don't need to observe this element anymore
                        el.setAttribute('data-animated', 'true');
                    }
                }
            });
        }, 100);
    }
    
    /**
     * Simple debounce function
     */
    function debounce(func, wait = 20) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Return public API
    return {
        init,
        animateElement: (element) => {
            element.classList.add('visible');
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ScrollAnimations.init();
});
