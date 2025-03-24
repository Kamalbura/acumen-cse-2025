/**
 * Mobile Content Padding Adjuster
 * Ensures content isn't hidden under navbar
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        function adjustContentPadding() {
            // We're removing the padding adjustments to ensure perfect centering
            
            // Special case for events page banner - only add minimal padding if needed
            const eventsBanner = document.querySelector('.events-banner');
            if (eventsBanner && !eventsBanner.classList.contains('hero')) {
                // Add minimal padding only if this is not the main hero
                console.log("Adjusting events banner padding minimally");
                eventsBanner.style.paddingTop = '10px';
            }
            
            // No padding for main homepage hero
            const mainHero = document.querySelector('.hero');
            if (mainHero) {
                mainHero.style.paddingTop = '0';
            }
            
            // Special case for other banners - only add minimal padding
            const otherBanners = document.querySelectorAll('.page-banner, .event-hero');
            otherBanners.forEach(section => {
                if (!section.classList.contains('hero')) {
                    section.style.paddingTop = '10px';
                }
            });
        }
        
        // Run on load with a slight delay to ensure correct measurements
        setTimeout(adjustContentPadding, 100);
        
        // Run on resize
        window.addEventListener('resize', function() {
            setTimeout(adjustContentPadding, 100);
        });
    });
})();
