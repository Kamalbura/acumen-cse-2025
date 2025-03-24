/**
 * Comprehensive Mobile Optimizations
 * Handles all mobile-specific behavior in one central place
 */
(function() {
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    window.innerWidth < 768;
                    
    // Only run if we're on a mobile device
    if (!isMobile) return;
    
    // Add mobile class to document for CSS targeting
    document.documentElement.classList.add('is-mobile');
    
    // Execute when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 Applying mobile optimizations');
        
        // Disable heavy animations
        disableHeavyAnimations();
        
        // Fix viewport height issues (iOS Safari)
        fixViewportHeight();
        
        // Optimize images
        optimizeImages();
        
        // Improve touch interactions
        enhanceTouchInteractions();
        
        // Handle navigation
        improveNavigation();
    });
    
    // Handle resize and orientation change
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure orientation has completed
        setTimeout(fixViewportHeight, 100);
    });
    
    /**
     * Disable CPU-intensive animations
     */
    function disableHeavyAnimations() {
        // Create style to disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
            /* Disable particle effects */
            .particle-canvas, 
            .data-stream,
            .matrix-bg::before {
                display: none !important;
            }
            
            /* Simplify glitch effects */
            .glitch-text::before,
            .glitch-text::after,
            .glitch-image::before,
            .glitch-image::after {
                display: none !important;
            }
            
            /* Reduce animation intensity */
            * {
                animation-duration: 50% !important;
                transition-duration: 50% !important;
            }
        `;
        document.head.appendChild(style);
        
        // Remove existing heavy effect elements
        document.querySelectorAll('.particle-canvas, .glitch-overlay').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
    
    /**
     * Fix the viewport height issue on iOS Safari
     */
    function fixViewportHeight() {
        // Get the viewport height
        const vh = window.innerHeight * 0.01;
        // Set the --vh CSS variable
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    /**
     * Optimize images for mobile
     */
    function optimizeImages() {
        // Apply native lazy loading to all images that don't have it
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // Fix body background for mobile
        fixMobileBackground();
    }
    
    /**
     * Fix mobile background issues
     */
    function fixMobileBackground() {
        // Add fallback background color
        document.body.style.backgroundColor = '#101025';
        
        // Check if before pseudo-element has loaded the background image
        const checkBackgroundImg = new Image();
        checkBackgroundImg.onerror = function() {
            // If background image fails to load, try alternate paths
            const style = document.createElement('style');
            style.textContent = `
                body::before {
                    background-image: url('img/background2.jpg'), url('img/background.jpg'), linear-gradient(45deg, #101025, #1a1a40) !important;
                }
            `;
            document.head.appendChild(style);
        };
        
        // Try to load the image to test if it exists
        const computedStyle = window.getComputedStyle(document.body, '::before');
        const bgImage = computedStyle.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            // Extract URL from the CSS value: url("path/to/image.jpg")
            const match = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (match && match[1]) {
                checkBackgroundImg.src = match[1];
            }
        }
    }
    
    /**
     * Enhance touch interactions
     */
    function enhanceTouchInteractions() {
        // Fix button and interactive elements
        document.querySelectorAll('.btn, .event-card, .venue-card').forEach(el => {
            // Add active state for touch feedback
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});
            
            el.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        });
    }
    
    /**
     * Improve navigation for mobile
     */
    function improveNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            // Keep track of touchstart position
            let touchStartY = 0;
            
            // Handle body scroll locking
            navToggle.addEventListener('click', function() {
                if (navLinks.classList.contains('active')) {
                    document.body.style.overflow = '';
                } else {
                    document.body.style.overflow = 'hidden';
                    // Save scroll position
                    document.body.dataset.scrollY = window.scrollY;
                }
            });
            
            // Handle touchstart/touchend for menu
            navLinks.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
            }, {passive: true});
            
            // Allow scrolling within menu if needed
            navLinks.addEventListener('touchmove', function(e) {
                const touchY = e.touches[0].clientY;
                const touchYDelta = touchY - touchStartY;
                const scrollTop = this.scrollTop;
                const scrollHeight = this.scrollHeight;
                const offsetHeight = this.offsetHeight;
                
                // Check if at the top or bottom of menu scrolling
                if ((scrollTop === 0 && touchYDelta > 0) || 
                    (scrollHeight - scrollTop === offsetHeight && touchYDelta < 0)) {
                    e.preventDefault();
                }
            }, {passive: false});
        }
    }
})();
