/**
 * Mobile Navbar Optimizations
 * - Auto-hides navbar after scrolling
 * - Shows navbar when hovering near top or scrolling up
 * - Adjusts content padding to prevent overlap
 */

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let scrollTimer = null;
    let hideTimer = null;
    
    // Auto-hide navbar after 1 second of inactivity (changed from 2 seconds)
    function startHideTimer() {
        clearTimeout(hideTimer);
        
        // Always show navbar first (in case it was hidden)
        navbar.classList.remove('auto-hide');
        
        // Set timer to hide after 1 second (changed from 2000)
        hideTimer = setTimeout(function() {
            // Only hide if we're not at the top of the page
            if (window.scrollY > 50) {
                navbar.classList.add('auto-hide');
            }
        }, 1000); // Changed from 2000 to 1000
    }
    
    // Start the hide timer on page load
    startHideTimer();
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show navbar immediately when scrolling
        navbar.classList.remove('auto-hide');
        
        // Reset the hide timer
        startHideTimer();
        
        // Additional behavior: hide immediately when scrolling down significantly
        if (scrollTop > lastScrollTop + 50 && scrollTop > 100) {
            navbar.classList.add('auto-hide');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
    }, false);
    
    // Show navbar when hovering/touching near the top
    document.addEventListener('mousemove', function(e) {
        if (e.clientY < 20) {
            navbar.classList.remove('auto-hide');
            startHideTimer();
        }
    });
    
    // For touch devices, detect touch at top of screen
    document.addEventListener('touchstart', function(e) {
        if (e.touches[0].clientY < 30) {
            navbar.classList.remove('auto-hide');
            startHideTimer();
        }
    });
    
    // Reset hide timer when interacting with navbar
    navbar.addEventListener('mouseenter', function() {
        navbar.classList.remove('auto-hide');
        clearTimeout(hideTimer);
    });
    
    navbar.addEventListener('mouseleave', function() {
        startHideTimer();
    });
    
    // Calculate navbar height and set body padding-top
    function adjustContentPadding() {
        const navbarHeight = navbar.offsetHeight;
        
        // For hero sections and page banners
        document.querySelectorAll('.hero, .page-banner, .event-hero').forEach(element => {
            if (element) {
                element.style.paddingTop = (navbarHeight + 1) + 'px'; // 1px extra for separation
            }
        });
        
        // For content containers
        document.querySelectorAll('.hero-content, .page-banner .container, .event-hero-content').forEach(element => {
            if (element) {
                element.style.paddingTop = '20px';
            }
        });
    }
    
    // Run on page load and on resize
    adjustContentPadding();
    window.addEventListener('resize', adjustContentPadding);
    
    // Add observer to handle navbar height changes (like when collapsing/expanding on mobile)
    const observer = new MutationObserver(adjustContentPadding);
    observer.observe(navbar, { attributes: true, childList: true, subtree: true });
});
