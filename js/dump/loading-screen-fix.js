/**
 * Loading Screen Fix
 * Ensures loading screens don't get stuck and provide a smooth transition
 */

(function() {
    // Configuration
    const config = {
        maxWaitTime: 5000,      // Maximum time to wait before force-removing loading screen
        fadeOutDuration: 500,   // Duration of fade out animation
        loadingSelectors: ['.loading-screen', '.preloader', '.page-transition-overlay'],
        bodyLoadedClass: 'loaded'
    };
    
    // Track execution to prevent duplicate runs
    let hasRun = false;
    
    /**
     * Initialize loading screen fix
     */
    function init() {
        // Prevent multiple executions
        if (hasRun) return;
        hasRun = true;
        
        console.log('🔄 Initializing loading screen fix');
        
        // Apply fix immediately for early-loading issues
        fixLoadingScreen();
        
        // Set timeout to ensure loading screen is removed
        setTimeout(forceRemoveLoadingScreen, config.maxWaitTime);
        
        // Handle page load event
        window.addEventListener('load', onPageLoad);
        
        // Also handle DOMContentLoaded in case load event doesn't fire
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(fixLoadingScreen, 1000);
        });
        
        // Add CSS to ensure proper transitions
        injectFixStyles();
    }
    
    /**
     * Handle page load event
     */
    function onPageLoad() {
        // Add loaded class to body
        document.body.classList.add(config.bodyLoadedClass);
        
        // Short delay to allow other scripts to initialize
        setTimeout(fixLoadingScreen, 100);
    }
    
    /**
     * Fix loading screen
     */
    function fixLoadingScreen() {
        // Find all loading screen elements
        const loadingElements = [];
        config.loadingSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => loadingElements.push(el));
            }
        });
        
        if (loadingElements.length === 0) return;
        
        console.log(`🔄 Removing ${loadingElements.length} loading screen elements`);
        
        // Add hide class and remove after transition
        loadingElements.forEach(el => {
            el.classList.add('hide');
            
            // Set inline transition if not already set
            if (!el.style.transition) {
                el.style.transition = `opacity ${config.fadeOutDuration}ms ease`;
            }
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }, config.fadeOutDuration);
        });
        
        // Add loaded class to body
        document.body.classList.add(config.bodyLoadedClass);
    }
    
    /**
     * Force remove loading screen as a last resort
     */
    function forceRemoveLoadingScreen() {
        // Find all loading elements using broader search
        const allPossibleLoaders = document.querySelectorAll('[class*="load"], [class*="preload"], [class*="transition"]');
        
        allPossibleLoaders.forEach(el => {
            // Check if element appears to be a loading screen
            if (
                el.id?.toLowerCase().includes('load') ||
                el.classList.contains('loading-screen') ||
                el.classList.contains('preloader') ||
                el.classList.contains('loader') ||
                el.classList.contains('page-transition') ||
                el.style.position === 'fixed'
            ) {
                console.warn('🔄 Force removing loading element:', el);
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }
        });
        
        // Ensure body is visible
        document.body.style.display = 'block';
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        document.body.classList.add(config.bodyLoadedClass);
        
        // Enable scrolling just in case
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
    
    /**
     * Inject CSS fixes for loading screens
     */
    function injectFixStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            body.loaded {
                overflow: auto !important;
            }
            
            .loading-screen.hide,
            .preloader.hide,
            .page-transition-overlay.hide {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            
            /* Ensure content is visible */
            main, 
            .container, 
            .content {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Check if there's currently a loading screen visible
     */
    function isLoadingScreenVisible() {
        for (const selector of config.loadingSelectors) {
            const element = document.querySelector(selector);
            if (element && 
                getComputedStyle(element).display !== 'none' && 
                getComputedStyle(element).visibility !== 'hidden' && 
                getComputedStyle(element).opacity !== '0') {
                return true;
            }
        }
        return false;
    }
    
    // Initialize immediately to catch early issues
    init();
    
    // Expose API
    window.LoadingScreenFix = {
        fix: fixLoadingScreen,
        forceRemove: forceRemoveLoadingScreen,
        isVisible: isLoadingScreenVisible
    };
})();
