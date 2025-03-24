/**
 * Homepage Animations
 * Specialized animations for the ACUMEN 2025 homepage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on main page - check URL path
    const isMainPage = window.location.pathname === '/' || 
                      window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/');
    
    if (!isMainPage) {
        console.log('Not on main page, skipping homepage-specific animations');
        return;
    }
    
    // Initialize animations only if not on a mobile device and no reduced motion preference
    if (
        !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        console.log('Initializing homepage animations');
        initHeroAnimation();
        initCountdownEffects();
        initSponsorAnimation();
    } else {
        // Apply simplified animations for mobile/reduced motion users
        console.log('Applying simplified animations for mobile/reduced motion');
        initSimplifiedAnimations();
    }
});

/**
 * Initialize hero section animations
 */
function initHeroAnimation() {
    // Dynamic text effect for tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        animateTagline(tagline);
    }
    
    // Add particles to hero background
    addParticleEffect();
    
    // Apply subtle floating effect to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'float 6s ease-in-out infinite';
    }
    
    // Create floating circuit lines in background
    createCircuitLines();
}

/**
 * Animate the hero tagline with typing effect
 */
function animateTagline(element) {
    // Get original text
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--primary-color)';
    
    // Add class for animation
    element.classList.add('typing-animation');
    
    // Type text character by character
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 500);
        }
    }, 50);
}

/**
 * Add particle effect to hero section
 */
function addParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
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
    
    hero.appendChild(canvas);
    
    // Initialize particles
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    // Create particles
    function createParticles() {
        // Limited number of particles for performance
        const particleCount = Math.min(window.innerWidth / 20, 40);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                color: `rgba(0, 243, 255, ${Math.random() * 0.5 + 0.2})`,
                speedX: Math.random() * 0.6 - 0.3,
                speedY: Math.random() * 0.6 - 0.3
            });
        }
    }
    
    // Animate particles
    function animateParticles() {
        if (document.hidden) {
            requestAnimationFrame(animateParticles);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw connections between nearby particles
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animateParticles();
}

/**
 * Create animated circuit lines in the hero background
 */
function createCircuitLines() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const circuitContainer = document.createElement('div');
    circuitContainer.className = 'circuit-lines-container';
    circuitContainer.style.position = 'absolute';
    circuitContainer.style.top = '0';
    circuitContainer.style.left = '0';
    circuitContainer.style.width = '100%';
    circuitContainer.style.height = '100%';
    circuitContainer.style.pointerEvents = 'none';
    circuitContainer.style.zIndex = '0';
    circuitContainer.style.opacity = '0.3';
    
    // Create 5 random circuit lines
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        
        // Randomize position and size
        const isHorizontal = Math.random() > 0.5;
        const position = Math.random() * 80 + 10; // 10% to 90%
        const length = Math.random() * 30 + 10; // 10% to 40% 
        
        line.style.position = 'absolute';
        line.style.backgroundColor = 'var(--primary-color)';
        line.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        
        if (isHorizontal) {
            line.style.height = '1px';
            line.style.width = `${length}%`;
            line.style.top = `${position}%`;
            line.style.left = `${Math.random() * (100 - length)}%`;
        } else {
            line.style.width = '1px';
            line.style.height = `${length}%`;
            line.style.left = `${position}%`;
            line.style.top = `${Math.random() * (100 - length)}%`;
        }
        
        // Add pulse animation
        line.style.animation = `pulse-opacity ${Math.random() * 3 + 2}s infinite alternate ease-in-out`;
        
        circuitContainer.appendChild(line);
        
        // Add circuit nodes at the ends
        addCircuitNode(circuitContainer, line, isHorizontal, true); // Start node
        addCircuitNode(circuitContainer, line, isHorizontal, false); // End node
    }
    
    hero.appendChild(circuitContainer);
    
    // Add a style element for the animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-opacity {
            0% { opacity: 0.1; }
            100% { opacity: 0.4; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add circuit node to the ends of circuit lines
 */
function addCircuitNode(container, line, isHorizontal, isStart) {
    const node = document.createElement('div');
    node.className = 'circuit-node';
    
    node.style.position = 'absolute';
    node.style.width = '4px';
    node.style.height = '4px';
    node.style.borderRadius = '50%';
    node.style.backgroundColor = 'var(--primary-color)';
    node.style.boxShadow = '0 0 5px var(--primary-color)';
    
    if (isHorizontal) {
        node.style.top = line.style.top;
        
        if (isStart) {
            node.style.left = line.style.left;
        } else {
            const lineLeft = parseFloat(line.style.left);
            const lineWidth = parseFloat(line.style.width);
            node.style.left = `calc(${lineLeft}% + ${lineWidth}%)`;
        }
    } else {
        node.style.left = line.style.left;
        
        if (isStart) {
            node.style.top = line.style.top;
        } else {
            const lineTop = parseFloat(line.style.top);
            const lineHeight = parseFloat(line.style.height);
            node.style.top = `calc(${lineTop}% + ${lineHeight}%)`;
        }
    }
    
    node.style.transform = 'translate(-50%, -50%)';
    container.appendChild(node);
}

/**
 * Add special effects to the countdown timer
 */
function initCountdownEffects() {
    const countdownDigits = document.querySelectorAll('.countdown .time span:first-child');
    
    countdownDigits.forEach(digit => {
        // Add cyberpunk glow effect
        digit.style.textShadow = '0 0 10px var(--primary-glow)';
        
        // Add flicker effect occasionally
        setInterval(() => {
            // Only flicker sometimes
            if (Math.random() > 0.9) {
                digit.style.opacity = '0.8';
                setTimeout(() => {
                    digit.style.opacity = '1';
                }, 50);
            }
        }, 2000);
    });
}

/**
 * Animate sponsor logos 
 */
function initSponsorAnimation() {
    const sponsorCards = document.querySelectorAll('.sponsor-card');
    
    sponsorCards.forEach((card, index) => {
        // Add staggered animation
        card.style.setProperty('--animation-order', index);
        
        // Add scan effect 
        const scanLine = document.createElement('div');
        scanLine.className = 'sponsor-scan-line';
        scanLine.style.position = 'absolute';
        scanLine.style.top = '0';
        scanLine.style.left = '-100%';
        scanLine.style.width = '50%';
        scanLine.style.height = '100%';
        scanLine.style.background = 'linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.2), transparent)';
        scanLine.style.transform = 'skewX(-20deg)';
        scanLine.style.pointerEvents = 'none';
        scanLine.style.animation = `sponsor-scan 3s infinite`;
        scanLine.style.animationDelay = `${index * 0.3}s`;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(scanLine);
    });
    
    // Add a style element for the animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sponsor-scan {
            0% { left: -100%; }
            100% { left: 200%; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize simpler animations for mobile/reduced motion users
 */
function initSimplifiedAnimations() {
    // Add subtle color pulse to primary buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.style.animation = 'simple-pulse 4s infinite alternate';
    });
    
    // Create simplified style block
    const style = document.createElement('style');
    style.textContent = `
        @keyframes simple-pulse {
            0% { box-shadow: 0 0 5px var(--primary-color); }
            100% { box-shadow: 0 0 15px var(--primary-color); }
        }
        
        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}
