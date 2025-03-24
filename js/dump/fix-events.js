/**
 * Event Page Enhancement Script
 * Fixes and enhances the event page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix event card styling
    fixEventCards();
    
    // Ensure category filters work properly
    setupCategoryFilters();
    
    // Add image error handling
    addImageErrorHandling();

    /**
     * Fix styling issues with event cards
     */
    function fixEventCards() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            // Ensure proper structure
            if (card.querySelector('.event-card-inner')) {
                // This is an old flip card structure that needs to be fixed
                restructureFlipCard(card);
            }
            
            // Set proper height
            card.style.height = 'auto';
            card.style.minHeight = '380px';
            
            // Ensure buttons are at the bottom
            const detailsLink = card.querySelector('.event-details-link');
            if (detailsLink && detailsLink.parentElement) {
                // Move the link to the end of its parent container
                const parent = detailsLink.parentElement;
                parent.appendChild(detailsLink);
            }
            
            // Make sure layout is flexbox
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            
            // Make sure content area is also flexbox
            const content = card.querySelector('.event-card-content');
            if (content) {
                content.style.display = 'flex';
                content.style.flexDirection = 'column';
                content.style.flex = '1';
            }
        });
    }
    
    /**
     * Restructure an old flip card to the new design
     */
    function restructureFlipCard(card) {
        const inner = card.querySelector('.event-card-inner');
        const front = card.querySelector('.event-card-front');
        const back = card.querySelector('.event-card-back');
        
        if (!front || !back) return;
        
        // Extract information
        const imgSrc = front.querySelector('img')?.getAttribute('src') || '';
        const title = front.querySelector('h3')?.textContent || back.querySelector('h3')?.textContent || 'Event';
        const desc = front.querySelector('p')?.textContent || back.querySelector('p')?.textContent || '';
        
        // Extract category
        const category = card.getAttribute('data-category') || 'technical';
        
        // Extract link
        let link = '#';
        const btnLink = back.querySelector('a.btn') || back.querySelector('a');
        if (btnLink) {
            link = btnLink.getAttribute('href');
        }
        
        // Create new structure
        card.innerHTML = `
            <img src="${imgSrc}" alt="${title}" loading="lazy">
            <div class="event-card-content">
                <h3>${title}</h3>
                <p>${desc}</p>
                <div class="event-meta">
                    <span><i class="fas fa-calendar-alt"></i> April 2025</span>
                    <span><i class="fas fa-map-marker-alt"></i> VCE</span>
                </div>
                <a href="${link}" class="event-details-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
    }
    
    /**
     * Set up category filtering
     */
    function setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.category-btn');
        const eventCards = document.querySelectorAll('.event-card');
        
        // Set initial state
        let activeFilter = 'all';
        filterButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeFilter = btn.getAttribute('data-filter');
            }
        });
        
        // Apply initial filtering
        applyFilter(activeFilter);
        
        // Add click event listeners
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value and apply it
                const filterValue = this.getAttribute('data-filter');
                applyFilter(filterValue);
            });
        });
        
        // Filter function
        function applyFilter(filterValue) {
            eventCards.forEach(card => {
                // Get category (default to technical if not set)
                const category = card.getAttribute('data-category') || 'technical';
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
    
    /**
     * Add error handling for images
     */
    function addImageErrorHandling() {
        const images = document.querySelectorAll('.event-card img');
        
        images.forEach(img => {
            img.onerror = function() {
                this.src = 'img/placeholder.jpg';
                this.alt = 'Event placeholder';
            };
        });
    }
});
