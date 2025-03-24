/**
 * ACUMEN Master Initialization
 * Coordinates all systems and ensures proper loading order
 */

// Execute immediately to catch early errors
(function() {
    console.log('🚀 ACUMEN Initialization Started');
    
    // Mark document as loading
    document.documentElement.classList.add('preload');
    
    // Detect touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.documentElement.classList.add('touch-device');
    }
    
    // Setup load event to remove preload class
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.documentElement.classList.remove('preload');
        }, 300);
    });
    
    // Detect browser capabilities
    const isIE = !!document.documentMode;
    const isOldEdge = !isIE && !!window.StyleMedia;
    const isOldBrowser = isIE || isOldEdge || !('CSS' in window);
    
    if (isOldBrowser) {
        document.documentElement.classList.add('old-browser');
    }
    
    // Add core CSS for critical rendering path
    const criticalCSS = `
        body {
            background-color: #0a0a1b;
            color: #fff;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        body.loaded {
            opacity: 1;
        }
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0a0a1b;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .preload * {
            transition: none !important;
            animation: none !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
})();

// Main initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM Content Loaded - Initializing Systems');
    
    // Make body visible
    document.body.classList.add('loaded');
    
    // Systems initialization order
    initializeCore();
    
    /**
     * Initialize core systems in proper order
     */
    function initializeCore() {
        // 1. First load our error recovery system
        loadScript('js/error-recovery.js')
            // 2. Then initialize resource manager
            .then(() => loadScript('js/resource-manager.js'))
            // 3. Then initialize performance manager
            .then(() => loadScript('js/performance-manager.js'))
            // 4. Then load unified fixes CSS
            .then(() => loadCSS('css/unified-fixes.css'))
            // 5. Then complete initialization
            .then(() => completeInitialization())
            .catch(error => {
                console.error('Failed to initialize core systems:', error);
                // Still try to initialize with best effort
                completeInitialization();
            });
    }
    
    /**
     * Complete the initialization after core systems loaded
     */
    function completeInitialization() {
        // Fix any stuck loading screens
        document.querySelectorAll('.loading-screen').forEach(screen => {
            screen.classList.add('hide');
            setTimeout(() => {
                if (screen.parentNode) screen.parentNode.removeChild(screen);
            }, 500);
        });
        
        // Initialize any additional systems
        loadPageSpecificResources();
        
        // Log completion
        console.log('✅ ACUMEN Initialization Complete');
    }
    
    /**
     * Load page specific resources
     */
    function loadPageSpecificResources() {
        const path = window.location.pathname;
        
        // Events page
        if (path.endsWith('events.html') || path.includes('/events/')) {
            loadScript('js/fix-events.js');
        }
        
        // Form pages
        if (path.endsWith('contact.html') || path.endsWith('registration.html')) {
            loadScript('js/form-validation.js');
        }
    }
    
    /**
     * Load a script with a promise
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Skip if already loaded
            if (document.querySelector(`script[src$="${src.split('/').pop()}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            const isInSubfolder = window.location.pathname.split('/').length > 2;
            
            script.src = isInSubfolder && !src.startsWith('../') ? 
                         '../' + src : src;
            
            script.onload = () => resolve();
            script.onerror = (error) => reject(error);
            
            document.body.appendChild(script);
        });
    }
    
    /**
     * Load a CSS file with a promise
     */
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            // Skip if already loaded
            if (document.querySelector(`link[href$="${href.split('/').pop()}"]`)) {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            const isInSubfolder = window.location.pathname.split('/').length > 2;
            
            link.rel = 'stylesheet';
            link.href = isInSubfolder && !href.startsWith('../') ? 
                        '../' + href : href;
            
            link.onload = () => resolve();
            link.onerror = (error) => reject(error);
            
            document.head.appendChild(link);
        });
    }
});

// Final initialization after full page load
window.addEventListener('load', function() {
    // Remove loading class
    document.documentElement.classList.remove('preload');
    
    // Mark body as fully loaded
    document.body.classList.add('fully-loaded');
    
    console.log('📋 Page fully loaded');
});
