/**
 * CSS Module Manager
 * Dynamically loads CSS files based on page requirements
 * Replaces the need for a consolidated CSS file
 */
(function() {
    // Configuration
    const config = {
        basePath: 'css/',
        coreModules: [
            'base/variables.css',
            'base/reset.css',
            'layout/grid.css',
            'layout/header.css',
            'layout/footer.css',
            'effects/animations.css'
        ],
        pageSpecificModules: {
            'index.html': [
                'pages/home.css',
                'components/countdown.css',
                'layout/sections.css',
                'components/cards.css'
            ],
            'events.html': [
                'layout/events-grid.css',
                'components/cards.css',
                'layout/page-banner.css'
            ],
            'registration.html': [
                'registration.css',
                'components/forms.css'
            ],
            'schedule.html': [
                'layout/page-banner.css',
                'layout/timeline.css'
            ],
            'team.html': [
                'layout/page-banner.css',
                'components/team-cards.css'
            ],
            'gallery.html': [
                'layout/page-banner.css',
                'components/gallery-grid.css'
            ]
        },
        conditionalModules: {
            // For pages that include countdowns
            '.countdown-container': ['components/countdown.css'],
            // For pages with forms
            'form': ['components/forms.css'],
            // For pages with hero sections
            '.hero': ['layout/hero.css'],
            // For pages with event cards
            '.event-card': ['components/cards.css']
        },
        // Modules that should be preloaded (critical)
        criticalModules: [
            'base/variables.css',
            'base/reset.css'
        ]
    };
    
    // State tracking
    const loadedModules = new Set();
    
    /**
     * Initialize the module manager
     */
    function init() {
        // Load critical CSS first
        loadCriticalModules();
        
        // Load core modules
        loadCoreModules();
        
        // Load page specific modules
        loadPageSpecificModules();
        
        // Check for conditional modules
        document.addEventListener('DOMContentLoaded', () => {
            loadConditionalModules();
        });
    }
    
    /**
     * Load critical CSS modules synchronously
     */
    function loadCriticalModules() {
        config.criticalModules.forEach(module => {
            if (loadedModules.has(module)) return;
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = config.basePath + module;
            document.head.appendChild(link);
            
            loadedModules.add(module);
        });
    }
    
    /**
     * Load core CSS modules
     */
    function loadCoreModules() {
        config.coreModules.forEach(module => {
            if (!config.criticalModules.includes(module)) {
                loadCSSModule(module);
            }
        });
    }
    
    /**
     * Load page specific modules based on current page
     */
    function loadPageSpecificModules() {
        const path = window.location.pathname;
        let pageName = path.split('/').pop();
        
        // Default to index.html if no page specified
        if (!pageName || pageName === '') pageName = 'index.html';
        
        const pageModules = config.pageSpecificModules[pageName];
        
        if (pageModules) {
            pageModules.forEach(module => {
                loadCSSModule(module);
            });
        }
        
        // If it's an event detail page
        if (path.includes('events/') && !path.endsWith('events/')) {
            loadCSSModule('components/cards.css');
            loadCSSModule('event-pages.css');
        }
    }
    
    /**
     * Check for elements that require conditional CSS modules
     */
    function loadConditionalModules() {
        for (const selector in config.conditionalModules) {
            if (document.querySelector(selector)) {
                const modules = config.conditionalModules[selector];
                modules.forEach(module => {
                    loadCSSModule(module);
                });
            }
        }
    }
    
    /**
     * Load a CSS module asynchronously
     */
    function loadCSSModule(module) {
        if (loadedModules.has(module)) return;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        
        // For non-critical CSS, load async
        link.media = 'print';
        link.onload = function() {
            link.media = 'all';
        };
        
        link.href = config.basePath + module;
        
        link.onload = () => {
            loadedModules.add(module);
        };
        
        link.onerror = () => {
            console.error(`Failed to load CSS module: ${module}`);
        };
        
        document.head.appendChild(link);
    }
    
    /**
     * Check if a module is already loaded
     */
    function isModuleLoaded(module) {
        return loadedModules.has(module) || 
               document.querySelector(`link[href$="${module}"]`) !== null;
    }
    
    // Initialize
    init();
    
    // Public API
    window.CSSModuleManager = {
        loadModule: loadCSSModule,
        isModuleLoaded: isModuleLoaded,
        getLoadedModules: () => Array.from(loadedModules)
    };
})();
