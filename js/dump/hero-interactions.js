document.addEventListener('DOMContentLoaded', function() {
    // Announcement Banner
    const closeBannerBtn = document.querySelector('.close-banner');
    const announcementBanner = document.querySelector('.announcement-banner');
    
    if (closeBannerBtn && announcementBanner) {
        closeBannerBtn.addEventListener('click', function() {
            announcementBanner.style.height = '0';
            announcementBanner.style.padding = '0';
            announcementBanner.style.opacity = '0';
            setTimeout(() => {
                announcementBanner.style.display = 'none';
            }, 300);
            
            // Save to session storage so it doesn't reappear on refresh
            sessionStorage.setItem('bannerClosed', 'true');
        });
        
        // Check if banner was previously closed
        if (sessionStorage.getItem('bannerClosed') === 'true') {
            announcementBanner.style.display = 'none';
        }
    }
    
    // Add particle effect to hero background
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && 
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Create canvas for particles
            const canvas = document.createElement('canvas');
            canvas.className = 'particles-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '1';
            canvas.style.pointerEvents = 'none';
            
            // Insert canvas as first child of hero section
            heroSection.insertBefore(canvas, heroSection.firstChild);
            
            // Initialize particles
            initParticles(canvas);
        }
    }
    
    // Interactive glitch effect on user interaction
    const glitchText = document.querySelector('.hero-title.glitch-text');
    if (glitchText) {
        glitchText.addEventListener('mouseover', function() {
            this.classList.add('active-glitch');
            setTimeout(() => {
                this.classList.remove('active-glitch');
            }, 1000);
        });
    }
    
    // Event scroll navigation
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    const eventsScroll = document.querySelector('.events-scroll');
    
    if (scrollLeftBtn && scrollRightBtn && eventsScroll) {
        const scrollAmount = 350; // Scroll distance in pixels
        
        scrollLeftBtn.addEventListener('click', () => {
            eventsScroll.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            eventsScroll.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll buttons based on scroll position
        eventsScroll.addEventListener('scroll', () => {
            // Show left button only if scrolled right
            scrollLeftBtn.style.opacity = eventsScroll.scrollLeft > 0 ? '1' : '0.3';
            
            // Show right button only if more content to scroll
            const maxScrollLeft = eventsScroll.scrollWidth - eventsScroll.clientWidth;
            scrollRightBtn.style.opacity = eventsScroll.scrollLeft >= maxScrollLeft ? '0.3' : '1';
        });
        
        // Initialize button states
        setTimeout(() => {
            const maxScrollLeft = eventsScroll.scrollWidth - eventsScroll.clientWidth;
            scrollLeftBtn.style.opacity = '0.3';
            scrollRightBtn.style.opacity = maxScrollLeft > 0 ? '1' : '0.3';
        }, 100);
    }
});

function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isVisible = true;
    
    // Check if canvas is visible
    const checkVisibility = () => {
        if (document.hidden) {
            isVisible = false;
            cancelAnimationFrame(animationId);
        } else {
            isVisible = true;
            if (!animationId) {
                animationId = requestAnimationFrame(drawParticles);
            }
        }
    };
    
    // Add visibility listener
    document.addEventListener('visibilitychange', checkVisibility);
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    function createParticles() {
        particles = [];
        // Reduce particle count for better performance
        const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 20000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.3 - 0.15, // Slower speed for better performance
                speedY: Math.random() * 0.3 - 0.15,
                color: `rgba(30, 84, 233, ${Math.random() * 0.5 + 0.25})`
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });
        
        if (isVisible) {
            animationId = requestAnimationFrame(drawParticles);
        }
    }
    
    // Handle window resize with debounce for performance
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resizeCanvas();
            createParticles();
        }, 250);
    });
    
    resizeCanvas();
    createParticles();
    drawParticles();
    
    // Clean up function
    return function cleanup() {
        document.removeEventListener('visibilitychange', checkVisibility);
        cancelAnimationFrame(animationId);
    };
}
