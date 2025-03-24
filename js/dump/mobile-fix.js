/**
 * Mobile optimizations for ACUMEN website
 * Handles touchscreen-specific behaviors and performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth < 768;
    
    if (isMobile) {
        initMobileOptimizations();
    }
    
    // Also initialize safe touch interactions regardless of device
    // (some desktop devices have touch capabilities too)
    initTouchInteractions();
});

/**
 * Initialize mobile-specific optimizations
 */
function initMobileOptimizations() {
    console.log('Applying mobile optimizations');
    
    // Add mobile class to body for CSS targeting
    document.body.classList.add('mobile-device');
    
    // Disable heavy animations
    disableHeavyAnimations();
    
    // Optimize images
    lazyLoadImages();
    
    // Fix 100vh issue on mobile browsers
    fixMobileVhUnit();
    
    // Improve tap response time
    improveScrollPerformance();
}

/**
 * Disable CPU-intensive animations on mobile
 */
function disableHeavyAnimations() {
    // Remove animated backgrounds and effects that consume too much CPU
    document.querySelectorAll('.glitch-overlay, .circuit-overlay, .digital-noise').forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    // Disable particle effects
    document.querySelectorAll('.particle-canvas').forEach(el => {
        if (el) el.remove();
    });
    
    // Simplify glitch effects
    document.querySelectorAll('.glitch-text').forEach(el => {
        if (el) {
            // Keep text but remove animation
            el.classList.add('mobile-glitch');
            el.classList.remove('glitch-text');
        }
    });
    
    // Reduce animation intensity on timeline elements
    document.documentElement.style.setProperty('--animation-intensity', '0.3');
}

/**
 * Initialize proper touch interactions
 */
function initTouchInteractions() {
    // Fix event delegation for touch events
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Apply active states rather than hover effects on touch
    document.querySelectorAll('.btn, .event-card, .sponsor-card, .nav-links a').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, {passive: true});
        
        el.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, {passive: true});
    });
    
    // Fix iOS momentum scrolling
    document.querySelectorAll('.nav-links.active, .modal-content').forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
    });
    
    // Improve back-to-top functionality for mobile
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, {passive: true});
    }
}

/**
 * Fix 100vh height issue on mobile browsers
 * (100vh is taller than visible viewport on mobile due to browser UI)
 */
function fixMobileVhUnit() {
    const setVhProperty = () => {
        // Get the viewport height and multiply by 1% to get a value for a vh unit
        const vh = window.innerHeight * 0.01;
        // Set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Initialize and update on resize
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    
    // Use the custom property in your CSS with: height: calc(var(--vh, 1vh) * 100);
    document.querySelectorAll('.hero, .full-height').forEach(el => {
        el.style.height = 'calc(var(--vh, 1vh) * 100)';
    });
}

/**
 * Optimize scrolling performance
 */
function improveScrollPerformance() {
    // Add will-change hint before scrolling starts
    let timeout;
    
    window.addEventListener('touchstart', function() {
        clearTimeout(timeout);
        document.body.classList.add('is-scrolling');
        
        document.querySelectorAll('.hero, .about, .events-highlight, .cta-section').forEach(section => {
            section.style.willChange = 'transform';
        });
    }, {passive: true});
    
    window.addEventListener('touchend', function() {
        timeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
            
            document.querySelectorAll('.hero, .about, .events-highlight, .cta-section').forEach(section => {
                section.style.willChange = 'auto';
            });
        }, 100);
    }, {passive: true});
}

/**
 * Lazy load images for better performance
 */
function lazyLoadImages() {
    // Use native lazy loading where supported
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Use intersection observer for responsive images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without intersection observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}
