/**
 * Script Manager
 * Handles script loading, dependencies, and prevents conflicts
 */

const ScriptManager = (function() {
    // Script registry
    const scripts = {
        'main': {
            path: 'js/main.js',
            loaded: false,
            critical: true
        },
        'visual-enhancements': {
            path: 'js/visual-enhancements.js',
            dependencies: ['main'],
            loaded: false
        },
        'performance-enhancements': {
            path: 'js/performance-enhancements.js',
            dependencies: ['main'],
            loaded: false
        },
        'scroll-animations': {
            path: 'js/scroll-animations.js',
            dependencies: ['main', 'performance-enhancements'],
            loaded: false
        },
        'user-experience': {
            path: 'js/user-experience.js',
            dependencies: ['main', 'performance-enhancements'],
            loaded: false
        },
        'position-fix': {
            path: 'js/position-fix.js',
            dependencies: ['main'],
            loaded: false
        },
        'ui-fixes': {
            path: 'js/ui-fixes.js',
            dependencies: ['main', 'position-fix'],
            loaded: false
        },
        'error-recovery': {
            path: 'js/error-recovery.js',
            critical: true,
            loaded: false
        }
    };
    
    // Event registry to prevent duplicates
    const eventRegistry = {};
    
    /**
     * Load a script and its dependencies
     */
    function loadScript(scriptId) {
        const script = scripts[scriptId];
        
        // Skip if already loaded
        if (script.loaded) return Promise.resolve();
        
        // Load dependencies first
        const dependencyPromises = [];
        if (script.dependencies && script.dependencies.length > 0) {
            script.dependencies.forEach(depId => {
                if (!scripts[depId].loaded) {
                    dependencyPromises.push(loadScript(depId));
                }
            });
        }
        
        // Wait for dependencies to load then load this script
        return Promise.all(dependencyPromises).then(() => {
            return new Promise((resolve, reject) => {
                const scriptElement = document.createElement('script');
                scriptElement.src = script.path;
                scriptElement.async = true;
                
                scriptElement.onload = function() {
                    script.loaded = true;
                    console.log(`Loaded script: ${scriptId}`);
                    resolve();
                };
                
                scriptElement.onerror = function() {
                    console.error(`Failed to load script: ${scriptId}`);
                    reject(new Error(`Failed to load script: ${scriptId}`));
                };
                
                document.body.appendChild(scriptElement);
            });
        });
    }
    
    /**
     * Load all registered scripts in the correct order
     */
    function loadAllScripts() {
        // Load critical scripts first
        const criticalScripts = Object.keys(scripts).filter(id => scripts[id].critical);
        const promises = criticalScripts.map(id => loadScript(id));
        
        // Then load the rest
        Promise.all(promises).then(() => {
            Object.keys(scripts).forEach(id => {
                if (!scripts[id].critical && !scripts[id].loaded) {
                    loadScript(id).catch(err => console.warn(err));
                }
            });
        });
    }
    
    /**
     * Register a safe event listener that prevents duplicates
     */
    function addSafeEventListener(element, event, handler, useCapture = false) {
        // Create unique key for this element-event-handler combination
        const key = `${event}-${handler.toString()}`;
        
        // Skip if already registered
        if (eventRegistry[key]) return;
        
        // Register the event
        element.addEventListener(event, handler, useCapture);
        eventRegistry[key] = { element, event, handler, useCapture };
        
        return key;
    }
    
    /**
     * Remove an event listener by key
     */
    function removeEventListener(key) {
        if (eventRegistry[key]) {
            const { element, event, handler, useCapture } = eventRegistry[key];
            element.removeEventListener(event, handler, useCapture);
            delete eventRegistry[key];
        }
    }
    
    // Initialize when document is ready
    document.addEventListener('DOMContentLoaded', loadAllScripts);
    
    // Public API
    return {
        loadScript,
        addSafeEventListener,
        removeEventListener,
        isScriptLoaded: (scriptId) => scripts[scriptId]?.loaded || false
    };
})();
