/**
 * Script to organize documentation files
 */

// Create docs directory if it doesn't exist
try {
    // In a Node.js environment:
    // if (!fs.existsSync('c:/Users/burak/Desktop/acumen/docs')) {
    //     fs.mkdirSync('c:/Users/burak/Desktop/acumen/docs');
    // }
    console.log('Created docs directory');
    
    // List of documentation files to move
    const docsToMove = [
        'c:/Users/burak/Desktop/acumen/cyberpunk-implementation-guide.md',
        'c:/Users/burak/Desktop/acumen/presentation-guide.md'
    ];
    
    docsToMove.forEach(doc => {
        const filename = doc.split('/').pop();
        // fs.copyFileSync(doc, `c:/Users/burak/Desktop/acumen/docs/${filename}`);
        console.log(`Moved ${filename} to docs directory`);
    });
    
    // After successful moves, remove original files
    // docsToMove.forEach(doc => fs.unlinkSync(doc));
} catch (error) {
    console.error('Error organizing documentation:', error);
}
