/**
 * Mobile Background Fix
 * Ensures backgrounds display correctly on mobile devices with various configurations
 */
(function() {
    // Run immediately and also wait for DOM content loaded
    fixMobileBackground();
    document.addEventListener('DOMContentLoaded', fixMobileBackground);
    window.addEventListener('load', fixMobileBackground);
    
    // Fix background on resize and orientation change
    window.addEventListener('resize', fixMobileBackground);
    window.addEventListener('orientationchange', function() {
        setTimeout(fixMobileBackground, 100);
    });
    
    /**
     * Main function to fix mobile background issues
     */
    function fixMobileBackground() {
        // Only run on mobile devices
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 
            window.innerWidth >= 768) {
            return;
        }
        
        console.log('📱 Fixing mobile background');
        
        // Add CSS fixes for mobile backgrounds
        if (!document.getElementById('mobile-bg-fix-style')) {
            const style = document.createElement('style');
            style.id = 'mobile-bg-fix-style';
            style.textContent = `
                /* Ensure the body has a solid background color as fallback */
                body {
                    background-color: #101025 !important;
                }
                
                /* Reset any transform that might cause issues */
                body::before {
                    transform: none !important;
                    transform-origin: center center !important;
                    opacity: 1 !important;
                }
                
                /* Primary mobile background with better positioning */
                .mobile-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -10;
                    display: block !important;
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                    pointer-events: none;
                }
                
                /* Fix iOS specific background issues */
                @supports (-webkit-touch-callout: none) {
                    .mobile-background {
                        background-attachment: scroll;
                        height: 100vh;
                        height: -webkit-fill-available;
                    }
                }
                
                /* Adjusted card transparency for better readability on mobile */
                @media (max-width: 768px) {
                    .card,
                    .event-card,
                    .sponsor-card,
                    .venue-card,
                    .team-member-card {
                        background-color: rgba(10, 10, 27, 0.85) !important;
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                    }
                    
                    .navbar, 
                    .footer {
                        background-color: rgba(8, 8, 24, 0.95) !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create mobile background element if it doesn't exist
        let mobileBg = document.querySelector('.mobile-background');
        if (!mobileBg) {
            mobileBg = document.createElement('div');
            mobileBg.className = 'mobile-background';
            document.body.insertBefore(mobileBg, document.body.firstChild);
        }
        
        // Set the correct background image
        const isPortrait = window.innerHeight > window.innerWidth;
        const bgPath = isPortrait ? 'img/background-mobile.jpg' : 'img/background.jpg';
        
        // Try to load the targeted background first
        loadImageWithFallback(bgPath, ['img/background2.jpg', 'img/background.jpg'], function(validPath) {
            mobileBg.style.backgroundImage = `url('${validPath}')`;
            console.log(`📱 Using background: ${validPath}`);
            
            // Adjust background display based on orientation
            if (isPortrait) {
                // Portrait mode
                mobileBg.style.backgroundSize = '100% auto';
            } else {
                // Landscape mode
                mobileBg.style.backgroundSize = 'cover';
            }
        });
        
        // Add a fallback background color if all else fails
        setTimeout(function() {
            // If the background element has no background image set by now, apply a gradient
            const computedStyle = window.getComputedStyle(mobileBg);
            if (!computedStyle.backgroundImage || computedStyle.backgroundImage === 'none') {
                mobileBg.style.background = 'linear-gradient(45deg, #101025, #1a1a40)';
                console.log('📱 Using fallback background gradient');
            }
        }, 1000);
    }
    
    /**
     * Helper function to load an image with fallbacks
     */
    function loadImageWithFallback(primaryPath, fallbackPaths, callback) {
        const img = new Image();
        img.onload = function() {
            callback(primaryPath);
        };
        img.onerror = function() {
            // Try the first fallback if available
            if (fallbackPaths && fallbackPaths.length > 0) {
                const nextPath = fallbackPaths.shift();
                console.log(`📱 Primary background failed, trying: ${nextPath}`);
                loadImageWithFallback(nextPath, fallbackPaths, callback);
            } else {
                // All paths failed, use a data URI as last resort
                const fallbackSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
                        <rect width="100%" height="100%" fill="#101025"/>
                        <radialGradient id="grad" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                            <stop offset="0%" style="stop-color:#1a1a40;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#101025;stop-opacity:1" />
                        </radialGradient>
                        <rect width="100%" height="100%" fill="url(#grad)"/>
                    </svg>
                `;
                const fallbackUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallbackSvg)}`;
                callback(fallbackUri);
                console.log('📱 Using SVG fallback background');
            }
        };
        img.src = primaryPath;
    }
})();
