/**
 * Event Cards Fix
 * Improves event card layout and animations for better performance
 */

(function() {
    // Configuration
    const config = {
        cardSelectors: ['.event-card', '.featured-event-card', '.event-item'],
        imageSelectors: ['.event-image', 'img'],
        titleSelectors: ['.event-title', 'h3', '.title'],
        descriptionSelectors: ['.event-description', '.description', 'p'],
        linkSelectors: ['.event-link', '.event-details-link', 'a.btn'],
        dateSelectors: ['.event-date', '.date'],
        categorySelectors: ['.event-category', '.category', '.badge']
    };
    
    // Track execution
    let isInitialized = false;
    
    /**
     * Initialize event cards fix
     */
    function init() {
        // Prevent multiple executions
        if (isInitialized) return;
        isInitialized = true;
        
        console.log('🎫 Initializing event cards fix');
        
        // Find all event cards
        const eventCards = findAllEventCards();
        if (eventCards.length === 0) return;
        
        console.log(`Found ${eventCards.length} event cards`);
        
        // Fix each card
        eventCards.forEach(fixEventCard);
        
        // Add global CSS fixes
        injectEventCardFixStyles();
        
        // Add intersection observer for animation
        setupScrollAnimation();
        
        // Add resize handler for responsive fixes
        window.addEventListener('resize', debounce(fixCardSizes, 200));
        
        // Fix card sizes initially
        setTimeout(fixCardSizes, 300);
    }
    
    /**
     * Find all event cards on the page
     */
    function findAllEventCards() {
        const cards = [];
        
        // Try each selector
        config.cardSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => cards.push(el));
        });
        
        return cards;
    }
    
    /**
     * Fix an individual event card
     */
    function fixEventCard(card) {
        // Skip if already fixed
        if (card.hasAttribute('data-fixed')) return;
        
        // Mark as fixed
        card.setAttribute('data-fixed', 'true');
        
        // Add flex layout if not present
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        
        // Find image
        let image = null;
        for (const selector of config.imageSelectors) {
            image = card.querySelector(selector);
            if (image) break;
        }
        
        // Fix image
        if (image) {
            if (image.tagName === 'IMG') {
                // For direct img element
                image.style.objectFit = 'cover';
                image.style.aspectRatio = '16/9';
                image.setAttribute('loading', 'lazy');
            } else {
                // For image container
                image.style.overflow = 'hidden';
                
                // Fix nested image if present
                const img = image.querySelector('img');
                if (img) {
                    img.style.objectFit = 'cover';
                    img.style.width = '100%';
                    img.style.aspectRatio = '16/9';
                    img.setAttribute('loading', 'lazy');
                    
                    // Add smooth hover effect
                    img.style.transition = 'transform 0.5s ease';
                    card.addEventListener('mouseenter', function() {
                        if (!document.documentElement.classList.contains('is-scrolling')) {
                            img.style.transform = 'scale(1.05)';
                        }
                    });
                    card.addEventListener('mouseleave', function() {
                        img.style.transform = '';
                    });
                }
            }
        }
        
        // Find event content container - create if not present
        let contentContainer = card.querySelector('.event-content, .event-card-content, .content');
        if (!contentContainer) {
            // Create content container
            contentContainer = document.createElement('div');
            contentContainer.className = 'event-card-content';
            
            // Move all non-image content into container
            const imageElement = image && image.tagName ? image : null;
            const imageContainer = image && !image.tagName ? image : null;
            
            // Move child nodes that are not the image into content container
            Array.from(card.childNodes).forEach(node => {
                if (node !== imageElement && node !== imageContainer) {
                    contentContainer.appendChild(node);
                }
            });
            
            // Append content container to card
            card.appendChild(contentContainer);
        }
        
        // Add flex styling to content container
        contentContainer.style.display = 'flex';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.flexGrow = '1';
        
        // Find and fix link position
        let link = null;
        for (const selector of config.linkSelectors) {
            link = card.querySelector(selector);
            if (link) break;
        }
        
        if (link) {
            // Move link to end of content container
            contentContainer.appendChild(link);
            link.style.marginTop = 'auto';
            link.style.alignSelf = 'center';
        }
        
        // Extract category if present
        let category = null;
        for (const selector of config.categorySelectors) {
            category = card.querySelector(selector);
            if (category) break;
        }
        
        // Add category as data attribute for filtering
        if (category) {
            const categoryText = category.textContent.trim().toLowerCase();
            card.setAttribute('data-category', categoryText);
        }
        
        // Add optimized hover effect
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.addEventListener('mouseenter', function() {
            if (!document.documentElement.classList.contains('is-scrolling')) {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 243, 255, 0.2)';
            }
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    /**
     * Inject CSS fixes for event cards
     */
    function injectEventCardFixStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .event-card, .featured-event-card, .event-item {
                display: flex;
                flex-direction: column;
                height: auto;
                min-height: 350px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                overflow: hidden;
                backface-visibility: hidden;
                position: relative;
            }
            
            .event-card-content, .event-content, .content {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
            
            .event-card img, .featured-event-card img, .event-item img {
                width: 100%;
                aspect-ratio: 16/9;
                object-fit: cover;
            }
            
            .event-image, .featured-event-card .event-image {
                overflow: hidden;
            }
            
            .event-image img, .featured-event-card .event-image img {
                transition: transform 0.5s ease;
            }
            
            .event-title, .event-card h3, .featured-event-card h3 {
                margin-top: 10px;
                margin-bottom: 10px;
            }
            
            .event-description, .event-card p, .featured-event-card p {
                margin-bottom: 15px;
            }
            
            .event-details-link, .event-link, .event-card .btn {
                margin-top: auto;
                align-self: center;
            }
            
            .events-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 30px;
            }
            
            /* Hover effect without flicker */
            .is-scrolling .event-card,
            .is-scrolling .featured-event-card,
            .is-scrolling .event-item {
                transform: none !important;
                box-shadow: none !important;
            }
            
            .is-scrolling .event-image img {
                transform: none !important;
            }
            
            /* Touch device optimizations */
            .touch-device .event-card:hover,
            .touch-device .featured-event-card:hover,
            .touch-device .event-item:hover {
                transform: none !important;
            }
            
            /* Responsive adjustments */
            @media (max-width: 767px) {
                .events-grid {
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                }
            }
            
            @media (max-width: 576px) {
                .events-grid {
                    grid-template-columns: 1fr;
                    max-width: 320px;
                    margin-left: auto;
                    margin-right: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Setup scroll-based animation for event cards
     */
    function setupScrollAnimation() {
        if (!('IntersectionObserver' in window)) return;
        
        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class with delay based on position
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    const delay = (index % 5) * 0.1; // Delay increases for each card, resets every 5 cards
                    
                    entry.target.style.transitionDelay = `${delay}s`;
                    entry.target.classList.add('in-view');
                    
                    // Stop observing once animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Adjust trigger point (when element is 50px into viewport)
            threshold: 0.15 // Trigger when 15% visible
        });
        
        // Observe all event cards
        findAllEventCards().forEach(card => {
            observer.observe(card);
        });
    }
    
    /**
     * Fix card sizes for consistent layout
     */
    function fixCardSizes() {
        const eventCards = findAllEventCards();
        
        // Skip if no event cards
        if (eventCards.length === 0) return;
        
        // Reset heights
        eventCards.forEach(card => {
            card.style.height = '';
        });
        
        // Group cards by row for consistent height
        if (window.innerWidth >= 768) {
            // Only apply on larger screens where grid is multi-column
            const cardsInRow = groupCardsByRow(eventCards);
            
            // Set equal height for each row
            for (const rowCards of cardsInRow) {
                const maxHeight = Math.max(...rowCards.map(card => card.offsetHeight));
                rowCards.forEach(card => {
                    card.style.height = maxHeight + 'px';
                });
            }
        }
    }
    
    /**
     * Group cards by row based on their vertical position
     */
    function groupCardsByRow(cards) {
        // Create map of top position -> array of cards
        const rowMap = {};
        
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const top = Math.round(rect.top);
            
            if (!rowMap[top]) {
                rowMap[top] = [];
            }
            
            rowMap[top].push(card);
        });
        
        // Convert map to array of rows
        return Object.values(rowMap);
    }
    
    /**
     * Debounce function to prevent excessive calls
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
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', init);
    
    // Also try initializing earlier if possible
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    }
    
    // Expose API
    window.EventCardsFix = {
        init,
        fixCardSizes,
        findAllEventCards
    };
})();
