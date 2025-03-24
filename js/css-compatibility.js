/**
 * CSS Integration Helper
 * Ensures compatibility between modular CSS and consolidated CSS
 */
document.addEventListener('DOMContentLoaded', function() {
    // Detect which CSS system is in use and add appropriate class to body
    const usingModularCSS = document.querySelector('link[href*="main.css"]');
    const usingConsolidatedCSS = document.querySelector('link[href*="consolidated.css"]');
    
    if (usingModularCSS && usingConsolidatedCSS) {
        console.warn('Both CSS systems detected - this may cause conflicts');
        document.body.classList.add('dual-css-systems');
        
        // Ensure consolidated CSS takes precedence if both are loaded
        const consolidatedLink = document.querySelector('link[href*="consolidated.css"]');
        if (consolidatedLink) {
            document.head.appendChild(consolidatedLink); // Move to end to take precedence
        }
    } else if (usingModularCSS) {
        document.body.classList.add('using-modular-css');
        console.log('Using modular CSS system');
    } else if (usingConsolidatedCSS) {
        document.body.classList.add('using-consolidated-css');
        console.log('Using consolidated CSS system');
    }
    
    // Fix any known style conflicts regardless of system
    fixCommonStyleIssues();
    
    /**
     * Fix common style issues that occur in both systems
     */
    function fixCommonStyleIssues() {
        // Fix hero section padding to prevent navbar overlap
        document.querySelectorAll('.hero, .page-banner, .event-hero').forEach(el => {
            if (el) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                el.style.paddingTop = (navbarHeight + 10) + 'px';
            }
        });
        
        // Ensure background transparency for all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.backgroundColor = 'transparent';
        });
    }
    
    const pageHasEventCards = document.querySelector('.event-card');
    
    if (usingModularCSS && pageHasEventCards) {
        console.log('Using modular CSS with event cards - applying compatibility fixes');
        document.body.classList.add('using-modular-css');
        
        // Add helpful classes to the event cards
        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.add('modular-styling');
        });
    }
    
    if (usingConsolidatedCSS && pageHasEventCards) {
        console.log('Using consolidated CSS with event cards - applying compatibility fixes');
        document.body.classList.add('using-consolidated-css');
        
        // Add helpful classes to the event cards
        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.add('consolidated-styling');
        });
    }
    
    // Fix for event cards with missing attributes
    document.querySelectorAll('.event-card').forEach(card => {
        if (!card.getAttribute('data-category')) {
            card.setAttribute('data-category', 'uncategorized');
        }
    });
    
    // Fix for event cards with missing glitch-overlay
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        // Remove any glitch overlays - we don't want them anymore
        const glitchOverlay = card.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.remove();
        }
        
        // Remove glitch-image class from images
        const cardImage = card.querySelector('img.glitch-image');
        if (cardImage) {
            cardImage.classList.remove('glitch-image');
        }
    });
    
    // Force GPU acceleration to smooth animations
    document.querySelectorAll('.event-card, .glitch-text, .event-details-link').forEach(el => {
        el.style.transform = 'translateZ(0)';
        el.style.backfaceVisibility = 'hidden';
        el.style.willChange = 'transform, opacity';
    });
    
    // Additional fix for animation conflicts
    if (document.querySelector('.events-grid')) {
        // Normalize animation behavior for event cards
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach((card, index) => {
            // Clear any existing animation styles that might conflict
            if (card.style.animation) {
                card.style.animation = '';
            }
            
            // Apply consistent animation with staggered delay
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }
});
