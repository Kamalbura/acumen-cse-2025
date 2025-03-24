/**
 * Event Countdown Timer
 * Displays a dynamic countdown to the ACUMEN 2025 event date
 * Enhanced with cyberpunk visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set the event date - April 10, 2025
    const eventDate = new Date('April 10, 2025 09:00:00').getTime();
    
    // Create circuit lines in the background of countdown
    createCircuitLines();
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();
        
        // Calculate the time remaining
        const timeRemaining = eventDate - now;
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Get countdown elements
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        // Check if elements exist before updating
        if (daysElement && hoursElement && minutesElement && secondsElement) {
            // Add leading zeros if necessary
            daysElement.innerHTML = days < 10 ? '0' + days : days;
            hoursElement.innerHTML = hours < 10 ? '0' + hours : hours;
            minutesElement.innerHTML = minutes < 10 ? '0' + minutes : minutes;
            secondsElement.innerHTML = seconds < 10 ? '0' + seconds : seconds;
            
            // Add glitch effect occasionally
            addRandomGlitch(daysElement);
            addRandomGlitch(hoursElement);
            addRandomGlitch(minutesElement);
            addRandomGlitch(secondsElement);
            
            // Add digital flickering effect
            if (Math.random() > 0.992) {
                flickerDigit(secondsElement);
            }
            
            // Highlight changing seconds with glow effect
            highlightChangingDigit(secondsElement);
        }
        
        // If countdown is over
        if (timeRemaining < 0) {
            clearInterval(countdownTimer);
            
            // Update countdown to show zeros or "Event started" message
            if (daysElement) daysElement.innerHTML = '00';
            if (hoursElement) hoursElement.innerHTML = '00';
            if (minutesElement) minutesElement.innerHTML = '00';
            if (secondsElement) secondsElement.innerHTML = '00';
            
            // Update heading
            const countdownHeading = document.querySelector('.hero-countdown h2');
            if (countdownHeading) {
                countdownHeading.innerHTML = 'Event Has Started!';
                addGlitchAnimation(countdownHeading);
            }
        }
    }, 1000);
    
    /**
     * Add occasional glitch effect to countdown numbers
     * @param {HTMLElement} element - The countdown element to glitch
     */
    function addRandomGlitch(element) {
        // Only apply effect randomly (5% chance)
        if (Math.random() > 0.95) {
            element.classList.add('glitch-effect');
            
            // Remove glitch class after short delay
            setTimeout(() => {
                element.classList.remove('glitch-effect');
            }, 150);
        }
    }
    
    /**
     * Create circuit-like lines in the countdown background
     */
    function createCircuitLines() {
        const countdownBox = document.querySelector('.hero-countdown');
        if (!countdownBox) return;
        
        // Create canvas for circuit lines
        const circuitCanvas = document.createElement('canvas');
        circuitCanvas.className = 'circuit-canvas';
        circuitCanvas.style.position = 'absolute';
        circuitCanvas.style.top = '0';
        circuitCanvas.style.left = '0';
        circuitCanvas.style.width = '100%';
        circuitCanvas.style.height = '100%';
        circuitCanvas.style.zIndex = '-1';
        circuitCanvas.style.opacity = '0.15';
        
        countdownBox.appendChild(circuitCanvas);
        
        // Set canvas size
        function setCanvasSize() {
            circuitCanvas.width = countdownBox.offsetWidth;
            circuitCanvas.height = countdownBox.offsetHeight;
            drawCircuits();
        }
        
        // Draw circuit lines
        function drawCircuits() {
            const ctx = circuitCanvas.getContext('2d');
            ctx.clearRect(0, 0, circuitCanvas.width, circuitCanvas.height);
            
            // Draw horizontal and vertical lines
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.7)';
            ctx.lineWidth = 1;
            
            // Draw several random circuit paths
            for (let i = 0; i < 6; i++) {
                drawRandomCircuitPath(ctx, circuitCanvas.width, circuitCanvas.height);
            }
        }
        
        // Draw a random circuit path with 90-degree turns
        function drawRandomCircuitPath(ctx, width, height) {
            ctx.beginPath();
            
            // Start from a random edge point
            let x, y;
            const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            
            switch (edge) {
                case 0: // top
                    x = Math.random() * width;
                    y = 0;
                    break;
                case 1: // right
                    x = width;
                    y = Math.random() * height;
                    break;
                case 2: // bottom
                    x = Math.random() * width;
                    y = height;
                    break;
                case 3: // left
                    x = 0;
                    y = Math.random() * height;
                    break;
            }
            
            ctx.moveTo(x, y);
            
            // Create 3-7 segments with 90-degree turns
            let currentX = x;
            let currentY = y;
            const segments = 3 + Math.floor(Math.random() * 5);
            
            for (let i = 0; i < segments; i++) {
                // Decide whether to move horizontally or vertically
                if (Math.random() > 0.5) {
                    // Horizontal movement
                    currentX = Math.random() * width;
                    ctx.lineTo(currentX, currentY);
                } else {
                    // Vertical movement
                    currentY = Math.random() * height;
                    ctx.lineTo(currentX, currentY);
                }
                
                // Add a connector node at each turn
                ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
            }
            
            ctx.stroke();
        }
        
        // Initialize
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
    }
    
    /**
     * Add flickering effect to a digit
     * @param {HTMLElement} element - The element to flicker
     */
    function flickerDigit(element) {
        const originalText = element.textContent;
        const flickerSequence = [
            originalText, 
            '88', 
            originalText, 
            '--', 
            originalText, 
            '##',
            originalText
        ];
        
        let i = 0;
        const flickerEffect = setInterval(() => {
            element.textContent = flickerSequence[i];
            i++;
            
            if (i >= flickerSequence.length) {
                clearInterval(flickerEffect);
            }
        }, 50);
    }
    
    /**
     * Add glitch animation to an element
     * @param {HTMLElement} element - The element to animate
     */
    function addGlitchAnimation(element) {
        const originalText = element.textContent;
        element.setAttribute('data-text', originalText);
        element.classList.add('cyber-glitch-text');
        
        // Add necessary styles if not already present
        if (!document.getElementById('cyber-glitch-styles')) {
            const glitchStyle = document.createElement('style');
            glitchStyle.id = 'cyber-glitch-styles';
            glitchStyle.textContent = `
                .cyber-glitch-text {
                    position: relative;
                    animation: cyber-glitch 1s infinite;
                }
                
                .cyber-glitch-text::before,
                .cyber-glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                
                .cyber-glitch-text::before {
                    left: 2px;
                    text-shadow: -2px 0 #ff00ff;
                    clip: rect(24px, 550px, 90px, 0);
                    animation: cyber-glitch-anim-2 3s infinite linear alternate-reverse;
                }
                
                .cyber-glitch-text::after {
                    left: -2px;
                    text-shadow: -2px 0 #00ffff;
                    clip: rect(85px, 550px, 140px, 0);
                    animation: cyber-glitch-anim 2.5s infinite linear alternate-reverse;
                }
                
                @keyframes cyber-glitch {
                    2%, 64% { transform: translate(2px, 0); }
                    4%, 60% { transform: translate(-2px, 0); }
                    62% { transform: translate(0, 0); }
                }
                
                @keyframes cyber-glitch-anim {
                    0% { clip: rect(54px, 9999px, 56px, 0); }
                    20% { clip: rect(30px, 9999px, 36px, 0); }
                    40% { clip: rect(15px, 9999px, 15px, 0); }
                    60% { clip: rect(64px, 9999px, 67px, 0); }
                    80% { clip: rect(58px, 9999px, 98px, 0); }
                    100% { clip: rect(34px, 9999px, 59px, 0); }
                }
                
                @keyframes cyber-glitch-anim-2 {
                    0% { clip: rect(65px, 9999px, 119px, 0); }
                    20% { clip: rect(28px, 9999px, 29px, 0); }
                    40% { clip: rect(25px, 9999px, 57px, 0); }
                    60% { clip: rect(45px, 9999px, 79px, 0); }
                    80% { clip: rect(38px, 9999px, 135px, 0); }
                    100% { clip: rect(19px, 9999px, 49px, 0); }
                }
            `;
            document.head.appendChild(glitchStyle);
        }
    }
    
    /**
     * Highlight changing digits with a glow effect
     * @param {HTMLElement} element - The element that changes
     */
    function highlightChangingDigit(element) {
        element.style.transition = 'text-shadow 0.1s ease-in-out';
        element.style.textShadow = '0 0 20px var(--primary-color), 0 0 30px var(--primary-color)';
        
        setTimeout(() => {
            element.style.textShadow = '0 0 15px var(--primary-glow)';
        }, 200);
    }
});
