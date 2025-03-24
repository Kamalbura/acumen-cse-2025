/**
 * Page Integrity Checker
 * Ensures each page has necessary elements and functions properly
 */
document.addEventListener('DOMContentLoaded', function() {
    // Run the appropriate check based on current page
    const currentPage = getCurrentPage();
    console.log(`Running page integrity check for: ${currentPage}`);
    
    switch (currentPage) {
        case 'home':
            checkHomePage();
            break;
        case 'events':
            checkEventsPage();
            break;
        case 'event-detail':
            checkEventDetailPage();
            break;
        case 'registration':
            checkRegistrationPage();
            break;
        case 'gallery':
            checkGalleryPage();
            break;
        case 'team':
            checkTeamPage();
            break;
        case 'schedule':
            checkSchedulePage();
            break;
        default:
            checkGenericPage();
    }
    
    // Verify navbar and footer on all pages
    checkNavbarIntegrity();
    checkFooterIntegrity();
    
    /**
     * Get current page type based on URL
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        
        if (path === '/' || path.includes('index.html')) {
            return 'home';
        } else if (path.includes('events.html')) {
            return 'events';
        } else if (path.includes('events/') && !path.endsWith('events/')) {
            return 'event-detail';
        } else if (path.includes('registration.html')) {
            return 'registration';
        } else if (path.includes('gallery.html')) {
            return 'gallery';
        } else if (path.includes('team.html')) {
            return 'team';
        } else if (path.includes('schedule.html')) {
            return 'schedule';
        } else {
            return 'generic';
        }
    }
    
    /**
     * Check home page integrity
     */
    function checkHomePage() {
        const requiredElements = [
            '.hero', 
            '.hero-content', 
            '.countdown-container',
            '.events-section'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Home page missing required elements: ${missingElements.join(', ')}`);
            attemptFixHomePage(missingElements);
        }
        
        // Check countdown functionality
        if (document.querySelector('.countdown-container') && 
            typeof window.initCountdown !== 'function') {
            console.warn('Countdown container exists but initCountdown function is missing');
            addFallbackCountdown();
        }
    }
    
    /**
     * Check events page integrity
     */
    function checkEventsPage() {
        const requiredElements = [
            '.events-grid',
            '.events-filter',
            '.page-banner'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Events page missing required elements: ${missingElements.join(', ')}`);
            attemptFixEventsPage(missingElements);
        }
        
        // Check if event cards loaded
        if (document.querySelector('.events-grid') && 
            document.querySelectorAll('.event-card').length === 0) {
            console.warn('Events grid exists but no event cards found');
            addPlaceholderEvents();
        }
    }
    
    /**
     * Check event detail page integrity
     */
    function checkEventDetailPage() {
        const requiredElements = [
            '.event-hero',
            '.event-hero-content',
            '.event-details'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Event detail page missing required elements: ${missingElements.join(', ')}`);
            attemptFixEventDetailPage(missingElements);
        }
    }
    
    /**
     * Check registration page integrity
     */
    function checkRegistrationPage() {
        const requiredElements = [
            '#registrationForm',
            '.form-step[data-step="1"]',
            '.events-grid',
            '.order-summary'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Registration page missing required elements: ${missingElements.join(', ')}`);
            attemptFixRegistrationPage(missingElements);
        }
        
        // Check form functionality
        const form = document.getElementById('registrationForm');
        if (form) {
            // Ensure proper form submission handlers
            if (!form.hasAttribute('data-initialized')) {
                if (typeof window.initRegistrationForm === 'function') {
                    window.initRegistrationForm();
                } else {
                    addFallbackFormHandler(form);
                }
                form.setAttribute('data-initialized', 'true');
            }
        }
    }
    
    /**
     * Check gallery page integrity
     */
    function checkGalleryPage() {
        const requiredElements = [
            '.page-banner',
            '.gallery-container',
            '.posters-grid'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Gallery page missing required elements: ${missingElements.join(', ')}`);
            attemptFixGalleryPage(missingElements);
        }
    }
    
    /**
     * Check team page integrity
     */
    function checkTeamPage() {
        const requiredElements = [
            '.page-banner',
            '.team-section',
            '.team-grid'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Team page missing required elements: ${missingElements.join(', ')}`);
            attemptFixTeamPage(missingElements);
        }
    }
    
    /**
     * Check schedule page integrity
     */
    function checkSchedulePage() {
        const requiredElements = [
            '.page-banner',
            '.schedule-tabs',
            '.schedule-container'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Schedule page missing required elements: ${missingElements.join(', ')}`);
            attemptFixSchedulePage(missingElements);
        }
    }
    
    /**
     * Generic page check
     */
    function checkGenericPage() {
        // Basic checks for any page
        const requiredElements = [
            '.container'
        ];
        
        const missingElements = checkRequiredElements(requiredElements);
        
        if (missingElements.length > 0) {
            console.warn(`Page missing required elements: ${missingElements.join(', ')}`);
            // Add container if it doesn't exist
            if (!document.querySelector('.container')) {
                const main = document.querySelector('main') || document.body;
                const container = document.createElement('div');
                container.className = 'container';
                
                // Move all direct children of main into container
                Array.from(main.children).forEach(child => {
                    // Skip navbar and footer
                    if (!child.classList.contains('navbar') && 
                        !child.classList.contains('footer')) {
                        container.appendChild(child);
                    }
                });
                
                main.appendChild(container);
            }
        }
    }
    
    /**
     * Check if navbar exists and fix if missing
     */
    function checkNavbarIntegrity() {
        if (!document.querySelector('.navbar')) {
            console.warn('Navbar missing - generating fallback navbar');
            
            const navbar = document.createElement('nav');
            navbar.className = 'navbar';
            navbar.innerHTML = `
                <div class="container">
                    <div class="logo">
                        <div class="acumen-logo-nav">
                            <span class="department-text">CSE</span>
                            <span class="glitch-text">ACUMEN</span><span class="year-integrated">2025</span>
                        </div>
                    </div>
                    <div class="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="schedule.html">Schedule</a></li>
                        <li><a href="registration.html">Register</a></li>
                        <li><a href="gallery.html">Gallery</a></li>
                        <li><a href="team.html">Team</a></li>
                    </ul>
                </div>
            `;
            
            document.body.insertBefore(navbar, document.body.firstChild);
            
            // Add mobile menu toggle functionality
            const toggle = navbar.querySelector('.nav-toggle');
            const navLinks = navbar.querySelector('.nav-links');
            
            if (toggle && navLinks) {
                toggle.addEventListener('click', function() {
                    toggle.classList.toggle('active');
                    navLinks.classList.toggle('active');
                });
            }
        }
    }
    
    /**
     * Check if footer exists and fix if missing
     */
    function checkFooterIntegrity() {
        if (!document.querySelector('.footer')) {
            console.warn('Footer missing - generating fallback footer');
            
            const footer = document.createElement('footer');
            footer.className = 'footer';
            footer.innerHTML = `
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-logo">
                            <p>ACUMEN 2025 | CSE Department</p>
                            <p>Vasavi College of Engineering</p>
                        </div>
                        <div class="footer-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="index.html">Home</a></li>
                                <li><a href="events.html">Events</a></li>
                                <li><a href="registration.html">Register</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <div class="footer-contact">
                            <h3>Contact Us</h3>
                            <p><i class="fas fa-map-marker-alt"></i> Vasavi College of Engineering, Hyderabad</p>
                            <p><i class="fas fa-phone"></i> +91 98765 43210</p>
                            <p><i class="fas fa-envelope"></i> acumen@vasavi.ac.in</p>
                        </div>
                        <div class="footer-social">
                            <h3>Follow Us</h3>
                            <div class="social-icons">
                                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2025 ACUMEN - Vasavi College of Engineering. All Rights Reserved.</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(footer);
        }
    }
    
    /**
     * Check for required elements and return any missing ones
     */
    function checkRequiredElements(elements) {
        return elements.filter(selector => !document.querySelector(selector));
    }
    
    /**
     * Attempt to fix home page issues
     */
    function attemptFixHomePage(missingElements) {
        // Fix missing hero
        if (missingElements.includes('.hero')) {
            const main = document.querySelector('main') || document.body;
            const firstChild = main.firstChild;
            
            const hero = document.createElement('section');
            hero.className = 'hero';
            hero.innerHTML = `
                <div class="container">
                    <div class="hero-content">
                        <div class="acumen-hero-logo">
                            <span class="department">CSE</span>
                            ACUMEN<span class="year-integrated">2025</span>
                        </div>
                        <div class="hero-text">
                            <p class="tagline">Unleash Your Technical Potential</p>
                        </div>
                    </div>
                </div>
                <div class="hero-overlay"></div>
            `;
            
            main.insertBefore(hero, firstChild);
        }
        
        // Fix missing countdown
        if (missingElements.includes('.countdown-container')) {
            addFallbackCountdown();
        }
    }
    
    /**
     * Add fallback countdown
     */
    function addFallbackCountdown() {
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
            const countdownContainer = document.createElement('div');
            countdownContainer.className = 'countdown-container';
            countdownContainer.innerHTML = `
                <h3>Event Starts In</h3>
                <div class="countdown">
                    <div class="time">
                        <span id="days">00</span>
                        <span class="label">Days</span>
                    </div>
                    <div class="time">
                        <span id="hours">00</span>
                        <span class="label">Hours</span>
                    </div>
                    <div class="time">
                        <span id="minutes">00</span>
                        <span class="label">Minutes</span>
                    </div>
                    <div class="time">
                        <span id="seconds">00</span>
                        <span class="label">Seconds</span>
                    </div>
                </div>
            `;
            
            heroContent.appendChild(countdownContainer);
            
            // Add countdown functionality
            const eventDate = new Date('April 10, 2025 09:00:00').getTime();
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = eventDate - now;
                
                if (distance < 0) {
                    document.getElementById('days').innerHTML = "00";
                    document.getElementById('hours').innerHTML = "00";
                    document.getElementById('minutes').innerHTML = "00";
                    document.getElementById('seconds').innerHTML = "00";
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
                document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
                document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
            }
            
            // Update every second
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }
    
    /**
     * Attempt to fix events page issues
     */
    function attemptFixEventsPage(missingElements) {
        // Fix missing events grid
        if (missingElements.includes('.events-grid')) {
            const main = document.querySelector('main') || document.body;
            const container = main.querySelector('.container') || createContainer(main);
            
            const eventsSection = document.createElement('section');
            eventsSection.className = 'events-section';
            eventsSection.innerHTML = `
                <h2 class="section-title">Our <span>Events</span></h2>
                <div class="events-filter">
                    <button class="events-filter-btn active" data-filter="all">All Events</button>
                    <button class="events-filter-btn" data-filter="technical">Technical</button>
                    <button class="events-filter-btn" data-filter="coding">Coding</button>
                    <button class="events-filter-btn" data-filter="gaming">Gaming</button>
                    <button class="events-filter-btn" data-filter="non-technical">Non-Technical</button>
                </div>
                <div class="events-grid"></div>
            `;
            
            container.appendChild(eventsSection);
            
            // Add some placeholder events
            addPlaceholderEvents();
        }
    }
    
    /**
     * Create container if missing
     */
    function createContainer(parent) {
        const container = document.createElement('div');
        container.className = 'container';
        parent.appendChild(container);
        return container;
    }
    
    /**
     * Add placeholder events
     */
    function addPlaceholderEvents() {
        const eventsGrid = document.querySelector('.events-grid');
        
        if (eventsGrid) {
            const placeholderEvents = [
                {
                    title: 'Paper Presentation',
                    category: 'technical',
                    description: 'Present your research papers on innovative topics.',
                    icon: 'fas fa-file-alt'
                },
                {
                    title: 'Bug Busters',
                    category: 'coding',
                    description: 'Find and fix bugs in problematic code snippets.',
                    icon: 'fas fa-bug'
                },
                {
                    title: 'Valorant Tournament',
                    category: 'gaming',
                    description: 'Compete in teams in this popular tactical shooter game.',
                    icon: 'fas fa-gamepad'
                },
                {
                    title: 'Treasure Hunt',
                    category: 'non-technical',
                    description: 'Follow clues, solve puzzles and find the hidden treasure.',
                    icon: 'fas fa-map-marked-alt'
                }
            ];
            
            placeholderEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = `event-card ${event.category}`;
                eventCard.setAttribute('data-category', event.category);
                
                eventCard.innerHTML = `
                    <div class="event-icon">
                        <i class="${event.icon}"></i>
                    </div>
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <a href="#" class="event-details-link">View Details</a>
                `;
                
                eventsGrid.appendChild(eventCard);
            });
        }
    }
    
    /**
     * Attempt to fix event detail page
     */
    function attemptFixEventDetailPage(missingElements) {
        // Implement event detail fixing logic
        if (missingElements.includes('.event-hero')) {
            const main = document.querySelector('main') || document.body;
            const firstChild = main.firstChild;
            
            const eventHero = document.createElement('section');
            eventHero.className = 'event-hero';
            eventHero.style.backgroundImage = 'url("../img/events/default-event.jpg")';
            eventHero.innerHTML = `
                <div class="event-hero-overlay"></div>
                <div class="container">
                    <div class="event-hero-content">
                        <h1>Event Title</h1>
                        <p>This is a placeholder for the event description.</p>
                        <div class="event-meta-brief">
                            <span><i class="fas fa-calendar"></i> April 10-12, 2025</span>
                            <span><i class="fas fa-map-marker-alt"></i> Vasavi College of Engineering</span>
                        </div>
                    </div>
                </div>
            `;
            
            main.insertBefore(eventHero, firstChild);
        }
        
        if (missingElements.includes('.event-details')) {
            const main = document.querySelector('main') || document.body;
            const container = main.querySelector('.container') || createContainer(main);
            
            const eventDetails = document.createElement('section');
            eventDetails.className = 'event-details';
            eventDetails.innerHTML = `
                <div class="container">
                    <a href="../events.html" class="event-back-button"><i class="fas fa-arrow-left"></i> Back to Events</a>
                    <div class="event-section">
                        <h2>Event Details</h2>
                        <p>This is a placeholder for the event details.</p>
                    </div>
                </div>
            `;
            
            main.appendChild(eventDetails);
        }
    }
    
    /**
     * Attempt to fix gallery page issues
     */
    function attemptFixGalleryPage(missingElements) {
        // Fix missing gallery grid
        if (missingElements.includes('.posters-grid')) {
            const galleryContainer = document.querySelector('.gallery-container') || 
                                    createGalleryContainer();
            
            const postersSection = document.createElement('div');
            postersSection.className = 'posters-section';
            postersSection.innerHTML = `
                <h2>Event Posters</h2>
                <div class="posters-grid"></div>
            `;
            
            galleryContainer.appendChild(postersSection);
            
            // Add placeholder posters
            const postersGrid = postersSection.querySelector('.posters-grid');
            
            for (let i = 1; i <= 4; i++) {
                const posterItem = document.createElement('div');
                posterItem.className = 'poster-item';
                posterItem.setAttribute('data-poster', `placeholder-${i}`);
                
                posterItem.innerHTML = `
                    <img src="../img/posters/placeholder.jpg" alt="Placeholder Poster">
                    <div class="poster-overlay">
                        <h3>Event ${i}</h3>
                        <p>Placeholder description for event ${i}</p>
                        <a href="#" class="poster-btn">View Event</a>
                    </div>
                `;
                
                postersGrid.appendChild(posterItem);
            }
        }
    }
    
    /**
     * Create gallery container if missing
     */
    function createGalleryContainer() {
        const main = document.querySelector('main') || document.body;
        const galleryContainer = document.createElement('section');
        galleryContainer.className = 'gallery-container';
        
        const container = document.createElement('div');
        container.className = 'container';
        
        galleryContainer.appendChild(container);
        main.appendChild(galleryContainer);
        
        return container;
    }
    
    /**
     * Fallback form handler
     */
    function addFallbackFormHandler(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submission is not fully implemented. This is a fallback handler.');
            console.log('Form would be submitted with these values:', 
                Array.from(form.elements)
                    .filter(el => el.name)
                    .reduce((data, el) => {
                        data[el.name] = el.value;
                        return data;
                    }, {})
            );
        });
    }
    
    /**
     * Attempt to fix registration page issues
     */
    function attemptFixRegistrationPage(missingElements) {
        // Implementation for fixing registration page
        if (missingElements.includes('#registrationForm')) {
            const main = document.querySelector('main') || document.body;
            const container = main.querySelector('.container') || createContainer(main);
            
            const registrationSection = document.createElement('section');
            registrationSection.className = 'registration-section';
            registrationSection.innerHTML = `
                <h2 class="section-title">Event <span>Registration</span></h2>
                <form id="registrationForm" class="registration-form">
                    <div class="form-step" data-step="1">
                        <h3>Personal Information</h3>
                        <div class="form-group">
                            <label for="name">Full Name *</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone *</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="college">College/Institution *</label>
                            <input type="text" id="college" name="college" required>
                        </div>
                        <div class="form-buttons">
                            <button type="button" class="btn btn-primary next-step">Next</button>
                        </div>
                    </div>
                    
                    <div class="form-step" data-step="2" style="display: none;">
                        <h3>Select Events</h3>
                        <div class="events-grid" id="eventsGrid">
                            <p>Loading events...</p>
                        </div>
                        <div class="form-buttons">
                            <button type="button" class="btn btn-secondary prev-step">Previous</button>
                            <button type="button" class="btn btn-primary next-step">Next</button>
                        </div>
                    </div>
                    
                    <div class="form-step" data-step="3" style="display: none;">
                        <h3>Order Summary</h3>
                        <div class="order-summary">
                            <div id="orderSummaryItems">
                                <div id="noEventsSelected">No events selected</div>
                            </div>
                            <div class="total">
                                <span>Total:</span>
                                <span id="totalAmount">₹0</span>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button type="button" class="btn btn-secondary prev-step">Previous</button>
                            <button type="submit" class="btn btn-primary">Complete Registration</button>
                        </div>
                    </div>
                </form>
            `;
            
            container.appendChild(registrationSection);
            
            // Add basic form navigation
            const form = document.getElementById('registrationForm');
            const formSteps = form.querySelectorAll('.form-step');
            
            form.querySelectorAll('.next-step').forEach(button => {
                button.addEventListener('click', function() {
                    const currentStep = this.closest('.form-step');
                    const nextStep = currentStep.nextElementSibling;
                    
                    if (nextStep) {
                        currentStep.style.display = 'none';
                        nextStep.style.display = 'block';
                    }
                });
            });
            
            form.querySelectorAll('.prev-step').forEach(button => {
                button.addEventListener('click', function() {
                    const currentStep = this.closest('.form-step');
                    const prevStep = currentStep.previousElementSibling;
                    
                    if (prevStep) {
                        currentStep.style.display = 'none';
                        prevStep.style.display = 'block';
                    }
                });
            });
            
            // Add form submission handler
            addFallbackFormHandler(form);
        }
        
        // Add placeholder events to registration form
        if (missingElements.includes('.events-grid') && document.getElementById('eventsGrid')) {
            const eventsGrid = document.getElementById('eventsGrid');
            
            const placeholderEvents = [
                {
                    id: 'paper_presentation',
                    name: 'Paper Presentation',
                    price: 300
                },
                {
                    id: 'bug_busters',
                    name: 'Bug Busters',
                    price: 200
                },
                {
                    id: 'gaming_tournament',
                    name: 'Gaming Tournament',
                    price: 500
                }
            ];
            
            eventsGrid.innerHTML = '';
            
            placeholderEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-checkbox-card';
                
                eventCard.innerHTML = `
                    <input type="checkbox" name="events[]" id="${event.id}" value="${event.id}" data-price="${event.price}">
                    <label for="${event.id}">
                        <div class="event-checkbox-header">
                            <span class="event-name">${event.name}</span>
                            <span class="event-price">₹${event.price}</span>
                        </div>
                    </label>
                `;
                
                eventsGrid.appendChild(eventCard);
            });
        }
    }
});
