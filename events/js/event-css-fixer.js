/**
 * Event CSS Fixer
 * This script ensures all event pages have the correct CSS references
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on an event page
    if (document.location.pathname.includes('/events/')) {
        console.log('Event page detected. Running CSS integrity check...');
        
        // Check for the required CSS files
        const requiredCss = [
            '../css/styles.css',
            '../css/cyberpunk.css',
            'css/event-page.css'
        ];
        
        const currentLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .map(link => link.getAttribute('href'));
        
        // Log missing required CSS files
        const missingCss = requiredCss.filter(css => !currentLinks.includes(css));
        if (missingCss.length > 0) {
            console.warn('Missing required CSS files:', missingCss);
        }
        
        // Check for duplicate or unnecessary CSS files
        const unnecessaryCss = currentLinks.filter(href => 
            href && 
            !requiredCss.includes(href) && 
            !href.includes('font-awesome') && 
            !href.includes('fonts.googleapis.com')
        );
        
        if (unnecessaryCss.length > 0) {
            console.warn('Unnecessary CSS files detected:', unnecessaryCss);
        }
    }
});
