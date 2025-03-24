/**
 * Homepage Animations
 * Provides peaceful neon cyberpunk-themed animations and effects for the homepage
 * Inspired by tech institute event pages (IIT, NIT) with futuristic aesthetic
 */

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Only run if explicitly called by another script or if has special flag
    if (!window.LOAD_BACKUP_BACKGROUND && !document.body.classList.contains('use-backup-bg')) {
        console.log('Skipping backup background animations');
        return;
    }
    
    // Detect device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth < 768;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize appropriate animation level
    if (!isMobile && !prefersReducedMotion) {
        initFullCyberpunkEffects();
    } else {
        initSimplifiedAnimations();
    }
});

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

/**
 * Initialize full cyberpunk effects for capable devices
 */
function initFullCyberpunkEffects() {
    // Add gradient background waves
    createGradientWaves();
    
    // Add geometric neon grid
    createNeonGrid();
    
    // Add circular pulse effects
    createPulsingCircles();
    
    // Add smooth mesh network background (modified from original)
    createMeshNetwork();
    
    // Add hexagonal pattern overlay
    createHexagonPattern();
    
    // Add subtle neon accent shapes
    createNeonShapes();
    
    // Add elegant data streams
    createElegantDataStreams();
}

/**
 * Create smooth gradient waves background
 */
function createGradientWaves() {
    const heroSection = document.querySelector('.hero-section') || document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create gradient container
    const gradientContainer = document.createElement('div');
    gradientContainer.className = 'gradient-waves';
    gradientContainer.style.position = 'absolute';
    gradientContainer.style.top = '0';
    gradientContainer.style.left = '0';
    gradientContainer.style.width = '100%';
    gradientContainer.style.height = '100%';
    gradientContainer.style.zIndex = '0';
    gradientContainer.style.opacity = '0.7';
    gradientContainer.style.pointerEvents = 'none';
    
    // Set hero position to relative if it's not already
    if (window.getComputedStyle(heroSection).position === 'static') {
        heroSection.style.position = 'relative';
    }
    
    // Add gradient layers
    for (let i = 0; i < 3; i++) {
        const gradientLayer = document.createElement('div');
        gradientLayer.className = `gradient-layer layer-${i}`;
        gradientLayer.style.position = 'absolute';
        gradientLayer.style.top = '0';
        gradientLayer.style.left = '0';
        gradientLayer.style.width = '100%';
        gradientLayer.style.height = '100%';
        gradientLayer.style.opacity = '0.5';
        gradientLayer.style.mixBlendMode = 'overlay';
        
        const duration = 15 + i * 5;
        gradientLayer.style.animation = `gradient-wave-${i} ${duration}s infinite alternate ease-in-out`;
        
        gradientContainer.appendChild(gradientLayer);
    }
    
    // Add gradient animation styles
    const gradientStyle = document.createElement('style');
    gradientStyle.id = 'gradient-wave-styles';
    gradientStyle.textContent = `
        .gradient-layer.layer-0 {
            background: radial-gradient(circle at 30% 70%, rgba(0, 50, 100, 0), rgba(0, 195, 255, 0.4));
        }
        
        .gradient-layer.layer-1 {
            background: radial-gradient(circle at 70% 30%, rgba(50, 0, 100, 0), rgba(125, 0, 255, 0.3));
        }
        
        .gradient-layer.layer-2 {
            background: radial-gradient(circle at 50% 50%, rgba(0, 200, 255, 0), rgba(0, 243, 255, 0.2));
        }
        
        @keyframes gradient-wave-0 {
            0% { transform: scale(1.0) translate(0%, 0%); }
            100% { transform: scale(1.2) translate(5%, 2%); }
        }
        
        @keyframes gradient-wave-1 {
            0% { transform: scale(1.1) translate(2%, 3%); }
            100% { transform: scale(0.9) translate(-2%, -3%); }
        }
        
        @keyframes gradient-wave-2 {
            0% { transform: scale(0.9) translate(-3%, 2%); }
            100% { transform: scale(1.1) translate(3%, -2%); }
        }
    `;
    document.head.appendChild(gradientStyle);
    
    heroSection.appendChild(gradientContainer);
}

