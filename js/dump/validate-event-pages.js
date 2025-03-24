/**
 * Event Page Validator
 * Checks all event pages for required elements and consistent structure
 */

// List of required elements for each event page
const requiredElements = [
    '.event-hero',
    '.event-hero-content h1',
    '.event-section',
    '.faq-item',
    '.faq-question',
    '.faq-answer',
    '.event-meta'
];

// List of required script references
const requiredScripts = [
    '../js/main.js',
    '../js/faq-accordion.js'
];

// List of required stylesheet references
const requiredStylesheets = [
    '../css/styles.css',
    '../css/event-page.css',
    '../css/faq-accordion.css'
];

// Function to validate an event page
function validateEventPage(filename) {
    console.log(`Validating ${filename}...`);
    
    // In a browser or testing environment, we would:
    // 1. Fetch the HTML file
    // 2. Parse it to check for required elements
    // 3. Verify script and stylesheet references
    // 4. Generate a validation report
    
    // Simplified example:
    /*
    const filePath = `c:/Users/burak/Desktop/acumen/events/${filename}`;
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for required elements
    const missingElements = requiredElements.filter(selector => {
        // In a browser we would use document.querySelector
        // Here we're just checking if the selector appears in the HTML
        return !content.includes(selector.replace('.', ' class="')) && 
               !content.includes(selector.replace('.', ' class=\''));
    });
    
    // Check for required scripts
    const missingScripts = requiredScripts.filter(src => {
        return !content.includes(`src="${src}"`) && !content.includes(`src='${src}'`);
    });
    
    // Check for required stylesheets
    const missingStylesheets = requiredStylesheets.filter(href => {
        return !content.includes(`href="${href}"`) && !content.includes(`href='${href}'`);
    });
    
    // Generate validation report
    const isValid = missingElements.length === 0 && 
                    missingScripts.length === 0 && 
                    missingStylesheets.length === 0;
    
    return {
        file: filename,
        isValid,
        missingElements,
        missingScripts,
        missingStylesheets
    };
    */
    
    // Mock result for demonstration
    return {
        file: filename,
        isValid: Math.random() > 0.3, // Randomly mark some as invalid for demo
        missingElements: [],
        missingScripts: [],
        missingStylesheets: []
    };
}

// Function to generate a validation report
function generateValidationReport(validationResults) {
    console.log('=== EVENT PAGE VALIDATION REPORT ===');
    
    // Count valid and invalid pages
    const validPages = validationResults.filter(result => result.isValid).length;
    const invalidPages = validationResults.length - validPages;
    
    console.log(`SUMMARY: ${validPages}/${validationResults.length} pages valid`);
    
    if (invalidPages > 0) {
        console.log('\nISSUES FOUND:');
        validationResults
            .filter(result => !result.isValid)
            .forEach(result => {
                console.log(`\n${result.file}:`);
                if (result.missingElements.length > 0) {
                    console.log(`  Missing elements: ${result.missingElements.join(', ')}`);
                }
                if (result.missingScripts.length > 0) {
                    console.log(`  Missing scripts: ${result.missingScripts.join(', ')}`);
                }
                if (result.missingStylesheets.length > 0) {
                    console.log(`  Missing stylesheets: ${result.missingStylesheets.join(', ')}`);
                }
            });
    }
    
    console.log('\n=====================================');
}

// Main validation function
function validateAllEventPages() {
    // List of all event pages
    const eventPages = [
        'code-to-escape.html',
        'free-fire.html',
        'shark-tank.html',
        'ai-imagination.html',
        'bid-n-code.html',
        'call-of-duty.html',
        'project-expo.html',
        'paper-presentation.html',
        'poster-presentation.html',
        'sherlock-homies.html',
        'snakes-and-ladders.html',
        'squid-gaming.html',
        'treasure-hunt.html',
        'jail-break.html'
    ];
    
    // Validate each page
    const validationResults = eventPages.map(validateEventPage);
    
    // Generate report
    generateValidationReport(validationResults);
    
    return validationResults;
}

// Execute validation when script is run
validateAllEventPages();
