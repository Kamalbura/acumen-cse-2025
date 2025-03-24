/**
 * File Cleanup Script
 * Identifies and moves conflicting files to an 'archived' directory
 */

(function() {
    // Files to archive (these cause conflicts with layout)
    const filesToArchive = [
        // Redundant CSS files
        'css/events-page-fixes.css',
        'css/events-page-fixes-enhanced.css',
        'css/text-layout-fixes.css',
        'css/layout-fixes.css', 
        'css/final-polish.css',
        'css/visual-polish.css',
        'css/cyberpunk-enhanced.css',
        'css/anti-flicker.css',
        'css/cursor-fix.css',
        'css/mobile-fixes.css',
        'css/emergency-fallback.css',
        'css/unified-fixes.css',
        'css/cross-browser-fixes.css',
        'css/presentation-fix.css',
        'css/homepage-fixes.css',
        'css/hero-enhanced.css',
        
        // Redundant JavaScript files
        'js/position-fix.js',
        'js/ui-fixes.js',
        'js/visual-enhancements.js', 
        'js/mobile-fixes.js',
        'js/mobile-fix.js',
        'js/cursor-effects.js',
        'js/cursor-effects-enhanced.js',
        'js/font-loading-fix.js',
        'js/loading-screen-fix.js',
        'js/scroll-animations.js',
        'js/positioning-fine-tune.js',
        'js/disable-cursor-effects.js',
        'js/fix-hover-effects.js',
        'js/path-fixer.js',
        'js/fix-paths.js',
        'js/nav-fix.js',
        'js/emergency-fix.js'
    ];
    
    console.log('⚠️ To prevent layout conflicts, the following files should be moved to an "archived" folder:');
    console.log(filesToArchive.join('\n'));
    
    console.log('\n📝 To create the archive folder and move these files, run:');
    console.log('mkdir -p archived/css archived/js');
    
    filesToArchive.forEach(file => {
        const targetDir = file.startsWith('css/') ? 'archived/css/' : 'archived/js/';
        const filename = file.split('/').pop();
        console.log(`mv ${file} ${targetDir}${filename}`);
    });
})();
