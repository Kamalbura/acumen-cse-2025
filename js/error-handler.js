/**
 * Global Error Handler
 * Monitors JS errors and provides recovery mechanisms
 */
(function() {
    // Track errors
    let errorCount = 0;
    const errorLog = [];
    const maxErrors = 10; // Maximum errors before taking action
    
    // Initialize error handling
    function init() {
        // Set up global error handler
        window.addEventListener('error', handleError);
        
        // Set up unhandled promise rejection handler
        window.addEventListener('unhandledrejection', handleRejection);
        
        // Set up console error observer
        observeConsoleErrors();
        
        // Set up image error handling
        setupImageErrorHandling();
        
        // Fix paths if needed
        fixPaths();
        
        console.log('Error handler initialized');
    }
    
    // Handle JavaScript errors
    function handleError(event) {
        const error = {
            message: event.message,
            source: event.filename,
            line: event.lineno,
            column: event.colno,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        logError(error);
        
        // Try to recover if it's a known issue
        attemptRecovery(error);
        
        // Don't prevent browser's default error handling
        return false;
    }
    
    // Handle unhandled promise rejections
    function handleRejection(event) {
        const error = {
            message: event.reason?.message || 'Unhandled Promise Rejection',
            source: 'Promise',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            details: event.reason
        };
        
        logError(error);
    }
    
    // Log error to our internal tracking
    function logError(error) {
        errorCount++;
        errorLog.push(error);
        
        console.warn(`Error ${errorCount}:`, error.message);
        
        // If too many errors, take action
        if (errorCount >= maxErrors) {
            console.error(`${errorCount} errors detected - activating emergency recovery`);
            activateEmergencyRecovery();
        }
    }
    
    // Attempt to recover based on error type
    function attemptRecovery(error) {
        // Resource loading errors
        if (error.message.includes('Loading chunk') || 
            error.message.includes('Failed to load resource')) {
            console.log('Attempting to recover from resource loading error');
            
            // Reload missing resources
            if (typeof ResourceManager !== 'undefined') {
                ResourceManager.loadCriticalResources();
            } else {
                fixPaths();
            }
        }
        
        // Undefined function errors
        if (error.message.includes('is not defined') || 
            error.message.includes('is not a function')) {
            console.log('Attempting to recover from undefined function error');
            
            // Add noops for common functions that might be missing
            ['initAnimation', 'setupSlider', 'enableLightbox'].forEach(fn => {
                if (typeof window[fn] === 'undefined') {
                    window[fn] = function() { 
                        console.log(`Attempted to call missing function: ${fn}`);
                    };
                }
            });
        }
    }
    
    // Set up image error handling
    function setupImageErrorHandling() {
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                handleImageError(e.target);
            }
        }, true);
        
        // Also check existing images
        window.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('img').forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    handleImageError(img);
                }
            });
        });
    }
    
    // Handle image loading errors
    function handleImageError(img) {
        // Skip if already handled
        if (img.hasAttribute('data-error-handled')) return;
        
        // Mark as handled
        img.setAttribute('data-error-handled', 'true');
        
        console.warn(`Image failed to load: ${img.src}`);
        
        // Determine if we're in a subfolder
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        // Try with fixed path
        if (!img.src.includes(pathPrefix) && !img.src.includes('http')) {
            const originalSrc = img.src;
            img.src = pathPrefix + originalSrc.split('/').pop();
            
            // If that doesn't work, use placeholder
            img.onerror = function() {
                this.src = pathPrefix + 'img/placeholder.jpg';
                this.onerror = null; // Avoid infinite loop
            };
            
            return;
        }
        
        // Direct to placeholder image
        img.src = pathPrefix + 'img/placeholder.jpg';
    }
    
    // Fix paths for resources
    function fixPaths() {
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        if (!isInSubfolder) return;
        
        const pathPrefix = '../';
        
        // Fix CSS paths
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('../') && !href.startsWith('http')) {
                link.setAttribute('href', pathPrefix + href);
            }
        });
        
        // Fix JS paths
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('../') && !src.startsWith('http')) {
                script.setAttribute('src', pathPrefix + src);
            }
        });
        
        // Fix image paths
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('../') && !src.startsWith('http') && !src.startsWith('data:')) {
                img.setAttribute('src', pathPrefix + src);
            }
        });
    }
    
    // Observe console errors
    function observeConsoleErrors() {
        const originalError = console.error;
        
        console.error = function(...args) {
            // Log to our error tracking
            const errorMessage = args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg);
                }
                return String(arg);
            }).join(' ');
            
            logError({
                message: errorMessage.substring(0, 200), // Truncate for brevity
                source: 'console.error',
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
            
            // Call original console.error
            originalError.apply(console, args);
        };
    }
    
    // Last resort emergency recovery for major issues
    function activateEmergencyRecovery() {
        // Add emergency CSS fixes
        const emergencyStyle = document.createElement('style');
        emergencyStyle.textContent = `
            * { box-sizing: border-box !important; }
            body { 
                opacity: 1 !important;
                visibility: visible !important;
                overflow: auto !important;
                background: #101025 !important;
                color: #fff !important;
                font-family: 'Roboto', sans-serif !important;
            }
            .navbar {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 9999 !important;
                background: rgba(8, 8, 24, 0.9) !important;
                padding: 10px 0 !important;
            }
            section, .container {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            img[src=""], img:not([src]) {
                display: none !important;
            }
            .loading-screen, .preloader {
                display: none !important;
            }
            a { color: #00f3ff !important; }
            .btn { 
                background: #00f3ff !important;
                color: #000 !important;
                padding: 10px 20px !important;
                display: inline-block !important;
                margin: 10px !important;
                text-decoration: none !important;
            }
            .btn-secondary {
                background: transparent !important;
                border: 1px solid #00f3ff !important;
                color: #00f3ff !important;
            }
        `;
        document.head.appendChild(emergencyStyle);
        
        // Remove problematic scripts
        document.querySelectorAll('script[src*="animations"], script[src*="effects"]')
            .forEach(script => script.remove());
            
        // Show recovery message to user
        if (!document.getElementById('recovery-message')) {
            const message = document.createElement('div');
            message.id = 'recovery-message';
            message.style.cssText = 'position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.7);color:#fff;padding:10px 20px;border-radius:5px;z-index:9999;';
            message.innerHTML = '<p>We noticed some technical issues. The page has been stabilized.</p>';
            document.body.appendChild(message);
            
            // Auto remove after 5 seconds
            setTimeout(() => message.remove(), 5000);
        }
    }
    
    // Initialize when script loads
    init();
})();
