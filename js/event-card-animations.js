/**
 * Event Card Animations
 * Ensures consistent animations for event cards across pages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Apply consistent animations to event cards
    const eventCards = document.querySelectorAll('.event-card');
    
    if (eventCards.length > 0) {
        console.log('Applying consistent animations to event cards');
        
        // Remove any existing animations that might conflict
        eventCards.forEach(card => {
            if (card.style.animation) {
                card.style.animation = '';
            }
        });
        
        // Don't apply entrance animations if they already have CSS animations
        if (!document.querySelector('.using-modular-css')) {
            // Apply staggered entrance animation
            eventCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 + (index * 100)); // Staggered delay
            });
        }
        
        // Mobile detection for better performance
        const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                        window.matchMedia("(hover: none)").matches;
        
        if (!isMobile) {
            // Apply hover effects consistently on desktop only
            eventCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px)';
                    this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--primary-color), 0 0 20px rgba(0, 255, 255, 0.5)';
                    
                    // Find and enhance image if it exists
                    const cardImage = this.querySelector('img');
                    if (cardImage) {
                        cardImage.style.filter = 'brightness(1) contrast(1.2)';
                    }
                    
                    // Find and enhance heading if it exists
                    const cardHeading = this.querySelector('h3');
                    if (cardHeading) {
                        cardHeading.style.color = 'var(--primary-color)';
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                    
                    // Reset image filter
                    const cardImage = this.querySelector('img');
                    if (cardImage) {
                        cardImage.style.filter = '';
                    }
                    
                    // Reset heading color
                    const cardHeading = this.querySelector('h3');
                    if (cardHeading) {
                        cardHeading.style.color = '';
                    }
                });
            });
        }
    }
});
