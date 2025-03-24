/**
 * Event Page Functionality
 * Consolidated script for event page specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize FAQ Accordion
    initFaqAccordion();
    
    // 2. Add hover effects to elements
    addHoverEffects();
    
    // 3. Fix event page styling issues
    fixEventPageStyles();
    
    // 4. Fix any path issues for images and CSS
    fixResourcePaths();
    
    // 5. Add matching backgrounds
    addMatchingBackgrounds();
    
    /**
     * Initialize accordion functionality for FAQ sections
     */
    function initFaqAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        // Initially hide all answers
        document.querySelectorAll('.faq-answer').forEach(answer => {
            answer.style.display = 'none';
        });
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                this.classList.toggle('active');
                
                const answer = this.nextElementSibling;
                if (answer && answer.classList.contains('faq-answer')) {
                    if (this.classList.contains('active')) {
                        answer.style.display = 'block';
                    } else {
                        answer.style.display = 'none';
                    }
                }
            });
        });
    }
    
    /**
     * Add hover effects to interactive elements
     */
    function addHoverEffects() {
        // Add hover effect to guideline items
        const guidelineItems = document.querySelectorAll('.guideline-item');
        if (guidelineItems.length > 0) {
            guidelineItems.forEach(item => {
                item.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
        }
        
        // Add hover effect to event meta items
        const metaItems = document.querySelectorAll('.event-meta-item');
        if (metaItems.length > 0) {
            metaItems.forEach(item => {
                item.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        }
    }
    
    /**
     * Fix event page styling issues
     */
    function fixEventPageStyles() {
        // Apply category specific styling to event pages
        if (document.querySelector('.event-details')) {
            // Determine event category from meta tag or fallback to default
            const eventCategory = document.querySelector('meta[name="event-category"]')?.getAttribute('content') || 'technical';
            
            // Apply category class to body and hero section
            document.body.classList.add('event-page');
            document.body.setAttribute('data-category', eventCategory);
            
            const heroSection = document.querySelector('.event-hero');
            if (heroSection) {
                heroSection.setAttribute('data-category', eventCategory);
            }
        }
    }
    
    /**
     * Fix resource paths for images and CSS
     */
    function fixResourcePaths() {
        // Only run on event detail pages
        if (window.location.pathname.includes('/events/')) {
            // Fix stylesheet paths
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('css/') && !href.startsWith('../')) {
                    link.setAttribute('href', '../' + href);
                }
            });
            
            // Fix image paths
            document.querySelectorAll('img').forEach(img => {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
                    img.setAttribute('src', '../' + src);
                }
            });
        }
    }
    
    /**
     * Add only background elements that match the homepage
     */
    function addMatchingBackgrounds() {
        // Create necessary background elements for events page hero
        const eventsHero = document.querySelector('.events-hero');
        if (eventsHero) {
            // Add hero grid if not already present (only element needed besides overlay)
            if (!eventsHero.querySelector('.hero-grid')) {
                const heroGrid = document.createElement('div');
                heroGrid.className = 'hero-grid';
                eventsHero.appendChild(heroGrid);
            }
            
            // Add hero overlay if not already present
            if (!eventsHero.querySelector('.hero-overlay')) {
                const heroOverlay = document.createElement('div');
                heroOverlay.className = 'hero-overlay';
                eventsHero.appendChild(heroOverlay);
            }
            
            // Remove any other background elements that don't match homepage
            const nonMatchingElements = eventsHero.querySelectorAll('.hero-glow, .circuit-lines, .scanner-effect, .binary-code, .data-stream');
            nonMatchingElements.forEach(element => {
                element.remove();
            });
        }
        
        // Similar cleanup for individual event pages
        const eventHero = document.querySelector('.event-hero');
        if (eventHero) {
            // Add hero grid if not already present
            if (!eventHero.querySelector('.hero-grid')) {
                const heroGrid = document.createElement('div');
                heroGrid.className = 'hero-grid';
                eventHero.appendChild(heroGrid);
            }
            
            // Add hero overlay if not already present
            if (!eventHero.querySelector('.hero-overlay')) {
                const heroOverlay = document.createElement('div');
                heroOverlay.className = 'hero-overlay';
                eventHero.appendChild(heroOverlay);
            }
            
            // Remove any other background elements that don't match homepage
            const nonMatchingElements = eventHero.querySelectorAll('.hero-glow, .circuit-lines, .binary-code');
            nonMatchingElements.forEach(element => {
                element.remove();
            });
        }
        
        // Apply to all other hero sections across the site
        const otherHeroSections = document.querySelectorAll('.page-hero, .banner-hero, .section-hero');
        otherHeroSections.forEach(section => {
            // Add hero grid if not already present
            if (!section.querySelector('.hero-grid')) {
                const heroGrid = document.createElement('div');
                heroGrid.className = 'hero-grid';
                section.appendChild(heroGrid);
            }
            
            // Add hero overlay if not already present
            if (!section.querySelector('.hero-overlay')) {
                const heroOverlay = document.createElement('div');
                heroOverlay.className = 'hero-overlay';
                section.appendChild(heroOverlay);
            }
            
            // Remove non-matching elements
            const nonMatchingElements = section.querySelectorAll('.hero-glow, .circuit-lines, .binary-code');
            nonMatchingElements.forEach(element => {
                element.remove();
            });
        });
    }
});
