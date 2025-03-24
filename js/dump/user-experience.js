/**
 * User Experience Enhancements
 * Adds subtle refinements to make the site feel more responsive and polished
 */

(function() {
    // Initialize after DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🌟 Enhancing user experience');
        
        // Add smooth scroll behavior for anchor links
        setupSmoothScroll();
        
        // Show welcome toast after loading
        scheduleWelcomeToast();
        
        // Add scroll direction detection
        trackScrollDirection();
        
        // Add scroll progress indicator
        addScrollProgressIndicator();
        
        // Add advanced loading progress indicator
        enhanceLoadingScreen();
        
        // Add clever button interactions
        enhanceButtonInteractions();
    });
    
    /**
     * Implement smooth scrolling for anchor links
     */
    function setupSmoothScroll() {
        // Find all anchor links
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    
                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });
    }
    
    /**
     * Show welcome toast message
     */
    function scheduleWelcomeToast() {
        // Only show on first visit or after 7 days
        const lastVisit = localStorage.getItem('lastVisit');
        const now = new Date().getTime();
        
        if (!lastVisit || (now - parseInt(lastVisit)) > 7 * 24 * 60 * 60 * 1000) {
            // Schedule welcome toast
            setTimeout(() => {
                showToast('Welcome to ACUMEN 2025', 'The ultimate tech fest experience is here!');
                
                // Update last visit time
                localStorage.setItem('lastVisit', now.toString());
            }, 3000);
        }
    }
    
    /**
     * Show a toast notification
     */
    function showToast(title, message, duration = 5000) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        
        // Set toast content
        toast.innerHTML = `
            <strong>${title}</strong>
            <p>${message}</p>
            <button class="close-btn">&times;</button>
        `;
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Add close button functionality
        toast.querySelector('.close-btn').addEventListener('click', () => {
            toast.classList.remove('show');
        });
        
        // Auto hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
    
    /**
     * Track scroll direction and add classes to body
     */
    function trackScrollDirection() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Detect scroll direction
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                document.body.classList.add('scrolling-down');
                document.body.classList.remove('scrolling-up');
            } else {
                // Scrolling up
                document.body.classList.add('scrolling-up');
                document.body.classList.remove('scrolling-down');
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
    
    /**
     * Add scroll progress indicator
     */
    function addScrollProgressIndicator() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: var(--primary-color);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        // Update progress bar on scroll
        window.addEventListener('scroll', function() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPos = window.scrollY;
            const progress = (scrollPos / docHeight) * 100;
            
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }
    
    /**
     * Enhanced loading screen experience
     */
    function enhanceLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (!loadingScreen) return;
        
        // Add loading progress element if not present
        if (!loadingScreen.querySelector('.loading-progress')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'loading-progress';
            loadingScreen.appendChild(progressBar);
        }
        
        // Track resource loading
        const resources = [...document.querySelectorAll('img, link[rel="stylesheet"], script[src]')];
        let loadedResources = 0;
        
        resources.forEach(resource => {
            // Skip already loaded resources
            if (resource.complete || resource.readyState === 'complete') {
                loadedResources++;
                return;
            }
            
            // Add load event listener
            resource.addEventListener('load', () => {
                loadedResources++;
            });
            
            // Add error handling
            resource.addEventListener('error', () => {
                loadedResources++;
            });
        });
        
        // Update loading progress
        const updateInterval = setInterval(() => {
            const progress = resources.length > 0 
                ? (loadedResources / resources.length) * 100 
                : 100;
                
            // Check if we're done loading
            if (progress >= 100) {
                clearInterval(updateInterval);
            }
        }, 200);
    }
    
    /**
     * Add clever button interactions
     */
    function enhanceButtonInteractions() {
        // Find all interactive buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-neon, .btn-cyber, .btn-outline-cyber');
        
        buttons.forEach(button => {
            // Add magnetic effect on desktop
            button.addEventListener('mousemove', function(e) {
                if (window.innerWidth < 992) return;
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Subtle magnetic pull effect
                this.style.transform = `perspective(500px) translate3d(${(x - rect.width / 2) / 15}px, ${(y - rect.height / 2) / 15}px, 0)`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
            
            // Add click effect
            button.addEventListener('click', function() {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                // Set ripple position
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${event.clientX - rect.left - size/2}px`;
                ripple.style.top = `${event.clientY - rect.top - size/2}px`;
                
                // Add ripple to button
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
                }, 700);
            });
        });
        
        // Add ripple animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();