/**
 * Create elegant neon grid
 */
function createNeonGrid() {
    const sections = document.querySelectorAll('.about-section, .features-section, .cta-section');
    
    sections.forEach(section => {
        if (!section) return;
        
        // Create grid element
        const grid = document.createElement('div');
        grid.className = 'neon-grid';
        grid.style.position = 'absolute';
        grid.style.top = '0';
        grid.style.left = '0';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.backgroundImage = `
            linear-gradient(to right, rgba(0, 243, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 243, 255, 0.07) 1px, transparent 1px)
        `;
        grid.style.backgroundSize = '80px 80px';
        grid.style.pointerEvents = 'none';
        grid.style.zIndex = '0';
        
        // Apply perspective for 3D effect
        grid.style.perspective = '1000px';
        grid.style.animation = 'grid-perspective 20s infinite alternate ease-in-out';
        
        // Add perspective shift animation
        if (!document.getElementById('neon-grid-styles')) {
            const gridStyle = document.createElement('style');
            gridStyle.id = 'neon-grid-styles';
            gridStyle.textContent = `
                @keyframes grid-perspective {
                    0% { transform: rotateX(80deg) translateZ(-100px) translateY(50px); opacity: 0.5; }
                    50% { transform: rotateX(85deg) translateZ(-150px) translateY(100px); opacity: 0.7; }
                    100% { transform: rotateX(80deg) translateZ(-100px) translateY(50px); opacity: 0.5; }
                }
            `;
            document.head.appendChild(gridStyle);
        }
        
        // Apply to section
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        section.insertBefore(grid, section.firstChild);
    });
}

/**
 * Create pulsing neon circles
 */
