/**
 * Enhanced Performance Optimizations
 * Fixes hover effects, animation performance, and scrolling issues
 */

(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Fix hover effects
        optimizeHoverEffects();
        
        // Fix scroll performance
        optimizeScrollPerformance();
        
        // Fix animation performance
        optimizeAnimationPerformance();
        
        // Fix cursor effects
        disableCustomCursor();
        
        // Fix for specific elements
        optimizeSpecificElements();
    });
    
    /**
     * Optimize hover effects to prevent flickering
     */
    function optimizeHoverEffects() {
        // Get all elements with hover effects
        const hoverElements = document.querySelectorAll('.event-card, .btn, .cyber-card, .team-member-card');
        
        hoverElements.forEach(element => {
            // Remove any intensive hover effects
            element.addEventListener('mouseenter', function() {
                this.classList.add('optimized-hover');
            });
            
            element.addEventListener('mouseleave', function() {
                this.classList.remove('optimized-hover');
            });
            
            // Remove transform effects that might cause flickering
            const originalTransform = window.getComputedStyle(element).transform;
            
            if (originalTransform && originalTransform !== 'none') {
                element.style.transform = 'translateZ(0)';
            }
        });
        
        // Add style to optimize hover effects
        const style = document.createElement('style');
        style.textContent = `
            .optimized-hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 5px 15px rgba(0, 243, 255, 0.2) !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Optimize scroll performance
     */
    function optimizeScrollPerformance() {
        // Variables to track scroll state
        let isScrolling = false;
        let scrollTimeout;
        
        // Add scroll class when scrolling
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                document.documentElement.classList.add('is-scrolling');
                isScrolling = true;
            }
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout
            scrollTimeout = setTimeout(function() {
                document.documentElement.classList.remove('is-scrolling');
                isScrolling = false;
            }, 100);
        }, { passive: true });
        
        // Add style to disable animations during scroll
        const style = document.createElement('style');
        style.textContent = `
            .is-scrolling .glitch-text::before,
            .is-scrolling .glitch-text::after,
            .is-scrolling .btn::before,
            .is-scrolling .cyber-card::before,
            .is-scrolling .event-card::before,
            .is-scrolling [class*="hover-"]::before,
            .is-scrolling .cursor-dot,
            .is-scrolling .cursor-outline,
            .is-scrolling .digital-noise::before,
            .is-scrolling .hologram::before,
            .is-scrolling .matrix-bg::before,
            .is-scrolling .glitch-overlay {
                animation-play-state: paused !important;
                transition: none !important;
                will-change: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Optimize animation performance
     */
    function optimizeAnimationPerformance() {
        // Reduce number of animated elements
        const animatedElements = document.querySelectorAll('.glitch-text, .matrix-bg, .digital-noise');
        
        // Only animate visible elements
        function checkVisibility() {
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.bottom >= 0
                );
                
                if (isVisible) {
                    element.classList.add('animate');
                } else {
                    element.classList.remove('animate');
                }
            });
        }
        
        // Check initial visibility
        checkVisibility();
        
        // Check visibility on scroll
        window.addEventListener('scroll', checkVisibility, { passive: true });
        
        // Add style to only animate visible elements
        const style = document.createElement('style');
        style.textContent = `
            .glitch-text:not(.animate)::before,
            .glitch-text:not(.animate)::after,
            .matrix-bg:not(.animate)::before,
            .digital-noise:not(.animate)::before {
                animation-play-state: paused !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Disable custom cursor to improve performance
     */
    function disableCustomCursor() {
        // Remove cursor classes
        document.body.classList.remove('custom-cursor-active');
        
        // Add style to ensure normal cursor behavior
        const style = document.createElement('style');
        style.textContent = `
            body, a, button, .btn {
                cursor: auto !important;
            }
            
            a, button, .btn, .event-card {
                cursor: pointer !important;
            }
            
            .cursor-dot, .cursor-outline {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Optimize specific elements on the homepage and events page
     */
    function optimizeSpecificElements() {
        // Fix homepage hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.willChange = 'transform';
            heroSection.style.transform = 'translateZ(0)';
        }
        
        // Fix events grid
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
            const eventCards = eventsGrid.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                // Remove complex animations that cause flicker
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                // Fix event card image aspect ratio
                const img = card.querySelector('img');
                if (img) {
                    img.style.aspectRatio = '16/9';
                    img.style.objectFit = 'cover';
                }
                
                // Fix content layout
                const content = card.querySelector('.event-card-content');
                if (content) {
                    content.style.display = 'flex';
                    content.style.flexDirection = 'column';
                    content.style.flexGrow = '1';
                }
                
                // Fix link position
                const link = card.querySelector('.event-details-link');
                if (link) {
                    link.style.marginTop = 'auto';
                }
            });
        }
    }
})();
