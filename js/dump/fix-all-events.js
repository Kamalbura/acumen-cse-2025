/**
 * Fix All Event Pages
 * This script adds special path protection to all event detail pages
 */

(function() {
    // Execute immediately for events pages
    if (window.location.pathname.includes('/events/')) {
        fixEventPagePaths();
    }
    
    /**
     * Fix paths specifically for event detail pages
     */
    function fixEventPagePaths() {
        console.log('🔧 Running event page path fixes');
        
        // Fix CSS paths
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('../') && !href.startsWith('/')) {
                link.setAttribute('href', '../' + href);
            }
        });
        
        // Fix JS paths
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
                script.setAttribute('src', '../' + src);
            }
        });
        
        // Fix image paths
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('../') && !src.startsWith('/')) {
                img.setAttribute('src', '../' + src);
            }
            
            // Add error handling for images
            img.onerror = function() {
                // Only replace if not already set to placeholder
                if (!this.src.includes('placeholder') && !this.src.includes('default')) {
                    this.src = '../img/placeholder.jpg';
                    this.alt = this.alt || 'Image not available';
                }
            };
        });
        
        // Fix background images in inline styles
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('url(') && !style.includes('url(\'../') && 
                !style.includes('url("../') && !style.includes('url(../') && 
                !style.includes('url(http') && !style.includes('url(data:')) {
                
                // Replace url() with prefixed url()
                const newStyle = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
                    if (!url.startsWith('../') && !url.startsWith('/') && !url.startsWith('http')) {
                        return `url('../${url}')`;
                    }
                    return match;
                });
                
                el.setAttribute('style', newStyle);
            }
        });
        
        // Add common event page CSS if missing
        if (!document.querySelector('link[href*="event-page.css"]')) {
            const eventStyles = document.createElement('link');
            eventStyles.rel = 'stylesheet';
            eventStyles.href = '../css/event-page.css';
            document.head.appendChild(eventStyles);
        }
        
        // Add event functionality scripts if missing
        if (!document.querySelector('script[src*="event-page-functionality.js"]')) {
            const eventScript = document.createElement('script');
            eventScript.src = '../js/event-page-functionality.js';
            document.body.appendChild(eventScript);
        }
    }
    
    // Also run on DOMContentLoaded as a safety measure
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.pathname.includes('/events/')) {
            fixEventPagePaths();
            
            // Add a flag to body for CSS targeting
            document.body.classList.add('event-detail-page');
            
            // Set event category if needed and possible
            const eventCategory = getEventCategory();
            if (eventCategory) {
                document.body.setAttribute('data-category', eventCategory);
                
                const heroSection = document.querySelector('.event-hero');
                if (heroSection) {
                    heroSection.setAttribute('data-category', eventCategory);
                }
            }
        }
    });
    
    /**
     * Try to determine event category from the page content
     */
    function getEventCategory() {
        // First check for meta tag
        const metaCategory = document.querySelector('meta[name="event-category"]');
        if (metaCategory) {
            return metaCategory.getAttribute('content');
        }
        
        // Look for category badge
        const badge = document.querySelector('.event-badge, .category-badge');
        if (badge) {
            return badge.textContent.trim().toLowerCase();
        }
        
        // Try to infer from page content
        const content = document.body.textContent.toLowerCase();
        
        if (content.includes('coding') || content.includes('programming') || content.includes('code')) {
            return 'coding';
        } else if (content.includes('gaming') || content.includes('game') || content.includes('pubg') || 
                  content.includes('valorant') || content.includes('esports')) {
            return 'gaming';
        } else if (content.includes('hackathon')) {
            return 'hackathon';
        } else if (content.includes('non-technical') || content.includes('non technical')) {
            return 'non-technical';
        }
        
        // Default to technical
        return 'technical';
    }
})();
