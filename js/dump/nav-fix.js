/**
 * Navigation Enhancement Script
 * Improves mobile navigation and ensures correct active states
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Make sure mobile navigation toggle works properly
    fixMobileNavToggle();
    
    // 2. Ensure navigation links have proper active states
    highlightActiveNavItem();
    
    // 3. Add smooth scrolling to anchor links
    enableSmoothScrolling();
    
    // 4. Fix navigation position on scroll
    implementScrollBehavior();
    
    // 5. Add dropdown handling
    enhanceDropdowns();
    
    /**
     * Ensure mobile navigation toggle works correctly
     */
    function fixMobileNavToggle() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!navToggle || !navLinks) return;
        
        // Fix any existing issues with the toggle button
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Toggle the active class
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Set proper aria attributes for accessibility
            const expanded = navLinks.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
            
            // Improve mobile UX by preventing body scroll when nav is open
            if (expanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                e.target !== navToggle) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Add basic keyboard navigation
        navLinks.querySelectorAll('a').forEach((link, index, links) => {
            link.addEventListener('keydown', function(e) {
                // Handle tab navigation
                if (e.key === 'Escape') {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.focus();
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    /**
     * Highlight the active navigation item based on current page
     */
    function highlightActiveNavItem() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop().replace('.html', '');
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            // First remove any existing active classes
            link.classList.remove('active');
            
            // Get the href and extract page name
            const href = link.getAttribute('href') || '';
            const linkPage = href.split('/').pop().replace('.html', '');
            
            // Handle special case for home page
            if ((pageName === '' || pageName === 'index') && (linkPage === 'index' || linkPage === '')) {
                link.classList.add('active');
            }
            // Regular page matching
            else if (pageName === linkPage) {
                link.classList.add('active');
            }
            // Handle subfolders (like events)
            else if (linkPage !== '' && currentPath.includes('/' + linkPage + '/')) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Add smooth scrolling to anchor links
     */
    function enableSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Get the sticky navigation height to offset scrolling
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - navHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Update URL but without scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    /**
     * Implement scroll behavior for navigation
     */
    function implementScrollBehavior() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add "scrolled" class if scrolled down
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Add "scroll-up" class when scrolling up to show navbar
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.classList.add('scroll-down');
                navbar.classList.remove('scroll-up');
            } else {
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    /**
     * Enhance dropdown functionality in navigation
     */
    function enhanceDropdowns() {
        const dropdownLinks = document.querySelectorAll('.nav-links .dropdown > a');
        
        dropdownLinks.forEach(link => {
            // Add chevron icon if not present
            if (!link.querySelector('.dropdown-icon')) {
                const icon = document.createElement('i');
                icon.className = 'dropdown-icon fas fa-chevron-down';
                link.appendChild(icon);
            }
            
            // Handle dropdown toggle
            link.addEventListener('click', function(e) {
                // Check if we're on mobile view
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('open');
                }
            });
            
            // Add proper keyboard navigation
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.parentElement.classList.toggle('open');
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            dropdownLinks.forEach(link => {
                if (!link.contains(e.target)) {
                    link.parentElement.classList.remove('open');
                }
            });
        });
    }
});
