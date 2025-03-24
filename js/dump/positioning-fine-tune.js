/**
 * Positioning Fine-Tune
 * Makes precise adjustments to element positions that can't be handled by CSS alone
 */

(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 Running positioning fine-tuning');
        
        // Wait for images to load to prevent layout shifts
        window.addEventListener('load', function() {
            // Run all positioning fixes
            fixHeroPositioning();
            fixEventCardPositioning();
            fixCategoryCardHeights();
            fixSponsorPositioning();
            centerCountdownDigits();
        });
        
        // Update on window resize
        window.addEventListener('resize', debounce(function() {
            fixHeroPositioning();
            fixEventCardPositioning();
            fixCategoryCardHeights();
            fixSponsorPositioning();
        }, 250));
    });
    
    /**
     * Fix hero section positioning issues
     */
    function fixHeroPositioning() {
        const heroSection = document.querySelector('.hero-section');
        const navbar = document.querySelector('.navbar');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (!heroSection || !navbar) return;
        
        // Calculate navbar height and apply correct padding to hero section
        const navbarHeight = navbar.offsetHeight;
        heroSection.style.paddingTop = `${navbarHeight}px`;
        
        // Position hero visual correctly on desktop
        if (heroVisual && window.innerWidth > 992) {
            const container = heroSection.querySelector('.container');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const rightPosition = window.innerWidth - containerRect.right;
                
                // Only position if there's enough space
                if (rightPosition > 200) {
                    heroVisual.style.right = `${Math.max(20, rightPosition - 100)}px`;
                    heroVisual.style.position = 'absolute';
                    heroVisual.style.top = '50%';
                    heroVisual.style.transform = 'translateY(-50%)';
                } else {
                    // Reset to static positioning
                    heroVisual.style.position = 'static';
                    heroVisual.style.transform = 'none';
                    heroVisual.style.margin = '40px auto -30px';
                }
            }
        } else if (heroVisual) {
            // Mobile positioning
            heroVisual.style.position = 'relative';
            heroVisual.style.right = 'auto';
            heroVisual.style.top = 'auto';
            heroVisual.style.transform = 'none';
            heroVisual.style.margin = '40px auto -30px';
        }
    }
    
    /**
     * Fix event card positioning and heights
     */
    function fixEventCardPositioning() {
        const eventContainers = [
            '.events-grid',
            '.featured-events-grid'
        ];
        
        eventContainers.forEach(containerSelector => {
            const container = document.querySelector(containerSelector);
            if (!container) return;
            
            // Get all event cards in this container
            const eventCards = container.querySelectorAll('.event-card');
            if (eventCards.length === 0) return;
            
            // Reset heights first
            eventCards.forEach(card => {
                card.style.height = '';
            });
            
            // Skip equalization on mobile
            if (window.innerWidth < 768) return;
            
            // Group cards by their vertical position (row detection)
            const rows = {};
            eventCards.forEach(card => {
                const offsetTop = Math.floor(card.getBoundingClientRect().top);
                if (!rows[offsetTop]) rows[offsetTop] = [];
                rows[offsetTop].push(card);
            });
            
            // Equalize heights within each row
            Object.keys(rows).forEach(offsetTop => {
                const rowCards = rows[offsetTop];
                let maxHeight = 0;
                
                // Find max height in this row
                rowCards.forEach(card => {
                    maxHeight = Math.max(maxHeight, card.offsetHeight);
                });
                
                // Apply max height to all cards in this row
                rowCards.forEach(card => {
                    card.style.height = `${maxHeight}px`;
                });
            });
            
            // Make sure event content areas are properly aligned
            eventCards.forEach(card => {
                const content = card.querySelector('.event-content');
                const details = card.querySelector('.event-details-link');
                
                if (content && details) {
                    content.style.display = 'flex';
                    content.style.flexDirection = 'column';
                    details.style.marginTop = 'auto';
                }
            });
        });
    }
    
    /**
     * Fix category card heights
     */
    function fixCategoryCardHeights() {
        const categoryContainer = document.querySelector('.categories-grid');
        if (!categoryContainer) return;
        
        const cards = categoryContainer.querySelectorAll('.category-card');
        if (cards.length === 0) return;
        
        // Reset heights
        cards.forEach(card => {
            card.style.height = '';
        });
        
        // Skip on mobile
        if (window.innerWidth < 768) return;
        
        // Find maximum height
        let maxHeight = 0;
        cards.forEach(card => {
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });
        
        // Apply to all cards
        cards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }
    
    /**
     * Fix sponsor logo positioning
     */
    function fixSponsorPositioning() {
        const sponsorItems = document.querySelectorAll('.sponsor-item');
        if (sponsorItems.length === 0) return;
        
        sponsorItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                // Center the image and maintain proper aspect ratio
                img.style.maxHeight = '80%';
                img.style.maxWidth = '80%';
                img.style.objectFit = 'contain';
                img.style.position = 'relative';
                img.style.margin = '0 auto';
                
                // Add fallback for images that fail to load
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    
                    // Create placeholder
                    if (!item.querySelector('.sponsor-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'sponsor-placeholder';
                        placeholder.textContent = img.alt || 'Sponsor';
                        placeholder.style.border = '1px dashed rgba(0, 243, 255, 0.5)';
                        placeholder.style.padding = '10px';
                        placeholder.style.textAlign = 'center';
                        placeholder.style.color = 'rgba(0, 243, 255, 0.8)';
                        item.appendChild(placeholder);
                    }
                });
            }
        });
    }
    
    /**
     * Center countdown digits and labels
     */
    function centerCountdownDigits() {
        const countdownDigits = document.querySelectorAll('.countdown-digit');
        if (countdownDigits.length === 0) return;
        
        countdownDigits.forEach(digit => {
            digit.style.textAlign = 'center';
            digit.style.width = '100%';
        });
        
        const countdownLabels = document.querySelectorAll('.countdown-label');
        if (countdownLabels.length === 0) return;
        
        countdownLabels.forEach(label => {
            label.style.textAlign = 'center';
            label.style.width = '100%';
        });
        
        // Make countdown items flex containers
        const countdownItems = document.querySelectorAll('.countdown-item');
        if (countdownItems.length === 0) return;
        
        countdownItems.forEach(item => {
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.justifyContent = 'center';
            item.style.alignItems = 'center';
        });
    }
    
    /**
     * Debounce function to prevent excessive function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
})();
