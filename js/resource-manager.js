/**
 * Resource Manager
 * Handles loading of CSS and JS resources in the correct order
 */

const ResourceManager = (function() {
    // Track loaded resources
    const loaded = {
        css: new Set(),
        js: new Set()
    };
    
    // Path info
    const paths = {
        isInSubfolder: false,
        pathPrefix: ''
    };
    
    // Resource loading queue
    const queue = {
        css: [],
        js: []
    };
    
    // Dependency map
    const dependencies = {
        css: {
            'effects/cyberpunk.css': ['base/variables.css', 'effects/animations.css'],
            'components/cards.css': ['base/variables.css', 'layout/grid.css'],
            'pages/event-details.css': ['base/variables.css', 'components/cards.css']
        },
        js: {
            'event-card-animations.js': ['main.js'],
            'form-validation.js': ['main.js']
        }
    };
    
    /**
     * Initialize the resource manager
     */
    function init() {
        console.log('Initializing Resource Manager');
        
        // Check if page is in subfolder
        paths.isInSubfolder = window.location.pathname.split('/').length > 2;
        paths.pathPrefix = paths.isInSubfolder ? '../' : '';
        
        // Fix existing paths if needed
        fixExistingPaths();
        
        // Load critical resources
        loadCriticalResources();
    }
    
    /**
     * Fix existing resource paths in the DOM
     */
    function fixExistingPaths() {
        if (!paths.isInSubfolder) return;
        
        // Fix CSS paths
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('../') && !href.startsWith('/')) {
                link.href = paths.pathPrefix + href;
            }
        });
        
        // Fix JS paths
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
                script.src = paths.pathPrefix + src;
            }
        });
        
        // Fix image paths
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:') && 
                !src.startsWith('../') && !src.startsWith('/')) {
                img.src = paths.pathPrefix + src;
            }
        });
        
        // Fix background images in inline styles
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('url(') && 
                !style.includes('url(../') && !style.includes('url("../') && 
                !style.includes('url(http') && !style.includes('url(data:')) {
                
                const newStyle = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
                    if (!url.startsWith('../') && !url.startsWith('/') && !url.startsWith('http')) {
                        return `url('${paths.pathPrefix}${url}')`;
                    }
                    return match;
                });
                
                el.setAttribute('style', newStyle);
            }
        });
    }
    
    /**
     * Load critical CSS and JS resources
     */
    function loadCriticalResources() {
        // Essential CSS files
        const criticalCSS = [
            'css/base/variables.css',
            'css/base/reset.css',
            'css/layout/grid.css',
            'css/layout/header.css'
        ];
        
        // Essential JS files
        const criticalJS = [
            'js/main.js',
            'js/mobile-navbar.js'
        ];
        
        // Add page-specific resources
        addPageSpecificResources();
        
        // Load critical CSS
        criticalCSS.forEach(file => {
            loadCSS(file, true);
        });
        
        // Load critical JS
        criticalJS.forEach(file => {
            loadJS(file, true);
        });
    }
    
    /**
     * Add page-specific resources
     */
    function addPageSpecificResources() {
        const path = window.location.pathname;
        
        // Home page resources
        if (path === '/' || path.includes('index.html')) {
            queue.css.push('css/pages/home.css');
            queue.js.push('js/homepage-animations.js');
        }
        
        // Events page resources
        else if (path.includes('events.html')) {
            queue.css.push('css/layout/events-grid.css');
            queue.css.push('css/components/cards.css');
            queue.js.push('js/event-card-animations.js');
        }
        
        // Registration page resources
        else if (path.includes('registration.html')) {
            queue.css.push('css/registration.css');
            queue.js.push('js/form-validation.js');
            queue.js.push('js/registration-form-processor.js');
        }
        
        // Process queue based on dependencies
        processQueue();
    }
    
    /**
     * Process resource queue respecting dependencies
     */
    function processQueue() {
        // Process CSS queue
        while (queue.css.length > 0) {
            const file = queue.css.shift();
            loadCSS(file);
        }
        
        // Process JS queue
        while (queue.js.length > 0) {
            const file = queue.js.shift();
            loadJS(file);
        }
    }
    
    /**
     * Load a CSS file with error handling
     */
    function loadCSS(file, critical = false) {
        const filename = file.split('/').pop();
        
        // Skip if already loaded or in document
        if (loaded.css.has(filename) || document.querySelector(`link[href$="${filename}"]`)) {
            return Promise.resolve();
        }
        
        // Check dependencies first
        const fileKey = file.replace('css/', '');
        if (dependencies.css[fileKey]) {
            dependencies.css[fileKey].forEach(dep => {
                if (!loaded.css.has(dep.split('/').pop())) {
                    loadCSS('css/' + dep, critical);
                }
            });
        }
        
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            
            // For non-critical CSS, load asynchronously
            if (!critical) {
                link.media = 'print';
                link.onload = function() {
                    link.media = 'all';
                };
            }
            
            link.href = paths.isInSubfolder && !file.startsWith('../') ? 
                        paths.pathPrefix + file : file;
            
            link.onload = () => {
                loaded.css.add(filename);
                resolve();
            };
            
            link.onerror = (error) => {
                console.error(`Failed to load CSS: ${filename}`);
                
                // Try alternative path as fallback
                if (critical) {
                    const fallbackLink = document.createElement('link');
                    fallbackLink.rel = 'stylesheet';
                    fallbackLink.href = paths.isInSubfolder ? 
                                     filename : ('../css/' + filename);
                    document.head.appendChild(fallbackLink);
                }
                
                reject(error);
            };
            
            document.head.appendChild(link);
        });
    }
    
    /**
     * Load a JavaScript file with error handling
     */
    function loadJS(file, defer = false) {
        const filename = file.split('/').pop();
        
        // Skip if already loaded or in document
        if (loaded.js.has(filename) || document.querySelector(`script[src$="${filename}"]`)) {
            return Promise.resolve();
        }
        
        // Check dependencies first
        const fileKey = file.replace('js/', '');
        if (dependencies.js[fileKey]) {
            dependencies.js[fileKey].forEach(dep => {
                if (!loaded.js.has(dep.split('/').pop())) {
                    loadJS('js/' + dep, defer);
                }
            });
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            
            if (defer) {
                script.defer = true;
            }
            
            script.src = paths.isInSubfolder && !file.startsWith('../') ? 
                       paths.pathPrefix + file : file;
            
            script.onload = () => {
                loaded.js.add(filename);
                resolve();
            };
            
            script.onerror = (error) => {
                console.error(`Failed to load JS: ${filename}`);
                
                // Try alternative path as fallback
                const fallbackScript = document.createElement('script');
                fallbackScript.src = paths.isInSubfolder ? 
                                   filename : ('../js/' + filename);
                document.body.appendChild(fallbackScript);
                
                reject(error);
            };
            
            document.body.appendChild(script);
        });
    }
    
    // Public API
    return {
        init,
        loadCSS,
        loadJS,
        getPath: (resource) => {
            return paths.isInSubfolder ? paths.pathPrefix + resource : resource;
        },
        isInSubfolder: () => paths.isInSubfolder
    };
})();

// Initialize immediately
(function() {
    // Execute ASAP, even before DOM is fully loaded
    ResourceManager.init();
})();

// Also run when DOM is loaded as a safety measure
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - ensuring resources are properly loaded');
});
