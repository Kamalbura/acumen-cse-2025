/**
 * Event Card Styling Fixes
 * Handles dynamic style adjustments for event cards
 */
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all event cards have valid categories
    const validCategories = ['technical', 'non-technical', 'gaming', 'coding'];
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // If category is missing or invalid (like the removed "hackathon"), set to "technical"
        if (!category || !validCategories.includes(category)) {
            console.log(`Fixing invalid category: "${category}" on card`, card);
            card.setAttribute('data-category', 'technical');
        }
    });
    
    // First fix any style inconsistencies with event cards
    if (eventCards.length > 0) {
        console.log('Applying event card style fixes');
        
        // Clean up conflicting inline styles
        eventCards.forEach(card => {
            // Remove any inline padding that might conflict with our CSS
            if (card.style.padding) {
                card.style.padding = '';
            }
            
            // Make sure card content has the correct padding, not the card itself
            const content = card.querySelector('.event-card-content');
            if (content && !content.style.padding) {
                content.style.padding = '25px 15px';
            }
            
            // Fix width and height to ensure consistent sizing
            card.style.height = '360px';
            card.style.width = '100%';
            card.style.maxWidth = '100%';
            card.style.boxSizing = 'border-box';
            card.style.margin = '0';
            
            // Fix margins for cards in grid vs carousel
            if (card.closest('.events-grid')) {
                card.style.marginRight = '0';
            } else if (card.closest('.events-scroll')) {
                card.style.marginRight = '20px';
            }
            
            // Remove any remaining glitch-overlay elements
            const glitchOverlay = card.querySelector('.glitch-overlay');
            if (glitchOverlay) {
                glitchOverlay.remove();
            }
        });
    }
    
    // Fix grid layout issues by ensuring container and grid have proper widths
    const eventsContainer = document.querySelector('.events-list .container');
    const eventsGrid = document.querySelector('.events-grid');
    
    if (eventsContainer && eventsGrid) {
        eventsContainer.style.maxWidth = '1200px';
        eventsContainer.style.boxSizing = 'border-box';
        eventsGrid.style.width = '100%';
        
        // Force grid layout with appropriate columns based on screen width
        function updateGridColumns() {
            const width = window.innerWidth;
            
            if (width > 1200) {
                eventsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            } else if (width > 992) {
                eventsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else if (width > 576) {
                eventsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                eventsGrid.style.gridTemplateColumns = '1fr';
            }
        }
        
        // Run initially and on window resize
        updateGridColumns();
        window.addEventListener('resize', updateGridColumns);
    }
    
    // Enhance the icons
    document.querySelectorAll('.event-card .event-icon').forEach(icon => {
        icon.style.fontSize = '3rem'; // Larger icon
        icon.style.marginBottom = '20px';
        icon.style.textAlign = 'center';
    });
    
    // Disable the equalizeCardHeights function since we want fixed heights
    function equalizeCardHeights() {
        // Instead of dynamic heights, ensure all cards have the same fixed height
        const cards = document.querySelectorAll('.event-card');
        cards.forEach(card => {
            card.style.height = '360px';
        });
    }
    
    // Run equalization after images load and on resize
    window.addEventListener('load', equalizeCardHeights);
    window.addEventListener('resize', equalizeCardHeights);
    setTimeout(equalizeCardHeights, 500); // Also run after a delay to catch late-loading images
    
    // Create and add a default placeholder image to img directory if it doesn't exist yet
    function createPlaceholderImage() {
        // Check if the placeholder exists by trying to load it
        const testImg = new Image();
        testImg.onload = function() {
            console.log('Placeholder image exists');
        };
        testImg.onerror = function() {
            console.warn('Placeholder image missing, creating SVG placeholder');
            
            // Create a simple SVG placeholder and add it to the DOM for reference
            const svgPlaceholder = document.createElement('div');
            svgPlaceholder.style.display = 'none';
            svgPlaceholder.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180">
                    <rect width="300" height="180" fill="#0a0a1b"/>
                    <text x="150" y="90" fill="#00f3ff" font-family="Arial" font-size="16" text-anchor="middle">Event Image Placeholder</text>
                    <rect x="50" y="50" width="200" height="80" stroke="#00f3ff" stroke-width="1" fill="none"/>
                </svg>
            `;
            document.body.appendChild(svgPlaceholder);
            
            // Use this SVG for any error-handled images
            document.querySelectorAll('img.error-handled').forEach(img => {
                img.src = 'data:image/svg+xml;base64,' + btoa(svgPlaceholder.innerHTML);
            });
        };
        testImg.src = 'img/placeholder.jpg';
    }
    
    // Run the placeholder check
    createPlaceholderImage();
    
    // Dynamic header spacing adjustments
    const navbar = document.querySelector('.navbar');
    const eventsBanner = document.querySelector('.events-banner');
    const eventCategories = document.querySelector('.event-categories');
    const eventsList = document.querySelector('.events-list');
    
    // If we're on the events page with these elements
    if (navbar && eventsBanner && eventCategories) {
        // Get actual navbar height instead of hardcoding
        const navbarHeight = navbar.offsetHeight;
        
        // Apply correct top padding to banner to avoid navbar overlap
        eventsBanner.style.paddingTop = (navbarHeight + 50) + 'px';
        
        // Set the sticky top position of categories to actual navbar height
        eventCategories.style.top = navbarHeight + 'px';
        
        console.log(`Set navbar spacing: ${navbarHeight}px`);
        
        // Watch for window resize to adjust spacing
        window.addEventListener('resize', function() {
            const updatedNavbarHeight = navbar.offsetHeight;
            eventsBanner.style.paddingTop = (updatedNavbarHeight + 50) + 'px';
            eventCategories.style.top = updatedNavbarHeight + 'px';
        });
        
        // Special fix for mobile layouts
        function checkMobileLayout() {
            if (window.innerWidth <= 768) {
                // Tighten up spacing on mobile
                eventsBanner.style.paddingTop = (navbarHeight + 30) + 'px';
                eventsBanner.style.paddingBottom = '40px';
                
                if (eventsList) {
                    eventsList.style.paddingTop = '20px';
                }
            } else {
                eventsBanner.style.paddingTop = (navbarHeight + 50) + 'px';
                eventsBanner.style.paddingBottom = '70px';
                
                if (eventsList) {
                    eventsList.style.paddingTop = '40px';
                }
            }
        }
        
        // Run once on load and again on resize
        checkMobileLayout();
        window.addEventListener('resize', checkMobileLayout);
    }
    
    // Fix the event-meta and ensure consistent alignment
    document.querySelectorAll('.event-card .event-meta').forEach(meta => {
        meta.style.marginTop = 'auto'; // Push to bottom
    });
    
    // Fix paragraph heights for consistent text display
    document.querySelectorAll('.event-card p').forEach(p => {
        p.style.maxHeight = '4.8rem';
        p.style.overflow = 'hidden';
        p.style.display = '-webkit-box';
        p.style.webkitLineClamp = '3';
        p.style.webkitBoxOrient = 'vertical';
    });
    
    // Adapt cards to match index.html style if on events page
    const isEventsPage = document.body.classList.contains('events-page');
    if (isEventsPage) {
        document.querySelectorAll('.event-card').forEach(card => {
            // Standard styling from index.html
            card.style.borderRadius = '10px';
            card.style.backgroundColor = 'rgba(10, 10, 27, 0.8)';
            card.style.border = '1px solid var(--primary-color)';
            card.style.padding = '0';
            
            // Ensure proper icon sizing
            const icon = card.querySelector('.event-icon');
            if (icon) {
                icon.style.fontSize = '3rem';
                icon.style.textAlign = 'center';
                icon.style.marginBottom = '20px';
            }
        });
    }
    
    // Add a structure check to ensure all cards follow the proper pattern
    function checkCardsStructure() {
        console.log('Checking event card structure consistency...');
        const cards = document.querySelectorAll('.event-card');
        
        cards.forEach(card => {
            // Check if event-card-content exists
            if (!card.querySelector('.event-card-content')) {
                console.warn('Card missing event-card-content div', card);
                
                // Fix by wrapping contents in event-card-content
                const wrapper = document.createElement('div');
                wrapper.className = 'event-card-content';
                
                // Move all direct children into the wrapper
                while(card.firstChild) {
                    wrapper.appendChild(card.firstChild);
                }
                
                card.appendChild(wrapper);
            }
            
            // Check if event-meta exists and has the proper structure
            const eventMeta = card.querySelector('.event-meta');
            if (eventMeta) {
                // Move any span siblings after event-meta back inside event-meta
                let nextSibling = eventMeta.nextElementSibling;
                while (nextSibling && nextSibling.tagName === 'SPAN') {
                    const span = nextSibling;
                    nextSibling = span.nextElementSibling; // Store next sibling before moving
                    eventMeta.appendChild(span);
                }
                
                // If the event-meta is empty but has siblings that are spans, move them inside
                if (eventMeta.children.length === 0) {
                    const spanElements = card.querySelectorAll(':scope > span');
                    spanElements.forEach(span => {
                        eventMeta.appendChild(span);
                    });
                }
            }
        });
    }
    
    // Run the structure check after DOM is loaded
    checkCardsStructure();
    
    // Add improved structure check to fix incorrectly nested elements
    function fixCardStructure() {
        // Get all event cards
        const cards = document.querySelectorAll('.event-card');
        
        cards.forEach(card => {
            // First check if content wrapper exists
            let contentWrapper = card.querySelector('.event-card-content');
            
            // If wrapper exists but is empty (closing tag in wrong place)
            if (contentWrapper && !contentWrapper.children.length) {
                console.warn('Found empty content wrapper, fixing structure', card);
                
                // Remove the empty wrapper
                contentWrapper.remove();
                
                // Create a new wrapper
                contentWrapper = document.createElement('div');
                contentWrapper.className = 'event-card-content';
                
                // Move all direct children of card into the wrapper
                while (card.firstChild) {
                    contentWrapper.appendChild(card.firstChild);
                }
                
                // Append the wrapper back to the card
                card.appendChild(contentWrapper);
            }
            
            // If no wrapper exists at all
            if (!contentWrapper) {
                console.warn('Card missing content wrapper, adding one', card);
                
                contentWrapper = document.createElement('div');
                contentWrapper.className = 'event-card-content';
                
                // Move all direct children of card into the wrapper
                while (card.firstChild) {
                    contentWrapper.appendChild(card.firstChild);
                }
                
                // Append the wrapper back to the card
                card.appendChild(contentWrapper);
            }
            
            // Ensure proper styling for consistency
            card.style.width = '100%';
            card.style.height = '360px';
            card.style.boxSizing = 'border-box';
            
            // Ensure content wrapper has proper padding
            contentWrapper.style.padding = '25px 15px';
        });
    }
    
    // Run structure fix immediately
    fixCardStructure();

    // Update grid columns immediately after fixing structure
    if (eventsGrid) {
        updateGridColumns();
    }

    // Update event count in the counter
    const eventCounter = document.querySelector('.event-counter .count');
    if (eventCounter && eventCounter.textContent === '12+') {
        // Update to reflect the actual number of events
        const actualCount = document.querySelectorAll('.event-card').length;
        eventCounter.textContent = actualCount + '+';
    }
});
