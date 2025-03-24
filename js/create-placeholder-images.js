/**
 * Create Missing Placeholder Images
 * Generates placeholder images for missing files
 */
(function() {
    // Run when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📷 Creating placeholder images');
        
        // Create a directory structure checker
        checkAndCreatePlaceholders();
    });
    
    function checkAndCreatePlaceholders() {
        // Create list of expected images and their fallbacks
        const criticalImages = [
            {
                path: 'img/about/acumen-previous-year.jpg',
                alt: 'Acumen Previous Year',
                width: 600,
                height: 400
            },
            {
                path: 'img/placeholder.jpg',
                alt: 'Image Placeholder',
                width: 400, 
                height: 300
            }
        ];
        
        // Check if they exist and create fallbacks
        criticalImages.forEach(imageInfo => {
            const img = new Image();
            img.onload = function() {
                console.log(`✅ Image exists: ${imageInfo.path}`);
            };
            
            img.onerror = function() {
                console.log(`❌ Missing image: ${imageInfo.path}, creating placeholder`);
                
                // Find all images with this source and replace them
                document.querySelectorAll(`img[src$="${imageInfo.path.split('/').pop()}"]`).forEach(imgEl => {
                    imgEl.src = createImagePlaceholder(imageInfo.alt, imageInfo.width, imageInfo.height);
                });
            };
            
            img.src = imageInfo.path;
        });
    }
    
    function createImagePlaceholder(text, width, height) {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="#0a0a1b"/>
                <rect x="5" y="5" width="${width-10}" height="${height-10}" fill="none" stroke="#00f3ff" stroke-width="2"/>
                <text x="50%" y="45%" font-family="Arial" font-size="24" fill="#00f3ff" text-anchor="middle">
                    ${text}
                </text>
                <text x="50%" y="55%" font-family="Arial" font-size="14" fill="#00f3ff" text-anchor="middle">
                    Placeholder Image
                </text>
            </svg>
        `;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
})();
