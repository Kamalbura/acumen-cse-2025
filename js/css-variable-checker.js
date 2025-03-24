/**
 * CSS Variable Integrity Checker
 * Ensures CSS variables are properly applied across the site
 */
document.addEventListener('DOMContentLoaded', function() {
    // Define expected core CSS variables
    const coreVariables = [
        '--primary-color',
        '--secondary-color',
        '--accent-color',
        '--bg-dark',
        '--bg-darker',
        '--text-light',
        '--text-dim'
    ];
    
    // Check if root variables are defined
    function checkCSSVariables() {
        const rootStyle = getComputedStyle(document.documentElement);
        const missingVariables = [];
        
        coreVariables.forEach(variable => {
            const value = rootStyle.getPropertyValue(variable).trim();
            if (!value) {
                missingVariables.push(variable);
                console.warn(`CSS variable ${variable} is not defined`);
            }
        });
        
        // If missing variables, try to fix them
        if (missingVariables.length > 0) {
            console.warn(`Found ${missingVariables.length} missing CSS variables, attempting to fix`);
            applyEmergencyVariables(missingVariables);
        } else {
            console.log('All core CSS variables are properly defined');
        }
    }
    
    // Apply emergency default variables if any are missing
    function applyEmergencyVariables(missingVars) {
        const defaults = {
            '--primary-color': '#00ffff',
            '--secondary-color': '#ff00ff',
            '--accent-color': '#ffff00',
            '--bg-dark': '#101025',
            '--bg-darker': '#080818',
            '--text-light': '#ffffff',
            '--text-dim': '#e0e0e0'
        };
        
        let cssText = ':root {';
        
        missingVars.forEach(variable => {
            cssText += `${variable}: ${defaults[variable]};`;
        });
        
        cssText += '}';
        
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
        
        console.log('Applied emergency CSS variables');
    }
    
    // Run check
    checkCSSVariables();
});
