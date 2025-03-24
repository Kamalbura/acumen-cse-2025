/**
 * Mobile Viewport Height Fixer
 * Fixes the 100vh bug on mobile browsers - particularly on iOS
 */

(function() {
    // Set CSS variable for viewport height
    function setViewportHeight() {
        // First we get the viewport height and multiple it by 1% to get a value for a vh unit
        const vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set it on initial load
    setViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', function() {
        // Slight delay on orientation change for browsers to catch up
        setTimeout(setViewportHeight, 100);
    });
})();
