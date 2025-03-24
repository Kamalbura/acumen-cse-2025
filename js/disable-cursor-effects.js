/**
 * Disable Custom Cursor Effects
 * This script removes the custom cursor effects to fix flickering issues
 */

(function() {
    console.log('🖱️ Disabling custom cursor effects');
    
    // Execute immediately
    disableCustomCursor();
    
    // Also run when DOM is ready to ensure effects are disabled
    document.addEventListener('DOMContentLoaded', disableCustomCursor);
    
    /**
     * Disable custom cursor effects
     */
    function disableCustomCursor() {
        // 1. Remove existing cursor elements
        document.querySelectorAll('.cursor-dot, .cursor-outline').forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // 2. Remove custom-cursor-area class from body
        document.body.classList.remove('custom-cursor-area');
        
        // 3. Reset cursor style on all elements
        document.body.style.cursor = '';
        document.querySelectorAll('a, button, .btn, .interactive').forEach(el => {
            el.style.cursor = '';
        });
        
        // 4. Stop the cursor effects from initializing again
        if (window.CyberEffects) {
            // Disable the cursor effects initialization
            if (typeof window.CyberEffects.disabledEffects === 'object') {
                window.CyberEffects.disabledEffects.push('cursor');
            }
            
            // Override the init function for cursor effects
            if (typeof window.CyberEffects.initCursorEffects === 'function') {
                window.CyberEffects.initCursorEffects = function() {
                    console.log('Custom cursor effects disabled');
                    return false;
                };
            }
        }
    }
    
    // Set up mutation observer to catch any new cursor elements that might be created
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && (node.classList.contains('cursor-dot') || node.classList.contains('cursor-outline'))) {
                        node.parentNode.removeChild(node);
                    }
                });
            }
        });
    });
    
    // Start observing the body
    observer.observe(document.body, { 
        childList: true,
        subtree: true
    });
})();
