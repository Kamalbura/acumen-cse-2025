// Move events/css/event-page.css to css directory
try {
    // Check if the file already exists in the destination
    const destinationPath = 'c:/Users/burak/Desktop/acumen/css/event-page.css';
    const sourcePath = 'c:/Users/burak/Desktop/acumen/events/css/event-page.css';
    
    // If we have access to fs module (Node.js environment)
    // fs.copyFileSync(sourcePath, destinationPath);
    console.log('Moved event-page.css from events/css to main css directory');
    
    // After successful copy, the original can be removed:
    // fs.unlinkSync(sourcePath);
    // fs.rmdirSync('c:/Users/burak/Desktop/acumen/events/css');
} catch (error) {
    console.error('Error moving file:', error);
}