function createPulsingCircles() {
    const heroSection = document.querySelector('.hero-section') || document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create container for circles
    const circleContainer = document.createElement('div');
    circleContainer.className = 'neon-circles';
    circleContainer.style.position = 'absolute';
    circleContainer.style.top = '0';
    circleContainer.style.left = '0';
    circleContainer.style.width = '100%';
    circleContainer.style.height = '100%';
    circleContainer.style.pointerEvents = 'none';
    circleContainer.style.zIndex = '1';
    
    // Create circles at strategic positions
    const circlePositions = [
        { x: '10%', y: '30%', size: '150px', delay: 0 },
        { x: '85%', y: '20%', size: '180px', delay: 2 },
        { x: '70%', y: '80%', size: '200px', delay: 1 },
        { x: '20%', y: '70%', size: '120px', delay: 3 }
    ];
    
    circlePositions.forEach(pos => {
        const circle = document.createElement('div');
        circle.className = 'neon-circle';
        circle.style.position = 'absolute';
        circle.style.left = pos.x;
        circle.style.top = pos.y;
        circle.style.width = pos.size;
        circle.style.height = pos.size;
        circle.style.borderRadius = '50%';
        circle.style.border = '1px solid rgba(0, 243, 255, 0.3)';
        circle.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)';
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0.8)';
        circle.style.animation = `circle-pulse 8s ${pos.delay}s infinite alternate ease-in-out`;
        
        circleContainer.appendChild(circle);
    });
    
    // Add circle pulse animation
    if (!document.getElementById('circle-styles')) {
        const circleStyle = document.createElement('style');
        circleStyle.id = 'circle-styles';
        circleStyle.textContent = `
            @keyframes circle-pulse {
                0% { opacity: 0.1; transform: scale(0.8); }
                50% { opacity: 0.3; transform: scale(1.0); }
                100% { opacity: 0.1; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(circleStyle);
    }
    
    heroSection.appendChild(circleContainer);
}

/**
 * Create mesh network background (smoother version)
 */
function createMeshNetwork() {
    const hero = document.querySelector('.hero-section') || document.querySelector('.hero');
    if (!hero) return;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'mesh-network';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.4';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    hero.style.position = 'relative';
    
    // Set canvas size
    const setCanvasSize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    
    hero.appendChild(canvas);
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Initialize mesh network
    const ctx = canvas.getContext('2d');
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 30000));
    const particles = [];
    const maxDistance = 180;
    
    // Create particles arranged in a more organized pattern
    const rows = Math.ceil(Math.sqrt(particleCount));
    const cols = Math.ceil(particleCount / rows);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (particles.length >= particleCount) break;
            
            // Add some randomness to the grid position
            const randomOffset = 30; // pixels
            const x = (j / cols) * canvas.width + (Math.random() * randomOffset - randomOffset/2);
            const y = (i / rows) * canvas.height + (Math.random() * randomOffset - randomOffset/2);
            
            particles.push({
                x: x,
                y: y,
                originX: x,
                originY: y,
                vx: Math.random() * 0.1 - 0.05,
                vy: Math.random() * 0.1 - 0.05,
                radius: Math.random() * 1.5 + 1,
                color: `rgba(0, ${Math.random() * 50 + 200}, ${Math.random() * 50 + 200}, 0.8)`
            });
        }
    }
    
    function drawMeshNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(p => {
            // Move particles with smooth wave-like motion
            p.x += p.vx;
            p.y += p.vy;
            
            // Keep particles near their origin
            const dx = p.x - p.originX;
            const dy = p.y - p.originY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 30) {
                p.vx -= dx * 0.01;
                p.vy -= dy * 0.01;
            }
            
            // Light friction to smooth movement
            p.vx *= 0.98;
            p.vy *= 0.98;
            
            // Add slight randomness for organic feel
            p.vx += (Math.random() - 0.5) * 0.01;
            p.vy += (Math.random() - 0.5) * 0.01;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        
        // Connect nearby particles with gradient lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Create gradient for line
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    
                    const opacity = 1 - distance / maxDistance;
                    gradient.addColorStop(0, `rgba(0, 243, 255, ${opacity * 0.15})`);
                    gradient.addColorStop(1, `rgba(120, 0, 255, ${opacity * 0.15})`);
                    
                    ctx.beginPath();
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = opacity * 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation frame handler with visibility check
    let animationId;
    let lastTime = 0;
    const isInViewport = () => {
        const rect = canvas.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    };
    
    const animate = (timestamp) => {
        // Limit to 30 FPS for better performance
        if (timestamp - lastTime < 33) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        lastTime = timestamp;
        
        // Only animate when in viewport and document is visible
        if (!document.hidden && isInViewport()) {
            drawMeshNetwork();
        }
        animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    // Clean up
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

/**
 * Create hexagon pattern overlay
 */
function createHexagonPattern() {
    const sections = document.querySelectorAll('.hero-section, .hero, .cta-section');
    
    sections.forEach(section => {
        if (!section) return;
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        
        // Create hexagon container
        const hexContainer = document.createElement('div');
        hexContainer.className = 'hexagon-pattern';
        hexContainer.style.position = 'absolute';
        hexContainer.style.top = '0';
        hexContainer.style.left = '0';
        hexContainer.style.width = '100%';
        hexContainer.style.height = '100%';
        hexContainer.style.pointerEvents = 'none';
        hexContainer.style.zIndex = '1';
        hexContainer.style.opacity = '0.2';
        
        // Add hexagon SVG pattern
        hexContainer.innerHTML = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="hex-pattern" width="150" height="130" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                        <path d="M75,0 L150,43.3 L150,86.7 L75,130 L0,86.7 L0,43.3 Z" 
                              fill="none" 
                              stroke="rgba(0, 243, 255, 0.4)" 
                              stroke-width="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-pattern)" />
            </svg>
        `;
        
        // Apply subtle animation
        hexContainer.style.animation = 'hex-pattern-rotate 60s linear infinite';
        
        if (!document.getElementById('hexagon-styles')) {
            const hexStyle = document.createElement('style');
            hexStyle.id = 'hexagon-styles';
            hexStyle.textContent = `
                @keyframes hex-pattern-rotate {
                    0% { transform: translateY(0) rotate(0); }
                    100% { transform: translateY(-50px) rotate(1deg); }
                }
            `;
            document.head.appendChild(hexStyle);
        }
        
        section.appendChild(hexContainer);
    });
}

