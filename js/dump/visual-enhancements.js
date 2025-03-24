/**
 * Visual Enhancements
 * Adds dynamic visual effects to enhance the cyberpunk aesthetic
 */

(function() {
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎨 Initializing visual enhancements');
        
        // Check if we should reduce effects based on device/preference
        const shouldReduceEffects = isMobileDevice() || prefersReducedMotion();
        
        // Apply enhancements based on device capability
        if (!shouldReduceEffects) {
            createParticleEffect();
            createGlowingElements();
            createScanLines();
        }
        
        // These effects are less intensive and suitable for all devices
        enhanceScrollAnimations();
        initializeDataStreams();
        
        // Apply 3D hover effect for non-touch devices only
        if (!isTouchDevice()) {
            apply3DHoverEffect('.event-card');
        }
        
        // Add error recovery mechanism
        monitorForVisualErrors();
    });
    
    /**
     * Check if user prefers reduced motion
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    /**
     * Check if using touch device
     */
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    /**
     * Create dynamic particle effect
     */
    function createParticleEffect() {
        // Skip on mobile devices for better performance
        if (isMobileDevice()) return;
        
        // Find target sections to add particles
        const targetSections = document.querySelectorAll('.hero-section, .cta-section');
        if (targetSections.length === 0) return;
        
        targetSections.forEach(section => {
            // Create canvas element
            const canvas = document.createElement('canvas');
            canvas.className = 'particle-canvas';
            canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;';
            
            // Add canvas to the section
            section.style.position = 'relative';
            section.appendChild(canvas);
            
            // Initialize particles with a lower count for better performance
            initializeParticles(canvas, 30); // Reduced from 50
        });
    }
    
    /**
     * Initialize particles on a canvas
     */
    function initializeParticles(canvas, particleCount) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        let width, height;
        let animationFrame;
        
        // Handle resize
        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }
        
        // Create particles
        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: Math.random() * 0.5 - 0.25,
                    vy: Math.random() * 0.5 - 0.25,
                    size: Math.random() * 2 + 1,
                    color: `rgba(0, ${Math.floor(Math.random() * 150) + 100}, ${Math.floor(Math.random() * 100) + 155}, ${Math.random() * 0.5 + 0.25})`
                });
            }
        }
        
        // Update particles
        function updateParticles() {
            // Skip animation if document hidden or scrolling
            if (document.hidden || document.body.classList.contains('is-scrolling')) {
                animationFrame = requestAnimationFrame(updateParticles);
                return;
            }
            
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach((p, index) => {
                // Move particle
                p.x += p.vx;
                p.y += p.vy;
                
                // Handle borders
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Connect nearby particles - only connect with nearby particles to improve performance
                for (let i = index + 5; i < Math.min(index + 5, particles.length); i++) {
                    const p2 = particles[i];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            
            animationFrame = requestAnimationFrame(updateParticles);
        }
        
        // Initialize
        resize();
        createParticles();
        updateParticles();
        
        // Handle window resize
        window.addEventListener('resize', resize);
        
        // Clean up function to prevent memory leaks
        return function cleanup() {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }
    
    /**
     * Create glowing elements effect for cyberpunk aesthetic
     */
    function createGlowingElements() {
        // Add glowing elements to key sections
        const sections = document.querySelectorAll('.hero-section, .featured-events-section, .cta-section');
        
        sections.forEach(section => {
            // Add subtle glowing dots - reduce count for better performance
            for (let i = 0; i < 3; i++) { // Reduced from 5
                const dot = document.createElement('div');
                dot.className = 'cyber-glow-dot';
                dot.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    border-radius: 50%;
                    background-color: rgba(0, 243, 255, 0.5);
                    box-shadow: 0 0 10px rgba(0, 243, 255, 0.8);
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.5 + 0.25};
                    pointer-events: none;
                    z-index: 1;
                    animation: pulse-glow ${Math.random() * 3 + 2}s infinite alternate ease-in-out;
                `;
                section.appendChild(dot);
            }
        });
        
        // Add style for pulse animation if not exists
        if (!document.getElementById('glow-styles')) {
            const style = document.createElement('style');
            style.id = 'glow-styles';
            style.textContent = `
                @keyframes pulse-glow {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(1.5); opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Enhance scroll animations
     */
    function enhanceScrollAnimations() {
        // Skip if IntersectionObserver not supported
        if (!('IntersectionObserver' in window)) return;
        
        // Define elements to animate on scroll
        const animatedElements = document.querySelectorAll('.event-card, .about-image, .hero-badge, .countdown-item, .section-title');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation with staggered delay based on index
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.transitionDelay = `${delay}s`;
                    entry.target.classList.add('animate-in');
                    
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Observe elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Add CSS for scroll animations if not exists
        if (!document.getElementById('scroll-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'scroll-animation-styles';
            style.textContent = `
                .event-card, .about-image, .hero-badge, .countdown-item, .section-title {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Create scan lines effect for retro-futuristic look
     */
    function createScanLines() {
        // Skip on mobile devices for better performance
        if (isMobileDevice()) return;
        
        // Create scan lines element if not exists
        if (!document.querySelector('.scan-lines')) {
            const scanLines = document.createElement('div');
            scanLines.className = 'scan-lines';
            scanLines.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: repeating-linear-gradient(
                    to bottom,
                    transparent,
                    transparent 1px,
                    rgba(0, 243, 255, 0.03) 1px,
                    rgba(0, 243, 255, 0.03) 2px
                );
                pointer-events: none;
                z-index: 9999;
                opacity: 0.3;
            `;
            document.body.appendChild(scanLines);
        }
    }
    
    /**
     * Initialize data streams effect
     */
    function initializeDataStreams() {
        // Look for datastream containers
        const containers = document.querySelectorAll('.datastream-container');
        
        containers.forEach(container => {
            // Create data streams if needed
            if (container.querySelectorAll('.data-stream').length === 0) {
                for (let i = 0; i < 3; i++) {
                    const stream = document.createElement('div');
                    stream.className = 'data-stream';
                    stream.style.left = `${Math.random() * 100}%`;
                    stream.style.animationDelay = `${Math.random() * 5}s`;
                    container.appendChild(stream);
                }
            }
        });
    }
    
    /**
     * Apply 3D hover effect to elements
     */
    function apply3DHoverEffect(selector) {
        // Skip on mobile devices
        if (isMobileDevice()) return;
        
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
        
        function handleMouseMove(e) {
            // Skip if scrolling
            if (document.documentElement.classList.contains('is-scrolling')) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 5; // Max 5deg
            const rotateX = -((y - centerY) / centerY) * 5; // Max 5deg
            
            // Apply transform
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            this.style.transition = 'none';
            
            // Add highlight effect
            const highlightX = (x / rect.width) * 100;
            const highlightY = (y / rect.height) * 100;
            this.style.background = `
                linear-gradient(135deg, 
                    rgba(6, 6, 20, 0.8) 0%, 
                    rgba(10, 10, 27, 0.8) 50%,
                    rgba(0, 243, 255, 0.1) ${highlightX}%, 
                    rgba(10, 10, 27, 0.8) 100%)
            `;
        }
        
        function handleMouseLeave() {
            this.style.transform = '';
            this.style.background = '';
            this.style.transition = 'transform 0.5s ease, background 0.5s ease';
        }
    }
    
    /**
     * Monitor for visual glitches and errors
     */
    function monitorForVisualErrors() {
        // Fix any z-index issues that may arise
        setInterval(function() {
            // Ensure key interactive elements are above visual effects
            const interactiveElements = document.querySelectorAll('a, button, input, .btn, .nav-links a');
            interactiveElements.forEach(el => {
                const zIndex = parseInt(window.getComputedStyle(el).zIndex, 10);
                if (zIndex < 5) {
                    el.style.zIndex = '5';
                    el.style.position = 'relative';
                }
            });
            
            // Ensure overlays don't block interaction
            const overlays = document.querySelectorAll('.glitch-overlay, .digital-noise, .circuit-pattern');
            overlays.forEach(el => {
                el.style.pointerEvents = 'none';
            });
        }, 5000); // Check every 5 seconds
    }
    
    /**
     * Check if current device is mobile
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }
})();
