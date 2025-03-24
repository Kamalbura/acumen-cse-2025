/**
 * Events Carousel - Dynamically loads events and handles auto-scrolling
 */
class EventsCarousel {
    constructor(options = {}) {
        this.container = document.querySelector(options.container || '.events-scroll');
        this.autoScrollSpeed = options.autoScrollSpeed || 1; // pixels per frame
        this.pauseOnHover = options.pauseOnHover !== false;
        this.animationId = null;
        this.isScrolling = false;
        this.isPaused = false;
        this.eventsPath = options.eventsPath || 'events';
        this.loadedEvents = [];
        
        if (!this.container) return;
        
        this.init();
    }
    
    async init() {
        // Load events data
        await this.loadEvents();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start auto-scrolling
        this.startAutoScroll();
        
        // Set initial button states
        this.updateButtonStates();
    }
    
    async loadEvents() {
        try {
            // For demonstration, we'll use the events already in the HTML
            // In a production environment, you'd fetch this from a JSON file or API
            const eventCards = this.container.querySelectorAll('.event-card');
            
            if (eventCards.length === 0) {
                // If no events in HTML, try to load from sample data
                const sampleEvents = [
                    {
                        icon: 'fa-code',
                        title: 'Code to Escape',
                        description: 'A unique fusion of programming challenges and escape room puzzles.',
                        link: 'events/code-to-escape.html'
                    },
                    {
                        icon: 'fa-robot',
                        title: 'AI Imagination',
                        description: 'Explore the creative potential of artificial intelligence.',
                        link: 'events/ai-imagination.html'
                    },
                    // Add more sample events...
                ];
                
                // Create event cards
                sampleEvents.forEach(event => this.createEventCard(event));
            } else {
                // Enhance existing event cards with animations
                eventCards.forEach(card => this.enhanceEventCard(card));
            }
            
            // Clone events for infinite scrolling
            this.setupInfiniteScroll();
            
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }
    
    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        card.innerHTML = `
            <div class="event-icon">
                <i class="fas ${event.icon}"></i>
            </div>
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <a href="${event.link}" class="event-details-link">View Details <i class="fas fa-arrow-right"></i></a>
        `;
        
        this.enhanceEventCard(card);
        this.container.appendChild(card);
    }
    
    enhanceEventCard(card) {
        // Add cyberpunk hover effects
        card.classList.add('cyberpunk-card');
        
        // Add data attributes for animation
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-duration', '800');
        
        // Add tilt effect
        card.addEventListener('mousemove', this.handleCardTilt);
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    }
    
    handleCardTilt(e) {
        const card = e.currentTarget;
        const boundingRect = card.getBoundingClientRect();
        const centerX = boundingRect.left + boundingRect.width / 2;
        const centerY = boundingRect.top + boundingRect.height / 2;
        const xPos = (e.clientX - centerX) / boundingRect.width;
        const yPos = (e.clientY - centerY) / boundingRect.height;
        
        const rotateY = xPos * 5; // Max 5 degrees
        const rotateX = yPos * -5; // Max 5 degrees
        
        card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    setupInfiniteScroll() {
        // For true infinite scrolling, clone some items
        const cards = this.container.querySelectorAll('.event-card');
        if (cards.length > 3) {
            // Clone first 3 cards and append to end
            for (let i = 0; i < 3; i++) {
                const clone = cards[i].cloneNode(true);
                clone.classList.add('cloned-card');
                this.enhanceEventCard(clone);
                this.container.appendChild(clone);
            }
        }
    }
    
    addEventListeners() {
        // Pause on hover
        if (this.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => { this.isPaused = true; });
            this.container.addEventListener('mouseleave', () => { this.isPaused = false; });
        }
        
        // Handle manual scrolling
        this.container.addEventListener('touchstart', () => { this.isPaused = true; });
        this.container.addEventListener('touchend', () => {
            setTimeout(() => { this.isPaused = false; }, 3000);
        });
        
        this.container.addEventListener('scroll', () => {
            this.isScrolling = true;
            this.isPaused = true;
            clearTimeout(this.scrollTimeout);
            
            // Resume auto-scroll after user stops scrolling
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.isPaused = false;
            }, 3000);
            
            this.updateButtonStates();
        });
        
        // Button controls
        const leftBtn = document.querySelector('.scroll-left');
        const rightBtn = document.querySelector('.scroll-right');
        
        if (leftBtn) {
            leftBtn.addEventListener('click', () => this.scrollEvents(-350));
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('click', () => this.scrollEvents(350));
        }
    }
    
    updateButtonStates() {
        const leftBtn = document.querySelector('.scroll-left');
        const rightBtn = document.querySelector('.scroll-right');
        
        if (!leftBtn || !rightBtn) return;
        
        // Show left button only if scrolled right
        leftBtn.style.opacity = this.container.scrollLeft > 0 ? '1' : '0.3';
        
        // Show right button only if more content to scroll
        const maxScrollLeft = this.container.scrollWidth - this.container.clientWidth;
        rightBtn.style.opacity = this.container.scrollLeft >= maxScrollLeft - 10 ? '0.3' : '1';
    }
    
    scrollEvents(amount) {
        this.isPaused = true;
        this.container.scrollBy({
            left: amount,
            behavior: 'smooth'
        });
        
        // Resume auto-scroll after user interaction
        clearTimeout(this.pauseTimeout);
        this.pauseTimeout = setTimeout(() => {
            this.isPaused = false;
        }, 3000);
    }
    
    startAutoScroll() {
        const animateScroll = () => {
            if (!this.isPaused) {
                const maxScrollLeft = this.container.scrollWidth - this.container.clientWidth;
                
                // If we've reached the end, reset to beginning for infinite effect
                if (this.container.scrollLeft >= maxScrollLeft) {
                    // Smooth reset by scrolling quickly to beginning
                    this.container.scrollTo({
                        left: 0,
                        behavior: 'auto'
                    });
                } else {
                    // Otherwise continue scrolling
                    this.container.scrollLeft += this.autoScrollSpeed;
                }
                
                this.updateButtonStates();
            }
            
            this.animationId = requestAnimationFrame(animateScroll);
        };
        
        this.animationId = requestAnimationFrame(animateScroll);
    }
    
    stopAutoScroll() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize the events carousel when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new EventsCarousel({
        container: '.events-scroll',
        autoScrollSpeed: 0.5,
        pauseOnHover: true,
        eventsPath: 'events'
    });
});
