/**
 * Font Loading Fix
 * Implements font loading strategy to avoid FOUT/FOIT and prevent flickering
 */

(function() {
    // Mark the document for CSS transitions to be temporarily disabled
    document.documentElement.classList.add('preload');
    document.documentElement.classList.add('fonts-loading');
    
    // Check if the browser supports the Font Loading API
    if ('fonts' in document) {
        // Define our primary fonts we want to ensure are loaded
        Promise.all([
            document.fonts.load('1em Orbitron'),
            document.fonts.load('1em Rajdhani')
        ]).then(() => {
            // Fonts are loaded, remove loading classes
            document.documentElement.classList.remove('fonts-loading');
            
            // Allow transitions after a slight delay to ensure rendering is complete
            setTimeout(() => {
                document.documentElement.classList.remove('preload');
            }, 100);
            
            console.log('Fonts loaded successfully');
        }).catch(err => {
            // On error, still remove classes but log the error
            document.documentElement.classList.remove('fonts-loading');
            document.documentElement.classList.remove('preload');
            console.warn('Font loading error:', err);
        });
    } else {
        // Fallback for browsers without Font Loading API
        // Use a simple timeout to approximate font loading time
        setTimeout(() => {
            document.documentElement.classList.remove('fonts-loading');
            document.documentElement.classList.remove('preload');
        }, 300);
    }
    
    // Failsafe - ensure classes are removed even if something goes wrong
    setTimeout(() => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.remove('preload');
    }, 1000);
})();
