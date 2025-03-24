/**
 * Animation Performance Optimizer
 * Ensures smooth animations by using requestAnimationFrame and monitoring performance
 */

(function() {
    // Check if the browser supports requestAnimationFrame
    const requestAnimFrame = window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame;
    
    // Performance tracking
    let lastFrameTime = 0;
    let frameTimes = [];
    let lowPerformanceMode = false;
    
    // Check device capability
    const isLowPowerDevice = checkIfLowPowerDevice();
    
    // Initialize based on device capability
    if (isLowPowerDevice) {
        enableLowPerformanceMode();
    } else {
        // Start performance monitoring
        monitorPerformance();
    }
    
    /**
     * Check if current device is likely to be low power
     */
    function checkIfLowPowerDevice() {
        // Mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // If we can detect battery, check its status
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    enableLowPerformanceMode();
                }
            });
        }
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return isMobile || prefersReducedMotion;
    }
    
    /**
     * Enable low performance mode to reduce animation load
     */
    function enableLowPerformanceMode() {
        lowPerformanceMode = true;
        document.body.classList.add('low-performance-mode');
        console.log('Low performance mode enabled');
        
        // Disable intensive animations
        document.querySelectorAll('.particle-canvas, .data-stream').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        
        // Simplify other animations
        document.querySelectorAll('.glitch-text').forEach(el => {
            el.classList.add('simplified');
        });
        
        // Disable hover effects that might cause performance issues
        document.querySelectorAll('.cyber-card, .team-card, .event-card').forEach(card => {
            card.classList.add('no-hover-effect');
        });
    }
    
    /**
     * Monitor performance and adjust animation complexity if needed
     */
    function monitorPerformance() {
        // Skip if already in low performance mode
        if (lowPerformanceMode) return;
        
        // Setup animation frame counter
        let frameCount = 0;
        let lastTime = performance.now();
        
        function checkFrame(timestamp) {
            frameCount++;
            
            // Every second, check the frame rate
            if (timestamp - lastTime > 1000) {
                const fps = Math.round((frameCount * 1000) / (timestamp - lastTime));
                frameTimes.push(fps);
                
                // Keep only the last 5 measurements
                if (frameTimes.length > 5) {
                    frameTimes.shift();
                }
                
                // Calculate average FPS over the last measurements
                const avgFps = frameTimes.reduce((sum, val) => sum + val, 0) / frameTimes.length;
                
                // If consistently below 30 FPS, switch to low performance mode
                if (avgFps < 30 && frameTimes.length >= 3) {
                    enableLowPerformanceMode();
                    console.warn(`Low frame rate detected (${avgFps.toFixed(1)} FPS), reducing animations`);
                    return; // Stop monitoring
                }
                
                // Reset for next second
                frameCount = 0;
                lastTime = timestamp;
            }
            
            // Continue monitoring
            requestAnimFrame(checkFrame);
        }
        
        // Start monitoring
        requestAnimFrame(checkFrame);
    }
})();
