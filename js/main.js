/**
 * Main JavaScript
 * Core functionality for ACUMEN website
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navbar
    initMobileNavbar();
    
    // Add active class to current page nav link
    highlightCurrentPageLink();
    
    // Initialize back to top button
    initBackToTop();
    
    // Ensure all sections maintain transparency
    maintainTransparency();
    
    // Initialize any animation effects
    initAnimationEffects();
    
    // Initialize modals
    initModals();
    
    // Initialize nav element positioning
    adjustElementsForNavbar();
    
    // Handle venue button clicks and smooth scrolling
    const venueButtons = document.querySelectorAll('.venue-button, a[href*="#venue"], [data-scroll-to="venue"]');
    
    venueButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find venue section
            const venueSection = document.getElementById('venue-section') || 
                                document.querySelector('.venue-section') || 
                                document.querySelector('[data-section="venue"]');
            
            if (venueSection) {
                // Add scroll-target class for margin offset
                venueSection.classList.add('scroll-target');
                
                // Smooth scroll to venue section
                venueSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the venue section temporarily
                venueSection.classList.add('highlight-section');
                setTimeout(() => {
                    venueSection.classList.remove('highlight-section');
                }, 2000);
            }
        });
    });
});

/**
 * Initialize mobile navbar functionality
 */
function initMobileNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Add active class to current page link in navigation
 */
function highlightCurrentPageLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if link matches current path
        if (currentPath.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        } else if (currentPath === '/' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    // Create back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
    
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Function to ensure all dynamic sections remain transparent
 */
function maintainTransparency() {
    // Remove any dynamically added background colors
    document.querySelectorAll('section').forEach(section => {
        section.style.backgroundColor = 'transparent';
        section.style.backgroundImage = 'none';
    });
    
    // Make sure all cards and containers remain transparent
    document.querySelectorAll('.card, .container, .event-card, .venue-card, .team-member-card').forEach(element => {
        const currentBg = window.getComputedStyle(element).backgroundColor;
        if (currentBg !== 'transparent' && !currentBg.includes('rgba')) {
            element.style.backgroundColor = 'rgba(10, 10, 27, 0.08)';
        }
    });

    // Run periodically to catch any dynamically added elements
    setTimeout(maintainTransparency, 1000);
}

/**
 * Initialize animation effects
 */
function initAnimationEffects() {
    // Glitch text effect for elements with .glitch-text class
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        if (!element.hasAttribute('data-text')) {
            element.setAttribute('data-text', element.textContent);
        }
    });
    
    // Detect is-scrolling to pause animations when scrolling
    let scrollTimer;
    window.addEventListener('scroll', function() {
        document.body.classList.add('is-scrolling');
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            document.body.classList.remove('is-scrolling');
        }, 100);
    });
}

/**
 * Initialize modal functionality
 */
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.querySelector(this.getAttribute('data-modal-target'));
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });
}

/**
 * Adjust elements to account for navbar height
 */
function adjustElementsForNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        
        // Add padding to hero sections
        document.querySelectorAll('.hero, .page-banner, .event-hero').forEach(element => {
            if (element) {
                element.style.paddingTop = (navbarHeight + 10) + 'px';
            }
        });
    }
}

/**
 * Check if an element is in the viewport
 */
function isInViewport(element, margin = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.bottom + margin >= 0 &&
        rect.right + margin >= 0 &&
        rect.top - margin <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left - margin <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Clean up any unwanted background layers on main page
 */
function cleanupMainPageBackgrounds() {
    // Only run on main page
    const path = window.location.pathname;
    const isMainPage = path === '/' || path.endsWith('index.html') || path.endsWith('/');
    
    if (!isMainPage) return;
    
    console.log('Cleaning up unwanted background layers on main page');
    
    // Get the main hero section
    const mainHero = document.querySelector('.hero, .hero-section');
    
    if (mainHero) {
        // Keep only essential elements
        const essentialSelectors = ['.hero-content', '.container', '.hero-grid', '.hero-overlay'];
        const children = Array.from(mainHero.children);
        
        children.forEach(child => {
            let isEssential = false;
            for (const selector of essentialSelectors) {
                if (child.matches(selector) || child.querySelector(selector)) {
                    isEssential = true;
                    break;
                }
            }
            
            // If it's not an essential element and it's not a script
            if (!isEssential && child.tagName !== 'SCRIPT') {
                // Check if it's a background image element
                if (child.style && (
                    child.style.backgroundImage || 
                    child.classList.contains('circuit-lines-container') ||
                    child.classList.contains('gradient-waves') ||
                    child.classList.contains('neon-circles') ||
                    child.classList.contains('hexagon-pattern') ||
                    child.classList.contains('neon-shapes') ||
                    child.classList.contains('mesh-network')
                )) {
                    console.log('Removing unwanted background layer:', child);
                    child.style.display = 'none';  // Hide it instead of removing to avoid layout shifts
                }
            }
        });
    }
}

// Run cleanup after all scripts have executed
window.addEventListener('load', cleanupMainPageBackgrounds);
