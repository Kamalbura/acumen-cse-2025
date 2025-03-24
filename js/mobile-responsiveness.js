/**
 * Mobile Responsiveness Enhancements
 * Fixes layout issues on mobile devices dynamically
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body for specific mobile styling
        document.body.classList.add('is-mobile');
        
        // Fix hero height on mobile
        function adjustHeroHeight() {
            const hero = document.querySelector('.hero');
            if (hero) {
                const windowHeight = window.innerHeight;
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                hero.style.minHeight = `${windowHeight}px`;
                
                // Ensure hero content is nicely positioned
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.paddingTop = `${navbarHeight + 20}px`;
                    heroContent.style.paddingBottom = '40px';
                }
            }
        }
        
        // Prevent elements from overlapping by ensuring minimum spacing
        function preventOverlap() {
            // Check for elements that might overlap
            const elements = document.querySelectorAll('.venue-card, .transport-option, .event-card');
            
            elements.forEach(el => {
                // Add bottom margin to prevent overlap
                el.style.marginBottom = '20px';
                
                // Reset any transforms that might cause layout issues
                el.style.transform = 'none';
                
                // Add explicit height if needed
                if (el.scrollHeight < 100) {
                    el.style.minHeight = '100px';
                }
            });
        }
        
        // Fix grid layouts that might break
        function fixGridLayouts() {
            const grids = document.querySelectorAll('.venue-grid, .events-grid, .transport-options');
            
            grids.forEach(grid => {
                // For smallest screens, ensure single column layout
                if (window.innerWidth < 576) {
                    grid.style.gridTemplateColumns = '1fr';
                    grid.style.gap = '20px';
                }
            });
        }
        
        // Run fixes on load and resize
        adjustHeroHeight();
        preventOverlap();
        fixGridLayouts();
        
        window.addEventListener('resize', function() {
            adjustHeroHeight();
            fixGridLayouts();
        });
        
        // Fix touch interactions
        const touchTargets = document.querySelectorAll('a, button, .btn, .event-card, .venue-card');
        
        touchTargets.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }
    
    // Add this script to all pages to ensure consistent mobile experience
    if (!document.getElementById('viewport-meta')) {
        const meta = document.createElement('meta');
        meta.id = 'viewport-meta';
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
});
