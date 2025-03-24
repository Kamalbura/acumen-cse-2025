/**
 * Critical CSS Loader
 * Ensures core styles are loaded quickly and handles fallbacks
 */

(function() {
    // Critical CSS that should be inlined immediately
    const criticalCSS = `
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
            background-color: #0a0a1b;
            color: #fff;
            margin: 0;
            padding: 0;
            font-family: 'Rajdhani', sans-serif;
        }
        .navbar {
            background-color: #090918;
            border-bottom: 1px solid rgba(0, 243, 255, 0.2);
        }
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
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
        img {
            max-width: 100%;
            height: auto;
        }
    `;

    // Inject critical CSS
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
    
    // Set document to visible once DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });
    
    // Optimize stylesheet loading
    function optimizeStylesheets() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        
        // Mark non-critical stylesheets to load asynchronously
        stylesheets.forEach(sheet => {
            // Skip emergency or already processed stylesheets
            if (sheet.hasAttribute('data-critical') || 
                sheet.href.includes('emergency') ||
                sheet.href.includes('cross-browser')) {
                return;
            }
            
            // Make non-critical stylesheets load async
            sheet.setAttribute('media', 'print');
            sheet.setAttribute('onload', "this.media='all'");
        });
    }
    
    // Run optimization early
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeStylesheets);
    } else {
        optimizeStylesheets();
    }

    // CSS files in order of importance
    const cssFiles = [
        'css/unified-fixes.css',
        'css/cyberpunk.css',
        'css/homepage-fixes.css',
        'css/mobile-fixes.css',
        'css/cross-browser-fixes.css',
        'css/effects.css',
        'css/anti-flicker.css'
    ];

    // Check if document is ready
    function docReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Load CSS files
    function loadCSSFiles() {
        cssFiles.forEach((file, index) => {
            loadCSS(file, index === 0); // First file is critical
        });
    }

    // Load CSS file with fallback
    function loadCSS(href, isEssential = false) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        if (isEssential) {
            link.setAttribute('data-critical', 'true');
        }
        
        // Add error handling
        link.onerror = function() {
            console.warn(`Failed to load CSS: ${href}`);
            
            // If critical CSS fails, apply emergency styles
            if (isEssential) {
                applyEmergencyStyles();
            }
        };
        
        document.head.appendChild(link);
    }
    
    // Apply minimum emergency styles if critical CSS fails
    function applyEmergencyStyles() {
        console.warn('Applying emergency styles...');
        const emergencyStyle = document.createElement('style');
        emergencyStyle.textContent = `
            body {
                background-color: #060614;
                color: #ffffff;
                font-family: Arial, sans-serif;
            }
            .navbar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background-color: rgba(6, 6, 20, 0.9);
                padding: 15px 0;
                z-index: 1000;
            }
            .container {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            .hero-section {
                padding-top: 100px;
                min-height: 500px;
            }
            a {
                color: #00f3ff;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #00f3ff;
                color: #000;
                text-decoration: none;
                margin: 10px;
            }
        `;
        document.head.appendChild(emergencyStyle);
    }
    
    // Document ready handler
    docReady(() => {
        loadCSSFiles();
        
        // After 3 seconds, check if CSS is applied
        setTimeout(checkCSSLoaded, 3000);
    });
    
    // Check if CSS has been properly loaded
    function checkCSSLoaded() {
        // Simple check - test if a core style is applied
        const testEl = document.querySelector('.navbar');
        if (testEl) {
            const styles = window.getComputedStyle(testEl);
            if (!styles.backgroundColor || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
                console.warn('CSS does not appear to be loaded properly');
                applyEmergencyStyles();
            }
        }
    }
})();
