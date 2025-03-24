/**
 * Mobile-specific fixes
 * Improves performance and fixes layout issues on mobile devices
 */

(function() {
    // Execute as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         window.innerWidth < 768;
        
        if (isMobile) {
            console.log('📱 Applying mobile optimizations');
            applyMobileOptimizations();
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', fixMobileLayout);
        
        // Handle viewport resize events
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(fixMobileLayout, 250);
        });
    });
    
    /**
     * Apply mobile-specific optimizations
     */
    function applyMobileOptimizations() {
        // Mark the document for mobile-specific CSS targeting
        document.documentElement.classList.add('mobile-device');
        
        // Disable intensive animations
        disableHeavyAnimations();
        
        // Fix touch interactions
        fixTouchInteractions();
        
        // Optimize images for mobile
        optimizeImagesForMobile();
        
        // Fix navigation behavior
        fixMobileNavigation();
        
        // Fix font sizes for readability
        fixFontSizes();
    }
    
    /**
     * Disable heavy animations on mobile for better performance
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
            
            /* Disable hover transformations */
            .event-card:hover,
            .team-card:hover,
            .cyber-card:hover {
                transform: none !important;
                box-shadow: 0 5px 15px rgba(0, 243, 255, 0.2) !important;
            }
            
            /* Optimize backgrounds */
            .digital-noise::before,
            .circuit-bg::before,
            .hologram::before {
                opacity: 0.3 !important;
                animation-duration: 10s !important;
            }
        `;
        document.head.appendChild(style);
        
        // Remove existing particle canvases
        document.querySelectorAll('.particle-canvas').forEach(canvas => {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        });
    }
    
    /**
     * Fix touch interactions for mobile devices
     */
    function fixTouchInteractions() {
        // Add touch-friendly styling
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            /* Larger touch targets */
            button, .btn, .nav-link, .event-card, a {
                min-height: 44px;
                min-width: 44px;
            }
            
            /* Add active state for touch feedback */
            .btn:active, 
            .event-card:active,
            .team-card:active, 
            .cyber-card:active {
                transform: scale(0.98);
                opacity: 0.9;
                transition: transform 0.1s ease, opacity 0.1s ease;
            }
            
            /* Fix dropdown menus for touch */
            .dropdown-menu {
                max-height: 80vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(touchStyle);
        
        // Fix click delay on mobile
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
    
    /**
     * Optimize images for mobile
     */
    function optimizeImagesForMobile() {
        // Replace high-res images with lower resolution versions
        document.querySelectorAll('img:not([src*="placeholder"])').forEach(img => {
            // Skip SVGs and small images
            if (img.src.includes('.svg') || img.naturalWidth < 600) return;
            
            // Check if mobile version exists
            const src = img.getAttribute('src');
            const mobileSrc = src.replace(/\.(jpg|png|webp)/, '-mobile.$1');
            
            // Create a test image to see if mobile version exists
            const testImg = new Image();
            testImg.onload = function() {
                img.src = mobileSrc;
            };
            testImg.onerror = function() {
                // No mobile version - compress quality with data URI if small enough
                if (img.naturalWidth < 1000) {
                    compressImageQuality(img);
                }
            };
            testImg.src = mobileSrc;
        });
        
        // Lazy load images below the fold
        setupLazyLoading();
    }
    
    /**
     * Compress image quality
     */
    function compressImageQuality(img) {
        // Only process if image is loaded
        if (!img.complete) {
            img.onload = () => compressImageQuality(img);
            return;
        }
        
        try {
            // Create canvas for compression
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set dimensions to slightly smaller than original
            canvas.width = img.naturalWidth * 0.8;
            canvas.height = img.naturalHeight * 0.8;
            
            // Draw at lower quality
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Replace with compressed version if it's not too large
            const compressedSrc = canvas.toDataURL('image/jpeg', 0.7);
            
            if (compressedSrc.length < 100000) { // Only use if less than ~100KB
                img.src = compressedSrc;
            }
        } catch (e) {
            // Silently fail - keep original image
            console.warn('Could not compress image:', e);
        }
    }
    
    /**
     * Set up lazy loading for images
     */
    function setupLazyLoading() {
        // Use native lazy loading if available
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // For browsers without native support, use intersection observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '100px' });
            
            // Observe images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    /**
     * Fix mobile navigation behavior
     */
    function fixMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navbar && navToggle && navLinks) {
            // Fix nav toggle button size and position
            navToggle.style.padding = '15px';
            navToggle.style.zIndex = '1000';
            
            // Add close button to expanded navigation
            if (!document.querySelector('.nav-close')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'nav-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = 'position:absolute;top:15px;right:15px;background:none;border:none;color:#fff;font-size:24px;';
                navLinks.appendChild(closeBtn);
                
                closeBtn.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            }
            
            // Prevent body scroll when nav is open
            navToggle.addEventListener('click', function() {
                if (navLinks.classList.contains('active')) {
                    document.body.style.overflow = '';
                } else {
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Close nav when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    /**
     * Fix font sizes for better mobile readability
     */
    function fixFontSizes() {
        // Create style for better text readability
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 576px) {
                h1 {
                    font-size: 1.8rem !important;
                }
                h2 {
                    font-size: 1.5rem !important;
                }
                p, li, .btn {
                    font-size: 1rem !important;
                }
                .small-text {
                    font-size: 0.9rem !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Fix layout issues after orientation changes
     */
    function fixMobileLayout() {
        // Wait a bit for layout to settle after resize/orientation change
        setTimeout(function() {
            // Fix viewport height issue on mobile browsers
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Fix event cards sizing
            document.querySelectorAll('.event-card').forEach(card => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.height = 'auto';
                    img.style.aspectRatio = '16/9';
                }
            });
            
            // Adjust hero section height
            const hero = document.querySelector('.hero-section');
            if (hero) {
                hero.style.minHeight = `calc(var(--vh, 1vh) * 85)`;
            }
        }, 300);
    }
})();
