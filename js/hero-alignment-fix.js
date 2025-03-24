/**
 * Hero Alignment Fixer
 * Ensures hero content stays properly centered when navbar visibility changes
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const hero = document.querySelector('.hero');
        const navbar = document.querySelector('.navbar');
        
        if (!hero || !navbar) return;
        
        console.log('Initializing hero alignment fix');
        
        // Add CSS fixes for hero alignment
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            /* Hero section perfect centering fix */
            .hero {
                min-height: 100vh;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                padding: 0 !important; /* Remove any padding */
                margin: 0 !important; /* Remove any margin */
            }
            
            /* Force hero to take full viewport height */
            @media (min-width: 992px) {
                .hero {
                    height: 100vh !important; /* Force full height */
                }
            }
            
            /* Center hero content */
            .hero .container {
                width: 100%;
                padding: 0 20px;
                margin: 0 auto;
                position: relative;
                z-index: 5;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* Perfect vertical and horizontal alignment of hero content */
            .hero-content {
                margin-top: 0 !important;
                padding-top: 0 !important;
                text-align: center !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                height: auto !important;
            }
            
            /* Center the hero buttons */
            .hero-buttons {
                display: flex;
                justify-content: center !important;
                gap: 15px;
                margin-top: 30px;
            }
            
            /* Center the countdown section */
            .hero-countdown {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center !important;
                text-align: center;
                height: auto !important;
            }
            
            /* Maintain grid arrangement for desktop with center alignment */
            @media (min-width: 992px) {
                .hero-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    align-items: center;
                    justify-content: center;
                    min-height: auto !important; /* Remove min-height constraint */
                    height: auto !important;
                }
                
                /* On desktop, left-align text on the left side but keep vertical centering */
                .hero-content {
                    text-align: left !important;
                    align-items: flex-start !important;
                    justify-content: center !important;
                }
                
                /* Left-align buttons on desktop */
                .hero-buttons {
                    justify-content: flex-start !important;
                }
            }
            
            /* Mobile adjustments */
            @media (max-width: 991px) {
                .hero {
                    height: 100vh;
                    min-height: 100vh;
                    padding: 0 !important; /* Remove all padding */
                }
                
                .hero-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh !important;
                    padding: 20px 0;
                }
                
                .hero-content, .hero-countdown {
                    width: 100%;
                    margin-bottom: 30px;
                }
                
                /* Ensure no extra space at the bottom of last element */
                .hero-countdown {
                    margin-bottom: 0;
                }
            }
        `;
        document.head.appendChild(styleEl);
        
        // Monitor navbar visibility changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    // When navbar changes visibility, ensure hero stays centered
                    if (navbar.classList.contains('hidden') || navbar.classList.contains('fading')) {
                        hero.style.paddingTop = '0';
                    }
                }
            });
        });
        
        observer.observe(navbar, { attributes: true });
        
        // Additional fix: ensure proper height calculation when viewport changes
        function updateHeroHeight() {
            // Set the hero height to viewport height
            const vh = window.innerHeight;
            hero.style.height = `${vh}px`;
            
            // Ensure the hero container is centered vertically
            const heroContainer = document.querySelector('.hero-container');
            if (heroContainer) {
                heroContainer.style.minHeight = 'auto';
                
                // Fix vertical alignment for hero content specifically
                const heroContent = document.querySelector('.hero-content');
                const heroCountdown = document.querySelector('.hero-countdown');
                
                if (heroContent) {
                    heroContent.style.height = 'auto';
                    heroContent.style.display = 'flex';
                    heroContent.style.flexDirection = 'column';
                    heroContent.style.justifyContent = 'center';
                }
                
                if (heroCountdown) {
                    heroCountdown.style.height = 'auto';
                    heroCountdown.style.display = 'flex';
                    heroCountdown.style.flexDirection = 'column';
                    heroCountdown.style.justifyContent = 'center';
                }
            }
        }
        
        // Run on load and viewport changes with a slight delay to ensure DOM is ready
        setTimeout(updateHeroHeight, 150);
        window.addEventListener('resize', updateHeroHeight);
        window.addEventListener('orientationchange', function() {
            setTimeout(updateHeroHeight, 100);
        });
        
        // Fix any scroll issues that might affect centering
        window.scrollTo(0, 0);
    });
})();
