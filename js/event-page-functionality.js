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
    
    // 4. Update all event dates to April 10
    updateEventDates();
    
    // 5. Add matching backgrounds
    addMatchingBackgrounds();
    
    /**
     * Initialize accordion functionality for FAQ sections
     */
    function initFaqAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                this.classList.toggle('active');
                
                const answer = this.nextElementSibling;
                if (this.classList.contains('active')) {
                    answer.style.display = 'block';
                } else {
                    answer.style.display = 'none';
                }
            });
        });
    }
    
    /**
     * Add hover effects to interactive elements
     */
    function addHoverEffects() {
        const btns = document.querySelectorAll('.btn, .event-details-link');
        
        btns.forEach(btn => {
            btn.addEventListener('mouseover', function() {
                this.classList.add('hover');
            });
            
            btn.addEventListener('mouseout', function() {
                this.classList.remove('hover');
            });
        });
    }
    
    /**
     * Fix event page styling issues
     */
    function fixEventPageStyles() {
        // Fix image paths if needed
        const images = document.querySelectorAll('img[src*="posters/"]');
        
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src.indexOf('../') === -1 && window.location.pathname.includes('/events/')) {
                img.setAttribute('src', '../' + src);
            }
        });
    }
    
    /**
     * Update all event dates to April 10 for the one-day event
     */
    function updateEventDates() {
        const dateElements = document.querySelectorAll('.event-meta-item h3:first-child + p');
        
        dateElements.forEach(dateEl => {
            if (dateEl.textContent.includes('April') || dateEl.textContent.includes('Apr')) {
                dateEl.textContent = 'April 10, 2025';
            }
        });
        
        // Also update any calendar icons with dates
        const calendarSpans = document.querySelectorAll('.event-meta span:has(i.fa-calendar-alt)');
        
        calendarSpans.forEach(span => {
            span.innerHTML = '<i class="fas fa-calendar-alt"></i> Apr 10';
        });
    }
    
    /**
     * Add matching backgrounds to event sections
     */
    function addMatchingBackgrounds() {
        const eventSections = document.querySelectorAll('.event-section');
        
        eventSections.forEach((section, index) => {
            if (index % 2 === 0) {
                section.classList.add('alt-bg');
            }
        });
    }
});
