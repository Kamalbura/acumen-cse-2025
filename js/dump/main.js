document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Fix: Toggle body class to prevent background scrolling when menu is open
            document.body.classList.toggle('menu-open');
            
            // Add delay to each navigation item for staggered animation
            document.querySelectorAll('.nav-links li').forEach((item, index) => {
                if (navLinks.classList.contains('active')) {
                    item.style.transitionDelay = `${index * 0.1}s`;
                } else {
                    item.style.transitionDelay = '0s';
                }
            });
        });
    }
    
    // Close mobile nav when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navToggle.click();
            }
        });
    });
    
    // Sticky Navigation with optimized scroll listener
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let ticking = false;
    
    if (navbar) {
        window.addEventListener('scroll', () => {
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
    }
    
    // Fix for glitch effects - reduce frequency
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
    
    // Fix: Add digital noise with lower opacity for better performance
    const digitalNoiseEl = document.createElement('div');
    digitalNoiseEl.classList.add('digital-noise');
    digitalNoiseEl.style.opacity = '0.03'; // Reduce opacity
    document.body.appendChild(digitalNoiseEl);
    
    // Fix: More efficient event card animation
    const eventCards = document.querySelectorAll('.event-card');
    
    if (eventCards.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
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
    
    // Fix: Terminal typing effect with better performance
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
    
    // Fix: More reliable scrolling fix
    function fixScrolling() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.height = 'auto';
        document.documentElement.style.height = 'auto';
        
        // Force browser to recalculate layout
        window.dispatchEvent(new Event('resize'));
    }
    
    // Run scroll fix when page loads and after a delay
    fixScrolling();
    setTimeout(fixScrolling, 1000);
    
    // Fix: Better performance for animations on mobile
    function optimizeForDevice() {
        const isMobile = window.innerWidth < 768 || 
                         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Set animation intensity CSS variable
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
    
    // Run device optimization immediately and on resize
    optimizeForDevice();
    window.addEventListener('resize', optimizeForDevice);
    
    // Fix scrolling issues by pausing animations during scroll
    let scrollTimeout;
    let isScrolling = false;
    
    function onScroll() {
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
        }, 200); // Longer timeout for smoother experience
    }
    
    // Optimized scroll event with passive flag for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Fix: Optimize animation-related elements for better performance
    function optimizeAnimations() {
        const glitchTexts = document.querySelectorAll('.glitch-text');
        
        glitchTexts.forEach(function(element) {
            // Ensure each element has a data-text attribute
            if (!element.getAttribute('data-text')) {
                element.setAttribute('data-text', element.textContent);
            }
            
            // Force hardware acceleration
            element.style.transform = 'translateZ(0)';
        });
        
        // Add CSS class to limit animations during scroll
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            body.is-scrolling .glitch-text::before,
            body.is-scrolling .glitch-text::after,
            body.is-scrolling .countdown-item {
                animation-play-state: paused !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    optimizeAnimations();
    
    // Initialize remaining features with better performance
    // Add student-friendly features
    
    // Highlight event deadlines
    const now = new Date();
    const eventDeadlines = document.querySelectorAll('[data-deadline]');
    
    if (eventDeadlines.length > 0) {
        eventDeadlines.forEach(deadline => {
            const deadlineDate = new Date(deadline.dataset.deadline);
            const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
            
            if (daysLeft <= 3 && daysLeft > 0) {
                // Highlight approaching deadlines
                deadline.classList.add('deadline-soon');
                deadline.innerHTML += `<span class="deadline-badge">Only ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left!</span>`;
            }
        });
    }
    
    // Enhance accessibility
    document.querySelectorAll('a, button').forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const icon = element.querySelector('i');
            if (icon && icon.className) {
                const iconClass = icon.className.split(' ').filter(cls => cls.includes('fa-'))[0];
                if (iconClass) {
                    const label = iconClass.replace('fa-', '').replace(/-/g, ' ');
                    element.setAttribute('aria-label', label);
                }
            }
        }
    });
    
    // CRITICAL FIX: Ensure scrolling works properly
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
    
    // Run scroll fix on page load and after a delay
    fixScrollIssues();
    setTimeout(fixScrollIssues, 500);
    
    // Fix any potential z-index issues with overlay elements
    document.querySelectorAll('.glitch-overlay, body::after').forEach(function(el) {
        if(el.style) {
            el.style.pointerEvents = 'none';
            el.style.zIndex = parseInt(el.style.zIndex || 0) < 2 ? el.style.zIndex : 1;
        }
    });
    
    // Check for mobile devices and reduce animation intensity
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
        // Reduce animation intensity on mobile for better performance and scrolling
        document.documentElement.style.setProperty('--animation-intensity', '0.3');
        
        // Further optimize for mobile scrolling
        document.querySelectorAll('.glitch-text').forEach(el => {
            el.style.animationDuration = '6s';
        });
    }
    
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
    });
    
    // Fix scrolling flickering by pausing animations during scroll
    let scrollTimeout;
    let isScrolling = false;
    
    function onScroll() {
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
        }, 100);
    }
    
    // Optimized scroll event with passive flag for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Fix for animation-related flickering
    function optimizeAnimations() {
        const glitchTexts = document.querySelectorAll('.glitch-text');
        
        glitchTexts.forEach(function(element) {
            // Ensure each element has a data-text attribute
            if (!element.getAttribute('data-text')) {
                element.setAttribute('data-text', element.textContent);
            }
            
            // Force hardware acceleration
            element.style.transform = 'translateZ(0)';
        });
    }
    
    optimizeAnimations();
    
    // Throttle random glitch effect to reduce repaints
    const originalRandomGlitch = randomGlitch;
    randomGlitch = function() {
        if (!isScrolling) {
            originalRandomGlitch();
        } else {
            // When scrolling, schedule next check without executing effect
            setTimeout(randomGlitch, 3000);
        }
    };

    // Hero section button enhancements
    const registerButton = document.getElementById('registerButton');
    const exploreButton = document.getElementById('exploreButton');
    
    if (registerButton) {
        // Add hover effect
        registerButton.addEventListener('mouseenter', function() {
            this.classList.add('btn-hover');
        });
        
        registerButton.addEventListener('mouseleave', function() {
            this.classList.remove('btn-hover');
        });
        
        // Add click animation and analytics tracking
        registerButton.addEventListener('click', function(e) {
            // Add click animation
            this.classList.add('btn-clicked');
            
            // Track registration button click in analytics (if available)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'engagement',
                    'event_label': 'register_button'
                });
            }
            
            // For mobile, add active state
            if (window.innerWidth < 768) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Add active state briefly
                this.classList.add('active');
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    }
    
    if (exploreButton) {
        // Add hover effect
        exploreButton.addEventListener('mouseenter', function() {
            this.classList.add('btn-hover');
        });
        
        exploreButton.addEventListener('mouseleave', function() {
            this.classList.remove('btn-hover');
        });
        
        // Add click animation and analytics tracking
        exploreButton.addEventListener('click', function(e) {
            // Add click animation
            this.classList.add('btn-clicked');
            
            // Track explore events button click in analytics (if available)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'engagement',
                    'event_label': 'explore_events_button'
                });
            }
            
            // For mobile, add active state
            if (window.innerWidth < 768) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Add active state briefly
                this.classList.add('active');
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    }
    
    // Add custom cursor activation
    if (!('ontouchstart' in window)) {
        document.body.classList.add('custom-cursor-active');
        
        // Add glitch hover effect to text elements
        const headings = document.querySelectorAll('h1, h2, h3, .event-title, .footer-logo p');
        headings.forEach(heading => {
            if (!heading.classList.contains('glitch-text')) {  // Skip already glitched elements
                heading.classList.add('glitch-hover');
                heading.setAttribute('data-text', heading.textContent);
            }
        });
    }
    
    // Add parallax effect to hero sections
    const heroSections = document.querySelectorAll('.hero-section, .event-hero, .page-banner');
    
    window.addEventListener('scroll', function() {
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
    });
    
    // Add card tilt effect
    const cards = document.querySelectorAll('.event-card, .organizer-card, .sponsor-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Get position of mouse relative to card
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit tilt amount
            const maxTilt = 10;
            const tiltX = ((y - centerY) / centerY) * maxTilt;
            const tiltY = -((x - centerX) / centerX) * maxTilt;
            
            // Apply transform
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset transform on mouse leave
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Add animated underline effect to links
    document.querySelectorAll('.animated-link').forEach(link => {
        link.innerHTML = `<span class="animated-link-text">${link.textContent}</span>`;
        link.innerHTML += `<svg class="animated-link-line" width="100%" height="8" viewBox="0 0 100 8"><path d="M0,5 Q25,3 50,5 T100,5" stroke-width="2" stroke="var(--primary-color)" fill="none" /></svg>`;
    });
    
    // Improve navigation interaction
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = `0 0 10px var(--primary-color)`;
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
    
    // Digital noise effect
    const noise = document.createElement('div');
    noise.className = 'digital-noise';
    document.body.appendChild(noise);
    
    // Add border glow effect to cards and buttons
    document.querySelectorAll('.event-card, .sponsor-card, .organizer-card').forEach(card => {
        card.classList.add('glow-border');
    });
    
    // Add energy field effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('energy-field');
        btn.setAttribute('data-text', btn.textContent);
    });
    
    // Add scanline effect to sections
    document.querySelectorAll('.event-hero, .hero-section, .about-section').forEach(section => {
        section.classList.add('scanline-effect');
    });
    
    // Add circuit path effect to footer links
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.classList.add('circuit-path');
    });
    
    // Add corrupt text effect to social icons
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.classList.add('corrupt-text');
    });
    
    // Add text scramble effect for tech-themed elements
    const techElements = document.querySelectorAll('.event-title');
    
    techElements.forEach(element => {
        element.classList.add('scramble-text');
        element.setAttribute('data-text', element.textContent);
        
        element.addEventListener('mouseenter', function() {
            this.classList.add('scrambling');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('scrambling');
        });
    });
    
    // Initialize new components
    initBackToTop();
    initTestimonials();
    initCategoryCards();
    initSponsors();
});

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize testimonials slider if present
 */
