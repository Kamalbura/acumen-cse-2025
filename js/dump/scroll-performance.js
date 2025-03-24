/**
 * Scroll Performance Manager
 * Improves scrolling performance by pausing animations during scroll
 */

(function() {
    let scrollTimeout;
    let isScrolling = false;
    const html = document.documentElement;
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            html.classList.add('is-scrolling');
            
            // Pause heavy animations during scroll
            pauseHeavyAnimations();
            
            // Disable hover effects during scroll
            html.classList.add('disable-hover');
        }
        
        // Clear the timeout if it's been set
        clearTimeout(scrollTimeout);
        
        // Set a timeout to run after scrolling ends
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            html.classList.remove('is-scrolling');
            html.classList.remove('disable-hover');
            
            // Resume animations after scroll
            resumeHeavyAnimations();
        }, 200);
    }, { passive: true });
    
    /**
     * Pause animations that affect performance
     */
    function pauseHeavyAnimations() {
        // Pause particle animations
        document.querySelectorAll('.particle-canvas').forEach(canvas => {
            canvas.classList.add('paused');
        });
        
        // Pause glitch effects
        document.querySelectorAll('.glitch-text, .glitch-image').forEach(el => {
            el.classList.add('paused');
        });
        
        // Pause matrix animations
        document.querySelectorAll('.matrix-bg, .datastream-container').forEach(el => {
            el.classList.add('paused');
        });
    }
    
    /**
     * Resume animations after scrolling stops
     */
    function resumeHeavyAnimations() {
        // Small delay before resuming animations
        setTimeout(() => {
            // Resume particle animations
            document.querySelectorAll('.particle-canvas.paused').forEach(canvas => {
                canvas.classList.remove('paused');
            });
            
            // Resume glitch effects
            document.querySelectorAll('.glitch-text.paused, .glitch-image.paused').forEach(el => {
                el.classList.remove('paused');
            });
            
            // Resume matrix animations
            document.querySelectorAll('.matrix-bg.paused, .datastream-container.paused').forEach(el => {
                el.classList.remove('paused');
            });
        }, 50);
    }
    
    // Add helper CSS to the document
    const style = document.createElement('style');
    style.textContent = `
        /* Disable hover effects while scrolling to prevent jank */
        .disable-hover * {
            pointer-events: none !important;
        }
        
        /* Pause animations */
        .paused {
            animation-play-state: paused !important;
        }
        
        /* Improve scroll performance */
        .is-scrolling .particle-canvas,
        .is-scrolling [class*="glitch-"],
        .is-scrolling .cursor-outline,
        .is-scrolling .cursor-dot,
        .is-scrolling .data-stream,
        .is-scrolling .scan-effect::after,
        .is-scrolling .matrix-bg::before,
        .is-scrolling [class*="hover-"]:hover::before,
        .is-scrolling [class*="hover-"]:hover::after {
            animation-play-state: paused !important;
            transition: none !important;
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