/**
 * Create neon accent shapes
 */
function createNeonShapes() {
    const heroSection = document.querySelector('.hero-section') || document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create shape container
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'neon-shapes';
    shapesContainer.style.position = 'absolute';
    shapesContainer.style.top = '0';
    shapesContainer.style.left = '0';
    shapesContainer.style.width = '100%';
    shapesContainer.style.height = '100%';
    shapesContainer.style.pointerEvents = 'none';
    shapesContainer.style.zIndex = '2';
    
    // Create SVG shapes
    const shapeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    shapeSVG.setAttribute('width', '100%');
    shapeSVG.setAttribute('height', '100%');
    shapeSVG.style.position = 'absolute';
    shapeSVG.style.top = '0';
    shapeSVG.style.left = '0';
    
    // Add interesting shapes
    const shapes = [
        // Bottom left corner triangles
        {
            type: 'polygon',
            points: '0,80% 20%,100% 0,100%',
            fill: 'rgba(0, 243, 255, 0.15)',
            animation: 'shape-pulse-1'
        },
        {
            type: 'polygon',
            points: '0,70% 30%,100% 15%,100% 0,85%',
            fill: 'rgba(0, 243, 255, 0.1)',
            animation: 'shape-pulse-2'
        },
        // Top right corner shapes
        {
            type: 'polygon',
            points: '80%,0 100%,0 100%,20%',
            fill: 'rgba(120, 0, 255, 0.15)',
            animation: 'shape-pulse-1'
        },
        {
            type: 'circle',
            cx: '90%',
            cy: '10%',
            r: '50',
            stroke: 'rgba(0, 243, 255, 0.2)',
            fill: 'none',
            strokeWidth: 1,
            animation: 'circle-scale-1'
        },
        // Accent lines
        {
            type: 'line',
            x1: '0',
            y1: '30%',
            x2: '15%',
            y2: '30%',
            stroke: 'rgba(0, 243, 255, 0.3)',
            strokeWidth: 1,
            animation: 'line-extend-1'
        },
        {
            type: 'line',
            x1: '85%',
            y1: '70%',
            x2: '100%',
            y2: '70%',
            stroke: 'rgba(0, 243, 255, 0.3)',
            strokeWidth: 1,
            animation: 'line-extend-2'
        }
    ];
    
    // Create each shape
    shapes.forEach((shape, index) => {
        let element;
        
        switch(shape.type) {
            case 'polygon':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                element.setAttribute('points', shape.points);
                if (shape.fill) element.setAttribute('fill', shape.fill);
                break;
                
            case 'circle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                element.setAttribute('cx', shape.cx);
                element.setAttribute('cy', shape.cy);
                element.setAttribute('r', shape.r);
                if (shape.fill) element.setAttribute('fill', shape.fill);
                if (shape.stroke) element.setAttribute('stroke', shape.stroke);
                if (shape.strokeWidth) element.setAttribute('stroke-width', shape.strokeWidth);
                break;
                
            case 'line':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                element.setAttribute('x1', shape.x1);
                element.setAttribute('y1', shape.y1);
                element.setAttribute('x2', shape.x2);
                element.setAttribute('y2', shape.y2);
                if (shape.stroke) element.setAttribute('stroke', shape.stroke);
                if (shape.strokeWidth) element.setAttribute('stroke-width', shape.strokeWidth);
                break;
        }
        
        // Add animation
        if (shape.animation) {
            element.style.animation = `${shape.animation} 7s infinite alternate ease-in-out`;
        }
        
        shapeSVG.appendChild(element);
    });
    
    shapesContainer.appendChild(shapeSVG);
    
    // Add shape animation styles
    if (!document.getElementById('neon-shape-styles')) {
        const shapeStyle = document.createElement('style');
        shapeStyle.id = 'neon-shape-styles';
        shapeStyle.textContent = `
            @keyframes shape-pulse-1 {
                0% { opacity: 0.3; filter: blur(0px); }
                50% { opacity: 0.7; filter: blur(2px); }
                100% { opacity: 0.3; filter: blur(0px); }
            }
            
            @keyframes shape-pulse-2 {
                0% { opacity: 0.2; filter: blur(0px); }
                70% { opacity: 0.5; filter: blur(3px); }
                100% { opacity: 0.2; filter: blur(0px); }
            }
            
            @keyframes circle-scale-1 {
                0% { transform: scale(0.8); opacity: 0.3; }
                50% { transform: scale(1.1); opacity: 0.6; }
                100% { transform: scale(0.8); opacity: 0.3; }
            }
            
            @keyframes line-extend-1 {
                0% { transform: scaleX(0.5); transform-origin: left; opacity: 0.3; }
                50% { transform: scaleX(1.2); transform-origin: left; opacity: 0.8; }
                100% { transform: scaleX(0.5); transform-origin: left; opacity: 0.3; }
            }
            
            @keyframes line-extend-2 {
                0% { transform: scaleX(0.5); transform-origin: right; opacity: 0.3; }
                60% { transform: scaleX(1.2); transform-origin: right; opacity: 0.8; }
                100% { transform: scaleX(0.5); transform-origin: right; opacity: 0.3; }
            }
        `;
        document.head.appendChild(shapeStyle);
    }
    
    heroSection.appendChild(shapesContainer);
}

