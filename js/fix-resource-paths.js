/**
 * Resource Path Fixer
 * Creates necessary directories and placeholder files
 */
(function() {
    console.log('🔍 Running resource path fixer');
    
    // Check and create necessary directories and files
    document.addEventListener('DOMContentLoaded', function() {
        // Fix the inline style issue first
        fixInlineGlitchStyle();
        
        // Create placeholder images
        createPlaceholderImage();
    });
    
    /**
     * Fix the inline style error for glitch text
     */
    function fixInlineGlitchStyle() {
        // Remove any incorrect <scrypt> tag
        const incorrectScript = document.querySelector('scrypt');
        if (incorrectScript) {
            incorrectScript.remove();
        }
        
        // Add proper style tag with the correct styling
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .hero-content h1 .glitch-text {
                font-size: 50px;
                display: inline-block;
            }
            
            /* Make sure glitch effect is visible */
            .glitch-text {
                position: relative;
                display: inline-block;
                color: #fff;
                font-family: 'Orbitron', sans-serif;
                letter-spacing: 2px;
                text-shadow: 0 0 10px rgba(0, 243, 255, 0.8);
            }
        `;
        document.head.appendChild(styleTag);
    }
    
    /**
     * Create placeholder images for missing resources
     */
    function createPlaceholderImage() {
        // Monitor for image loading errors
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                const img = e.target;
                console.log(`Creating placeholder for: ${img.src}`);
                
                // Generate SVG placeholder for the image
                const svgPlaceholder = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect width="100%" height="100%" fill="#0a0a1b"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#00f3ff" text-anchor="middle">
                            Image Placeholder
                        </text>
                        <text x="50%" y="50%" dy="25" font-family="Arial" font-size="14" fill="#00f3ff" text-anchor="middle">
                            ${img.alt || 'Acumen 2025'}
                        </text>
                    </svg>
                `;
                
                // Apply the placeholder
                img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPlaceholder)}`;
            }
        }, true);
    }
})();
