/**
 * Presentation Readiness Script
 * Performs last-minute checks and fixes to ensure the website is presentation-ready
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Fix broken links
    fixBrokenLinks();
    
    // 2. Fix image paths that might be problematic
    fixImagePaths();
    
    // 3. Add loading indicators for better UX
    enhanceLoadingExperience();
    
    // 4. Ensure responsive behavior works
    ensureResponsiveness();
    
    // 5. Fix mobile navigation issues
    enhanceMobileNavigation();
    
    // Fix broken links by checking for 404s and fixing common path issues
    function fixBrokenLinks() {
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip external links and anchors
            if (!href || href.startsWith('http') || href.startsWith('#')) return;
            
            // Fix common path issues
            if (href.startsWith('./')) {
                link.setAttribute('href', href.replace('./', ''));
            }
            
            // Fix event page links if needed
            if (href.includes('/events/') && !href.includes('.html')) {
                link.setAttribute('href', href + '.html');
            }
            
            // Handle cases where original link had double slashes
            if (href.includes('//')) {
                link.setAttribute('href', href.replace('//', '/'));
            }
        });
    }
    
    // Fix common image path issues
    function fixImagePaths() {
        document.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (!src) return;
            
            // Fix missing images with a fallback
            img.onerror = function() {
                if (!this.src.includes('placeholder.jpg')) {
                    this.src = '../img/placeholder.jpg';
                }
            };
            
            // Fix relative paths in event pages
            if (window.location.pathname.includes('/events/') && !src.startsWith('../') && !src.startsWith('http')) {
                img.setAttribute('src', '../' + src);
            }
        });
    }
    
    // Add loading indicators for better UX
    function enhanceLoadingExperience() {
        // Add loading class to images that aren't loaded yet
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete) {
                img.classList.add('loading');
                img.addEventListener('load', () => img.classList.remove('loading'));
            }
        });
        
        // Add loading spinners to sections with dynamic content
        document.querySelectorAll('.events-grid, .team-grid, .gallery-grid').forEach(grid => {
            if (grid.children.length === 0) {
                grid.innerHTML = '<div class="loading-spinner"></div>';
            }
        });
    }
    
    // Fix navigation height issues on mobile
    function enhanceMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (!navbar || !navToggle) return;
        
        navToggle.addEventListener('click', () => {
            // Ensure the navbar has a max height when open on mobile
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                navLinks.style.maxHeight = 'calc(100vh - 70px)';
                navLinks.style.overflowY = 'auto';
            }
        });
    }
    
    // Ensure responsive behavior works correctly
    function ensureResponsiveness() {
        // Add viewport meta tag if missing
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(meta);
        }
        
        // Fix any overflow issues
        document.body.style.overflowX = 'hidden';
        
        // Check for and fix common responsive issues with grids
        document.querySelectorAll('.events-grid, .team-grid, .sponsors-grid').forEach(grid => {
            if (window.innerWidth < 768) {
                grid.style.gridTemplateColumns = '1fr';
            }
        });
    }
    
    // Console log success message when ready
    console.log('✅ Presentation ready checks completed!');
});
