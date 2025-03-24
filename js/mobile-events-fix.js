/**
 * Event Page Mobile Layout Fixer
 * Specifically addresses mobile view issues on the events page
 */
(function() {
    // Only run on mobile devices or narrow screens
    const isMobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                   
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Exit if not mobile or not on events page
        if (!isMobile || !document.querySelector('.events-page')) return;
        
        console.log("📱 Initializing mobile events page fixes");
        fixEventsBanner();
        fixCategoryFilters();
        fixEventGrid();
        enhanceTouchInteractions();
        fixBackgroundDisplay();
        
        // Handle orientation changes
        window.addEventListener('orientationchange', function() {
            // Allow time for orientation change to complete
            setTimeout(function() {
                fixEventGrid();
                fixCategoryFilters();
            }, 300);
        });
        
        // Listen for window resize events
        window.addEventListener('resize', debounce(function() {
            fixEventGrid();
            fixCategoryFilters();
        }, 250));
    });
    
    // Fix events banner spacing and layout
    function fixEventsBanner() {
        const eventsBanner = document.querySelector('.events-banner');
        if (!eventsBanner) return;
        
        console.log("📱 Fixing events banner for mobile");
        
        // Get navbar height for proper spacing
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 60;
        
        // Add proper top padding to account for fixed navbar
        eventsBanner.style.paddingTop = `${navHeight + 20}px`;
        
        // Ensure text is centered and properly sized
        const bannerTitle = eventsBanner.querySelector('h1');
        if (bannerTitle) {
            bannerTitle.style.fontSize = '2rem';
            bannerTitle.style.textAlign = 'center';
        }
        
        // Fix event counter layout for mobile
        const eventCounter = eventsBanner.querySelector('.event-counter');
        if (eventCounter) {
            eventCounter.style.display = 'flex';
            eventCounter.style.flexWrap = 'wrap';
            eventCounter.style.justifyContent = 'center';
            eventCounter.style.gap = '10px';
            
            // Set proper sizes for counter items
            const counterItems = eventCounter.querySelectorAll('.counter-item');
            counterItems.forEach(item => {
                item.style.flex = '0 0 calc(50% - 10px)';
                item.style.margin = '5px 0';
            });
        }
    }
    
    // Fix category filters for mobile
    function fixCategoryFilters() {
        const categoryFilters = document.querySelector('.category-filters');
        if (!categoryFilters) return;
        
        console.log("📱 Making category filters scrollable on mobile");
        
        // Add horizontal scrolling capabilities
        categoryFilters.style.display = 'flex';
        categoryFilters.style.overflowX = 'auto';
        categoryFilters.style.whiteSpace = 'nowrap';
        categoryFilters.style.scrollbarWidth = 'none'; // Firefox
        categoryFilters.style.msOverflowStyle = 'none'; // IE/Edge
        categoryFilters.style.webkitOverflowScrolling = 'touch'; // Smooth scrolling on iOS
        categoryFilters.style.padding = '15px 15px';
        
        // Hide scrollbar across all browsers
        const style = document.createElement('style');
        style.textContent = `.category-filters::-webkit-scrollbar { display: none; }`;
        if (!document.head.querySelector('style[data-mobile-events]')) {
            style.dataset.mobileEvents = 'true';
            document.head.appendChild(style);
        }
        
        // Ensure each button is properly sized
        const buttons = categoryFilters.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            btn.style.flex = '0 0 auto';
            btn.style.marginRight = '10px';
            btn.style.height = 'auto';
        });
    }
    
    // Fix event grid layout on mobile
    function fixEventGrid() {
        const eventsGrid = document.querySelector('.events-grid');
        if (!eventsGrid) return;
        
        console.log("📱 Fixing event cards layout for mobile");
        
        // Make the events grid a vertical column on mobile
        if (window.innerWidth <= 768) {
            eventsGrid.style.display = 'flex';
            eventsGrid.style.flexDirection = 'column';
            eventsGrid.style.alignItems = 'center';
            eventsGrid.style.gap = '20px';
            
            // Fix each event card's size and layout
            const eventCards = eventsGrid.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                card.style.width = '100%';
                card.style.maxWidth = '400px';
                card.style.margin = '0 auto';
                card.style.minHeight = 'unset';
                
                // Fix the content layout within each card
                const content = card.querySelector('.event-card-content');
                if (content) {
                    content.style.display = 'flex';
                    content.style.flexDirection = 'column';
                    content.style.height = '100%';
                    
                    // Fix description text
                    const description = content.querySelector('p');
                    if (description) {
                        description.style.flexGrow = '1';
                    }
                    
                    // Fix view details link
                    const link = content.querySelector('.event-details-link');
                    if (link) {
                        link.style.marginTop = 'auto';
                    }
                }
            });
        } else if (window.innerHeight <= 500 && window.innerWidth > window.innerHeight) {
            // Grid layout for landscape mode
            eventsGrid.style.display = 'grid';
            eventsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            eventsGrid.style.gap = '15px';
            
            const eventCards = eventsGrid.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                card.style.maxWidth = '100%';
                card.style.margin = '0';
            });
        }
    }
    
    // Enhance touch interactions for better mobile experience
    function enhanceTouchInteractions() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            card.classList.add('touch-device');
            
            // Add touch active state
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            }, {passive: true});
            
            // Fix tap delay
            card.style.touchAction = 'manipulation';
        });
        
        // Add tap active state to category buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.style.touchAction = 'manipulation';
            
            btn.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            }, {passive: true});
            
            btn.addEventListener('touchend', function() {
                this.style.opacity = '1';
            }, {passive: true});
        });
    }
    
    // Fix background issues on mobile
    function fixBackgroundDisplay() {
        // Add specific mobile background styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                /* Force proper background rendering */
                body.events-page::before {
                    content: '';
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    background-image: url('../img/background2.jpg') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-attachment: fixed !important;
                    z-index: -10 !important;
                }
                
                /* Improve contrast for readability */
                .events-page .event-card {
                    background-color: rgba(10, 10, 27, 0.8) !important;
                }
                
                /* Ensure registration banner is visible */
                .registration-banner {
                    position: relative;
                    z-index: 1;
                }
            }
        `;
        
        if (!document.head.querySelector('style[data-mobile-bg-fix]')) {
            style.dataset.mobileBgFix = 'true';
            document.head.appendChild(style);
        }
    }
    
    // Utility function: debounce
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
})();
