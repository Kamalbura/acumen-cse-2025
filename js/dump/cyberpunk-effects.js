/**
 * Creates a Matrix digital rain effect in the specified container
 * @param {HTMLElement} container - The container element
 */
function createMatrixRain(container) {
  // Set up the canvas
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';
  container.appendChild(canvas);
  
  // Make sure container has relative positioning
  if (window.getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  
  const ctx = canvas.getContext('2d');
  
  // Define characters
  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Create drops - MOBILE OPTIMIZATION: Fewer columns on mobile
  const fontSize = 14;
  const isMobile = window.innerWidth < 768;
  const columnDensity = isMobile ? 2 : 1; // Less dense on mobile
  const columns = Math.ceil(canvas.width / (fontSize * columnDensity));
  const drops = [];
  
  // Initialize drop positions
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
  }
  
  // Check if we should continue animation
  let animationActive = true;
  let animationFrame;
  
  // Draw the matrix rain
  function draw() {
    if (!animationActive) return;
    
    // Semi-transparent black to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Green text
    ctx.fillStyle = '#0aff0a';
    ctx.font = fontSize + 'px monospace';
    
    // MOBILE OPTIMIZATION: Process fewer drops per frame
    const processLimit = isMobile ? drops.length / 2 : drops.length;
    const startIndex = Math.floor(Math.random() * drops.length / 2);
    
    // Loop through a subset of drops
    for (let i = startIndex; i < startIndex + processLimit && i < drops.length; i++) {
      const idx = i % drops.length;
      
      // Choose random character
      const char = chars[Math.floor(Math.random() * chars.length)];
      
      // Draw character
      ctx.fillText(char, idx * fontSize * columnDensity, drops[idx] * fontSize);
      
      // Move drop down
      if (drops[idx] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[idx] = 0;
      }
      drops[idx]++;
    }
    
    // MOBILE OPTIMIZATION: Reduce animation frame rate on mobile
    if (isMobile) {
      setTimeout(() => {
        animationFrame = requestAnimationFrame(draw);
      }, 50); // Limit to ~20fps on mobile
    } else {
      animationFrame = requestAnimationFrame(draw);
    }
  }
  
  // Handle visibility change to save resources
  document.addEventListener('visibilitychange', function() {
    animationActive = !document.hidden;
    if (animationActive) {
      if (!animationFrame) draw();
    } else {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  });
  
  // Handle scroll to pause animation during scroll
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!isMobile) return; // Only apply on mobile
    
    if (animationActive) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
      animationActive = false;
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      animationActive = true;
      if (!animationFrame) draw();
    }, 200);
  }, { passive: true });
  
  // Handle resize
  window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
      // Reload animation with new density if device type changes
      cancelAnimationFrame(animationFrame);
      drops.length = 0;
      
      // Update canvas dimensions
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Reinitialize with new settings
      const newColumnDensity = newIsMobile ? 2 : 1;
      const newColumns = Math.ceil(canvas.width / (fontSize * newColumnDensity));
      
      for (let i = 0; i < newColumns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
      }
      
      // Restart animation
      animationActive = true;
      draw();
    } else {
      // Just update dimensions
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
  });
  
  // Start animation
  draw();
  
  // MOBILE OPTIMIZATION: Don't even start on mobile if user has reduced motion preference
  if (isMobile && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(animationFrame);
    animationActive = false;
    
    // Replace with static effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1;
      
      ctx.fillStyle = `rgba(0, 255, 70, ${Math.random() * 0.5 + 0.2})`;
      ctx.fillRect(x, y, size, size);
    }
  }
}

/**
 * Adds circuit board SVG pattern animation to an element
 * @param {HTMLElement} element - The element to animate
 */
function addCircuitPattern(element) {
  // Create SVG pattern using dynamic generation
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.zIndex = '-1';
  svg.style.opacity = '0.07';
  svg.style.pointerEvents = 'none';
  
  // Create basic circuit pattern
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  pattern.setAttribute('id', 'circuit-pattern');
  pattern.setAttribute('width', '200');
  pattern.setAttribute('height', '200');
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  
  // Add circuit lines and nodes to pattern
  const pathsData = [
    'M10,10 L50,10 L50,50 L90,50 L90,90',
    'M110,10 L110,50 L150,50 L150,150',
    'M10,110 L50,110 L50,150 L90,150',
    'M110,110 L190,110 L190,190'
  ];
  
  const dotsData = [
    [10, 10], [50, 10], [50, 50], [90, 50], [90, 90],
    [110, 10], [110, 50], [150, 50], [150, 150],
    [10, 110], [50, 110], [50, 150], [90, 150],
    [110, 110], [190, 110], [190, 190]
  ];
  
  // Add paths
  pathsData.forEach(data => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', data);
    path.setAttribute('stroke', '#00f3ff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    pattern.appendChild(path);
  });
  
  // Add nodes
  dotsData.forEach(coord => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', coord[0]);
    circle.setAttribute('cy', coord[1]);
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#00f3ff');
    pattern.appendChild(circle);
  });
  
  // Apply pattern
  defs.appendChild(pattern);
  svg.appendChild(defs);
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', '100%');
  rect.setAttribute('height', '100%');
  rect.setAttribute('fill', 'url(#circuit-pattern)');
  svg.appendChild(rect);
  
  // Add to element
  element.style.position = 'relative';
  element.appendChild(svg);
  
  // Animate circuit pattern
  let shift = 0;
  function animateCircuit() {
    shift += 0.2;
    if (shift > 200) shift = 0;
    
    rect.setAttribute('transform', `translate(${shift}, ${shift/2})`);
    requestAnimationFrame(animateCircuit);
  }
  
  animateCircuit();
}

