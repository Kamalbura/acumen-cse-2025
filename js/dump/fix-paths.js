/**
 * Fix Path Issues
 * Resolves issues with broken image paths and resource loading
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔍 Running path fixes');
        fixImagePaths();
        fixResourcePaths();
        fixBrokenLinks();
        addImageFallbacks();
    });

    /**
     * Fix common image path issues
     */
    function fixImagePaths() {
        // Check for images with invalid or missing paths
        document.querySelectorAll('img').forEach(img => {
            // Skip images that are already loaded or have valid src
            if (img.complete && img.naturalHeight !== 0) return;
            
            const src = img.getAttribute('src');
            if (!src || src === 'undefined' || src === 'null') {
                // Apply placeholder for missing image sources
                img.src = 'img/placeholders/event-placeholder.jpg';
                console.warn('Fixed missing image source:', img);
                
                // Add error handling in case the placeholder doesn't work
                img.onerror = function() {
                    this.onerror = null; // Prevent infinite loop
                    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23060614"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="12" text-anchor="middle" fill="%2300f3ff"%3EACUMEN 2025%3C/text%3E%3C/svg%3E';
                    this.style.opacity = '0.7';
                };
            } else if (src.startsWith('../')) {
                // Fix relative paths that might be incorrect
                const fixedSrc = src.replace(/^\.\.\/+/, '');
                img.src = fixedSrc;
                console.log('Fixed relative image path:', fixedSrc);
            }
        });
        
        // Fix background images in CSS
        document.querySelectorAll('[style*="background"]').forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('url(../')) {
                const fixedStyle = style.replace(/url\((['"]?)\.\.\/+/g, 'url($1');
                el.setAttribute('style', fixedStyle);
            }
        });
    }

    /**
     * Fix issues with CSS and JS resource paths
     */
    function fixResourcePaths() {
        // Check for CSS files that failed to load
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            // Create a test to check if stylesheet loaded
            const testEl = document.createElement('div');
            testEl.style.display = 'none';
            testEl.classList.add('css-test-element');
            document.body.appendChild(testEl);

            // Attempt to apply styles that should be in the CSS
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(testEl);
                const elementVisible = (computedStyle.display !== 'none');
                
                // If styles aren't applied, the CSS might not be loaded
                if (elementVisible) {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('../')) {
                        const fixedHref = href.replace(/^\.\.\/+/, '');
                        link.href = fixedHref;
                        console.log('Fixed CSS path:', fixedHref);
                    }
                }
                
                // Clean up test element
                document.body.removeChild(testEl);
            }, 500);
        });

        // Check if any script failed to load
        window.addEventListener('error', function(e) {
            if (e.filename && e.filename.includes('.js')) {
                const scriptName = e.filename.split('/').pop();
                console.warn('Script failed to load:', scriptName);
                
                // Attempt to fix script path and reload
                document.querySelectorAll('script').forEach(script => {
                    const src = script.getAttribute('src');
                    if (src && src.includes(scriptName) && src.startsWith('../')) {
                        const fixedSrc = src.replace(/^\.\.\/+/, '');
                        const newScript = document.createElement('script');
                        newScript.src = fixedSrc;
                        script.parentNode.replaceChild(newScript, script);
                        console.log('Attempted to fix script path:', fixedSrc);
                    }
                });
            }
        }, true);
    }

    /**
     * Fix broken links in the navigation
     */
    function fixBrokenLinks() {
        // Check navigation links
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Fix common issues with link paths
            if (href === '#' || href === 'javascript:void(0)') {
                // Fix empty links to point to relevant sections
                const text = link.textContent.toLowerCase().trim();
                
                if (text.includes('home')) {
                    link.href = 'index.html';
                } else if (text.includes('event')) {
                    link.href = 'events.html';
                } else if (text.includes('contact')) {
                    link.href = 'contact.html';
                } else if (text.includes('register')) {
                    link.href = 'registration.html';
                } else if (text.includes('sponsor')) {
                    link.href = 'sponsors.html';
                } else if (text.includes('team')) {
                    link.href = 'team.html';
                } else if (text.includes('gallery')) {
                    link.href = 'gallery.html';
                }
            } else if (href.startsWith('../')) {
                // Fix relative links
                link.href = href.replace(/^\.\.\/+/, '');
            }
        });
    }

    /**
     * Add fallbacks for images to prevent broken images
     */
    function addImageFallbacks() {
        document.querySelectorAll('img').forEach(img => {
            // Only add error handler if one doesn't already exist
            if (!img.hasAttribute('data-error-handler')) {
                img.setAttribute('data-error-handler', 'true');
                
                img.addEventListener('error', function() {
                    // Get image context to determine appropriate fallback
                    const isEventImage = img.closest('.event-image') !== null || 
                                        img.classList.contains('event-image');
                    
                    const isTeamMember = img.closest('.team-member') !== null;
                    
                    const isSponsorLogo = img.closest('.sponsor-item') !== null;
                    
                    // Apply appropriate fallback based on context
                    if (isEventImage) {
                        this.src = 'img/placeholders/event-placeholder.jpg';
                    } else if (isTeamMember) {
                        this.src = 'img/placeholders/profile-placeholder.jpg';
                    } else if (isSponsorLogo) {
                        this.src = 'img/placeholders/sponsor-placeholder.png';
                    } else {
                        this.src = 'img/placeholders/image-placeholder.jpg';
                    }
                    
                    // Add appropriate styling
                    this.style.opacity = '0.7';
                });
            }
        });
    }
})();
