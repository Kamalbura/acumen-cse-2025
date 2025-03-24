/**
 * Style Consistency
 * Ensures consistent styling across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add hero background elements to all hero sections
    addHeroBackgrounds();
    
    // Fix event card structures
    fixEventCards();
    
    // Ensure consistent styling for buttons
    fixButtonStyling();
    
    // Add placeholder for images until they load
    handleImageLoading();
    
    // Monitor for style inconsistencies
    monitorStyleConsistency();
});

/**
 * Add consistent hero background elements to all hero sections
 */
function addHeroBackgrounds() {
    // Target all hero sections across the site
    const heroSections = document.querySelectorAll('.hero, .events-hero, .event-hero, .page-hero');
    
    heroSections.forEach(section => {
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
 * Fix event card structures
 */
function fixEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Check if content wrapper exists
        let contentDiv = card.querySelector('.event-card-content');
        
        if (!contentDiv) {
            // Create content wrapper and move content into it
            contentDiv = document.createElement('div');
            contentDiv.className = 'event-card-content';
            
            // Move all children except the image into the content div
            Array.from(card.children).forEach(child => {
                if (child.tagName !== 'IMG') {
                    contentDiv.appendChild(child);
                }
            });
            
            // Append the content div after the image
            const img = card.querySelector('img');
            if (img) {
                img.insertAdjacentElement('afterend', contentDiv);
            } else {
                card.appendChild(contentDiv);
            }
        }
        
        // Ensure event-meta is before the link
        const meta = card.querySelector('.event-meta');
        const link = card.querySelector('.event-details-link');
        
        if (meta && link && meta.nextElementSibling !== link) {
            // Move meta before link
            if (contentDiv) {
                contentDiv.insertBefore(meta, link);
            }
        }
    });
}

/**
 * Fix button styling consistency
 */
function fixButtonStyling() {
    // Ensure all buttons have consistent styling
    const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .btn-outline');
    
    buttons.forEach(button => {
        // Add necessary classes for transitions and effects
        button.classList.add('transitions');
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 7px 15px rgba(0, 255, 255, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Handle image loading with placeholders
 */
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading class
        img.classList.add('loading');
        
        // Remove loading class when image loads
        img.onload = function() {
            this.classList.remove('loading');
        };
        
        // Handle error loading
        img.onerror = function() {
            this.src = 'img/placeholders/image-placeholder.jpg';
            this.classList.remove('loading');
        };
    });
}

/**
 * Monitor for style inconsistencies and fix them
 */
function monitorStyleConsistency() {
    // Check every few seconds for any style inconsistencies
    setInterval(() => {
        // Recheck hero backgrounds
        addHeroBackgrounds();
        
        // Recheck event cards
        fixEventCards();
        
        // Check for broken images
        document.querySelectorAll('img').forEach(img => {
            if (img.naturalWidth === 0 && !img.classList.contains('loading')) {
                img.classList.add('loading');
            }
        });
    }, 5000);
}
