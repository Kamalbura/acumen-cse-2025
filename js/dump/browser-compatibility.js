/**
 * Browser Compatibility Script
 * Provides fixes and fallbacks for various browser-specific issues
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect browser
    const browser = detectBrowser();
    document.body.setAttribute('data-browser', browser);
    
    // Apply browser-specific fixes
    applyBrowserFixes(browser);
    
    // Fix iOS-specific issues
    fixIOSIssues();
    
    // Fix Safari-specific issues
    fixSafariIssues();
    
    // Fix Internet Explorer issues
    fixIEIssues();
    
    /**
     * Detect browser name and version
     */
    function detectBrowser() {
        const userAgent = navigator.userAgent;
        let browser = 'unknown';
        
        if (userAgent.indexOf('Firefox') > -1) {
            browser = 'firefox';
        } else if (userAgent.indexOf('SamsungBrowser') > -1) {
            browser = 'samsung';
        } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            browser = 'opera';
        } else if (userAgent.indexOf('Trident') > -1 || userAgent.indexOf('MSIE') > -1) {
            browser = 'ie';
        } else if (userAgent.indexOf('Edge') > -1) {
            browser = 'edge';
        } else if (userAgent.indexOf('Chrome') > -1) {
            browser = 'chrome';
        } else if (userAgent.indexOf('Safari') > -1) {
            browser = 'safari';
        }
        
        return browser;
    }
    
    /**
     * Apply fixes based on detected browser
     */
    function applyBrowserFixes(browser) {
        if (browser === 'ie' || browser === 'edge') {
            document.body.classList.add('ms-browser');
            fixFlexboxIssues();
        }
        
        if (browser === 'safari') {
            document.body.classList.add('safari-browser');
        }
        
        if (browser === 'firefox') {
            document.body.classList.add('firefox-browser');
        }
    }
    
    /**
     * Fix iOS-specific issues
     */
    function fixIOSIssues() {
        // Check if iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (!isIOS) return;
        
        document.body.classList.add('ios-device');
        
        // Fix 100vh issue on iOS
        const fixVh = () => {
            // First we get the viewport height and multiply it by 1% to get a value for a vh unit
            const vh = window.innerHeight * 0.01;
            // Then we set the value in the --vh custom property to the root of the document
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        // Run the function immediately and on resize
        fixVh();
        window.addEventListener('resize', fixVh);
        
        // Fix hover effects on iOS
        document.querySelectorAll('.has-hover-effect').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('hover-activated');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('hover-activated');
                }, 300);
            });
        });
    }
    
    /**
     * Fix Safari-specific issues
     */
    function fixSafariIssues() {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!isSafari) return;
        
        // Fix for flexbox gap
        if (!CSS.supports('gap', '1px')) {
            document.querySelectorAll('.events-grid, .team-grid').forEach(grid => {
                const items = grid.children;
                for (let i = 0; i < items.length; i++) {
                    items[i].style.margin = '15px';
                }
            });
        }
        
        // Fix for some issues with position: sticky
        document.querySelectorAll('.sticky-element').forEach(elem => {
            const parent = elem.parentElement;
            parent.style.position = 'relative';
        });
    }
    
    /**
     * Fix Internet Explorer issues
     */
    function fixIEIssues() {
        // Check if IE
        const isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (!isIE) return;
        
        // Apply warning for IE users
        const warningBanner = document.createElement('div');
        warningBanner.className = 'browser-warning';
        warningBanner.innerHTML = `
            <p><strong>Internet Explorer is not fully supported.</strong> For the best experience, please use a modern browser like Chrome, Firefox, Edge, or Safari.</p>
            <button class="close-warning">&times;</button>
        `;
        document.body.insertAdjacentElement('afterbegin', warningBanner);
        
        // Add close button functionality
        warningBanner.querySelector('.close-warning').addEventListener('click', function() {
            warningBanner.style.display = 'none';
        });
        
        // Fix for CSS variables
        if (window.cssVars) {
            cssVars();
        }
    }
    
    /**
     * Fix flexbox issues in older browsers
     */
    function fixFlexboxIssues() {
        // Check for flex gap support
        if (!CSS.supports('gap', '1px')) {
            document.querySelectorAll('.flex-container').forEach(container => {
                const items = container.querySelectorAll('.flex-item');
                for (let i = 0; i < items.length; i++) {
                    items[i].style.margin = '10px';
                }
            });
        }
    }
});
