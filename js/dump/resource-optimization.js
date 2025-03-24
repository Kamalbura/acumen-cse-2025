/**
 * Resource Optimization
 * Improves loading performance by optimizing resources
 */

const ResourceOptimization = (function() {
    // Options
    const options = {
        lazyLoadImages: true,
        preloadCriticalImages: true,
        fontDisplay: 'swap',
        adaptiveLoading: true
    };
    
    /**
     * Initialize all optimizations
     */
    function init() {
        console.log('🚀 Initializing resource optimization');
        
        if (options.lazyLoadImages) {
            setupLazyLoading();
        }
        
        if (options.preloadCriticalImages) {
            preloadCriticalImages();
        }
        
        if (options.adaptiveLoading) {
            setupAdaptiveLoading();
        }
        
        optimizeFontLoading();
        optimizeThirdPartyResources();
        setupResourceHints();
    }
    
    /**
     * Set up lazy loading for images
     */
    function setupLazyLoading() {
        // Use native lazy loading where supported
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading') && !img.classList.contains('critical-image')) {
                img.loading = 'lazy';
            }
        });
        
        // For browsers that don't support native lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const dataSrc = img.getAttribute('data-src');
                        
                        if (dataSrc) {
                            img.src = dataSrc;
                            img.removeAttribute('data-src');
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            // Apply to images with data-src attribute
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
     * Preload critical images
     */
    function preloadCriticalImages() {
        // Find critical images (above the fold)
        const criticalImages = [
            'img/acumen-logo.png',
            'img/patterns/circuit-pattern.svg',
            'img/sponsors/sponsor-1.png',
            'img/sponsors/sponsor-2.png',
            'img/events/hackathon.jpg',
            'img/events/gaming.jpg',
            'img/events/ai-workshop.jpg'
        ];
        
        // Preload each critical image
        criticalImages.forEach(imagePath => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = imagePath;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Optimize font loading
     */
    function optimizeFontLoading() {
        // Apply font-display to all font-face rules
        if ('FontFace' in window) {
            document.fonts.forEach(font => {
                font.display = options.fontDisplay;
            });
        }
    }
    
    /**
     * Optimize third-party resources
     */
    function optimizeThirdPartyResources() {
        // Defer non-critical third-party scripts
        document.querySelectorAll('script[src*="cdn"], script[src*="analytics"]').forEach(script => {
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                script.defer = true;
            }
        });
    }
    
    /**
     * Set up resource hints (preconnect, dns-prefetch)
     */
    function setupResourceHints() {
        // Domains to preconnect to
        const domains = [
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        domains.forEach(domain => {
            // Add preconnect
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            preconnect.crossOrigin = 'anonymous';
            document.head.appendChild(preconnect);
            
            // Add dns-prefetch as fallback
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = domain;
            document.head.appendChild(dnsPrefetch);
        });
    }
    
    /**
     * Set up adaptive loading based on network and device capabilities
     */
    function setupAdaptiveLoading() {
        // Check for slow connection
        if (navigator.connection) {
            const connection = navigator.connection;
            
            if (connection.saveData || 
                connection.effectiveType === 'slow-2g' || 
                connection.effectiveType === '2g') {
                // Apply low data optimizations
                document.body.classList.add('low-data-mode');
                disableNonEssentialAnimations();
                enableLowResolutionImages();
            }
            
            // Listen for connection changes
            connection.addEventListener('change', function() {
                if (connection.saveData || 
                    connection.effectiveType === 'slow-2g' || 
                    connection.effectiveType === '2g') {
                    document.body.classList.add('low-data-mode');
                    disableNonEssentialAnimations();
                    enableLowResolutionImages();
                } else {
                    document.body.classList.remove('low-data-mode');
                }
            });
        }
    }
    
    /**
     * Disable non-essential animations to save resources
     */
    function disableNonEssentialAnimations() {
        document.body.classList.add('reduced-motion');
    }
    
    /**
     * Use lower resolution images when on slow connections
     */
    function enableLowResolutionImages() {
        document.querySelectorAll('img[data-low-res]').forEach(img => {
            const lowResSrc = img.getAttribute('data-low-res');
            if (lowResSrc && img.src !== lowResSrc) {
                img.src = lowResSrc;
            }
        });
    }
    
    // Return public API
    return {
        init,
        enableLowDataMode: () => {
            document.body.classList.add('low-data-mode');
            disableNonEssentialAnimations();
            enableLowResolutionImages();
        },
        disableLowDataMode: () => {
            document.body.classList.remove('low-data-mode');
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', ResourceOptimization.init);
