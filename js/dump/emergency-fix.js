/**
 * Emergency Fix Script for ACUMEN Website
 * Resolves blank page and critical path issues
 */

(function() {
    console.log('🛠️ Emergency fix script v2.0 activated');
    
    // Create a global reference for external access
    window.emergencyFix = {
        fixCriticalIssues: fixCriticalIssues,
        fixLoadingScreen: fixLoadingScreen,
        checkForBlankPage: checkForBlankPage,
        injectEmergencyBackupStyles: injectEmergencyBackupStyles
    };
    
    // Track the fix status to avoid duplicate fixes
    window.emergencyFixApplied = window.emergencyFixApplied || false;

    // Run immediately to catch errors early
    if (!window.emergencyFixApplied) {
        fixCriticalIssues();
        window.emergencyFixApplied = true;
    }
    
    // Also run when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        fixCriticalIssues();
        fixLoadingScreen();
        injectEmergencyBackupStyles();
    });

    // Run again after full page load to catch any missed issues
    window.addEventListener('load', function() {
        setTimeout(fixCriticalIssues, 500);
        setTimeout(checkPageRendering, 1500);
    });

    /**
     * Fix critical issues causing blank pages
     */
    function fixCriticalIssues() {
        // 1. Check if the body is actually visible
        if (document.body) {
            document.body.style.display = 'block';
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        }

        // 2. Fix resource paths based on current location
        fixResourcePaths();
        
        // 3. Make sure we have a container element
        ensureContainerExists();
        
        // 4. Check for basic content and add recovery if needed
        checkForBlankPage();
    }

    /**
     * Fix loading screen that might be stuck
     */
    function fixLoadingScreen() {
        const loadingScreens = document.querySelectorAll('.loading-screen, .page-transition-overlay');
        loadingScreens.forEach(screen => {
            // Force remove the loading screen after a delay
            setTimeout(() => {
                screen.classList.add('hide');
                setTimeout(() => {
                    if (screen.parentNode) {
                        screen.parentNode.removeChild(screen);
                    }
                }, 500);
            }, 1000);
        });
    }

    /**
     * Fix resource paths for CSS, JS, and images
     */
    function fixResourcePaths() {
        // Detect current context
        const path = window.location.pathname;
        const inEventsDir = path.includes('/events/') && !path.endsWith('/events/');
        const inSubfolder = path.split('/').length > 2;
        const pathPrefix = inEventsDir || inSubfolder ? '../' : '';
        
        // Store for global access
        window.emergencyFix.pathPrefix = pathPrefix;
        
        // Fix stylesheet paths
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('data:') || href.startsWith('../')) return;
            
            // Check if the path needs fixing
            if ((inEventsDir || inSubfolder) && 
                (href.startsWith('css/') || 
                 href.indexOf('/css/') > 0 || 
                 href.endsWith('.css'))) {
                link.href = pathPrefix + href;
            }
        });
        
        // Fix script paths
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith('../')) return;
            
            // Check if the path needs fixing
            if ((inEventsDir || inSubfolder) && 
                (src.startsWith('js/') || 
                 src.indexOf('/js/') > 0 || 
                 src.endsWith('.js'))) {
                script.src = pathPrefix + src;
            }
        });
        
        // Fix image paths
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith('../')) return;
            
            // Check if the path needs fixing
            if ((inEventsDir || inSubfolder) && 
                (src.startsWith('img/') || 
                 src.indexOf('/img/') > 0 || 
                 /\.(jpg|jpeg|png|gif|svg)$/i.test(src))) {
                img.src = pathPrefix + src;
            }
            
            // Set error handler for images
            img.onerror = function() {
                if (!this.src.includes('placeholder.jpg')) {
                    this.src = pathPrefix + 'img/placeholder.jpg';
                }
            };
        });
    }
    
    /**
     * Ensure container div exists
     */
    function ensureContainerExists() {
        if (!document.querySelector('.container, .content-container, .main-container')) {
            const main = document.querySelector('main') || document.body;
            const containerDiv = document.createElement('div');
            containerDiv.className = 'container';
            
            // Move existing content into container
            while (main.firstChild) {
                containerDiv.appendChild(main.firstChild);
            }
            
            main.appendChild(containerDiv);
        }
    }

    /**
     * Inject emergency backup styles
     */
    function injectEmergencyBackupStyles() {
        // Only add if no stylesheets have loaded
        let styleCount = document.querySelectorAll('link[rel="stylesheet"]').length;
        if (styleCount === 0 || document.body.offsetHeight < 200) {
            const emergencyStyles = document.createElement('style');
            emergencyStyles.textContent = `
                body {
                    background-color: #0a0a1b;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                .container, .main-container, .content-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .navbar, header {
                    background-color: #090918;
                    padding: 15px 0;
                    border-bottom: 1px solid #00f3ff4d;
                }
                h1, h2, h3 {
                    color: #00f3ff;
                    margin-bottom: 20px;
                }
                a {
                    color: #00f3ff;
                }
                .emergency-notice {
                    padding: 20px;
                    background-color: rgba(0, 243, 255, 0.1);
                    border-left: 4px solid #00f3ff;
                    margin-bottom: 20px;
                }
                .loading-screen, .page-transition-overlay {
                    display: none !important;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
            `;
            document.head.appendChild(emergencyStyles);
        }
    }

    /**
     * Check if the page appears blank and add recovery content if needed
     */
    function checkForBlankPage() {
        const mainContent = document.querySelector('.hero-section, .main-content, .event-details, main');
        
        // Check if page has meaningful content
        if (!mainContent || document.body.offsetHeight < 100) {
            // Create recovery content
            const recoveryContainer = document.querySelector('.container') || document.createElement('div');
            if (!recoveryContainer.classList.contains('container')) {
                recoveryContainer.className = 'container';
                document.body.appendChild(recoveryContainer);
            }
            
            // Only add recovery content if it doesn't exist already
            if (!document.querySelector('.emergency-notice')) {
                recoveryContainer.innerHTML = `
                    <div class="emergency-notice">
                        <h1>ACUMEN 2025</h1>
                        <p>We're experiencing technical difficulties with this page.</p>
                        <p>Please try one of these options:</p>
                        <button id="fix-btn" style="padding: 10px 20px; background: #00f3ff; color: #000; border: none; cursor: pointer; margin-right: 10px;">
                            Try Automatic Fix
                        </button>
                        <button id="reload-btn" style="padding: 10px 20px; background: #333; color: #fff; border: none; cursor: pointer;">
                            Reload Page
                        </button>
                    </div>
                    <div>
                        <h2>Navigation</h2>
                        <ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;">
                            <li><a href="index.html" style="color: #00f3ff; padding: 8px 15px; border: 1px solid #00f3ff; text-decoration: none; display: block;">Home</a></li>
                            <li><a href="events.html" style="color: #00f3ff; padding: 8px 15px; border: 1px solid #00f3ff; text-decoration: none; display: block;">Events</a></li>
                            <li><a href="contact.html" style="color: #00f3ff; padding: 8px 15px; border: 1px solid #00f3ff; text-decoration: none; display: block;">Contact</a></li>
                        </ul>
                    </div>
                ` + recoveryContainer.innerHTML;
                
                // Add button functionality
                setTimeout(() => {
                    document.getElementById('fix-btn')?.addEventListener('click', attemptAdvancedFix);
                    document.getElementById('reload-btn')?.addEventListener('click', () => window.location.reload(true));
                }, 100);
            }
        }
    }
    
    /**
     * Check if the page actually rendered content
     */
    function checkPageRendering() {
        // If body height is still small, something went wrong
        if (document.body.offsetHeight < 200) {
            injectEmergencyBackupStyles();
            checkForBlankPage();
            
            // Try to load essential resources
            loadEssentialResources();
        }
    }
    
    /**
     * Load essential resources dynamically
     */
    function loadEssentialResources() {
        // Determine the correct path prefix - use stored value if available
        const pathPrefix = window.emergencyFix.pathPrefix || 
                          ((window.location.pathname.split('/').length > 2) ? '../' : '');
        
        // List of critical CSS files
        const cssFiles = [
            'css/styles.css',
            'css/emergency-fallback.css',
            'css/cyberpunk.css'
        ];
        
        // Load CSS files
        cssFiles.forEach(file => {
            if (!document.querySelector(`link[href*="${file.split('/').pop()}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = pathPrefix + file;
                document.head.appendChild(link);
            }
        });
        
        // List of critical JS files
        const jsFiles = [
            'js/main.js',
            'js/path-fixer.js',
            'js/fix-events.js'
        ];
        
        // Load JS files
        jsFiles.forEach(file => {
            if (!document.querySelector(`script[src*="${file.split('/').pop()}"]`)) {
                const script = document.createElement('script');
                script.src = pathPrefix + file;
                document.body.appendChild(script);
            }
        });
    }
    
    /**
     * Attempt more advanced fixes
     */
    function attemptAdvancedFix() {
        // Fix paths with different approaches
        fixResourcePaths();
        
        // Load essential resources
        loadEssentialResources();
        
        // Try to dynamically fix specific issues
        try {
            // Fix events directory specific issues
            if (window.location.pathname.includes('/events/')) {
                // Add missing event page styles
                const eventCSS = document.createElement('link');
                eventCSS.rel = 'stylesheet';
                eventCSS.href = '../css/event-page.css';
                document.head.appendChild(eventCSS);
                
                // Fix event page scripts
                const eventScript = document.createElement('script');
                eventScript.src = '../js/event-page-functionality.js';
                document.body.appendChild(eventScript);
            }
            
            // Fix any stuck loading screens
            fixLoadingScreen();
        } catch (e) {
            console.error('Error during advanced fix:', e);
        }
        
        alert('Fix attempt complete. Page will now reload.');
        window.location.reload(true);
    }
})();
