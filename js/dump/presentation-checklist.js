/**
 * Presentation Checklist Script
 * Runs automated checks to ensure the website is ready for presentation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the checklist UI
    createChecklistUI();
    
    // Run tests when requested
    const runTestsButton = document.getElementById('run-tests-button');
    if (runTestsButton) {
        runTestsButton.addEventListener('click', runAllTests);
    }
    
    /**
     * Create the presentation checklist UI
     */
    function createChecklistUI() {
        // Only create the checklist in development/admin mode
        if (!isDevMode()) return;
        
        const checklistContainer = document.createElement('div');
        checklistContainer.className = 'presentation-checklist';
        checklistContainer.innerHTML = `
            <div class="checklist-header">
                <h3>Presentation Readiness</h3>
                <button id="toggle-checklist" class="toggle-button">▼</button>
            </div>
            <div class="checklist-body">
                <div class="test-controls">
                    <button id="run-tests-button" class="btn btn-primary btn-sm">Run All Tests</button>
                </div>
                <ul class="test-results">
                    <li data-test="images">Image Loading <span class="status">Not run</span></li>
                    <li data-test="links">Internal Links <span class="status">Not run</span></li>
                    <li data-test="responsive">Responsive Layout <span class="status">Not run</span></li>
                    <li data-test="scripts">Script Errors <span class="status">Not run</span></li>
                    <li data-test="styles">CSS Conflicts <span class="status">Not run</span></li>
                    <li data-test="forms">Form Fields <span class="status">Not run</span></li>
                    <li data-test="accessibility">Accessibility <span class="status">Not run</span></li>
                </ul>
            </div>
        `;
        
        document.body.appendChild(checklistContainer);
        
        // Add toggle functionality
        const toggleButton = document.getElementById('toggle-checklist');
        const checklistBody = checklistContainer.querySelector('.checklist-body');
        
        toggleButton.addEventListener('click', function() {
            if (checklistBody.style.display === 'none') {
                checklistBody.style.display = 'block';
                toggleButton.textContent = '▼';
            } else {
                checklistBody.style.display = 'none';
                toggleButton.textContent = '◀';
            }
        });
        
        // Add styles for the checklist
        const style = document.createElement('style');
        style.textContent = `
            .presentation-checklist {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid var(--primary-color);
                border-radius: 10px;
                color: #fff;
                z-index: 9999;
                font-family: monospace;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
                font-size: 14px;
            }
            
            .checklist-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.2);
            }
            
            .checklist-header h3 {
                margin: 0;
                font-size: 16px;
                color: var(--primary-color);
            }
            
            .toggle-button {
                background: none;
                border: none;
                color: var(--primary-color);
                cursor: pointer;
            }
            
            .checklist-body {
                padding: 15px;
            }
            
            .test-controls {
                margin-bottom: 15px;
            }
            
            .test-results {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .test-results li {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .status {
                font-weight: bold;
            }
            
            .status.pass {
                color: #00ff00;
            }
            
            .status.fail {
                color: #ff3366;
            }
            
            .status.running {
                color: #ffcc00;
            }
            
            .btn-sm {
                padding: 5px 10px;
                font-size: 14px;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Helper function to check if we're in development mode
     */
    function isDevMode() {
        return localStorage.getItem('devMode') === 'true' || 
               window.location.search.includes('devMode=true') || 
               window.location.hostname === 'localhost';
    }
    
    /**
     * Run all tests to check presentation readiness
     */
    function runAllTests() {
        updateTestStatus('images', 'running');
        updateTestStatus('links', 'running');
        updateTestStatus('responsive', 'running');
        updateTestStatus('scripts', 'running');
        updateTestStatus('styles', 'running');
        updateTestStatus('forms', 'running');
        updateTestStatus('accessibility', 'running');
        
        // Check images
        setTimeout(() => {
            const result = checkImages();
            updateTestStatus('images', result ? 'pass' : 'fail');
        }, 500);
        
        // Check links
        setTimeout(() => {
            const result = checkLinks();
            updateTestStatus('links', result ? 'pass' : 'fail');
        }, 800);
        
        // Check responsive layout
        setTimeout(() => {
            const result = checkResponsiveLayout();
            updateTestStatus('responsive', result ? 'pass' : 'fail');
        }, 1100);
        
        // Check script errors
        setTimeout(() => {
            const result = checkScriptErrors();
            updateTestStatus('scripts', result ? 'pass' : 'fail');
        }, 1400);
        
        // Check CSS conflicts
        setTimeout(() => {
            const result = checkCSSConflicts();
            updateTestStatus('styles', result ? 'pass' : 'fail');
        }, 1700);
        
        // Check form fields
        setTimeout(() => {
            const result = checkForms();
            updateTestStatus('forms', result ? 'pass' : 'fail');
        }, 2000);
        
        // Check accessibility
        setTimeout(() => {
            const result = checkAccessibility();
            updateTestStatus('accessibility', result ? 'pass' : 'fail');
        }, 2300);
    }
    
    /**
     * Update the status of a test in the UI
     */
    function updateTestStatus(testName, status) {
        const testItem = document.querySelector(`.test-results li[data-test="${testName}"] .status`);
        if (testItem) {
            testItem.textContent = status === 'running' ? 'Running...' : status === 'pass' ? 'Passed' : 'Failed';
            testItem.className = 'status ' + status;
        }
    }
    
    /**
     * Check for broken images
     */
    function checkImages() {
        let passed = true;
        let issues = 0;
        
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete || img.naturalWidth === 0) {
                console.warn('Broken image:', img.src);
                issues++;
                passed = false;
            }
        });
        
        console.log(`Images check: ${issues} issues found`);
        return passed;
    }
    
    /**
     * Check for broken internal links
     */
    function checkLinks() {
        let passed = true;
        let issues = 0;
        
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.includes('.html')) {
                console.warn('Potentially broken link:', href);
                issues++;
                passed = false;
            }
        });
        
        console.log(`Links check: ${issues} issues found`);
        return passed;
    }
    
    /**
     * Check responsive layout
     */
    function checkResponsiveLayout() {
        let passed = true;
        let issues = 0;
        
        // Check for horizontal overflow
        if (document.documentElement.scrollWidth > window.innerWidth) {
            console.warn('Horizontal overflow detected');
            issues++;
            passed = false;
        }
        
        // Check for fixed width elements
        document.querySelectorAll('*').forEach(element => {
            const style = window.getComputedStyle(element);
            if (style.width && style.width.endsWith('px') && parseInt(style.width) > window.innerWidth) {
                console.warn('Element wider than viewport:', element);
                issues++;
                passed = false;
            }
        });
        
        console.log(`Responsive layout check: ${issues} issues found`);
        return passed;
    }
    
    /**
     * Check for JavaScript errors
     */
    function checkScriptErrors() {
        // Since we can't directly check for previous errors,
        // we'll just check if our error handler is working
        try {
            const originalErrorCount = window._jsErrorCount || 0;
            console.log(`Script error check: ${originalErrorCount} errors logged`);
            return originalErrorCount === 0;
        } catch (e) {
            console.warn('Error checking JavaScript errors:', e);
            return false;
        }
    }
    
    /**
     * Check for CSS conflicts
     */
    function checkCSSConflicts() {
        // Check for common CSS issues
        let passed = true;
        let issues = 0;
        
        // Check if nav elements are visible
        const navLinks = document.querySelectorAll('.nav-links li');
        if (navLinks.length > 0) {
            const firstNavLink = navLinks[0];
            const style = window.getComputedStyle(firstNavLink);
            if (style.display === 'none' || style.visibility === 'hidden') {
                console.warn('Navigation links are hidden');
                issues++;
                passed = false;
            }
        }
        
        console.log(`CSS conflicts check: ${issues} issues found`);
        return passed;
    }
    
    /**
     * Check form fields
     */
    function checkForms() {
        let passed = true;
        let issues = 0;
        
        document.querySelectorAll('form').forEach(form => {
            // Check for required fields without labels
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                const id = field.getAttribute('id');
                if (id && !document.querySelector(`label[for="${id}"]`)) {
                    console.warn('Required field without label:', field);
                    issues++;
                    passed = false;
                }
            });
            
            // Check for submit buttons
            if (!form.querySelector('button[type="submit"], input[type="submit"]')) {
                console.warn('Form without submit button:', form);
                issues++;
                passed = false;
            }
        });
        
        console.log(`Forms check: ${issues} issues found`);
        return passed;
    }
    
    /**
     * Check basic accessibility issues
     */
    function checkAccessibility() {
        let passed = true;
        let issues = 0;
        
        // Check for images without alt text
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('alt')) {
                console.warn('Image without alt text:', img.src);
                issues++;
                passed = false;
            }
        });
        
        // Check for proper heading hierarchy
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        for (let i = 0; i < headings.length - 1; i++) {
            const current = parseInt(headings[i].tagName.charAt(1));
            const next = parseInt(headings[i + 1].tagName.charAt(1));
            if (next > current + 1) {
                console.warn('Heading level skipped:', headings[i], headings[i + 1]);
                issues++;
                passed = false;
            }
        }
        
        console.log(`Accessibility check: ${issues} issues found`);
        return passed;
    }
    
    // Set up global error tracking
    window._jsErrorCount = 0;
    window.addEventListener('error', function(e) {
        window._jsErrorCount = (window._jsErrorCount || 0) + 1;
        console.error('JavaScript error:', e.message);
    });
});
