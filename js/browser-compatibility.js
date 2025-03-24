/**
 * Browser Compatibility Fixes
 * Addresses issues specific to different browsers
 */
(function() {
    // Initialize fixes
    function init() {
        // Detect browser and add class to HTML element
        detectBrowser();
        
        // Apply browser-specific fixes
        applyBrowserFixes();
        
        // Add platform-specific classes
        detectPlatform();
        
        // Fix CSS custom property support
        fixCSSCustomProperties();
        
        // Fix smooth scrolling
        fixSmoothScrolling();
        
        // Fix object-fit for older browsers
        fixObjectFit();
    }
    
    // Detect browser and add class to HTML
    function detectBrowser() {
        const html = document.documentElement;
        
        // Chrome
        if (navigator.userAgent.indexOf("Chrome") > -1) {
            html.classList.add('browser-chrome');
        }
        // Firefox
        else if (navigator.userAgent.indexOf("Firefox") > -1) {
            html.classList.add('browser-firefox');
        }
        // Safari
        else if (navigator.userAgent.indexOf("Safari") > -1) {
            html.classList.add('browser-safari');
        }
        // Edge
        else if (navigator.userAgent.indexOf("Edg") > -1) {
            html.classList.add('browser-edge');
        }
        // IE
        else if (navigator.userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
            html.classList.add('browser-ie');
        }
    }
    
    // Apply browser-specific fixes
    function applyBrowserFixes() {
        const html = document.documentElement;
        
        // Safari fixes
        if (html.classList.contains('browser-safari')) {
            // Fix for flexbox gap support
            if (!supportsCSSProperty('gap')) {
                addGapFix();
            }
            
            // Fix for sticky hover on touch devices
            addStickyHoverFix();
        }
        
        // Firefox fixes
        if (html.classList.contains('browser-firefox')) {
            // Firefox sometimes renders fonts differently
            addFirefoxFontFix();
        }
        
        // Edge fixes
        if (html.classList.contains('browser-edge')) {
            // Fix for backdrop-filter
            addBackdropFilterFix();
        }
    }
    
    // Detect platform and add class to HTML
    function detectPlatform() {
        const html = document.documentElement;
        const ua = navigator.userAgent;
        
        // Mobile
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            html.classList.add('platform-mobile');
            
            // iOS specific
            if (/iPad|iPhone|iPod/.test(ua)) {
                html.classList.add('platform-ios');
                addIOSFixes();
            }
            
            // Android specific
            if (/Android/.test(ua)) {
                html.classList.add('platform-android');
            }
        } 
        // Desktop
        else {
            html.classList.add('platform-desktop');
            
            // Mac
            if (/Mac/.test(ua)) {
                html.classList.add('platform-mac');
            }
            // Windows
            else if (/Win/.test(ua)) {
                html.classList.add('platform-windows');
            }
        }
    }
    
    // Fix CSS custom properties support for older browsers
    function fixCSSCustomProperties() {
        if (!supportsCSSProperty('--test')) {
            // Load polyfill for CSS variables
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2/dist/css-vars-ponyfill.min.js';
            script.onload = function() {
                if (typeof cssVars === 'function') {
                    cssVars({
                        include: 'style,link[rel="stylesheet"]',
                        onlyLegacy: true,
                        watch: true
                    });
                }
            };
            document.head.appendChild(script);
        }
    }
    
    // Fix smooth scrolling for all browsers
    function fixSmoothScrolling() {
        // If native smooth scrolling is supported, we're good
        if ('scrollBehavior' in document.documentElement.style) return;
        
        // Otherwise add smooth scroll script
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    smoothScroll(targetElement, 500);
                }
            });
        });
        
        // Polyfill smooth scroll function
        function smoothScroll(target, duration) {
            const start = window.pageYOffset;
            const targetTop = target.getBoundingClientRect().top;
            const startTime = performance.now();
            
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function - easeInOutCubic
                const easing = progress < 0.5 
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, start + targetTop * easing);
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            }
            
            window.requestAnimationFrame(step);
        }
    }
    
    // Fix object-fit for older browsers (IE11)
    function fixObjectFit() {
        if ('objectFit' in document.documentElement.style) return;
        
        // Find all images with object-fit style
        document.querySelectorAll('img[style*="object-fit"]').forEach(img => {
            const style = getComputedStyle(img);
            const fit = style.getPropertyValue('object-fit');
            
            if (fit === 'cover' || fit === 'contain') {
                img.style.objectFit = 'unset';
                
                // Create wrapper div
                const wrapper = document.createElement('div');
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
                wrapper.style.position = 'relative';
                wrapper.style.overflow = 'hidden';
                
                // Set up background image instead
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                
                wrapper.style.backgroundImage = `url("${img.src}")`;
                wrapper.style.backgroundPosition = 'center center';
                wrapper.style.backgroundSize = fit;
                
                img.style.opacity = '0';
            }
        });
    }
    
    // Helper function to check if browser supports a CSS property
    function supportsCSSProperty(prop) {
        return prop in document.documentElement.style || 
              (`-webkit-${prop}` in document.documentElement.style);
    }
    
    // Fix for flexbox gap support in Safari
    function addGapFix() {
        const style = document.createElement('style');
        style.textContent = `
            /* Flexbox gap fallback */
            .events-grid, .team-grid, .sponsors-grid, .venue-grid {
                margin: -10px;
            }
            
            .events-grid > *, .team-grid > *, .sponsors-grid > *, .venue-grid > * {
                margin: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fix for sticky hover effects on touch devices
    function addStickyHoverFix() {
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .btn:hover, .event-card:hover, .venue-card:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
                
                .nav-links a:hover::after {
                    width: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fix for Firefox font rendering
    function addFirefoxFontFix() {
        const style = document.createElement('style');
        style.textContent = `
            @-moz-document url-prefix() {
                body {
                    font-weight: normal;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    font-weight: 600;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fix for backdrop-filter in Edge
    function addBackdropFilterFix() {
        document.querySelectorAll('[style*="backdrop-filter"]').forEach(el => {
            const currentBg = window.getComputedStyle(el).backgroundColor;
            
            // If using backdrop-filter and has translucent background, make it a bit more opaque
            if (currentBg.includes('rgba')) {
                const parts = currentBg.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
                if (parts && parts.length === 5) {
                    const opacity = parseFloat(parts[4]);
                    // Make background more opaque to compensate for lack of backdrop filter
                    const newOpacity = Math.min(opacity + 0.3, 1);
                    el.style.backgroundColor = `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${newOpacity})`;
                }
            }
        });
    }
    
    // iOS specific fixes
    function addIOSFixes() {
        const style = document.createElement('style');
        style.textContent = `
            /* Fix for 100vh issue on iOS */
            .hero, .hero-section {
                height: -webkit-fill-available;
                max-height: 800px;
            }
            
            /* Fix for input styling */
            input, button, textarea, select {
                appearance: none;
                -webkit-appearance: none;
                border-radius: 0;
            }
            
            /* Fix for momentum scrolling */
            body {
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize
    init();
})();
