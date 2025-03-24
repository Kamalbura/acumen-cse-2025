/**
 * Image Loader
 * Handles lazy loading and error recovery for images
 */
(function() {
    // Keep track of failed images
    const failed = new Set();
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        setupImageErrorHandling();
        setupLazyLoading();
    });
    
    /**
     * Set up error handling for all images
     */
    function setupImageErrorHandling() {
        // Global error event capture for images
        document.addEventListener('error', function(e) {
            const target = e.target;
            
            if (target.tagName === 'IMG' && !target.hasAttribute('data-error-handled')) {
                console.warn(`Image failed to load: ${target.src}`);
                
                // Mark as handled to prevent infinite loops
                target.setAttribute('data-error-handled', 'true');
                
                // Apply appropriate placeholder based on context
                applyPlaceholder(target);
            }
        }, true);
        
        // Check existing images that might have already failed
        document.querySelectorAll('img').forEach(img => {
            // If image is broken or has empty src
            if (img.complete && (img.naturalHeight === 0 || !img.src)) {
                applyPlaceholder(img);
            }
        });
    }
    
    /**
     * Apply placeholder to failed images
     */
    function applyPlaceholder(img) {
        // Skip if already handled to avoid loops
        if (failed.has(img.src)) return;
        failed.add(img.src);
        
        // Save original source for debugging
        if (!img.hasAttribute('data-original-src')) {
            img.setAttribute('data-original-src', img.src || '');
        }
        
        // Determine if we're in a subfolder
        const isInSubfolder = window.location.pathname.split('/').length > 2;
        const pathPrefix = isInSubfolder ? '../' : '';
        
        // Try to fix path first if it seems like a path issue
        if (!img.src.startsWith('http') && !img.src.startsWith('data:') && isInSubfolder && !img.src.startsWith('../')) {
            img.src = pathPrefix + img.getAttribute('data-original-src');
            return;
        }
        
        // Apply appropriate placeholder based on context
        if (img.closest('.sponsor-card')) {
            img.src = pathPrefix + 'img/sponsors/placeholder-sponsor.png';
        } else if (img.closest('.event-card')) {
            img.src = pathPrefix + 'img/events/placeholder-event.jpg';
        } else if (img.closest('.team-member')) {
            img.src = pathPrefix + 'img/team/placeholder-person.jpg';
        } else {
            img.src = pathPrefix + 'img/placeholder.jpg';
        }
        
        // Add a subtle "image not found" indicator
        img.style.border = '1px dashed rgba(255, 255, 255, 0.3)';
    }
    
    /**
     * Set up lazy loading for images
     */
    function setupLazyLoading() {
        // Use native lazy loading if supported
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
        
        // For browsers that don't support lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            // Target images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }
    
    /**
     * Add dedicated error handler for each image
     */
    function addImageErrorHandler(img) {
        img.addEventListener('error', function() {
            // Skip if already handled
            if (failed.has(img.src)) return;
            
            // Mark as failed
            failed.add(img.src);
            
            // Try to recover with original source
            const originalSrc = img.getAttribute('data-original-src');
            if (originalSrc && img.src !== originalSrc) {
                img.src = originalSrc;
                return;
            }
            
            // Apply placeholder as fallback
            applyPlaceholder(img);
        });
    }
})();
