/**
 * Advanced Hover Effects
 * Adds engaging hover interactions to various elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Apply 3D tilt effect to cards
    applyTiltEffect();
    
    // 2. Text scrambling effect
    applyTextScrambleEffect();
    
    // 3. Magnetic buttons
    applyMagneticEffect();
    
    // 4. Glitch effect on images
    applyGlitchEffect();
    
    // 5. Data stream animation
    initDataStreams();
    
    /**
     * Apply 3D tilt effect to event and team cards
     */
    function applyTiltEffect() {
        const cards = document.querySelectorAll('.event-card, .team-card, .cyber-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleY = (x - centerX) / 15;
                const angleX = (centerY - y) / 15;
                
                this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                
                const glare = this.querySelector('.card-glare') || document.createElement('div');
                if (!glare.classList.contains('card-glare')) {
                    glare.classList.add('card-glare');
                    glare.style.position = 'absolute';
                    glare.style.width = '100%';
                    glare.style.height = '100%';
                    glare.style.top = '0';
                    glare.style.left = '0';
                    glare.style.pointerEvents = 'none';
                    this.appendChild(glare);
                }
                
                const glareX = x / rect.width * 100;
                const glareY = y / rect.height * 100;
                
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 243, 255, 0.15) 0%, rgba(0, 0, 0, 0) 80%)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                this.style.transition = 'transform 0.5s ease';
                
                const glare = this.querySelector('.card-glare');
                if (glare) glare.style.background = 'none';
            });
        });
    }
    
    /**
     * Add text scramble effect on hover
     */
    function applyTextScrambleEffect() {
        const scrambleElements = document.querySelectorAll('.scramble-text');
        
        scrambleElements.forEach(element => {
            // Store the original text
            const originalText = element.textContent;
            element.setAttribute('data-text', originalText);
            
            // Create a text scramble controller
            let isScrambling = false;
            let interval = null;
            
            // Scramble characters set
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            
            element.addEventListener('mouseenter', () => {
                if (isScrambling) return;
                isScrambling = true;
                element.classList.add('scrambling');
                
                let iterationCount = 0;
                const maxIterations = 10;
                
                interval = setInterval(() => {
                    const scrambledText = originalText.split('')
                        .map((char, index) => {
                            if (index < iterationCount / 2) return char;
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    element.textContent = scrambledText;
                    iterationCount++;
                    
                    if (iterationCount >= maxIterations) {
                        clearInterval(interval);
                        element.textContent = originalText;
                        isScrambling = false;
                        element.classList.remove('scrambling');
                    }
                }, 60);
            });
            
            element.addEventListener('mouseleave', () => {
                if (interval) clearInterval(interval);
                element.textContent = originalText;
                isScrambling = false;
                element.classList.remove('scrambling');
            });
        });
    }
    
    /**
     * Apply magnetic effect to buttons
     */
    function applyMagneticEffect() {
        const magneticElements = document.querySelectorAll('.btn-magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = x - centerX;
                const deltaY = y - centerY;
                
                const magneticPull = 10; // Adjust to control the magnetic pull strength
                
                this.style.transform = `translate(${deltaX / magneticPull}px, ${deltaY / magneticPull}px)`;
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0)';
                this.style.transition = 'transform 0.3s ease';
            });
        });
    }
    
    /**
     * Apply glitch effect to images on hover
     */
    function applyGlitchEffect() {
        const glitchImages = document.querySelectorAll('.glitch-image');
        
        glitchImages.forEach(image => {
            image.addEventListener('mouseenter', function() {
                // Create three layers for the glitch effect
                const wrapper = document.createElement('div');
                wrapper.className = 'glitch-wrapper';
                wrapper.style.position = 'absolute';
                wrapper.style.top = '0';
                wrapper.style.left = '0';
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
                wrapper.style.overflow = 'hidden';
                wrapper.style.zIndex = '2';
                
                // Create different color channel layers
                const layers = ['red', 'green', 'blue'];
                layers.forEach((color, index) => {
                    const layer = document.createElement('div');
                    layer.className = `glitch-layer glitch-layer-${color}`;
                    layer.style.position = 'absolute';
                    layer.style.top = '0';
                    layer.style.left = '0';
                    layer.style.width = '100%';
                    layer.style.height = '100%';
                    layer.style.backgroundImage = `url(${image.src})`;
                    layer.style.backgroundSize = 'cover';
                    layer.style.backgroundPosition = 'center';
                    layer.style.mixBlendMode = 'multiply';
                    
                    // Set different filters for each layer
                    if (color === 'red') {
                        layer.style.filter = 'url(#glitch-red) blur(1px)';
                        layer.style.animation = 'glitch-anim-1 2s infinite linear alternate';
                    } else if (color === 'green') {
                        layer.style.filter = 'url(#glitch-green) blur(1px)';
                        layer.style.animation = 'glitch-anim-2 3s infinite linear alternate-reverse';
                    } else {
                        layer.style.filter = 'url(#glitch-blue) blur(1px)';
                        layer.style.animation = 'glitch-anim-3 2.5s infinite linear alternate';
                    }
                    
                    wrapper.appendChild(layer);
                });
                
                // Only add the wrapper if it doesn't already exist
                if (!image.parentNode.querySelector('.glitch-wrapper')) {
                    // Container needs position relative
                    if (window.getComputedStyle(image.parentNode).position === 'static') {
                        image.parentNode.style.position = 'relative';
                    }
                    
                    image.parentNode.appendChild(wrapper);
                }
            });
            
            image.addEventListener('mouseleave', function() {
                const wrapper = image.parentNode.querySelector('.glitch-wrapper');
                if (wrapper) {
                    image.parentNode.removeChild(wrapper);
                }
            });
        });
        
        // Add CSS animations for glitch effect
        if (!document.getElementById('glitch-animations')) {
            const style = document.createElement('style');
            style.id = 'glitch-animations';
            style.textContent = `
                @keyframes glitch-anim-1 {
                    0% { transform: translate(0, 0); }
                    20% { transform: translate(-3px, 3px); }
                    40% { transform: translate(-3px, -3px); }
                    60% { transform: translate(3px, 3px); }
                    80% { transform: translate(3px, -3px); }
                    100% { transform: translate(0, 0); }
                }
                
                @keyframes glitch-anim-2 {
                    0% { transform: translate(0, 0); }
                    20% { transform: translate(3px, 1px); }
                    40% { transform: translate(1px, -3px); }
                    60% { transform: translate(-3px, 1px); }
                    80% { transform: translate(-1px, -1px); }
                    100% { transform: translate(0, 0); }
                }
                
                @keyframes glitch-anim-3 {
                    0% { transform: translate(0, 0); }
                    20% { transform: translate(1px, -1px); }
                    40% { transform: translate(2px, 2px); }
                    60% { transform: translate(-2px, 1px); }
                    80% { transform: translate(-1px, -2px); }
                    100% { transform: translate(0, 0); }
                }
            `;
            document.head.appendChild(style);
            
            // Add SVG filters for glitch effect
            const svgFilters = document.createElement('div');
            svgFilters.style.height = '0';
            svgFilters.style.width = '0';
            svgFilters.style.position = 'absolute';
            svgFilters.style.overflow = 'hidden';
            svgFilters.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <filter id="glitch-red">
                        <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0
                                    0 0 0 0 0
                                    0 0 0 0 0
                                    0 0 0 1 0"
                        />
                    </filter>
                    <filter id="glitch-green">
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0
                                    0 1 0 0 0
                                    0 0 0 0 0
                                    0 0 0 1 0"
                        />
                    </filter>
                    <filter id="glitch-blue">
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0
                                    0 0 0 0 0
                                    0 0 1 0 0
                                    0 0 0 1 0"
                        />
                    </filter>
                </svg>
            `;
            document.body.appendChild(svgFilters);
        }
    }
    
    /**
     * Initialize data stream animations
     */
    function initDataStreams() {
        const dataElements = document.querySelectorAll('.datastream-container');
        
        dataElements.forEach(container => {
            // Create random number of data streams
            const numStreams = Math.floor(Math.random() * 5) + 3;
            
            // Create the streams
            for (let i = 0; i < numStreams; i++) {
                createDataStream(container);
            }
        });
        
        function createDataStream(container) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.position = 'absolute';
            stream.style.top = Math.random() * 100 + '%';
            stream.style.left = Math.random() * 100 + '%';
            stream.style.width = '1px';
            stream.style.height = Math.floor(Math.random() * 40 + 10) + 'px';
            stream.style.background = 'var(--primary-color)';
            stream.style.boxShadow = '0 0 5px var(--primary-color)';
            stream.style.opacity = Math.random() * 0.5 + 0.2;
            stream.style.zIndex = '1';
            
            // Animation duration
            const duration = Math.random() * 3 + 2;
            stream.style.animation = `dataStreamFall ${duration}s linear infinite`;
            
            container.appendChild(stream);
            
            // Create animation if it doesn't exist
            if (!document.getElementById('data-stream-animation')) {
                const style = document.createElement('style');
                style.id = 'data-stream-animation';
                style.textContent = `
                    @keyframes dataStreamFall {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(1000%); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
});
