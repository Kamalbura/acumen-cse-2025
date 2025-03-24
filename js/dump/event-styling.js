/**
 * Event Styling Enhancement Script
 * This script adds dynamic styling to event pages and cards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category colors as CSS variables
    const categoryColors = {
        'technical': '#00ffcc',
        'non-technical': '#ff9900',
        'gaming': '#ff3366',
        'hackathon': '#9966ff',
        'coding': '#33ccff'
    };
    
    // Helper function to convert hex to RGB
    const hexToRgb = hex => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };
    
    // Apply colors to CSS variables
    Object.entries(categoryColors).forEach(([category, color]) => {
        document.documentElement.style.setProperty(`--${category}-color`, color);
        document.documentElement.style.setProperty(`--${category}-color-rgb`, hexToRgb(color));
    });
    
    // Apply category class to event page body if we're on an event detail page
    if (document.querySelector('.event-details')) {
        // Try to determine event category
        const eventCategory = document.querySelector('meta[name="event-category"]')?.getAttribute('content') || 'technical';
        document.body.classList.add('event-page');
        document.body.setAttribute('data-category', eventCategory);
        
        // Also set the hero section category
        const heroSection = document.querySelector('.event-hero');
        if (heroSection) {
            heroSection.setAttribute('data-category', eventCategory);
        }
    }
    
    // Make sure all event cards have proper data-category attributes
    const setupEventCards = () => {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            // Handle cards with the old flip structure
            if (card.querySelector('.event-card-inner')) {
                // Extract content from the old structure
                const front = card.querySelector('.event-card-front');
                const back = card.querySelector('.event-card-back');
                
                // Get essential elements
                const imgSrc = front.querySelector('img')?.getAttribute('src') || '';
                const title = front.querySelector('h3')?.textContent || back.querySelector('h3')?.textContent || 'Event';
                const desc = front.querySelector('p')?.textContent || back.querySelector('p')?.textContent || '';
                const category = card.getAttribute('data-category') || 'technical';
                
                // Get link from back button if exists
                const link = back.querySelector('a')?.getAttribute('href') || '#';
                
                // Create the new simplified card structure
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
            
            // Extract category from badge text or maintain existing category
            const badgeText = card.querySelector('.event-badge')?.textContent.trim().toLowerCase();
            if (badgeText && ['technical', 'non-technical', 'gaming', 'hackathon', 'coding'].includes(badgeText)) {
                card.setAttribute('data-category', badgeText);
            } else if (!card.getAttribute('data-category')) {
                card.setAttribute('data-category', 'technical'); // Default
            }
            
            // Remove any remaining badges
            const badge = card.querySelector('.event-badge');
            if (badge) {
                badge.remove();
            }
        });
    };
    
    // Fix for FAQ accordion functionality
    const initFaqAccordion = () => {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            // Initially hide all answers
            const answer = question.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                answer.style.display = 'none';
            }
            
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
    };
    
    // Initialize all functionality
    setupEventCards();
    initFaqAccordion();
});
