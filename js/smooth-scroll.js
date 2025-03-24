/**
 * Smooth Scroll Enhancement
 * Provides smoother scrolling and fixes potential glitches in navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check for browser support
    const supportsPassive = checkPassiveSupport();
    
    // Smooth scroll to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement);
            }
        });
    });
    
    // Optimize scroll event listeners with passive option when supported
    window.addEventListener('scroll', handleScroll, supportsPassive ? { passive: true } : false);
    
    // Handle navbar transparency on scroll
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Add parallax effects only on non-mobile devices
        if (!isMobileDevice()) {
            applyParallax();
        }
    }
    
    // Check if device is mobile
    function isMobileDevice() {
        return (window.innerWidth <= 768) || 
               (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }
    
    // Apply parallax effects to supported elements
    function applyParallax() {
        const parallaxElements = document.querySelectorAll('.hero, .page-banner');
        const scrollPosition = window.scrollY;
        
        parallaxElements.forEach(element => {
            const elementPosition = element.offsetTop;
            const elementHeight = element.offsetHeight;
            
            if (scrollPosition >= elementPosition - window.innerHeight && 
                scrollPosition <= elementPosition + elementHeight) {
                // Calculate parallax offset
                const offset = (scrollPosition - elementPosition) * 0.4;
                element.style.backgroundPositionY = `calc(50% + ${offset}px)`;
            }
        });
    }
    
    // Smooth scroll function using requestAnimationFrame
    function smoothScrollTo(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // ms
        let startTimestamp = null;
        
        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            
            // Easing function for smooth animation
            const easeInOutCubic = t => t < 0.5 
                ? 4 * t * t * t 
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            
            const progressFraction = Math.min(progress / duration, 1);
            const easedProgress = easeInOutCubic(progressFraction);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
    
    // Check if browser supports passive event listeners
    function checkPassiveSupport() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() { supportsPassive = true; }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        
        return supportsPassive;
    }
    
    // Fix for iOS momentum scroll issues
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        document.addEventListener('touchmove', function(e) {
            // Only prevent default for elements that need custom scroll behavior
            if (e.target.closest('.custom-scroll-element')) {
                e.preventDefault();
            }
        }, supportsPassive ? { passive: false } : false);
    }
});
