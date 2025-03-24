/**
 * Move redundant CSS files to dump folder
 */
const cssFilesToMove = [
    'cross-browser-fixes.css',
    'browser-compatibility.css',
    'mobile-fixes.css',
    'events-page-fixes.css',
    'events-page-fixes-enhanced.css',
    'cyberpunk-enhanced.css',
    'advanced-cyberpunk.css',
    'layout-fixes.css',
    'unified-fixes.css',
    'home-page.css',
    'hero-enhanced.css',
    'css-conflict-resolver.css',
    'core-consolidated.css',
    'acumen-core.css',
    'emergency-fallback.css',
    'loading-screen.css',
    'cursor-fix.css',
    'anti-flicker.css',
    'homepage-fixes.css',
    'visual-polish.css',
    'compatibility-fixes.css',
    'presentation-fix.css'
];

// In a Node.js environment:
// cssFilesToMove.forEach(file => {
//     try {
//         const sourcePath = `c:/Users/burak/Desktop/acumen/css/${file}`;
//         const destPath = `c:/Users/burak/Desktop/acumen/dump/css/${file}`;
//         
//         if (fs.existsSync(sourcePath)) {
//             fs.copyFileSync(sourcePath, destPath);
//             fs.unlinkSync(sourcePath);
//             console.log(`Moved ${file} to dump folder`);
//         } else {
//             console.log(`${file} not found`);
//         }
//     } catch (error) {
//         console.error(`Error moving ${file}:`, error);
//     }
// });

console.log('CSS cleanup completed. Moved redundant files to dump folder.');
