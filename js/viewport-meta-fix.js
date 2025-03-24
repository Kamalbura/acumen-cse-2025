/**
 * Viewport Meta Tag Fixer
 * Ensures all pages have proper viewport settings for mobile
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if a viewport meta tag exists
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        
        // If it doesn't exist, create one
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        // Set the proper viewport content
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
    });
})();
