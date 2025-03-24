/**
 * Enhanced Cursor Effects - Inspired by top technical festival websites
 * This script creates advanced cursor interactions for a cyberpunk feel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only enable custom cursor on non-touch devices
    if (!('ontouchstart' in window)) {
        enableCustomCursor();
        enableCursorEffects();
    }
    
    // Initialize particle effects for hero sections
    initializeParticles();
    
    /**
     * Enable custom cursor with trail effect
     */
    function enableCustomCursor() {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);
        
        // Add body class for custom cursor styling
        document.body.classList.add('custom-cursor-area');
        
        let cursorDotX = 0;
        let cursorDotY = 0;
        let cursorOutlineX = 0;
        let cursorOutlineY = 0;
        let mouseX = 0;
        let mouseY = 0;
        
        // Update mouse position
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Animate cursor
        const animate = () => {
            // Smoothly follow the mouse position with easing
            cursorDotX = mouseX;
            cursorDotY = mouseY;
            
            cursorOutlineX += (mouseX - cursorOutlineX) * 0.2;
            cursorOutlineY += (mouseY - cursorOutlineY) * 0.2;
            
            cursorDot.style.transform = `translate(${cursorDotX}px, ${cursorDotY}px)`;
            cursorOutline.style.transform = `translate(${cursorOutlineX}px, ${cursorOutlineY}px)`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Add special effects for cursor interactions with elements
     */
    function enableCursorEffects() {
        const cursorOutline = document.querySelector('.cursor-outline');
        const cursorDot = document.querySelector('.cursor-dot');
        
        if (!cursorOutline || !cursorDot) return;
        
        // Elements that should trigger hover effect
        const hoverTargets = document.querySelectorAll(
            'a, button, .event-card, .team-card, .btn, .category-btn, ' +
            '.filter-btn, .nav-toggle, .faq-question'
        );
        
        hoverTargets.forEach(target => {
            // On hover, expand the cursor
            target.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.opacity = '0.5';
                cursorDot.style.backgroundColor = 'var(--neon-pink)';
            });
            
            // On leave, reset the cursor
            target.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.opacity = '1';
                cursorDot.style.backgroundColor = 'var(--primary-color)';
            });
        });
        
        // Add click effect
        document.addEventListener('mousedown', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });
        
        // Handle cursor over text elements differently
        const textElements = document.querySelectorAll('h1, h2, h3, p, span, li');
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.backgroundColor = 'var(--neon-blue)';
                cursorDot.style.opacity = '0.7';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.backgroundColor = 'var(--primary-color)';
                cursorDot.style.opacity = '1';
            });
        });
    }
    
    /**
     * Initialize particles for hero sections
     */
    function initializeParticles() {
        const heroSections = document.querySelectorAll('.hero-section, .event-hero, .events-banner');
        
        heroSections.forEach(section => {
            // Create canvas for particles
            const canvas = document.createElement('canvas');
            canvas.className = 'particle-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            
            // Make sure section has position relative for correct canvas positioning
            if (window.getComputedStyle(section).position === 'static') {
                section.style.position = 'relative';
            }
            
            section.insertBefore(canvas, section.firstChild);
            
            // Initialize particles
            const ctx = canvas.getContext('2d');
            canvas.width = section.clientWidth;
            canvas.height = section.clientHeight;
            
            const particles = [];
            const particleCount = canvas.width * canvas.height / 10000; // Adjust density
            
            // Create particles
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 1,
                    speedY: (Math.random() - 0.5) * 1,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
            
            // Animate particles
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach((p, index) => {
                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 243, 255, ${p.opacity})`;
                    ctx.fill();
                    
                    // Move particle
                    p.x += p.speedX;
                    p.y += p.speedY;
                    
                    // Wrap around edges
                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;
                    
                    // Connect nearby particles
                    for (let j = index + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const distX = p.x - p2.x;
                        const distY = p.y - p2.y;
                        const dist = Math.sqrt(distX * distX + distY * distY);
                        
                        if (dist < 100) { // Connection distance
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist/100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                });
                
                requestAnimationFrame(animateParticles);
            }
            
            animateParticles();
            
            // Resize handling
            window.addEventListener('resize', () => {
                canvas.width = section.clientWidth;
                canvas.height = section.clientHeight;
            });
        });
    }
});
