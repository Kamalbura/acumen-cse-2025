/**
 * UI Fixes
 * Handles dynamic UI fixes for the homepage
 */

(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎨 Running UI fixes');
        
        // Fix loading screen
        setupLoadingScreen();
        
        // Fix hero section content
        fixHeroContentLayout();
        
        // Fix event card heights
        fixEventCardHeights();
        
        // Ensure countdown component works
        fixCountdownComponent();
        
        // Fix visual glitches
        fixVisualGlitches();
        
        // Set up window resize handling
        window.addEventListener('resize', debounce(function() {
            fixHeroContentLayout();
            fixEventCardHeights();
        }, 200));
    });
    
    /**
     * Fix loading screen behavior
     */
    function setupLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (!loadingScreen) return;
        
        // Hide loading screen after content loads
        window.addEventListener('load', function() {
            loadingScreen.classList.add('hiding');
            
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(function() {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }, 500);
            }, 800);
        });
        
        // Fallback - hide loading screen after 5 seconds even if content isn't fully loaded
        setTimeout(function() {
            if (loadingScreen.parentNode) {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 500);
            }
        }, 5000);
    }
    
    /**
     * Fix hero content layout
     */
    function fixHeroContentLayout() {
        const heroSection = document.querySelector('.hero-section');
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (!heroSection || !heroContent) return;
        
        // Adjust hero content width based on screen size
        if (window.innerWidth >= 992) {
            // For desktop: maintain proper sizing
            heroContent.style.maxWidth = '550px';
            
            // Position hero visual properly
            if (heroVisual) {
                heroVisual.style.position = 'absolute';
                heroVisual.style.right = '5%';
                heroVisual.style.top = '50%';
                heroVisual.style.transform = 'translateY(-50%)';
            }
        } else {
            // For mobile: full width
            heroContent.style.maxWidth = '100%';
            heroContent.style.borderLeft = 'none';
            
            // Reset hero visual position
            if (heroVisual) {
                heroVisual.style.position = 'relative';
                heroVisual.style.right = 'auto';
                heroVisual.style.transform = 'none';
                heroVisual.style.marginTop = '40px';
                heroVisual.style.marginBottom = '-60px'; // Pull up into the next section
            }
        }
    }
    
    /**
     * Fix event card heights to be consistent
     */
    function fixEventCardHeights() {
        const eventCards = document.querySelectorAll('.event-card');
        if (!eventCards.length) return;
        
        // Reset heights
        eventCards.forEach(card => card.style.height = '');
        
        // Skip if mobile - let cards be natural height
        if (window.innerWidth < 768) return;
        
        // Get max height
        let maxHeight = 0;
        eventCards.forEach(card => {
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });
        
        // Apply consistent height
        eventCards.forEach(card => {
            card.style.height = maxHeight + 'px';
        });
    }
    
    /**
     * Fix countdown component
     */
    function fixCountdownComponent() {
        const countdownDays = document.getElementById('countdown-days');
        const countdownHours = document.getElementById('countdown-hours');
        const countdownMinutes = document.getElementById('countdown-minutes');
        const countdownSeconds = document.getElementById('countdown-seconds');
        
        if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;
        
        // Set target date to March 15, 2025
        const targetDate = new Date('March 15, 2025 09:00:00').getTime();
        
        // Update countdown every second
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            // If countdown is over
            if (distance < 0) {
                countdownDays.textContent = '00';
                countdownHours.textContent = '00';
                countdownMinutes.textContent = '00';
                countdownSeconds.textContent = '00';
                return;
            }
            
            // Calculate remaining time
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Add leading zero
            const formatNumber = num => num < 10 ? '0' + num : num;
            
            // Display countdown
            countdownDays.textContent = formatNumber(days);
            countdownHours.textContent = formatNumber(hours);
            countdownMinutes.textContent = formatNumber(minutes);
            countdownSeconds.textContent = formatNumber(seconds);
        }
        
        // Run once immediately
        updateCountdown();
        
        // Update every second
        setInterval(updateCountdown, 1000);
    }
    
    /**
     * Fix various visual glitches
     */
    function fixVisualGlitches() {
        // Fix hero badge glitch
        const heroBadge = document.querySelector('.hero-badge');
        if (heroBadge) {
            // Add cleanup class to prevent animation artifacts
            heroBadge.classList.add('gpu-accelerated');
        }
        
        // Fix event cards hover effect
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 255, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
        
        // Fix navigation menu dropdown on mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                this.classList.toggle('active');
                
                // Lock body scroll when menu is open
                if (navLinks.classList.contains('active')) {
                    document.body.classList.add('menu-open');
                } else {
                    document.body.classList.remove('menu-open');
                }
            });
        }
        
        // Fix back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            
            backToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
    
    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
})();
