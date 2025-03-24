document.addEventListener('DOMContentLoaded', function() {
    const eventsScroll = document.querySelector('.events-scroll');
    const scrollLeftBtn = document.querySelector('.scroll-arrow.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-arrow.scroll-right');
    
    // Fixed scrolling distance for each button click based on card size + margin
    const scrollDistance = 320; // Average width of a card + margins
    
    if (scrollLeftBtn && eventsScroll) {
        scrollLeftBtn.addEventListener('click', function() {
            eventsScroll.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        });
    }
    
    if (scrollRightBtn && eventsScroll) {
        scrollRightBtn.addEventListener('click', function() {
            eventsScroll.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        });
    }
    
    // Handle scroll buttons visibility
    function updateScrollButtonsVisibility() {
        if (!eventsScroll) return;
        
        const isAtStart = eventsScroll.scrollLeft <= 10;
        const isAtEnd = eventsScroll.scrollLeft >= eventsScroll.scrollWidth - eventsScroll.clientWidth - 10;
        
        if (scrollLeftBtn) {
            scrollLeftBtn.style.opacity = isAtStart ? '0.5' : '1';
            scrollLeftBtn.style.pointerEvents = isAtStart ? 'none' : 'all';
        }
        
        if (scrollRightBtn) {
            scrollRightBtn.style.opacity = isAtEnd ? '0.5' : '1';
            scrollRightBtn.style.pointerEvents = isAtEnd ? 'none' : 'all';
        }
    }
    
    // Update buttons on scroll
    if (eventsScroll) {
        eventsScroll.addEventListener('scroll', updateScrollButtonsVisibility);
        
        // Initial button state
        setTimeout(updateScrollButtonsVisibility, 100);
    }
    
    // Update on window resize
    window.addEventListener('resize', updateScrollButtonsVisibility);
    
    // Count the number of events and update any counters
    const eventCards = document.querySelectorAll('.events-scroll .event-card');
    const eventCounters = document.querySelectorAll('.event-counter .count');
    
    if (eventCounters.length > 0 && eventCards.length > 0) {
        eventCounters.forEach(counter => {
            // Update to match actual count
            if (counter.textContent.includes('+')) {
                counter.textContent = eventCards.length + '+';
            }
        });
    }
});
