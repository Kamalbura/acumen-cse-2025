/**
 * Navbar Auto-hide Functionality
 * 
 * - Completely hides navbar after 1 second of inactivity
 * - Shows navbar when mouse is at the top of the screen
 * - Compatible with existing navbar implementation
 * - Prevents content shifting when navbar appears/disappears
 */

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const presentsText = document.querySelector('.presents-text');
    
    // Exit if no navbar or hero section
    if (!navbar || !heroSection) return;
    
    // Use existing navbar-spacer if it exists, otherwise create it
    let navbarSpacer = document.querySelector('.navbar-spacer');
    if (!navbarSpacer) {
        navbarSpacer = document.createElement('div');
        navbarSpacer.className = 'navbar-spacer';
        // Insert the spacer at the top of the body
        document.body.insertBefore(navbarSpacer, document.body.firstChild);
    }
    
    // Set spacer height to match navbar but make it invisible
    navbarSpacer.style.height = `0px`; // Changed from navbar.offsetHeight to 0
    navbarSpacer.style.display = 'none'; // Hide completely to prevent any space
    navbarSpacer.style.width = '100%';
    
    // Variables for navbar control
    let hideNavTimeout;
    let fadeNavTimeout;
    let navbarVisible = true;
    let lastScrollTop = 0;
    const sensitivityZoneHeight = 100; // Fixed sensitivity zone
    
    // Add navbar hide class for CSS animation
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            /* Fixed positioning for navbar to prevent layout shifts */
            .navbar {
                transition: opacity 0.3s ease, background-color 0.3s ease;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 1000;
            }
            
            .navbar.fading {
                opacity: 0;
            }
            
            .navbar.hidden {
                display: none;
            }
            
            .navbar.scrolled {
                background-color: rgba(10, 10, 27, 0.95);
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
            }
            
            /* Ensure fixed positioning doesn't cause jumps */
            body {
                padding-top: 0; /* Remove padding-top */
                margin: 0;
            }
            
            /* Navbar spacer styling */
            .navbar-spacer {
                visibility: hidden;
                margin: 0;
                padding: 0;
                display: none; /* Hide completely */
                height: 0 !important; /* Force zero height */
            }
            
            /* Ensure hero section is properly centered */
            .hero {
                padding-top: 0 !important;
                margin-top: 0 !important;
            }
        </style>
    `);
    
    // Function to start hiding navbar - two-step process for smooth transition
    function startHidingNavbar() {
        if (navbarVisible) {
            // First fade out
            navbar.classList.add('fading');
            
            // Then completely hide after fade completes
            fadeNavTimeout = setTimeout(() => {
                navbar.classList.add('hidden');
            }, 300); // Match this to the CSS transition time
            
            navbarVisible = false;
        }
    }
    
    // Function to show navbar
    function showNavbar() {
        // Clear any pending fade timeouts
        clearTimeout(fadeNavTimeout);
        
        if (!navbarVisible) {
            // First make it visible but transparent
            navbar.classList.remove('hidden');
            
            // Force a reflow to ensure the display change takes effect before removing fading class
            navbar.offsetHeight;
            
            // Then fade it in
            navbar.classList.remove('fading');
            navbarVisible = true;
        }
        
        // Reset the auto-hide timer
        resetHideTimer();
    }
    
    // Reset timer that hides the navbar
    function resetHideTimer() {
        clearTimeout(hideNavTimeout);
        hideNavTimeout = setTimeout(startHidingNavbar, 1000);
    }
    
    // Handle mouse movement
    document.addEventListener('mousemove', function(e) {
        const mouseY = e.clientY;
        
        // Show navbar if mouse is in sensitivity zone at top of page
        if (mouseY < sensitivityZoneHeight) {
            showNavbar();
        } else {
            // Reset timer when mouse moves elsewhere
            if (navbarVisible) {
                resetHideTimer();
            }
        }
    });
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Always show navbar when scrolling up
        if (scrollTop < lastScrollTop) {
            showNavbar();
        } else {
            // When scrolling down, start hide timer
            resetHideTimer();
        }
        
        // Add 'scrolled' class for background when not at the top
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // Show navbar when any of its links are focused (accessibility)
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('focus', showNavbar);
    });
    
    // Start the initial hide timer
    resetHideTimer();
});

/**
 * Navbar Auto-Hide for Mobile
 * Hides navbar when scrolling down, shows when scrolling up
 * Saves valuable screen space on mobile devices
 */

(function() {
    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        let scrollTimer;
        
        if (!navbar) return;
        
        // Set initial state
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        }
        
        // Handle scroll events
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Clear existing timer
            clearTimeout(scrollTimer);
            
            // Handle navbar visibility based on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - hide navbar
                navbar.classList.add('auto-hide');
            } else {
                // Scrolling up or at top - show navbar
                navbar.classList.remove('auto-hide');
            }
            
            // Update last scroll position
            lastScrollTop = scrollTop;
            
            // Add scrolled class for styling when not at top
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide navbar again after inactivity
            scrollTimer = setTimeout(function() {
                if (scrollTop > 100) {
                    navbar.classList.add('auto-hide');
                }
            }, 3000); // Hide after 3 seconds of inactivity
        }, {passive: true});
        
        // Show navbar when hovering near top of screen
        document.addEventListener('mousemove', function(e) {
            if (e.clientY < 50 && window.scrollY > 100) {
                navbar.classList.remove('auto-hide');
            }
        }, {passive: true});
    });
})();
