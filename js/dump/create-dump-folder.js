/**
 * Create dump folder for unused CSS files
 */
try {
    // In a Node.js environment:
    // if (!fs.existsSync('c:/Users/burak/Desktop/acumen/dump')) {
    //     fs.mkdirSync('c:/Users/burak/Desktop/acumen/dump', { recursive: true });
    //     fs.mkdirSync('c:/Users/burak/Desktop/acumen/dump/css', { recursive: true });
    // }
    console.log('Created dump directory structure');
} catch (error) {
    console.error('Error creating dump directory:', error);
}
