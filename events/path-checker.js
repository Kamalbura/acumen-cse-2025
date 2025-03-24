/**
 * Event Page Path Checker
 * Runs diagnostics and fixes paths specifically for event detail pages
 */

(function() {
    console.log('🔍 Event page path checker running...');
    
    // Run checks
    checkPageIsLoaded();
    
    /**
     * Check if page is properly loaded
     */
    function checkPageIsLoaded() {
        // If we don't see basic elements, we might have a loading issue
        if (!document.querySelector('.event-hero') && !document.querySelector('.event-content')) {
            console.warn('Event page structure not found, applying fixes...');
            applyEmergencyFixes();
        } else {
            console.log('✅ Event page structure verified');
            fixRemainingPaths();
        }
    }
    
    /**
     * Apply emergency fixes for event page
     */
    function applyEmergencyFixes() {
        // 1. Fix CSS references
        const styles = ['../css/styles.css', '../css/event-page.css', '../css/cyberpunk.css'];
        styles.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        });
        
        // 2. Fix JS references
        const scripts = ['../js/main.js', '../js/event-page-functionality.js', '../js/emergency-fix.js'];
        scripts.forEach(src => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement('script');
                script.src = src;
                document.body.appendChild(script);
            }
        });
        
        // 3. Fix images
        document.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('../') && !src.startsWith('http')) {
                img.src = '../' + src;
            }
            
            // Add error handler
            img.onerror = function() {
                console.warn('Image failed to load:', this.src);
                if (!this.src.includes('placeholder.jpg')) {
                    this.src = '../img/placeholder.jpg';
                }
            };
        });
    }
    
    /**
     * Fix any remaining path issues
     */
    function fixRemainingPaths() {
        // Check for background image paths in inline styles
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('url(') && 
                !style.includes('url(../') && 
                !style.includes('url("../') && 
                !style.includes('url(\'../') && 
                !style.includes('http') && 
                !style.includes('data:')) {
                
                // Fix the path by adding ../
                const newStyle = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, path) => {
                    if (path.startsWith('/')) return match;
                    return `url('../${path}')`;
                });
                
                el.setAttribute('style', newStyle);
            }
        });
        
        // Check for category information
        const eventCategory = document.querySelector('meta[name="event-category"]')?.getAttribute('content') || 
                             getEventCategoryFromContent();
        
        if (eventCategory) {
            document.body.setAttribute('data-category', eventCategory);
            
            const heroSection = document.querySelector('.event-hero, .event-banner');
            if (heroSection) {
                heroSection.setAttribute('data-category', eventCategory);
            }
        }
    }
    
    /**
     * Try to determine event category from content
     */
    function getEventCategoryFromContent() {
        const content = document.body.textContent.toLowerCase();
        const pageUrl = window.location.pathname.toLowerCase();
        
        if (pageUrl.includes('code') || pageUrl.includes('hack') || 
            content.includes('coding') || content.includes('programming')) {
            return 'coding';
        }
        
        if (pageUrl.includes('game') || pageUrl.includes('pubg') || pageUrl.includes('valorant') ||
            content.includes('gaming') || content.includes('tournament')) {
            return 'gaming';
        }
        
        if (pageUrl.includes('hackathon') || content.includes('hackathon')) {
            return 'hackathon';
        }
        
        if (pageUrl.includes('non-tech') || content.includes('non-technical')) {
            return 'non-technical';
        }
        
        return 'technical'; // Default
    }
})();
