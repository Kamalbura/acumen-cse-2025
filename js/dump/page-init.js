/**
 * ACUMEN Page Initialization
 * Ensures all pages load correctly with proper resources
 */

(function() {
    // Execute immediately to catch very early errors
    checkAndFixPaths();
    
    // Run the rest when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Ensure base resources are loaded
        ensureBaseResourcesLoaded();
        
        // 2. Handle path-specific resources
        loadPathSpecificResources();
        
        // 3. Initialize cyberpunk effects based on device capability
        initializeEffects();
        
        // 4. Set up error handling and recovery
        setupErrorHandling();
        
        console.log('✅ Page initialization complete');
    });
    
    /**
     * Check and fix resource paths based on current location
     */
    function checkAndFixPaths() {
        const path = window.location.pathname;
        const inEventsDir = path.includes('/events/');
        const inSubfolder = path.split('/').length > 2;
        
        // Fix path only if needed
        if (inEventsDir || inSubfolder) {
            const pathPrefix = '../';
            
            // Fix existing stylesheet paths
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('../') && !href.startsWith('/')) {
                    link.href = pathPrefix + href;
                }
            });
            
            // Fix existing script paths
            document.querySelectorAll('script[src]').forEach(script => {
                const src = script.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
                    script.src = pathPrefix + src;
                }
            });
        }
    }
    
    /**
     * Ensure all base resources are loaded
     */
    function ensureBaseResourcesLoaded() {
        const pathPrefix = getPathPrefix();
        
        // Essential CSS files
        const essentialCss = [
            'css/styles.css',
            'css/cyberpunk.css',
            'css/emergency-fallback.css'
        ];
        
        // Load any missing CSS files
        essentialCss.forEach(cssFile => {
            const fileName = cssFile.split('/').pop();
            if (!document.querySelector(`link[href$="${fileName}"]`)) {
                loadStylesheet(pathPrefix + cssFile);
            }
        });
        
        // Essential JS files
        const essentialJs = [
            'js/main.js',
            'js/path-fixer.js',
            'js/emergency-fix.js'
        ];
        
        // Load any missing JS files
        essentialJs.forEach(jsFile => {
            const fileName = jsFile.split('/').pop();
            if (!document.querySelector(`script[src$="${fileName}"]`)) {
                loadScript(pathPrefix + jsFile);
            }
        });
    }
    
    /**
     * Load path-specific resources based on current URL
     */
    function loadPathSpecificResources() {
        const path = window.location.pathname;
        const pathPrefix = getPathPrefix();
        
        // Events page specific resources
        if (path.endsWith('events.html') || path.includes('events/index')) {
            loadStylesheet(pathPrefix + 'css/events-page.css');
            loadStylesheet(pathPrefix + 'css/events-page-fixes.css');
            loadScript(pathPrefix + 'js/events-page-fixes.js');
            loadScript(pathPrefix + 'js/fix-events.js');
        }
        
        // Event detail page specific resources
        if (path.includes('/events/') && !path.endsWith('events/') && !path.includes('events/index')) {
            loadStylesheet(pathPrefix + 'css/event-page.css');
            loadScript(pathPrefix + 'js/event-page-functionality.js');
            loadScript(pathPrefix + 'js/fix-paths.js');
        }
        
        // Contact page specific
        if (path.endsWith('contact.html')) {
            loadScript(pathPrefix + 'js/form-validation.js');
            loadScript(pathPrefix + 'js/coordinator-data.js');
        }
        
        // Registration page specific
        if (path.endsWith('registration.html')) {
            loadScript(pathPrefix + 'js/form-validation.js');
        }
    }
    
    /**
     * Initialize cyberpunk effects based on device capability
     */
    function initializeEffects() {
        // Check if we're on a low-powered device
        const isLowPower = checkLowPowerDevice();
        
        if (!isLowPower) {
            // Load enhanced effects for powerful devices
            const pathPrefix = getPathPrefix();
            loadStylesheet(pathPrefix + 'css/cyberpunk-enhanced.css');
            loadStylesheet(pathPrefix + 'css/interactive-elements.css');
            loadScript(pathPrefix + 'js/cursor-effects-enhanced.js');
            loadScript(pathPrefix + 'js/hover-effects.js');
        } else {
            // Add class to body to indicate low power mode
            document.body.classList.add('low-power-mode');
        }
    }
    
    /**
     * Set up error handling and recovery
     */
    function setupErrorHandling() {
        // Count JavaScript errors
        window.jsErrorCount = 0;
        
        window.addEventListener('error', function(e) {
            window.jsErrorCount++;
            console.error(`Error ${window.jsErrorCount}: ${e.message}`);
            
            // If too many errors, disable enhanced effects
            if (window.jsErrorCount > 3) {
                document.body.classList.add('low-power-mode');
                
                // Remove intensive effects
                document.querySelectorAll('.particle-canvas, .glitch-wrapper').forEach(el => {
                    el.remove();
                });
            }
        });
        
        // Check if page rendered properly
        setTimeout(function() {
            if (document.body.offsetHeight < 100) {
                console.error('Page appears to be blank or not rendering correctly');
                // Check if emergency fix is available before calling it
                if (window.emergencyFix && typeof window.emergencyFix.fixCriticalIssues === 'function') {
                    window.emergencyFix.fixCriticalIssues();
                } else {
                    // Manual emergency recovery as fallback
                    document.body.style.display = 'block';
                    document.body.style.visibility = 'visible';
                    document.body.innerHTML += '<div class="container" style="margin-top:50px;"><div class="emergency-notice"><h1>ACUMEN 2025</h1><p>We\'re experiencing technical difficulties.</p><button onclick="location.reload()">Reload Page</button></div></div>';
                }
            }
        }, 2000);
    }
    
    /**
     * Helper function to load a stylesheet
     */
    function loadStylesheet(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
    
    /**
     * Helper function to load a script
     */
    function loadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    }
    
    /**
     * Get the correct path prefix based on current location
     */
    function getPathPrefix() {
        const path = window.location.pathname;
        const inSubfolder = path.split('/').length > 2;
        return inSubfolder ? '../' : '';
    }
    
    /**
     * Check if current device is low powered
     */
    function checkLowPowerDevice() {
        // Check for touch device
        const isTouch = 'ontouchstart' in window;
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Check for URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const lowPowerParam = urlParams.get('lowPower');
        
        // Limited performance test
        let isSlowDevice = false;
        const testEl = document.createElement('div');
        document.body.appendChild(testEl);
        const start = performance.now();
        
        for (let i = 0; i < 100; i++) {
            testEl.style.opacity = (i % 2) ? '0.5' : '0';
        }
        
        const duration = performance.now() - start;
        document.body.removeChild(testEl);
        
        isSlowDevice = duration > 20; // Threshold for slow device
        
        return isTouch || prefersReducedMotion || lowPowerParam === 'true' || isSlowDevice;
    }
})();
