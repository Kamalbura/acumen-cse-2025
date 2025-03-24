/**
 * Events Page QoS Fixes
 * This script fixes common issues in the events.html page
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Fix category filter functionality
    fixCategoryFilters();
    
    // 2. Fix event card layout and responsive behavior
    fixEventCardLayout();
    
    // 3. Add missing ARIA attributes for accessibility
    enhanceAccessibility();
    
    // 4. Fix image loading and handling
    fixImageHandling();
    
    // 5. Add error recovery for dynamic content
    addErrorRecovery();
    
    /**
     * Fix category filter functionality
     */
    function fixCategoryFilters() {
        // Ensure we have an active filter on page load
        const categoryButtons = document.querySelectorAll('.category-btn, .filter-btn');
        if (categoryButtons.length === 0) return;
        
        let hasActiveFilter = false;
        categoryButtons.forEach(btn => {
            if (btn.classList.contains('active')) hasActiveFilter = true;
        });
        
        if (!hasActiveFilter) {
            // Set the first or "all" filter as active
            const allBtn = document.querySelector('[data-filter="all"]') || categoryButtons[0];
            if (allBtn) allBtn.classList.add('active');
        }
    }
    
    /**
     * Infer category from card content if missing
     */
    function inferCardCategory(card) {
        let category = 'technical'; // Default
        const text = card.textContent.toLowerCase();
        
        if (text.includes('gaming') || text.includes('game') || text.includes('tournament')) {
            category = 'gaming';
        } else if (text.includes('hackathon')) {
            category = 'hackathon';
        } else if (text.includes('code') || text.includes('coding') || text.includes('programming')) {
            category = 'coding';
        } else if (text.includes('non-tech') || text.includes('non tech')) {
            category = 'non-technical';
        }
        
        card.setAttribute('data-category', category);
    }
    
    /**
     * Fix event card layout issues
     */
    function fixEventCardLayout() {
        const eventCards = document.querySelectorAll('.event-card');
        if (eventCards.length === 0) return;
        
        eventCards.forEach(card => {
            // Add missing data-category attribute if needed
            if (!card.getAttribute('data-category')) {
                inferCardCategory(card);
            }
            
            // Fix link button position
            const detailsLink = card.querySelector('.event-details-link, a.btn-details');
            if (detailsLink) {
                detailsLink.style.marginTop = 'auto';
            }
        });
    }
    
    /**
     * Enhance accessibility
     */
    function enhanceAccessibility() {
        // Add proper ARIA roles to tab navigation
        const categoryButtons = document.querySelectorAll('.category-btn, .filter-btn');
        categoryButtons.forEach((btn, index) => {
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
            btn.setAttribute('id', 'tab-' + btn.getAttribute('data-filter'));
            btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
        });
        
        // Add ARIA labels to event cards
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || 'Event';
            card.setAttribute('aria-label', title + ' event card');
            
            // Make cards keyboard navigable
            const link = card.querySelector('a');
            if (link && !card.getAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        link.click();
                    }
                });
            }
        });
    }
    
    /**
     * Fix image handling
     */
    function fixImageHandling() {
        const images = document.querySelectorAll('.events-grid img, .event-card img');
        if (images.length === 0) return;
        
        images.forEach(img => {
            // Add loading attribute
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add alt text if missing
            if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
                const title = img.closest('.event-card')?.querySelector('h3')?.textContent || 'Event';
                img.setAttribute('alt', title + ' image');
            }
            
            // Add error handler
            img.onerror = function() {
                this.src = '../img/placeholder.jpg';
                this.alt = 'Event image placeholder';
            };
        });
    }
    
    /**
     * Add error recovery for dynamic content
     */
    function addErrorRecovery() {
        // Check if events grid is empty
        const eventsGrids = document.querySelectorAll('.events-grid');
        eventsGrids.forEach(grid => {
            if (grid.children.length === 0 || (grid.children.length === 1 && grid.children[0].classList.contains('loading-spinner'))) {
                // Create fallback message
                const fallbackMessage = document.createElement('div');
                fallbackMessage.className = 'events-fallback';
                fallbackMessage.innerHTML = `
                    <div class="fallback-message">
                        <i class="fas fa-info-circle"></i>
                        <h3>Events are loading...</h3>
                        <p>If events don't appear, please refresh the page or contact support.</p>
                        <button class="btn btn-secondary refresh-button">Refresh Content</button>
                    </div>
                `;
                
                // Add refresh functionality
                const refreshButton = fallbackMessage.querySelector('.refresh-button');
                refreshButton.addEventListener('click', function() {
                    location.reload();
                });
                
                grid.appendChild(fallbackMessage);
            }
        });
    }
    
    // Log successful initialization
    console.log('Events page QoS fixes applied successfully');
});
