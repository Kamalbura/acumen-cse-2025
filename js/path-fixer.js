/**
 * Path Fixer
 * Handles path resolution issues between main pages and subpages
 */
(function() {
    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Fix paths on load
        fixPaths();
        
        // Fix event links
        fixEventLinks();
        
        // Enable mobile navigation
        setupMobileNavigation();
    });
    
    // Fix paths based on current page location
    function fixPaths() {
        // Check if we're in a subfolder (e.g., /events/)
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        
        if (isInSubfolder) {
            const pathPrefix = '../';
            
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
                if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/') && !src.startsWith('data:')) {
                    img.src = pathPrefix + src;
                }
            });
            
            // Fix form actions
            document.querySelectorAll('form[action]').forEach(form => {
                const action = form.getAttribute('action');
                if (action && !action.startsWith('http') && !action.startsWith('../') && !action.startsWith('/')) {
                    form.action = pathPrefix + action;
                }
            });
        }
    }
    
    // Fix event link inconsistencies
    function fixEventLinks() {
        const eventLinkMappings = {
            'sherlock-holmes.html': 'sherlock-homies.html',
            'human-snakes-ladders.html': 'snakes-and-ladders.html',
            'three-legged-maze.html': 'squid-gaming.html'
            // Add more mappings as needed
        };
        
        // Fix links
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if link points to an event with an incorrect filename
            for (const [incorrect, correct] of Object.entries(eventLinkMappings)) {
                if (href.includes(incorrect)) {
                    link.href = href.replace(incorrect, correct);
                    console.log(`Fixed link: ${incorrect} → ${correct}`);
                    break;
                }
            }
            
            // Fix missing paths for event links from main page to events folder
            if (href.match(/^events\//) && !window.location.pathname.includes('/events/')) {
                // Already correct, keep as is
            } else if (href.match(/^\/events\//) && !window.location.pathname.includes('/events/')) {
                // Remove leading slash if present
                link.href = href.replace(/^\//, '');
            }
        });
    }
    
    // Ensure mobile navigation works consistently
    function setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            // Remove any existing click handlers
            const newNavToggle = navToggle.cloneNode(true);
            navToggle.parentNode.replaceChild(newNavToggle, navToggle);
            
            // Add fresh click handler
            newNavToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                
                // Apply direct styles for browsers without proper CSS support
                if (navLinks.classList.contains('active')) {
                    navLinks.style.right = '0';
                    navLinks.style.visibility = 'visible';
                    navLinks.style.opacity = '1';
                } else {
                    navLinks.style.right = '-100%';
                }
            });
        }
    }
})();
