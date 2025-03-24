/**
 * ACUMEN 2025 - Animation Effects
 * With mobile-optimized performance
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth < 768;
                     
    // Detect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize animations based on device and user preferences
    if (!isMobile && !prefersReducedMotion) {
        // Full animations for desktop
        initFullAnimations();
    } else {
        // Simplified animations for mobile or reduced motion preference
        initSimplifiedAnimations();
    }
    
    // Always initialize essential animations regardless of device
    initEssentialAnimations();
});

/**
 * Initialize full animations for desktop
 */
function initFullAnimations() {
    console.log('Initializing full animations for desktop');
    
    // Apply glitch effect to text elements
    document.querySelectorAll('.glitch-text').forEach(element => {
        if (!element.hasAttribute('data-text')) {
            element.setAttribute('data-text', element.textContent);
        }
    });
    
    // Initialize particle effects
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        initParticleEffect(heroSection);
    }
    
    // Initialize circuit line animations
    document.querySelectorAll('.circuit-pattern').forEach(element => {
        initCircuitLines(element);
    });
    
    // Add data streams to sections
    document.querySelectorAll('.hero, .cta-section').forEach(section => {
        initDataStreams(section);
    });
    
    // Add 3D tilt effect to cards
    document.querySelectorAll('.event-card, .sponsor-card').forEach(card => {
        initTiltEffect(card);
    });
}

/**
 * Initialize simplified animations for mobile/reduced motion
 */
function initSimplifiedAnimations() {
    console.log('Initializing simplified animations for mobile or reduced motion');
    
    // Replace glitch with simple glow for better performance
    document.querySelectorAll('.glitch-text').forEach(element => {
        element.classList.add('simple-glow');
        element.classList.remove('glitch-text');
    });
    
    // Add subtle pulse to buttons instead of complex animations
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.classList.add('simple-pulse');
    });
    
    // Add simplified appear animations for cards
    document.querySelectorAll('.event-card, .sponsor-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

/**
 * Initialize essential animations that work on all devices
 */
function initEssentialAnimations() {
    // Reveal animations on scroll for better performance
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.event-card, .sponsor-card, .about-image').forEach(el => {
            el.classList.add('reveal-element');
            revealObserver.observe(el);
        });
    }
    
    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, {passive: true});
        
        backToTopBtn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Create particle effect (desktop only)
 */
function initParticleEffect(container) {
    // Create canvas with fewer particles for better performance
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    const particleCount = Math.min(30, window.innerWidth / 50); // Fewer particles
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            color: `rgba(0, 243, 255, ${Math.random() * 0.5 + 0.2})`,
            vx: Math.random() * 0.4 - 0.2,
            vy: Math.random() * 0.4 - 0.2
        });
    }
    
    // Only animate when in viewport for better performance
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animate();
        }
    }, { threshold: 0.1 });
    
    function animate() {
        if (!document.hidden && container.classList.contains('in-viewport')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
    }
    
    // Add canvas to container
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);
    
    // Observe container visibility
    observer.observe(container);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
}

/**
 * Add 3D tilt effect to cards (desktop only)
 */
function initTiltEffect(element) {
    element.addEventListener('mousemove', e => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = (centerY - y) / centerY * 5; // Reduced tilt amount
        const tiltY = (x - centerX) / centerX * 5;
        
        element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

/**
 * Add circuit lines to an element (desktop only)
 */
function initCircuitLines(element) {
    const lineCount = 3; // Fewer lines for better performance
    
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.position = 'absolute';
        line.style.backgroundColor = 'rgba(0, 243, 255, 0.3)';
        
        const isHorizontal = Math.random() > 0.5;
        const position = Math.random() * 80 + 10;
        
        if (isHorizontal) {
            line.style.height = '1px';
            line.style.width = `${Math.random() * 30 + 10}%`;
            line.style.top = `${position}%`;
            line.style.left = `${Math.random() * 50}%`;
        } else {
            line.style.width = '1px';
            line.style.height = `${Math.random() * 30 + 10}%`;
            line.style.left = `${position}%`;
            line.style.top = `${Math.random() * 50}%`;
        }
        
        element.appendChild(line);
    }
}

/**
 * Add data streams to section (desktop only)
 */
function initDataStreams(element) {
    const streamCount = 3; // Fewer streams for performance
    
    for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        
        stream.style.position = 'absolute';
        stream.style.top = '0';
        stream.style.width = '1px';
        stream.style.height = `${Math.random() * 30 + 20}%`;
        stream.style.background = 'linear-gradient(to bottom, transparent, var(--primary-color), transparent)';
        stream.style.left = `${Math.random() * 100}%`;
        stream.style.opacity = '0.3';
        
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * 2;
        
        stream.style.animation = `data-flow ${duration}s ${delay}s infinite linear`;
        
        element.appendChild(stream);
    }
}

// CSS to add to the page for reveal animations
document.head.insertAdjacentHTML('beforeend', `
<style>
.reveal-element {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-element.revealed {
    opacity: 1;
    transform: translateY(0);
}
.simple-glow {
    color: var(--text-light);
    text-shadow: 0 0 10px var(--primary-color);
}
.simple-pulse {
    animation: simple-button-pulse 2s infinite alternate;
}
@keyframes simple-button-pulse {
    0% { box-shadow: 0 0 5px var(--primary-color); }
    100% { box-shadow: 0 0 15px var(--primary-color); }
}
@media (max-width: 768px) {
    .reveal-element {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
}
</style>
`);
