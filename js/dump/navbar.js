/**
 * Enhanced navbar functionality for ACUMEN 2025
 * Handles navigation, mobile menu, and scroll effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the navigation
    initNavigation();
    
    // Handle scroll effects
    initScrollEffects();
});

/**
 * Initialize the navigation functionality
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        toggleMobileNav();
    });
    
    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navToggle.contains(event.target) || 
                              navLinks.contains(event.target);
        
        if (!isClickInside && navLinks.classList.contains('active')) {
            toggleMobileNav();
        }
    });
    
    // Add escape key handler
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMobileNav();
        }
    });
    
    // Toggle mobile nav function
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    // Update active link based on current page
    updateActiveNavLink();
}

/**
 * Update active navigation link based on current URL
 */
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPath = link.getAttribute('href');
        link.classList.remove('active');
        
        if (currentPath.endsWith(linkPath) || 
            (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/acumen/')))) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize scroll-based effects for the navbar
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    // Handle scroll event with requestAnimationFrame for better performance
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarTransform(navbar, currentScroll, lastScrollTop);
                lastScrollTop = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check for page load with scroll already happened
    handleNavbarTransform(navbar, window.pageYOffset || document.documentElement.scrollTop, 0);
}

/**
 * Apply navbar transformations based on scroll position
 */
function handleNavbarTransform(navbar, currentScroll, lastScrollTop) {
    // Add scrolled class when scrolled down
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Add enhanced scrolled effect for dramatic scrolling
    if (Math.abs(currentScroll - lastScrollTop) > 30) {
        navbar.classList.add('fast-scroll');
        
        setTimeout(() => {
            navbar.classList.remove('fast-scroll');
        }, 300);
    }
}

// For modern browsers: Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // When page becomes visible again, update active link (for back/forward navigation)
        updateActiveNavLink();
    }
});
