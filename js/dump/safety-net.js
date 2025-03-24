/**
 * Safety Net Script
 * Provides core error prevention for all pages
 * This should be the FIRST script loaded on every page
 */

(function() {
    // Store original console methods
    window._originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };
    
    // Error tracking
    window._errorLog = [];
    window._errorCount = 0;
    
    // Safety settings
    window.ACUMEN_SAFETY = {
        errors: window._errorLog,
        errorCount: window._errorCount,
        criticalErrorsFixed: 0,
        pathsFixed: 0,
        isFallbackActive: false
    };
    
    // Global error handler
    window.addEventListener('error', function(event) {
        window._errorLog.push({
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            timestamp: new Date().toISOString()
        });
        
        window._errorCount++;
        window.ACUMEN_SAFETY.errorCount = window._errorCount;
        
        // If too many errors occur, activate fallback mode
        if (window._errorCount > 5 && !window.ACUMEN_SAFETY.isFallbackActive) {
            activateFallbackMode();
        }
        
        return false; // Let other error handlers run
    });
    
    // Check if page is in a subfolder
    const isInSubfolder = window.location.pathname.split('/').length > 2;
    const pathPrefix = isInSubfolder ? '../' : '';
    
    // Store path info for other scripts
    window.ACUMEN_SAFETY.pathPrefix = pathPrefix;
    window.ACUMEN_SAFETY.isInSubfolder = isInSubfolder;
    
    /**
     * Make sure the page loads visibly with some basic styles
     */
    function ensureVisibility() {
        // Create emergency styles
        const style = document.createElement('style');
        style.textContent = `
            body {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                background-color: #0a0a1b;
                color: #fff;
                font-family: system-ui, -apple-system, sans-serif;
            }
            .acumen-emergency-container {
                max-width: 1200px;
                margin: 50px auto;
                padding: 20px;
                background-color: rgba(0, 243, 255, 0.05);
                border: 1px solid rgba(0, 243, 255, 0.2);
            }
            .acumen-emergency-notice {
                padding: 15px;
                border-left: 4px solid #00f3ff;
                margin-bottom: 20px;
            }
            .acumen-emergency-btn {
                background: #00f3ff;
                color: #000;
                border: none;
                padding: 10px 20px;
                margin-right: 10px;
                cursor: pointer;
            }
            img[src*="undefined"], img[src=""], img:not([src]) {
                display: none;
            }
            .loading-screen, .page-transition-overlay {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Load emergency script to fix critical issues
     */
    function loadEmergencyScript() {
        const script = document.createElement('script');
        script.src = pathPrefix + 'js/emergency-fix.js';
        document.body.appendChild(script);
    }
    
    /**
     * Activate fallback mode when too many errors occur
     */
    function activateFallbackMode() {
        window.ACUMEN_SAFETY.isFallbackActive = true;
        
        // Create fallback interface
        const container = document.createElement('div');
        container.className = 'acumen-emergency-container';
        container.innerHTML = `
            <div class="acumen-emergency-notice">
                <h1 style="color:#00f3ff;margin-bottom:15px;">ACUMEN 2025</h1>
                <p>We're experiencing technical difficulties with this page.</p>
                <p style="margin-bottom:20px;">Please try one of these options:</p>
                <button class="acumen-emergency-btn" id="acumen-fix-btn">
                    Apply Automatic Fix
                </button>
                <button class="acumen-emergency-btn" style="background:#333;color:#fff;" id="acumen-reload-btn">
                    Reload Page
                </button>
            </div>
            <div>
                <h2 style="color:#00f3ff;margin-bottom:15px;">Navigation</h2>
                <div style="display:flex;flex-wrap:wrap;gap:10px;">
                    <a href="${pathPrefix}index.html" style="color:#00f3ff;padding:8px 15px;border:1px solid #00f3ff;text-decoration:none;">Home</a>
                    <a href="${pathPrefix}events.html" style="color:#00f3ff;padding:8px 15px;border:1px solid #00f3ff;text-decoration:none;">Events</a>
                    <a href="${pathPrefix}contact.html" style="color:#00f3ff;padding:8px 15px;border:1px solid #00f3ff;text-decoration:none;">Contact</a>
                </div>
            </div>
            <div style="margin-top:30px;font-size:12px;color:#888;">
                <details>
                    <summary>Technical Details</summary>
                    <pre id="acumen-error-details" style="background:#000;padding:10px;overflow:auto;max-height:200px;"></pre>
                </details>
            </div>
        `;
        
        // Clear body while preserving scripts and append container
        const scripts = Array.from(document.body.querySelectorAll('script'));
        document.body.innerHTML = '';
        document.body.appendChild(container);
        scripts.forEach(script => document.body.appendChild(script));
        
        // Add button functionality
        setTimeout(() => {
            document.getElementById('acumen-fix-btn')?.addEventListener('click', applyFixes);
            document.getElementById('acumen-reload-btn')?.addEventListener('click', () => window.location.reload(true));
            
            // Show error details
            const errorDetails = document.getElementById('acumen-error-details');
            if (errorDetails) {
                errorDetails.textContent = JSON.stringify(window._errorLog, null, 2);
            }
        }, 100);
    }
    
    /**
     * Apply fixes when user clicks the button
     */
    function applyFixes() {
        // Try to include critical scripts
        ['js/emergency-fix.js', 'js/fix-paths.js', 'js/fix-all-events.js'].forEach(src => {
            const script = document.createElement('script');
            script.src = pathPrefix + src;
            document.body.appendChild(script);
        });
        
        // Try to include critical styles
        ['css/emergency-fallback.css', 'css/styles.css'].forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = pathPrefix + href;
            document.head.appendChild(link);
        });
        
        alert('Applying fixes... Page will reload in 3 seconds.');
        setTimeout(() => window.location.reload(true), 3000);
    }
    
    // Execute immediate fixes
    ensureVisibility();
    loadEmergencyScript();
    
    // Expose diagnostics function
    window.runACUMENDiagnostics = function() {
        console.log('==== ACUMEN DIAGNOSTICS ====');
        console.log('Errors logged:', window._errorCount);
        console.log('Path prefix:', pathPrefix);
        console.log('Is in subfolder:', isInSubfolder);
        console.log('Page URL:', window.location.href);
        console.log('==========================');
        return {
            errors: window._errorLog,
            pathPrefix: pathPrefix,
            isInSubfolder: isInSubfolder,
            pageUrl: window.location.href
        };
    };
})();
