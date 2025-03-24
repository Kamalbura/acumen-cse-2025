/**
 * Style Consistency Script
 * Ensures that all pages, including event pages, have consistent styling
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Style consistency check running...');
    
    // Check if we're on an event page
    const isEventPage = window.location.pathname.includes('/events/');
    
    // Fix navbar padding on all pages
    adjustNavbarPadding();
    
    // Add hero backgrounds consistently
    addHeroBackgrounds();
    
    // Fix event page specific issues
    if (isEventPage) {
        fixEventPageStyles();
    }
    
    /**
     * Add consistent hero background elements to all hero sections
     */
    function addHeroBackgrounds() {
        // Target all hero sections across the site BUT exclude the main homepage hero
        const heroSections = document.querySelectorAll('.events-hero, .event-hero, .page-hero');
        
        heroSections.forEach(section => {
            // Skip the main homepage hero section
            if (section.classList.contains('hero') || section.classList.contains('hero-section')) {
                return;
            }
            
            // Add hero-overlay if not present
            if (!section.querySelector('.hero-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'hero-overlay';
                section.appendChild(overlay);
            }
            
            // Add hero-grid if not present
            if (!section.querySelector('.hero-grid')) {
                const grid = document.createElement('div');
                grid.className = 'hero-grid';
                section.appendChild(grid);
            }
        });
    }
    
    /**
     * Adjust navbar padding for all pages
     */
    function adjustNavbarPadding() {
        document.querySelectorAll('.hero, .page-banner, .event-hero').forEach(el => {
            if (el) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                el.style.paddingTop = (navbarHeight + 10) + 'px';
            }
        });
    }
    
    /**
     * Fix event page specific styling issues
     */
    function fixEventPageStyles() {
        // Ensure glitch text effect is applied consistently
        document.querySelectorAll('.glitch-text').forEach(el => {
            if (!el.getAttribute('data-text') && el.textContent.trim() !== '') {
                el.setAttribute('data-text', el.textContent.trim());
            }
        });
        
        // Fix event meta styles
        document.querySelectorAll('.event-meta').forEach(meta => {
            // Apply consistent transparency for meta containers
            meta.style.backgroundColor = 'rgba(10, 10, 27, 0.3)';
            meta.style.backdropFilter = 'blur(4px)';
        });
        
        // Fix event poster styles for consistency
        document.querySelectorAll('.event-poster').forEach(poster => {
            const categoryClasses = Array.from(document.body.classList).filter(cls => cls.startsWith('category--'));
            if (categoryClasses.length > 0) {
                const category = categoryClasses[0].replace('category--', '');
                switch(category) {
                    case 'technical':
                        poster.style.borderColor = 'var(--category-technical-color)';
                        break;
                    case 'gaming':
                        poster.style.borderColor = 'var(--category-gaming-color)';
                        break;
                    case 'coding':
                        poster.style.borderColor = 'var(--category-coding-color)';
                        break;
                    case 'hackathon':
                        poster.style.borderColor = 'var(--category-hackathon-color)';
                        break;
                    case 'nontech':
                        poster.style.borderColor = 'var(--category-nontech-color)';
                        break;
                }
            }
        });
    }
});
