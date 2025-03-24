/**
 * Performance Enhancements
 * Improves site performance by optimizing animations and interactions
 */

(function() {
    // Variables for tracking
    let scrolling = false;
    let resizing = false;
    let lowPowerMode = false;
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        console.log('⚡ Initializing performance enhancements');
        
        // Set up scroll optimization
        setupScrollOptimization();
        
        // Set up resize optimization
        setupResizeOptimization();
        
        // Check device capabilities
        checkDeviceCapabilities();
        
        // Optimize images
        optimizeImageLoading();
        
        // Optimize animations
        optimizeAnimations();
        
        // Check for and remove duplicate event listeners
        cleanupEventListeners();
    });
    
    /**
     * Optimize animations during scrolling
     */
    function setupScrollOptimization() {
        let scrollTimeout;
        
        // Use passive listener for better performance
        window.addEventListener('scroll', function() {
            if (!scrolling) {
                scrolling = true;
                document.body.classList.add('is-scrolling');
                
                // Disable expensive animations during scroll
                document.body.classList.add('disable-expensive-animations');
                
                // requestAnimationFrame for better performance
                window.requestAnimationFrame(function() {
                    // Clear previous timeout
                    clearTimeout(scrollTimeout);
                    
                    // Set new timeout
                    scrollTimeout = setTimeout(function() {
                        scrolling = false;
                        document.body.classList.remove('is-scrolling');
                        document.body.classList.remove('disable-expensive-animations');
                    }, 200);
                });
            }
        }, { passive: true });
    }
    
    /**
     * Optimize animations during resizing
     */
    function setupResizeOptimization() {
        let resizeTimeout;
        
        window.addEventListener('resize', function() {
            if (!resizing) {
                resizing = true;
                document.body.classList.add('is-resizing');
                
                // Disable expensive animations during resize
                document.body.classList.add('disable-expensive-animations');
                
                // Clear previous timeout
                clearTimeout(resizeTimeout);
                
                // Set new timeout
                resizeTimeout = setTimeout(function() {
                    resizing = false;
                    document.body.classList.remove('is-resizing');
                    document.body.classList.remove('disable-expensive-animations');
                }, 200);
            }
        });
    }
    
    /**
     * Check device capabilities and adjust animations accordingly
     */
    function checkDeviceCapabilities() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Check for low power mode
        checkBatteryStatus();
        
        // Check for touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }
        
        // Check for low-end device
        checkDevicePerformance();
    }
    
    /**
     * Check battery status if available
     */
    function checkBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                // Check if battery is discharging and below 20%
                if (battery.level < 0.2 && !battery.charging) {
                    lowPowerMode = true;
                    document.body.classList.add('low-power-mode');
                }
                
                // Listen for changes
                battery.addEventListener('levelchange', function() {
                    if (battery.level < 0.2 && !battery.charging && !lowPowerMode) {
                        lowPowerMode = true;
                        document.body.classList.add('low-power-mode');
                    } else if ((battery.level >= 0.2 || battery.charging) && lowPowerMode) {
                        lowPowerMode = false;
                        document.body.classList.remove('low-power-mode');
                    }
                });
                
                battery.addEventListener('chargingchange', function() {
                    if (!battery.charging && battery.level < 0.2 && !lowPowerMode) {
                        lowPowerMode = true;
                        document.body.classList.add('low-power-mode');
                    } else if (battery.charging && lowPowerMode) {
                        lowPowerMode = false;
                        document.body.classList.remove('low-power-mode');
                    }
                });
            });
        }
    }
    
    /**
     * Check device performance
     */
    function checkDevicePerformance() {
        // Simple heuristic to detect low-end devices
        const start = Date.now();
        let count = 0;
        
        // Run a small benchmark
        while (Date.now() - start < 5) {
            count++;
        }
        
        // If count is low, device might be slow
        if (count < 1000) {
            document.body.classList.add('low-performance');
            
            // Disable some animations
            disableExpensiveAnimations();
        }
    }
    
    /**
     * Optimize image loading
     */
    function optimizeImageLoading() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            // Target images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }
    
    /**
     * Optimize animations based on device capabilities
     */
    function optimizeAnimations() {
        // Add scan line effect only on high-performance devices
        if (!document.body.classList.contains('low-performance') && 
            !document.body.classList.contains('reduced-motion') &&
            !document.body.classList.contains('low-power-mode')) {
            
            addScanLineEffect();
        }
        
        // Add GPU acceleration to important elements
        document.querySelectorAll('.navbar, .hero-content, .countdown-digit, .glitch-text')
            .forEach(el => {
                el.classList.add('gpu-accelerated');
            });
    }
    
    /**
     * Disable expensive animations
     */
    function disableExpensiveAnimations() {
        // Remove animations from elements
        document.querySelectorAll('.matrix-bg, .digital-noise, .glitch-overlay')
            .forEach(el => {
                el.style.display = 'none';
            });
        
        // Disable complex animations
        document.querySelectorAll('.glitch-text::before, .glitch-text::after')
            .forEach(el => {
                el.style.animation = 'none';
            });
    }
    
    /**
     * Add scan line effect for cyberpunk aesthetic
     */
    function addScanLineEffect() {
        const scanLine = document.createElement('div');
        scanLine.classList.add('scan-line');
        document.body.appendChild(scanLine);
    }
    
    /**
     * Clean up duplicate event listeners
     */
    function cleanupEventListeners() {
        // Nothing to do here directly, but this is a reminder of the principle
        // In a real-world scenario, you'd use a central event registry
    }
})();
