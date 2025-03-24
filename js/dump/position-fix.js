/**
 * Position Fix
 * Handles dynamic corrections for positioning issues
 */

(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🧩 Running position fixes');
        
        // Fix hero section height
        adjustHeroHeight();
        
        // Fix event card heights
        equalizeCardHeights();
        
        // Correct any z-index issues
        fixZIndexes();
        
        // Fix navbar position on mobile
        fixMobileNavPosition();
        
        // Fix any stuck absolute elements
        fixAbsoluteElements();
        
        // Set up window resize handling
        window.addEventListener('resize', debounce(function() {
            adjustHeroHeight();
            equalizeCardHeights();
            fixMobileNavPosition();
        }, 250));
    });
    
    /**
     * Fix hero section height to account for navbar
     */
    function adjustHeroHeight() {
        const navbar = document.querySelector('.navbar');
        const heroSection = document.querySelector('.hero-section');
        
        if (navbar && heroSection) {
            const navbarHeight = navbar.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Adjust hero height to account for navbar
            if (window.innerWidth > 768) {
                heroSection.style.height = `${windowHeight}px`;
                heroSection.style.minHeight = `${windowHeight}px`;
            } else {
                heroSection.style.height = 'auto';
                heroSection.style.minHeight = `${windowHeight - navbarHeight/2}px`;
            }
        }
    }
    
    /**
     * Equalize card heights in each row
     */
    function equalizeCardHeights() {
        const cardContainers = ['.events-grid', '.featured-events-grid', '.categories-grid'];
        
        cardContainers.forEach(containerSelector => {
            const container = document.querySelector(containerSelector);
            if (container) {
                // Reset heights
                const cards = container.querySelectorAll('.event-card, .category-card');
                cards.forEach(card => card.style.height = '');
                
                // Skip if on mobile
                if (window.innerWidth < 768) return;
                
                // Get positions
                const cardPositions = Array.from(cards).map(card => {
                    return {
                        element: card,
                        top: card.getBoundingClientRect().top
                    };
                });
                
                // Group cards by row (same top position)
                const rows = {};
                cardPositions.forEach(card => {
                    if (!rows[card.top]) rows[card.top] = [];
                    rows[card.top].push(card.element);
                });
                
                // Set equal heights per row
                Object.values(rows).forEach(rowCards => {
                    const maxHeight = Math.max(...rowCards.map(card => card.offsetHeight));
                    rowCards.forEach(card => card.style.height = `${maxHeight}px`);
                });
            }
        });
    }
    
    /**
     * Fix z-index issues with overlapping elements
     */
    function fixZIndexes() {
        // Ensure navbar is above all
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.zIndex = '1000';
        
        // Ensure content is above background effects
        const contentElements = document.querySelectorAll('.hero-content, .container, section');
        contentElements.forEach(el => {
            if (parseInt(window.getComputedStyle(el).zIndex) < 5) {
                el.style.zIndex = '5';
                el.style.position = 'relative';
            }
        });
        
        // Ensure background effects are in background
        const bgEffects = document.querySelectorAll('.glitch-overlay, .matrix-bg, .digital-noise, .circuit-bg');
        bgEffects.forEach(el => {
            el.style.zIndex = '1';
            el.style.pointerEvents = 'none';
        });
    }
    
    /**
     * Fix mobile navigation positioning
     */
    function fixMobileNavPosition() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            if (window.innerWidth < 768) {
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    navLinks.style.paddingTop = `${navbar.offsetHeight + 20}px`;
                    
                    // Ensure nav toggle is properly positioned
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navToggle) {
                        navToggle.style.position = 'relative';
                        navToggle.style.zIndex = '1001';
                    }
                }
            } else {
                navLinks.style.paddingTop = '';
            }
        }
    }
    
    /**
     * Fix absolutely positioned elements that may get stuck
     */
    function fixAbsoluteElements() {
        // Fix hero visual position
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual && window.innerWidth > 992) {
            setTimeout(() => {
                heroVisual.style.top = '50%';
                heroVisual.style.transform = 'translateY(-50%)';
            }, 100);
        }
        
        // Fix countdown alignment
        const countdownItems = document.querySelectorAll('.countdown-item');
        countdownItems.forEach(item => {
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.justifyContent = 'center';
            item.style.alignItems = 'center';
        });
    }
    
    /**
     * Debounce function to prevent excessive execution
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
})();
