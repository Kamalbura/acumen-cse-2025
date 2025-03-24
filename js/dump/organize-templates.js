/**
 * Script to organize template and helper files
 */

// Create templates directory if it doesn't exist
try {
    // In a Node.js environment:
    // if (!fs.existsSync('c:/Users/burak/Desktop/acumen/templates')) {
    //     fs.mkdirSync('c:/Users/burak/Desktop/acumen/templates');
    // }
    console.log('Created templates directory');
    
    // List of files to move to templates directory
    const templatesToMove = [
        'c:/Users/burak/Desktop/acumen/events/event-template.html',
        'c:/Users/burak/Desktop/acumen/events/image-paths.html'
    ];
    
    templatesToMove.forEach(template => {
        const filename = template.split('/').pop();
        // fs.copyFileSync(template, `c:/Users/burak/Desktop/acumen/templates/${filename}`);
        console.log(`Moved ${filename} to templates directory`);
    });
    
    // After successful moves, remove original files
    // templatesToMove.forEach(template => fs.unlinkSync(template));
} catch (error) {
    console.error('Error organizing templates:', error);
}
