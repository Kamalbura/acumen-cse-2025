/**
 * ACUMEN Resource Loader
 * Dynamically loads critical resources with error handling
 */

window.AcumenResources = (function() {
    // Track loaded resources to prevent duplicates
    const loadedResources = {
        css: [],
        js: []
    };
    
    // Default paths
    const defaultPaths = {
        css: 'css/',
        js: 'js/',
        img: 'img/'
    };
    
    // Store subfolder status for global access within this module
    let isInSubfolder = false;
    
    /**
     * Initialize resource loader
     */
    function init() {
        // Fix paths based on current page location
        updateResourcePaths();
        
        // Load critical resources 
        loadCriticalResources();
    }
    
    /**
     * Update resource paths based on current location
     */
    function updateResourcePaths() {
        isInSubfolder = window.location.pathname.split('/').length > 2;
        
        if (isInSubfolder) {
            defaultPaths.css = '../css/';
            defaultPaths.js = '../js/';
            defaultPaths.img = '../img/';
        }
    }
    
    /**
     * Load all critical resources for the site
     */
    function loadCriticalResources() {
        // Essential CSS files in loading order
        const criticalCSS = [
            'emergency-fallback.css',
            'styles.css',
            'cyberpunk.css'
        ];
        
        // Critical JS files in loading order
        const criticalJS = [
            'emergency-fix.js',
            'main.js',
            'fix-paths.js'
        ];
        
        // Load critical CSS first
        criticalCSS.forEach(file => {
            loadCSS(file, true);
        });
        
        // Load critical JS
        criticalJS.forEach(file => {
            loadJS(file, true);
        });
    }
    
    /**
     * Load a CSS file
     */
    function loadCSS(filename, critical = false) {
        // Skip if already loaded
        if (loadedResources.css.includes(filename)) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Check if it's already in the document
            if (document.querySelector(`link[href$="${filename}"]`)) {
                loadedResources.css.push(filename);
                return resolve();
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = defaultPaths.css + filename;
            
            link.onload = () => {
                loadedResources.css.push(filename);
                resolve();
            };
            
            link.onerror = (error) => {
                console.error(`Failed to load CSS: ${filename}`);
                if (critical) {
                    // Try one more time with different path
                    const retryLink = document.createElement('link');
                    retryLink.rel = 'stylesheet';
                    retryLink.href = isInSubfolder ? filename : ('../css/' + filename);
                    document.head.appendChild(retryLink);
                }
                reject(error);
            };
            
            document.head.appendChild(link);
        });
    }
    
    /**
     * Load a JavaScript file
     */
    function loadJS(filename, critical = false) {
        // Skip if already loaded
        if (loadedResources.js.includes(filename)) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Check if it's already in the document
            if (document.querySelector(`script[src$="${filename}"]`)) {
                loadedResources.js.push(filename);
                return resolve();
            }
            
            const script = document.createElement('script');
            script.src = defaultPaths.js + filename;
            
            script.onload = () => {
                loadedResources.js.push(filename);
                resolve();
            };
            
            script.onerror = (error) => {
                console.error(`Failed to load JS: ${filename}`);
                if (critical) {
                    // Try one more time with different path
                    const retryScript = document.createElement('script');
                    retryScript.src = isInSubfolder ? filename : ('../js/' + filename);
                    document.body.appendChild(retryScript);
                }
                reject(error);
            };
            
            document.body.appendChild(script);
        });
    }
    
    /**
     * Check if a resource is loaded
     */
    function isLoaded(filename, type) {
        return loadedResources[type] && loadedResources[type].includes(filename);
    }
    
    /**
     * Get resource URL with proper path
     */
    function getResourceURL(filename, type) {
        return defaultPaths[type] + filename;
    }
    
    return {
        init,
        loadCSS,
        loadJS,
        isLoaded,
        getResourceURL
    };
})();

// Initialize the resource loader early
document.addEventListener('DOMContentLoaded', function() {
    window.AcumenResources.init();
});
