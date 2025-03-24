/**
 * CSS Consolidation and Dependency Management
 * Handles CSS file dependencies and loading order to prevent conflicts
 */

(function() {
    // CSS file dependencies and loading order
    const cssFiles = [
        { 
            id: 'acumen-core', 
            path: 'css/acumen-core.css', 
            critical: true 
        },
        { 
            id: 'home-page', 
            path: 'css/home-page.css', 
            dependencies: ['acumen-core'] 
        },
        { 
            id: 'visual-polish', 
            path: 'css/visual-polish.css', 
            dependencies: ['acumen-core', 'home-page']
        },
        { 
            id: 'text-layout-fixes', 
            path: 'css/text-layout-fixes.css', 
            dependencies: ['acumen-core', 'home-page']
        },
        { 
            id: 'final-polish', 
            path: 'css/final-polish.css', 
            dependencies: ['acumen-core', 'home-page', 'visual-polish', 'text-layout-fixes']
        },
        { 
            id: 'advanced-cyberpunk', 
            path: 'css/advanced-cyberpunk.css', 
            dependencies: ['acumen-core'], 
            conditionalLoad: 'high-performance'
        }
    ];
    
    // Determine which files to load based on page and device
    function determineRequiredCSSFiles() {
        const pagePath = window.location.pathname;
        const isHomePage = pagePath === '/' || pagePath.endsWith('index.html');
        const requiredFiles = [];
        
        cssFiles.forEach(file => {
            // Always load critical files
            if (file.critical) {
                requiredFiles.push(file);
                return;
            }
            
            // Load home page specific files
            if (isHomePage && file.id === 'home-page') {
                requiredFiles.push(file);
                return;
            }
            
            // Load page-specific files
            if (pagePath.includes(file.id.replace('-page', ''))) {
                requiredFiles.push(file);
                return;
            }
            
            // Load conditionally based on device capabilities
            if (file.conditionalLoad === 'high-performance' && !isLowPowerDevice()) {
                requiredFiles.push(file);
                return;
            }
        });
        
        return requiredFiles;
    }
    
    // Check if device is low power
    function isLowPowerDevice() {
        return (
            document.body.classList.contains('low-power-mode') || 
            document.body.classList.contains('low-performance') || 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }
    
    // Load CSS files in the correct order with proper dependencies
    function loadCSSFiles() {
        const requiredFiles = determineRequiredCSSFiles();
        const loadedFiles = new Set();
        
        // Function to load a file and its dependencies
        function loadFileWithDependencies(file) {
            // Skip if already loaded
            if (loadedFiles.has(file.id)) return;
            
            // Load dependencies first
            if (file.dependencies && file.dependencies.length > 0) {
                file.dependencies.forEach(depId => {
                    const depFile = cssFiles.find(f => f.id === depId);
                    if (depFile && !loadedFiles.has(depId)) {
                        loadFileWithDependencies(depFile);
                    }
                });
            }
            
            // Create and add the link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = file.path;
            link.id = `css-${file.id}`;
            document.head.appendChild(link);
            
            // Mark as loaded
            loadedFiles.add(file.id);
        }
        
        // Load each required file with its dependencies
        requiredFiles.forEach(loadFileWithDependencies);
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', loadCSSFiles);
})();
