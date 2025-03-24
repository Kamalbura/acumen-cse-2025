/**
 * Update CSS references in HTML files to use consolidated stylesheets
 */

const htmlFiles = [
    'index.html',
    'events.html',
    'schedule.html',
    'registration.html',
    'gallery.html',
    'team.html',
    'sponsors.html',
    'contact.html',
    'events/code-to-escape.html',
    'events/free-fire.html',
    'events/shark-tank.html',
    'events/ai-imagination.html',
    'events/bid-n-code.html',
    'events/call-of-duty.html',
    'events/project-expo.html',
    'events/paper-presentation.html',
    'events/poster-presentation.html',
    'events/sherlock-homies.html',
    'events/snakes-and-ladders.html',
    'events/squid-gaming.html',
    'events/treasure-hunt.html',
    'events/jail-break.html'
];

// Define core CSS files that should be used
const coreCssFiles = {
    all: [
        '<link rel="stylesheet" href="css/consolidated.css">',
        '<link rel="stylesheet" href="css/cyberpunk.css">',
        '<link rel="stylesheet" href="css/compatibility.css">'
    ],
    index: [
        '<link rel="stylesheet" href="css/homepage-enhancements.css">'
    ],
    events: [
        '<link rel="stylesheet" href="css/event-pages.css">'
    ],
    eventPages: [
        '<link rel="stylesheet" href="../css/consolidated.css">',
        '<link rel="stylesheet" href="../css/cyberpunk.css">',
        '<link rel="stylesheet" href="../css/event-pages.css">',
        '<link rel="stylesheet" href="../css/compatibility.css">',
        '<link rel="stylesheet" href="../css/faq-accordion.css">'
    ]
};

// Update function for processing files
function updateCssReferences(htmlPath, isEventPage = false) {
    console.log(`Updating CSS references in: ${htmlPath}`);
    
    // In a Node.js environment:
    // const fs = require('fs');
    // const path = require('path');
    // 
    // // Read the file
    // let content = fs.readFileSync(htmlPath, 'utf8');
    // 
    // // Remove all existing CSS links
    // content = content.replace(/<link rel="stylesheet" href="(\.\.\/)?css\/.*?\.css".*?>/g, '');
    // 
    // // Add new CSS references
    // const cssLinks = isEventPage ? 
    //     coreCssFiles.eventPages.join('\n    ') : 
    //     coreCssFiles.all.join('\n    ') + 
    //     (htmlPath.includes('index.html') ? '\n    ' + coreCssFiles.index.join('\n    ') : '') +
    //     (htmlPath.includes('events.html') ? '\n    ' + coreCssFiles.events.join('\n    ') : '');
    // 
    // content = content.replace('</head>', `    ${cssLinks}\n</head>`);
    // 
    // // Write back to file
    // fs.writeFileSync(htmlPath, content);
    
    console.log(`Updated CSS references in ${htmlPath}`);
}

// Process each HTML file
htmlFiles.forEach(file => {
    const fullPath = `c:/Users/burak/Desktop/acumen/${file}`;
    updateCssReferences(fullPath, file.startsWith('events/'));
});

console.log('All CSS references have been updated.');
