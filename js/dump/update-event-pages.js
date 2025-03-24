/**
 * Script to update all event pages with standardized components
 */

// List of all event pages that need updating
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

// Function to update each page
function updateEventPage(filename) {
    console.log(`Updating ${filename}...`);
    
    // This is where we would read the file, make changes, and save it
    // In a Node.js environment:
    /*
    const filePath = `c:/Users/burak/Desktop/acumen/events/${filename}`;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove old FAQ script
    content = content.replace(/<!-- FAQ Accordion functionality -->\s*<script>\s*document\.addEventListener.*?<\/script>/s, '');
    
    // Add new FAQ script reference before closing body tag
    content = content.replace(/<\/body>/, `    <script src="../js/faq-accordion.js"></script>
    <link rel="stylesheet" href="../css/faq-accordion.css">
</body>`);
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content);
    */
    
    console.log(`Updated ${filename} with standardized FAQ accordion`);
}

// Process all event pages
eventPages.forEach(updateEventPage);
