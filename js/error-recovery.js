/**
 * Error Recovery System
 * Provides robust error handling and recovery for the entire site
 */

const ErrorRecovery = (function() {
    // Error tracking
    const errors = [];
    let errorCount = 0;
    let recoveryAttempts = 0;
    let isRecoveryMode = false;
    
    // Initialize error recovery system
    function init() {
        console.log('🛡️ Initializing Error Recovery System');
        
        // Set up global error handler
        setupErrorHandler();
        
        // Check initial page state
        setTimeout(checkInitialState, 1000);
        
        // Add emergency styles
        injectEmergencyStyles();
    }
    
    /**
     * Set up global error handler
     */
    function setupErrorHandler() {
        window.addEventListener('error', function(event) {
            // Log the error
            const error = {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                timestamp: new Date().toISOString()
            };
            
            errors.push(error);
            errorCount++;
            
            console.error(`Error ${errorCount}: ${error.message} at ${error.source}:${error.line}`);
            
            // Check if recovery is needed
            if (errorCount >= 3 && !isRecoveryMode) {
                enterRecoveryMode();
            }
            
            return false; // Allow other error handlers
        }, true);
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            errors.push({
                message: event.reason || 'Unhandled Promise Rejection',
                timestamp: new Date().toISOString()
            });
            
            errorCount++;
        });
        
        // Handle loading errors for resources
        document.addEventListener('error', function(event) {
            const target = event.target;
            
            // Handle image loading errors
            if (target.tagName === 'IMG' && !target.hasAttribute('data-recovery-attempted')) {
                target.setAttribute('data-recovery-attempted', 'true');
                handleImageError(target);
            }
        }, true);
    }
    
    /**
     * Check the initial state of the page
     */
    function checkInitialState() {
        // Check if page has visible content
        const hasVisibleContent = document.body.offsetHeight > 100;
        const hasMainContent = !!document.querySelector('.container') || 
                              !!document.querySelector('main') || 
                              !!document.querySelector('.hero-section');
        
        if (!hasVisibleContent || !hasMainContent) {
            console.warn('Page appears to be blank or has minimal content');
            enterRecoveryMode();
        }
        
        // Check for stuck loading screen
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen && !loadingScreen.classList.contains('hide')) {
            console.warn('Loading screen appears to be stuck');
            loadingScreen.classList.add('hide');
            
            // Remove after animation
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
    }
    
    /**
     * Enter recovery mode
     */
    function enterRecoveryMode() {
        if (isRecoveryMode) return;
        
        isRecoveryMode = true;
        recoveryAttempts++;
        
        console.warn(`Entering recovery mode (attempt ${recoveryAttempts})`);
        
        // Add recovery mode class to body
        document.body.classList.add('recovery-mode');
        
        // If too many attempts, create emergency interface
        if (recoveryAttempts >= 2) {
            createEmergencyInterface();
            return;
        }
        
        // Otherwise try automatic recovery
        try {
            // Force fix resource paths
            if (typeof ResourceManager !== 'undefined') {
                ResourceManager.init();
            } else {
                fixResourcePaths();
            }
            
            // Force remove loading screen
            document.querySelectorAll('.loading-screen, .page-transition-overlay').forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
            
            // Ensure body is visible
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
            
            // Load critical resources
            loadCriticalResources();
            
            // Add notice to inform user
            addRecoveryNotice();
        } catch (e) {
            console.error('Recovery attempt failed:', e);
            createEmergencyInterface();
        }
    }
    
    /**
     * Create emergency interface when recovery fails
     */
    function createEmergencyInterface() {
        console.warn('Creating emergency interface');
        
        // Save scripts to preserve them when clearing body
        const scripts = Array.from(document.body.querySelectorAll('script'));
        
        // Create emergency container
        const emergencyContainer = document.createElement('div');
        emergencyContainer.className = 'emergency-container';
        emergencyContainer.innerHTML = `
            <div class="emergency-notice">
                <h1>ACUMEN 2025</h1>
                <p>We're experiencing technical difficulties with this page.</p>
                <p>Please try one of these options:</p>
                <div class="emergency-actions">
                    <button id="fix-btn" class="emergency-btn">
                        Try Automatic Fix
                    </button>
                    <button id="reload-btn" class="emergency-btn secondary">
                        Reload Page
                    </button>
                </div>
            </div>
            <div class="emergency-nav">
                <h2>Navigation</h2>
                <div class="emergency-links">
                    <a href="index.html">Home</a>
                    <a href="events.html">Events</a>
                    <a href="contact.html">Contact</a>
                </div>
            </div>
            <div class="emergency-details">
                <details>
                    <summary>Technical Details</summary>
                    <pre id="error-details"></pre>
                </details>
            </div>
        `;
        
        // Clear body and add emergency container
        document.body.innerHTML = '';
        document.body.appendChild(emergencyContainer);
        
        // Add back scripts
        scripts.forEach(script => document.body.appendChild(script));
        
        // Add error details
        document.getElementById('error-details').textContent = 
            JSON.stringify(errors, null, 2);
        
        // Add button functionality
        document.getElementById('fix-btn').addEventListener('click', attemptManualFix);
        document.getElementById('reload-btn').addEventListener('click', () => {
            window.location.reload(true);
        });
    }
    
    /**
     * Add a notice to inform user of recovery
     */
    function addRecoveryNotice() {
        const notice = document.createElement('div');
        notice.className = 'recovery-notice';
        notice.innerHTML = `
            <p>We've detected and fixed some issues with this page.</p>
            <button id="reload-btn">Reload Page</button>
            <button id="dismiss-btn">Dismiss</button>
        `;
        
        document.body.appendChild(notice);
        
        document.getElementById('reload-btn').addEventListener('click', () => {
            window.location.reload(true);
        });
        
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            notice.classList.add('hide');
            setTimeout(() => {
                if (notice.parentNode) notice.parentNode.removeChild(notice);
            }, 300);
        });
    }
    
    /**
     * Inject emergency styles
     */
    function injectEmergencyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .emergency-container {
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
            }
            
            .emergency-notice {
                padding: 20px;
                background-color: rgba(0, 243, 255, 0.1);
                border-left: 4px solid #00f3ff;
                margin-bottom: 30px;
            }
            
            .emergency-actions {
                margin-top: 20px;
                display: flex;
                gap: 10px;
            }
            
            .emergency-btn {
                padding: 10px 20px;
                background: #00f3ff;
                color: #000;
                border: none;
                cursor: pointer;
            }
            
            .emergency-btn.secondary {
                background: #333;
                color: #fff;
            }
            
            .emergency-links {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }
            
            .emergency-links a {
                color: #00f3ff;
                padding: 8px 15px;
                border: 1px solid #00f3ff;
                text-decoration: none;
            }
            
            .emergency-details {
                margin-top: 30px;
                font-size: 12px;
                color: #888;
            }
            
            #error-details {
                background: #000;
                padding: 10px;
                overflow: auto;
                max-height: 200px;
                color: #ddd;
                font-family: monospace;
            }
            
            .recovery-notice {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.8);
                border: 1px solid #00f3ff;
                padding: 15px;
                color: #fff;
                z-index: 9999;
                max-width: 300px;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .recovery-notice.hide {
                opacity: 0;
                transform: translateY(30px);
            }
            
            .recovery-notice button {
                background: #00f3ff;
                color: #000;
                border: none;
                padding: 5px 10px;
                margin-right: 10px;
                margin-top: 10px;
                cursor: pointer;
            }
            
            .recovery-notice button#dismiss-btn {
                background: transparent;
                color: #aaa;
                border: 1px solid #aaa;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Handle image loading errors
     */
    function handleImageError(img) {
        const src = img.getAttribute('src');
        console.warn(`Image failed to load: ${src}`);
        
        // Determine if we're in a subfolder
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        // Try with placeholder
        img.src = pathPrefix + 'img/placeholder.jpg';
        
        // If that fails too, use inline SVG
        img.onerror = function() {
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${img.width || 300}" height="${img.height || 200}" 
                     viewBox="0 0 300 200" fill="none">
                    <rect width="300" height="200" fill="#0a0a1b"/>
                    <path d="M150 80L180 140H120L150 80Z" fill="#00f3ff"/>
                    <text x="150" y="180" text-anchor="middle" fill="#00f3ff" 
                          font-family="sans-serif" font-size="14">Image Not Found</text>
                </svg>
            `;
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        };
    }
    
    /**
     * Fix resource paths (simplified version as backup)
     */
    function fixResourcePaths() {
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        if (isInSubfolder) {
            // Fix CSS paths
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('../') && !href.startsWith('/')) {
                    link.href = pathPrefix + href;
                }
            });
            
            // Fix JS paths
            document.querySelectorAll('script[src]').forEach(script => {
                const src = script.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
                    script.src = pathPrefix + src;
                }
            });
            
            // Fix image paths
            document.querySelectorAll('img[src]').forEach(img => {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('../') && !src.startsWith('/')) {
                    img.src = pathPrefix + src;
                }
            });
        }
    }
    
    /**
     * Load critical resources as fallback
     */
    function loadCriticalResources() {
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        // Essential CSS
        const cssFiles = [
            'css/emergency-fallback.css',
            'css/styles.css'
        ];
        
        // Essential JS
        const jsFiles = [
            'js/main.js'
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
     * Attempt manual fix when user clicks the button
     */
    function attemptManualFix() {
        alert('Applying fixes. The page will reload after the fixes are applied.');
        
        // Fix paths
        fixResourcePaths();
        
        // Try to load critical resources
        loadCriticalResources();
        
        // Reload after a delay
        setTimeout(() => window.location.reload(true), 1000);
    }
    
    // Public API
    return {
        init,
        getErrors: () => errors,
        isInRecoveryMode: () => isRecoveryMode
    };
})();

// Initialize immediately
ErrorRecovery.init();

/**
 * Error Recovery Script
 * Handles runtime errors and ensures the site remains usable
 */

(function() {
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Set up monitoring for style errors
        monitorStyleErrors();
        fixMissingStyles();
        ensureNavbarFunctionality();
        recoverFromImageErrors();
    });

    /**
     * Monitor for visible style errors
     */
    function monitorStyleErrors() {
        // Check every 5 seconds for common styling issues
        setInterval(function() {
            // Check if the body has background color - a sign that CSS is working
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            if (bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent') {
                console.warn('Body background missing, reapplying styles');
                applyBackupBodyStyles();
            }

            // Check if main sections are visible
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const display = window.getComputedStyle(section).display;
                if (display === 'none') {
                    section.style.display = 'block';
                }
            });

            // Check if navbar is positioned correctly
            const navbar = document.querySelector('.navbar');
            if (navbar && window.getComputedStyle(navbar).position !== 'fixed') {
                navbar.style.position = 'fixed';
                navbar.style.top = '0';
                navbar.style.left = '0';
                navbar.style.width = '100%';
                navbar.style.zIndex = '1000';
            }
        }, 5000);
    }

    /**
     * Apply backup body styles if main styles failed
     */
    function applyBackupBodyStyles() {
        document.body.style.backgroundColor = '#060614';
        document.body.style.color = '#ffffff';
        document.body.style.fontFamily = "'Rajdhani', Arial, sans-serif";
    }

    /**
     * Fix missing styles for critical elements
     */
    function fixMissingStyles() {
        // Fix hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && !window.getComputedStyle(heroSection).height) {
            heroSection.style.height = '100vh';
            heroSection.style.display = 'flex';
            heroSection.style.alignItems = 'center';
            heroSection.style.position = 'relative';
            heroSection.style.overflow = 'hidden';
            heroSection.style.backgroundColor = 'rgba(6, 6, 20, 0.7)';
            heroSection.style.marginTop = '70px';
        }

        // Fix buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (!window.getComputedStyle(btn).backgroundColor) {
                if (btn.classList.contains('btn-primary')) {
                    btn.style.backgroundColor = '#00f3ff';
                    btn.style.color = '#060614';
                } else {
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#00f3ff';
                    btn.style.border = '1px solid #00f3ff';
                }
                btn.style.padding = '12px 25px';
                btn.style.textTransform = 'uppercase';
                btn.style.cursor = 'pointer';
            }
        });

        // Fix countdown container
        const countdown = document.querySelector('.countdown-container');
        if (countdown) {
            countdown.style.backgroundColor = 'rgba(9, 9, 24, 0.8)';
            countdown.style.padding = '20px';
            countdown.style.marginTop = '40px';
        }

        // Fix event cards
        document.querySelectorAll('.event-card').forEach(card => {
            card.style.backgroundColor = 'rgba(10, 10, 27, 0.7)';
            card.style.border = '1px solid rgba(0, 243, 255, 0.5)';
            card.style.overflow = 'hidden';
            card.style.borderRadius = '5px';
            card.style.marginBottom = '20px';
        });
    }

    /**
     * Ensure navbar works even without CSS
     */
    function ensureNavbarFunctionality() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                // If CSS transitions aren't working, handle toggle manually
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navLinks.style.right = '-100%';
                } else {
                    navLinks.classList.add('active');
                    navLinks.style.right = '0';
                }
            });
        }
    }

    /**
     * Recover from image loading errors
     */
    function recoverFromImageErrors() {
        document.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                // Apply placeholder background color
                this.style.backgroundColor = '#0a0a1b';
                
                // Add a fallback text with the image alt or filename
                const altText = this.alt || this.src.split('/').pop().split('.')[0] || 'Image';
                
                // Create SVG fallback
                const svgFallback = `
                    <svg width="${this.width || 300}" height="${this.height || 200}" 
                         xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#0a0a1b"/>
                        <text x="50%" y="50%" fill="#00f3ff" text-anchor="middle" dominant-baseline="middle"
                              font-family="Arial" font-size="16">
                            ${altText}
                        </text>
                    </svg>
                `;
                
                this.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgFallback)}`;
            };
        });
    }
})();