/**
 * Creates a data stream effect on an element
 * @param {HTMLElement} element - Container element
 * @param {number} streamCount - Number of data streams to create
 */
function createDataStreams(element, streamCount = 5) {
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  
  for (let i = 0; i < streamCount; i++) {
    const stream = document.createElement('div');
    stream.className = 'data-stream';
    
    // Random positioning
    stream.style.left = `${Math.random() * 100}%`;
    stream.style.height = `${30 + Math.random() * 50}%`;
    stream.style.width = '1px';
    stream.style.position = 'absolute';
    stream.style.background = 'linear-gradient(to bottom, transparent, #00f3ff, transparent)';
    stream.style.opacity = '0.3';
    
    // Random animation timing
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    
    stream.style.animation = `data-flow ${duration}s ${delay}s infinite linear`;
    
    element.appendChild(stream);
  }
}

/**
 * Apply terminal typing effect to text
 * @param {HTMLElement} element - Element containing text to animate
 * @param {number} speed - Typing speed in ms per character
 */
function terminalTypingEffect(element, speed = 50) {
  const text = element.textContent;
  element.textContent = '';
  element.style.borderRight = '2px solid #00f3ff';
  element.style.display = 'inline-block';
  element.style.whiteSpace = 'nowrap';
  element.style.overflow = 'hidden';
  element.classList.add('terminal-text');
  
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Blink cursor at end
      element.style.animation = 'blink 0.75s step-end infinite';
    }
  }
  
  // Use Intersection Observer to start animation when visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(type, 200);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
  } else {
    setTimeout(type, 200);
  }
}

/**
 * Initialize the cyberpunk effects on the page with mobile optimizations
 */
function initCyberpunkEffects() {
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth < 768;
  
  // Create matrix background in the designated container
  const matrixContainer = document.querySelector('.matrix-background');
  if (matrixContainer && (!isMobile || !window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    createMatrixRain(matrixContainer);
  }
  
  // Add circuit patterns only on desktop
  if (!isMobile) {
    document.querySelectorAll('.circuit-pattern').forEach(el => {
      addCircuitPattern(el);
    });
  }
  
  // Add data streams to containers - fewer on mobile
  document.querySelectorAll('.data-stream-container').forEach(el => {
    const streamCount = isMobile ? 2 : (parseInt(el.dataset.streamCount) || 5);
    createDataStreams(el, streamCount);
  });
  
  // Apply terminal typing effect - slower on mobile for better performance
  document.querySelectorAll('.terminal-typing').forEach(el => {
    const speed = isMobile ? 100 : (parseInt(el.dataset.speed) || 50);
    terminalTypingEffect(el, speed);
  });
  
  // Add glitch effect to text elements - not for mobile
  if (!isMobile) {
    document.querySelectorAll('.glitch-text').forEach(el => {
      if (!el.getAttribute('data-text')) {
        el.setAttribute('data-text', el.textContent);
      }
    });
  } else {
    // Replace with simple glow effect on mobile
    document.querySelectorAll('.glitch-text').forEach(el => {
      el.classList.add('mobile-glitch');
      el.classList.remove('glitch-text');
    });
    
    // Add stylesheet for mobile glitch
    const style = document.createElement('style');
    style.textContent = `
      .mobile-glitch {
        color: #fff;
        text-shadow: 0 0 10px var(--primary-color);
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize on DOM load with mobile awareness
document.addEventListener('DOMContentLoaded', function() {
  // Check both reduced motion preference and mobile status
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                  window.innerWidth < 768;
  
  if (!reducedMotion && (!isMobile || window.innerWidth >= 1024)) {
    // Full effects only on desktop with no reduced motion preference
    initCyberpunkEffects();
  } else if (!reducedMotion) {
    // Simplified effects on tablets or if not specifically requested reduced motion
    initSimplifiedCyberpunkEffects();
  } else {
    // No effects for reduced motion or mobile
    console.log('Reduced motion preference detected or mobile device. Skipping animations.');
  }
});

/**
 * Initialize simplified cyberpunk effects for mobile
 */
function initSimplifiedCyberpunkEffects() {
  // Just add some minimal effects
  document.querySelectorAll('.glitch-text').forEach(el => {
    el.classList.add('mobile-glitch');
    el.classList.remove('glitch-text');
  });
  
  // Add minimal glow to buttons
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.style.boxShadow = '0 0 10px var(--primary-color)';
  });
  
  // Apply simpler terminal typing to one element only
  const mainTerminal = document.querySelector('.hero .terminal-typing');
  if (mainTerminal) {
    terminalTypingEffect(mainTerminal, 80);
  }
}