/**
 * Create elegant data streams (replacing the original data stream function)
 */
function createElegantDataStreams() {
    const sections = document.querySelectorAll('.cta-section, .features-section');
    
    sections.forEach(section => {
        if (!section) return;
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        
        // Create data stream SVG
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '1';
        svg.style.opacity = '0.6';
        
        // Create linear gradients
        const defs = document.createElementNS(svgNS, 'defs');
        
        // Create gradient for data paths
        const gradient = document.createElementNS(svgNS, 'linearGradient');
        gradient.id = 'dataStreamGradient';
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', 'rgba(0, 243, 255, 0.7)');
        
        const stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', 'rgba(0, 180, 255, 0.4)');
        
        const stop3 = document.createElementNS(svgNS, 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', 'rgba(120, 0, 255, 0.7)');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svg.appendChild(defs);
        
        // Create data paths
        const pathCount = 3;
        for (let i = 0; i < pathCount; i++) {
            // Create flowing path
            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'url(#dataStreamGradient)');
            path.setAttribute('stroke-width', '1');
            
            // Different path for each data stream
            switch(i) {
                case 0:
                    path.setAttribute('d', 'M-100,50 Q150,180 300,100 T600,150');
                    path.style.opacity = '0.6';
                    break;
                case 1:
                    path.setAttribute('d', 'M-100,150 Q100,50 250,200 T600,250');
                    path.style.opacity = '0.4';
                    break;
                case 2:
                    path.setAttribute('d', 'M-100,200 Q200,100 350,250 T600,200');
                    path.style.opacity = '0.7';
                    break;
            }
            
            // Add dot animation along the path
            const circle = document.createElementNS(svgNS, 'circle');
            circle.setAttribute('r', '3');
            circle.setAttribute('fill', 'rgba(0, 243, 255, 0.9)');
            
            // Create motion path animation
            const animateMotion = document.createElementNS(svgNS, 'animateMotion');
            animateMotion.setAttribute('dur', `${8 + i * 2}s`);
            animateMotion.setAttribute('repeatCount', 'indefinite');
            animateMotion.setAttribute('path', path.getAttribute('d'));
            
            circle.appendChild(animateMotion);
            svg.appendChild(path);
            svg.appendChild(circle);
        }
        
        section.appendChild(svg);
    });
}
