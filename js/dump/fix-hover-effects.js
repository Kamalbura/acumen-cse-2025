/**
 * Hover Effects Fixer
 * Optimizes hover effects to prevent flickering and scroll interruptions
 */

(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Detect touch devices - they don't need hover effects
        const isTouchDevice = 'ontouchstart' in window || 
                              navigator.maxTouchPoints > 0 ||
                              navigator.msMaxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
            disableHoverEffects();
            return;
        }
        
        // Fix problematic hover effects
        fixCardHoverEffects();
        fixButtonHoverEffects();
        disableGlitchOnScroll();
    });
    
    /**
     * Completely disable hover effects for touch devices
     */
    function disableHoverEffects() {
        // Add a style to disable all hover effects
        const style = document.createElement('style');
        style.textContent = `
            .touch-device .glitch-text:hover,
            .touch-device .event-card:hover,
            .touch-device .team-card:hover,
            .touch-device .cyber-card:hover,
            .touch-device .btn:hover,
            .touch-device a:hover,
            .touch-device [class*="hover-"]:hover {
                transform: none !important;
                animation: none !important;
            }
            
            .touch-device .cyber-card::before,
            .touch-device .cyber-card::after,
            .touch-device .btn-neon::before,
            .touch-device .btn-cyber::before,
            .touch-device .hover-glitch::before,
            .touch-device .hover-glitch::after {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Fix card hover effects that might cause flickering
     */
    function fixCardHoverEffects() {
        const cards = document.querySelectorAll('.event-card, .team-card, .cyber-card');
        
        cards.forEach(card => {
            // Remove any existing mousemove listeners that might cause jank
            card.removeEventListener('mousemove', cardMouseMoveHandler);
            
            // Add simpler hover effect
            card.addEventListener('mouseenter', simpleCardHoverEnter);
            card.addEventListener('mouseleave', simpleCardHoverLeave);
            
            // Add style-only hover effect as a backup
            card.classList.add('simple-hover');
        });
    }
    
    /**
     * Simple card hover enter handler - just lift slightly
     */
    function simpleCardHoverEnter(e) {
        // Only lift card if not currently scrolling
        if (!document.documentElement.classList.contains('is-scrolling')) {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 243, 255, 0.2)';
        }
    }
    
    /**
     * Simple card hover leave handler - reset
     */
    function simpleCardHoverLeave(e) {
        this.style.transform = '';
        this.style.boxShadow = '';
    }
    
    /**
     * Card mousemove handler - stub function to avoid errors
     */
    function cardMouseMoveHandler() {
        // This is a stub to replace any existing handlers
        return false;
    }
    
    /**
     * Fix button hover effects
     */
    function fixButtonHoverEffects() {
        document.querySelectorAll('.btn-neon, .btn-cyber, .btn-magnetic').forEach(btn => {
            // Replace any magnetic effect with simpler hover
            btn.classList.remove('btn-magnetic');
            btn.classList.add('btn-simple-hover');
            
            // Remove any mousemove handlers
            btn.removeEventListener('mousemove', function(){});
        });
    }
    
    /**
     * Disable glitch effects during scroll
     */
    function disableGlitchOnScroll() {
        // Add a scroll event detector to pause glitch effects
        let scrollTimer;
        window.addEventListener('scroll', function() {
            // Add a class to temporarily disable glitch effects
            document.body.classList.add('disable-glitch');
            
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                // After scrolling stops, re-enable glitch effects
                document.body.classList.remove('disable-glitch');
            }, 300);
        }, { passive: true });
    }
})();
