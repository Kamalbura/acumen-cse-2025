/**
 * Safety Net Script
 * Detects and fixes common mobile viewport rendering issues
 */
(function() {
    // Run immediately and also after DOM content is loaded
    fixViewport();
    document.addEventListener('DOMContentLoaded', fixViewport);
    
    function fixViewport() {
        // Fix missing or broken viewport meta tag
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        // Set correct viewport content
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
        
        // Check if we're on the events page
        const isEventsPage = window.location.pathname.includes('events.html') || 
                           document.querySelector('.events-page') !== null;
        
        if (isEventsPage) {
            document.documentElement.classList.add('events-page-html');
            document.body.classList.add('events-page');
            
            // Add critical mobile styles for events page
            const criticalStyle = document.createElement('style');
            criticalStyle.textContent = `
                /* Emergency fixes for events page */
                @media (max-width: 768px) {
                    .events-grid {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                    
                    .event-card {
                        width: 100% !important;
                        max-width: 400px !important;
                        margin: 0 auto 15px !important;
                    }
                    
                    .category-filters {
                        display: flex !important;
                        overflow-x: auto !important;
                        white-space: nowrap !important;
                    }
                    
                    .events-banner {
                        padding-top: 80px !important;
                    }
                    
                    /* Fix potential background issues */
                    body::before {
                        content: '';
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: #101025;
                        z-index: -11;
                    }
                }
            `;
            
            if (!document.head.querySelector('style[data-safety-net]')) {
                criticalStyle.dataset.safetyNet = 'true';
                document.head.appendChild(criticalStyle);
            }
        }
    }
    
    // Apply safety checks when page finishes loading
    window.addEventListener('load', function() {
        // Check for broken layouts and fix them
        setTimeout(fixBrokenLayouts, 500);
    });
    
    function fixBrokenLayouts() {
        // Fix if event cards are not visible or incorrectly positioned
        const eventCards = document.querySelectorAll('.event-card');
        if (eventCards.length > 0 && window.innerWidth <= 768) {
            let hasLayoutIssue = false;
            
            // Check if any card is outside the viewport or has zero height
            eventCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0 || rect.right <= 0 || rect.left >= window.innerWidth) {
                    hasLayoutIssue = true;
                }
            });
            
            if (hasLayoutIssue) {
                console.warn('💡 Safety Net: Fixing broken event card layout');
                document.querySelector('.events-grid').style.cssText = 'display: flex !important; flex-direction: column !important; align-items: center !important;';
                
                eventCards.forEach(card => {
                    card.style.cssText = 'width: 100% !important; max-width: 400px !important; margin: 0 auto 15px !important; opacity: 1 !important; visibility: visible !important;';
                });
            }
        }
        
        // Fix if category filters are not scrollable
        const categoryFilters = document.querySelector('.category-filters');
        if (categoryFilters && window.innerWidth <= 768) {
            const totalButtonWidth = Array.from(categoryFilters.querySelectorAll('.category-btn'))
                .reduce((sum, btn) => sum + btn.offsetWidth, 0);
            
            if (totalButtonWidth > window.innerWidth && categoryFilters.scrollWidth <= categoryFilters.clientWidth) {
                console.warn('💡 Safety Net: Fixing broken category filters');
                categoryFilters.style.cssText = 'display: flex !important; overflow-x: auto !important; white-space: nowrap !important; padding-bottom: 15px !important;';
            }
        }
    }
})();
