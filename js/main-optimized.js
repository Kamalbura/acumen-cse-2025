/**
 * ACUMEN 2025 - Main JavaScript
 * Consolidated and optimized core functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing ACUMEN 2025 website...');
    
    // Initialize core modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initCountdownTimer();
    initBackToTop();
    optimizeForDevice();
    
    // Set up performance monitoring
    setupPerformanceMonitoring();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Staggered animation for nav items
        document.querySelectorAll('.nav-links li').forEach((item, index) => {
            item.style.transitionDelay = navLinks.classList.contains('active') 
                ? `${index * 0.1}s` 
                : '0s';
        });
    });
    
    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navToggle.click();
            }
        });
    });
}

/**
 * Initialize scroll-based effects
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let ticking = false;
    let isScrolling = false;
    let scrollTimeout;
    
    // Handle scroll event with requestAnimationFrame for better performance
    window.addEventListener('scroll', () => {
        // Update scroll state
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
        }, 200);
        
        // Handle navbar transformation
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                    navbar.style.padding = '10px 0';
                    navbar.style.boxShadow = '0 5px 20px rgba(0, 255, 255, 0.1)';
                } else {
                    navbar.classList.remove('scrolled');
                    navbar.style.padding = '15px 0';
                    navbar.style.boxShadow = 'none';
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero-section, .hero');
    
    window.addEventListener('scroll', function() {
        if (isScrolling && heroSections.length > 0) {
            const scrollPosition = window.pageYOffset;
            
            heroSections.forEach(section => {
                // Only apply effect if section is in viewport
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom >= 0) {
                    // Adjust background position based on scroll
                    const speed = 0.5;
                    section.style.backgroundPosition = `center ${scrollPosition * speed}px`;
                }
            });
        }
    }, { passive: true });
}

/**
 * Initialize visual animations
 */
function initAnimations() {
    // Apply glitch effect to elements
    document.querySelectorAll('[data-glitch]').forEach(element => {
        if (!element.hasAttribute('data-text')) {
            element.setAttribute('data-text', element.textContent);
        }
    });
    
    // Random glitch effect
    function randomGlitch() {
        // Skip if scrolling or page is hidden
        if (document.body.classList.contains('is-scrolling') || document.hidden) {
            setTimeout(randomGlitch, Math.random() * 10000 + 5000);
            return;
        }
        
        const elements = document.querySelectorAll('.event-card, .section-title, .btn-primary, .btn-secondary');
        
        if (elements.length > 0) {
            // Only apply effect if element is in viewport
            const visibleElements = Array.from(elements).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            });
            
            if (visibleElements.length) {
                const randomElement = visibleElements[Math.floor(Math.random() * visibleElements.length)];
                
                randomElement.classList.add('glitch-effect');
                
                setTimeout(() => {
                    randomElement.classList.remove('glitch-effect');
                }, 200);
            }
            
            // Schedule next glitch with longer interval
            setTimeout(randomGlitch, Math.random() * 10000 + 5000);
        }
    }
    
    // Start random glitch effect with delay
    setTimeout(randomGlitch, 5000);
    
    // Add digital noise effect
    if (!document.querySelector('.digital-noise')) {
        const digitalNoiseEl = document.createElement('div');
        digitalNoiseEl.classList.add('digital-noise');
        digitalNoiseEl.style.opacity = '0.03';
        document.body.appendChild(digitalNoiseEl);
    }
    
    // Terminal typing effect for tagline
    const tagline = document.querySelector('.tagline');
    
    if (tagline && !tagline.classList.contains('terminal-text')) {
        const text = tagline.textContent;
        
        // Don't run the effect if the text is too long (performance)
        if (text.length < 50) {
            tagline.textContent = '';
            tagline.classList.add('terminal-text');
            
            let i = 0;
            function typeWriter() {
                if (i < text.length) {
                    tagline.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            
            // Use IntersectionObserver to only start animation when visible
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        setTimeout(typeWriter, 1000);
                        observer.disconnect();
                    }
                });
                observer.observe(tagline);
            } else {
                setTimeout(typeWriter, 1000);
            }
        }
    }
    
    // Reveal animations for event cards
    const eventCards = document.querySelectorAll('.event-card');
    
    if (eventCards.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });
        
        eventCards.forEach(card => {
            observer.observe(card);
        });
    }
}

/**
 * Initialize countdown timer
 */
function initCountdownTimer() {
    const countdownDays = document.getElementById('days');
    const countdownHours = document.getElementById('hours');
    const countdownMinutes = document.getElementById('minutes');
    const countdownSeconds = document.getElementById('seconds');
    
    if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;
    
    // Get the countdown date from the container's data attribute or default to April 10, 2025
    const countdownContainer = document.querySelector('.countdown-container');
    let countdownDate;
    
    if (countdownContainer && countdownContainer.getAttribute('data-date')) {
        countdownDate = new Date(countdownContainer.getAttribute('data-date')).getTime();
    } else {
        countdownDate = new Date("April 10, 2025 00:00:00").getTime();
    }
    
    // Update countdown immediately, then set interval
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        // Stop if event has passed
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownDays.textContent = "00";
            countdownHours.textContent = "00";
            countdownMinutes.textContent = "00";
            countdownSeconds.textContent = "00";
            return;
        }
        
        // Calculate remaining time
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Format with leading zeros
        const formatTime = (time) => (time < 10 ? "0" : "") + time;
        
        // Update elements
        countdownDays.textContent = formatTime(days);
        countdownHours.textContent = formatTime(hours);
        countdownMinutes.textContent = formatTime(minutes);
        countdownSeconds.textContent = formatTime(seconds);
    }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    // Create button if it doesn't exist
    if (!document.getElementById('back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
    }
    
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Optimize for device type
 */
function optimizeForDevice() {
    const isMobile = window.innerWidth < 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Reduce animation intensity
        document.documentElement.style.setProperty('--animation-intensity', '0.3');
        
        // Disable heavy effects on mobile
        document.querySelectorAll('.glitch-overlay, .matrix-bg').forEach(el => {
            if (el) el.style.opacity = '0.1';
        });
        
        // Add touch-friendly navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            link.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    } else {
        document.documentElement.style.setProperty('--animation-intensity', '1');
    }
}

/**
 * Set up performance monitoring
 */
function setupPerformanceMonitoring() {
    // Monitor for scroll issues
    let lastScrollTop = 0;
    let scrollStuckCounter = 0;
    
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if scroll seems stuck
        if (Math.abs(st - lastScrollTop) < 1) {
            scrollStuckCounter++;
            if (scrollStuckCounter > 20) {
                // Scroll appears stuck, try to fix
                fixScrollIssues();
                scrollStuckCounter = 0;
            }
        } else {
            scrollStuckCounter = 0;
        }
        
        lastScrollTop = st;
    }, { passive: true });
    
    // Fix any scrolling issues
    function fixScrollIssues() {
        // Reset any problematic styles that might be blocking scroll
        document.documentElement.style.height = 'auto';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'visible';
        document.body.style.overflow = 'visible';
        
        // Force proper overflow settings
        setTimeout(function() {
            document.documentElement.style.overflowY = 'scroll';
            document.body.style.overflowY = 'visible';
            
            // Force browser to recognize changes
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }
    
    // Run scroll fix on page load
    fixScrollIssues();
}