function initTestimonials() {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (!testimonialSlider) return;
    
    // Add animation classes based on scroll position
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const testimonials = entry.target.querySelectorAll('.testimonial-item');
                testimonials.forEach((item, index) => {
                    // Stagger the animation
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 200);
                });
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(testimonialSlider);
}

/**
 * Initialize category card animations
 */
function initCategoryCards() {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) return;
    
    const cards = categoriesGrid.querySelectorAll('.category-card');
    
    // Add animation order as CSS variable for staggered animations
    cards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
    
    // Animate cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.category-card');
                cards.forEach((card, index) => {
                    // Stagger the animation
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 150);
                });
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(categoriesGrid);
}

/**
 * Initialize sponsor animations
 */
function initSponsors() {
    const sponsorItems = document.querySelectorAll('.sponsor-item');
    
    // Add animation order for shine effect
    sponsorItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index % 5); // Cycle through 5 delay values
    });
}

/**
 * Add custom cursor functionality
 */
function addCustomCursor() {
    if (document.querySelector('.cursor-outer')) return;
    
    // Create cursor elements
    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'cursor-outer';
    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';
    
    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);
    document.body.classList.add('custom-cursor-active');
    
    // Throttle mouse movement for better performance
    let lastX = 0, lastY = 0;
    let ticking = false;
    
    document.addEventListener('mousemove', function(e) {
        lastX = e.clientX;
        lastY = e.clientY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                cursorOuter.style.left = lastX + 'px';
                cursorOuter.style.top = lastY + 'px';
                cursorInner.style.left = lastX + 'px';
                cursorInner.style.top = lastY + 'px';
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .event-card, .nav-links li a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursorOuter.classList.add('cursor-hover');
            cursorInner.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', function() {
            cursorOuter.classList.remove('cursor-hover');
            cursorInner.classList.remove('cursor-hover');
        });
    });
}

/**
 * Add back to top button
 */
function addBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
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
 * Initialize countdown timer with optimized code
 */
function initCountdownTimer() {
    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    
    if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;
    
    // Set the countdown date (March 15, 2025)
    const countdownDate = new Date("March 15, 2025 00:00:00").getTime();
    
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
