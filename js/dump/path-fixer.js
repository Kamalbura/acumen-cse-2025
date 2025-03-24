/**
 * Resource Path Fixer
 * Automatically corrects image, CSS, and script paths based on page context
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix paths based on the current page location
    const isEventDetailPage = window.location.pathname.includes('/events/') && 
                             !window.location.pathname.endsWith('/events/');
    const isInSubfolder = window.location.pathname.split('/').length > 2;
    
    // Fix image paths
    fixResourcePaths('img', isEventDetailPage, isInSubfolder);
    
    // Fix CSS paths
    fixResourcePaths('css', isEventDetailPage, isInSubfolder);
    
    // Fix script paths
    fixResourcePaths('js', isEventDetailPage, isInSubfolder);
    
    /**
     * Fix resource paths for the specified resource type
     */
    function fixResourcePaths(resourceType, isEventDetailPage, isInSubfolder) {
        const selectors = {
            'img': 'img[src]',
            'css': 'link[rel="stylesheet"]',
            'js': 'script[src]'
        };
        
        const attributes = {
            'img': 'src',
            'css': 'href',
            'js': 'src'
        };
        
        const selector = selectors[resourceType];
        const attribute = attributes[resourceType];
        
        if (!selector || !attribute) return;
        
        document.querySelectorAll(selector).forEach(element => {
            const path = element.getAttribute(attribute);
            
            // Skip if no path, external URL, or data URL
            if (!path || path.startsWith('http') || path.startsWith('data:')) return;
            
            // If we're in event detail page and path doesn't already have parent directory prefix
            if (isEventDetailPage && !path.startsWith('../') && !path.startsWith('/')) {
                element.setAttribute(attribute, '../' + path);
            } 
            // If we're in another subfolder and path doesn't have correct prefix
            else if (isInSubfolder && !path.startsWith('../') && !path.startsWith('/') && !isEventDetailPage) {
                element.setAttribute(attribute, '../' + path);
            }
        });
    }
    
    // Fix navigation active links
    fixActiveNavLinks();
    
    /**
     * Ensure the correct nav link is shown as active
     */
    function fixActiveNavLinks() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop().replace('.html', '');
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            // Reset active state
            link.classList.remove('active');
            
            // Get the href and extract page name
            const href = link.getAttribute('href') || '';
            const linkPage = href.split('/').pop().replace('.html', '');
            
            // Special case for index/home
            if ((pageName === '' || pageName === 'index') && (linkPage === 'index' || linkPage === '')) {
                link.classList.add('active');
            }
            // Check if this link corresponds to current page
            else if (pageName === linkPage) {
                link.classList.add('active');
            }
            // Check if we're in events section
            else if (currentPath.includes('/events/') && linkPage === 'events') {
                link.classList.add('active');
            }
        });
    }
});
