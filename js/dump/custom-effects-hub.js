/**
 * Custom Effects Hub
 * Central management for all cyberpunk effects with performance optimization
 */

// Initialize effect registry
const CyberEffects = {
    // Effect states
    initialized: false,
    disabledEffects: [],
    enabledEffects: [],
    
    // Device and capability detection
    isTouch: 'ontouchstart' in window,
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isLowPowerMode: false, // Will be detected
    
    // Performance monitoring
    fpsMonitor: null,
    lowPerformanceCount: 0,
    
    // Initialize all effects with automatic capability detection
    init: function(options = {}) {
        // Prevent double initialization
        if (this.initialized) return;
        
        console.log('🔌 Initializing CyberEffects system');
        
        // Process options
        const settings = {
            disableOnMobile: options.disableOnMobile !== false,
            enableFpsMonitoring: options.enableFpsMonitoring === true,
            effectsIntensity: options.effectsIntensity || 'medium', // low, medium, high
            ...options
        };
        
        // Store settings
        this.settings = settings;
        
        // Check for reduced capabilities
        this.detectCapabilities();
        
        // Initialize the effects based on capabilities
        this.initializeEffects();
        
        // Start performance monitoring if enabled
        if (settings.enableFpsMonitoring) {
            this.startPerformanceMonitoring();
        }
        
        // Mark as initialized
        this.initialized = true;
        
        // Log enabled effects
        console.log(`🔌 CyberEffects activated with ${this.enabledEffects.length} effects, ${this.disabledEffects.length} disabled`);
    },
    
    // Detect device capabilities and set appropriate flags
    detectCapabilities: function() {
        // Check for mobile/touch device
        if (this.isTouch && this.settings.disableOnMobile) {
            console.log('🔌 Touch device detected, reducing effects');
            this.isLowPowerMode = true;
        }
        
        // Check for battery status if API available
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    console.log('🔌 Low battery detected, reducing effects');
                    this.isLowPowerMode = true;
                    this.adjustEffectsForCapabilities();
                }
            }).catch(() => {
                // Silently fail if battery API is not available
            });
        }
        
        // Check for reduced motion preference
        if (this.isReducedMotion) {
            console.log('🔌 Reduced motion preference detected, minimizing animations');
            this.isLowPowerMode = true;
        }
        
        // Check for browser performance
        this.checkBrowserPerformance();
    },
    
    // Basic check for browser performance
    checkBrowserPerformance: function() {
        // Simple performance test - create and manipulate 1000 DOM elements
        const testEl = document.createElement('div');
        testEl.style.cssText = 'position:absolute;left:-9999px;opacity:0';
        document.body.appendChild(testEl);
        
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            testEl.style.opacity = (i % 2) ? '0.5' : '0';
        }
        const duration = performance.now() - start;
        document.body.removeChild(testEl);
        
        if (duration > 50) { // Threshold for considering it a low performance device
            console.log(`🔌 Performance test indicates lower device capability (${duration.toFixed(2)}ms)`);
            this.isLowPowerMode = true;
        }
    },
    
    // Initialize effects based on device capabilities
    initializeEffects: function() {
        // Initialize effects appropriate for the device capabilities
        this.initCursorEffects();
        this.initHoverEffects();
        this.initGlitchEffects();
        this.initParticleEffects();
        this.initScrollEffects();
    },
    
    // Initialize custom cursor effects
    initCursorEffects: function() {
        // Skip on touch devices or reduced motion preference
        if (this.isTouch || this.isReducedMotion || this.isLowPowerMode) {
            this.disabledEffects.push('cursor');
            return;
        }
        
        try {
            // Create cursor elements
            const cursorDot = document.createElement('div');
            const cursorOutline = document.createElement('div');
            
            cursorDot.className = 'cursor-dot';
            cursorOutline.className = 'cursor-outline';
            
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorOutline);
            
            document.body.classList.add('custom-cursor-area');
            
            // Track cursor position with smoothing
            let cursorDotX = 0;
            let cursorDotY = 0;
            let cursorOutlineX = 0;
            let cursorOutlineY = 0;
            
            document.addEventListener('mousemove', e => {
                cursorDotX = e.clientX;
                cursorDotY = e.clientY;
            });
            
            // Animation loop for cursor
            const updateCursor = () => {
                cursorOutlineX += (cursorDotX - cursorOutlineX) * 0.2;
                cursorOutlineY += (cursorDotY - cursorOutlineY) * 0.2;
                
                if (cursorDot && cursorOutline) {
                    cursorDot.style.transform = `translate(${cursorDotX}px, ${cursorDotY}px)`;
                    cursorOutline.style.transform = `translate(${cursorOutlineX}px, ${cursorOutlineY}px)`;
                }
                
                requestAnimationFrame(updateCursor);
            };
            
            updateCursor();
            
            // Add hover interactions
            document.querySelectorAll('a, button, .btn, .interactive').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.classList.add('cursor-hover');
                });
                
                el.addEventListener('mouseleave', () => {
                    cursorOutline.classList.remove('cursor-hover');
                });
            });
            
            this.enabledEffects.push('cursor');
        } catch (e) {
            console.error('Error initializing cursor effects:', e);
            this.disabledEffects.push('cursor');
        }
    },
    
    // Initialize hover effects
    initHoverEffects: function() {
        if (this.isLowPowerMode) {
            // On low power mode, use simplified hover effects
            document.querySelectorAll('.cyber-card, .event-card, .team-card').forEach(card => {
                card.classList.add('low-power');
            });
            
            this.disabledEffects.push('hoverEffect');
            return;
        }
        
        try {
            // Tilt effect for cards
            document.querySelectorAll('.cyber-card:not(.no-tilt), .event-card:not(.no-tilt), .team-card:not(.no-tilt)').forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    if (CyberEffects.isLowPowerMode) return;
                    
                    const rect = this.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const maxRotation = 8; // Maximum rotation in degrees
                    
                    const rotateY = maxRotation * (e.clientX - centerX) / (rect.width / 2);
                    const rotateX = -maxRotation * (e.clientY - centerY) / (rect.height / 2);
                    
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                    this.style.transition = 'transform 0.5s ease';
                });
            });
            
            this.enabledEffects.push('hoverEffect');
        } catch (e) {
            console.error('Error initializing hover effects:', e);
            this.disabledEffects.push('hoverEffect');
        }
    },
    
    // Initialize glitch effects
    initGlitchEffects: function() {
        // Reduce intensity on low power mode
        const intensity = this.isLowPowerMode ? 'low' : (this.settings.effectsIntensity || 'medium');
        
        try {
            // Text glitch effect
            document.querySelectorAll('.glitch-text').forEach(element => {
                // Set data attribute if not present
                if (!element.getAttribute('data-text')) {
                    element.setAttribute('data-text', element.textContent);
                }
                
                // Add glitch effect on hover for high intensity only
                if (intensity === 'high' && !this.isTouch) {
                    element.addEventListener('mouseenter', function() {
                        this.classList.add('glitching');
                    });
                    
                    element.addEventListener('mouseleave', function() {
                        this.classList.remove('glitching');
                    });
                }
            });
            
            // Image glitch effect - only on high intensity
            if (intensity === 'high') {
                document.querySelectorAll('.glitch-image').forEach(img => {
                    img.addEventListener('mouseenter', function() {
                        if (CyberEffects.isLowPowerMode) return;
                        
                        const glitchEffect = document.createElement('div');
                        glitchEffect.className = 'image-glitch-effect';
                        
                        const imgSrc = this.src;
                        for (let i = 0; i < 3; i++) {
                            const layer = document.createElement('div');
                            layer.className = `glitch-layer layer-${i}`;
                            layer.style.backgroundImage = `url(${imgSrc})`;
                            glitchEffect.appendChild(layer);
                        }
                        
                        // Position it correctly
                        if (this.parentElement.style.position !== 'absolute' && 
                            this.parentElement.style.position !== 'relative') {
                            this.parentElement.style.position = 'relative';
                        }
                        
                        this.parentElement.appendChild(glitchEffect);
                    });
                    
                    img.addEventListener('mouseleave', function() {
                        const effect = this.parentElement.querySelector('.image-glitch-effect');
                        if (effect) effect.remove();
                    });
                });
            }
            
            this.enabledEffects.push('glitchEffect');
        } catch (e) {
            console.error('Error initializing glitch effects:', e);
            this.disabledEffects.push('glitchEffect');
        }
    },
    
    // Initialize particle effects for hero sections
    initParticleEffects: function() {
        // Skip on low power mode or reduce particles
        const intensity = this.isLowPowerMode ? 'low' : (this.settings.effectsIntensity || 'medium');
        let particleDensity;
        
        if (intensity === 'low') {
            particleDensity = 20; // Very few particles
        } else if (intensity === 'medium') {
            particleDensity = 50; // Moderate amount
        } else {
            particleDensity = 100; // Lots of particles
        }
        
        try {
            document.querySelectorAll('.hero-section, .event-hero, .particle-area').forEach(section => {
                // Create canvas for particles
                const canvas = document.createElement('canvas');
                canvas.className = 'particle-canvas';
                canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
                
                // Ensure section has position relative
                if (getComputedStyle(section).position === 'static') {
                    section.style.position = 'relative';
                }
                
                section.insertBefore(canvas, section.firstChild);
                
                // Setup particle system
                const ctx = canvas.getContext('2d');
                canvas.width = section.clientWidth;
                canvas.height = section.clientHeight;
                
                // Create particles
                const particles = [];
                const totalParticles = Math.floor(canvas.width * canvas.height / (10000 / particleDensity));
                
                for (let i = 0; i < totalParticles; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        size: Math.random() * 2 + 1,
                        speedX: (Math.random() - 0.5) * 0.5,
                        speedY: (Math.random() - 0.5) * 0.5,
                        opacity: Math.random() * 0.5 + 0.2
                    });
                }
                
                // Animation function
                function animateParticles() {
                    if (!canvas.isConnected) return; // Stop if canvas removed
                    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    particles.forEach((p, i) => {
                        // Draw particle
                        ctx.fillStyle = `rgba(0, 243, 255, ${p.opacity})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Move particle
                        p.x += p.speedX;
                        p.y += p.speedY;
                        
                        // Wrap around edges
                        if (p.x < 0) p.x = canvas.width;
                        if (p.x > canvas.width) p.x = 0;
                        if (p.y < 0) p.y = canvas.height;
                        if (p.y > canvas.height) p.y = 0;
                        
                        // Connect nearby particles (skip in low power mode)
                        if (intensity !== 'low') {
                            for (let j = i + 1; j < particles.length; j++) {
                                const p2 = particles[j];
                                const dx = p.x - p2.x;
                                const dy = p.y - p2.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                
                                if (dist < 70) {
                                    ctx.beginPath();
                                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - dist / 70)})`;
                                    ctx.lineWidth = 0.5;
                                    ctx.moveTo(p.x, p.y);
                                    ctx.lineTo(p2.x, p2.y);
                                    ctx.stroke();
                                }
                            }
                        }
                    });
                    
                    requestAnimationFrame(animateParticles);
                }
                
                // Start animation
                animateParticles();
                
                // Handle resize
                window.addEventListener('resize', () => {
                    canvas.width = section.clientWidth;
                    canvas.height = section.clientHeight;
                });
            });
            
            this.enabledEffects.push('particles');
        } catch (e) {
            console.error('Error initializing particle effects:', e);
            this.disabledEffects.push('particles');
        }
    },
    
    // Initialize scroll-based effects
    initScrollEffects: function() {
        // Skip on reduced motion preference
        if (this.isReducedMotion) {
            this.disabledEffects.push('scrollEffects');
            return;
        }
        
        try {
            // Create Intersection Observer for scroll effects
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    } else if (entry.target.classList.contains('reset-on-exit')) {
                        entry.target.classList.remove('in-view');
                    }
                });
            }, { threshold: 0.15 });
            
            // Observe elements with scroll effects
            document.querySelectorAll('.fade-in-up, .fade-in, .slide-in, .reveal').forEach(element => {
                observer.observe(element);
            });
            
            this.enabledEffects.push('scrollEffects');
        } catch (e) {
            console.error('Error initializing scroll effects:', e);
            this.disabledEffects.push('scrollEffects');
        }
    },
    
    // Start monitoring performance and disable effects if necessary
    startPerformanceMonitoring: function() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;
        
        // Update FPS calculation every second
        setInterval(() => {
            const currentTime = performance.now();
            const elapsed = currentTime - lastTime;
            fps = Math.round(frames / (elapsed / 1000));
            
            // Reset counters
            frames = 0;
            lastTime = currentTime;
            
            // Check for low FPS
            if (fps < 30) {
                this.lowPerformanceCount++;
                
                // If consistently low, reduce effects
                if (this.lowPerformanceCount > 3 && !this.isLowPowerMode) {
                    console.log(`🔌 Low performance detected (${fps} FPS), reducing effects`);
                    this.isLowPowerMode = true;
                    this.adjustEffectsForCapabilities();
                }
            } else {
                this.lowPerformanceCount = 0;
            }
        }, 1000);
        
        // Count frames in animation loop
        const countFrame = () => {
            frames++;
            requestAnimationFrame(countFrame);
        };
        
        countFrame();
    },
    
    // Adjust effects based on device capabilities
    adjustEffectsForCapabilities: function() {
        if (this.isLowPowerMode) {
            // Remove intensive effects
            document.body.classList.add('low-power-mode');
            
            // Simplify or disable animations
            document.querySelectorAll('.particle-canvas').forEach(canvas => {
                canvas.remove();
            });
            
            // Disable tilt effects
            document.querySelectorAll('.cyber-card, .event-card, .team-card').forEach(card => {
                card.classList.add('no-tilt');
            });
            
            // Simplify other effects
            document.querySelectorAll('.glitch-text').forEach(el => {
                el.classList.add('simplified');
            });
            
            // Update the cursor if it exists
            const cursor = document.querySelector('.cursor-outline');
            if (cursor) {
                cursor.style.display = 'none';
            }
        }
    }
};

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with options
    CyberEffects.init({
        disableOnMobile: true,
        enableFpsMonitoring: true,
        effectsIntensity: 'medium' // Can be low, medium, or high
    });
    
    // Error recovery - if any effects cause problems, disable them
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('CyberEffects')) {
            console.warn('Error detected in effects, switching to low power mode');
            CyberEffects.isLowPowerMode = true;
            CyberEffects.adjustEffectsForCapabilities();
        }
    });
});

// Expose to global scope
window.CyberEffects = CyberEffects;
