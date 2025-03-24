/**
 * Unified Performance Manager
 * Handles all performance optimizations in a coordinated way
 */

const PerformanceManager = (function() {
    // Device and capability detection
    const settings = {
        isTouch: 'ontouchstart' in window,
        isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isLowPower: false,
        isScrolling: false,
        fpsThreshold: 30,
        performanceMode: 'auto' // 'auto', 'high', 'medium', 'low'
    };
    
    // Initialize performance manager
    function init() {
        console.log('🚀 Initializing Performance Manager');
        
        // Detect capabilities
        detectCapabilities();
        
        // Apply initial optimizations
        applyOptimizations();
        
        // Set up event listeners
        setupEventListeners();
        
        // Monitor performance if not in low power mode
        if (!settings.isLowPower) {
            monitorPerformance();
        }
    }
    
    /**
     * Detect device capabilities
     */
    function detectCapabilities() {
        // Check URL parameters first (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        const perfMode = urlParams.get('performance');
        
        if (perfMode) {
            settings.performanceMode = perfMode;
            settings.isLowPower = (perfMode === 'low');
            return;
        }
        
        // Mobile devices default to low power
        if (settings.isTouch || settings.isReducedMotion) {
            settings.isLowPower = true;
            return;
        }
        
        // Check battery status if available
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    settings.isLowPower = true;
                    applyLowPowerMode();
                }
            }).catch(() => {});
        }
        
        // Simple performance test
        performQuickPerfTest();
    }
    
    /**
     * Quick performance test
     */
    function performQuickPerfTest() {
        const start = performance.now();
        let count = 0;
        
        // Simple stress test
        for (let i = 0; i < 10000; i++) {
            count += Math.sqrt(i);
        }
        
        const duration = performance.now() - start;
        
        // If test takes too long, device might be low-powered
        if (duration > 50) {
            settings.isLowPower = true;
        }
    }
    
    /**
     * Apply optimizations based on detected capabilities
     */
    function applyOptimizations() {
        // Apply low power mode if needed
        if (settings.isLowPower) {
            applyLowPowerMode();
            return;
        }
        
        // Optimize animations
        optimizeAnimations();
        
        // Optimize hover effects
        optimizeHoverEffects();
        
        // Disable custom cursor (major source of performance issues)
        disableCustomCursor();
    }
    
    /**
     * Set up scroll and resize event listeners
     */
    function setupEventListeners() {
        // Handle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (!settings.isScrolling) {
                settings.isScrolling = true;
                document.documentElement.classList.add('is-scrolling');
                pauseHeavyAnimations();
            }
            
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(function() {
                settings.isScrolling = false;
                document.documentElement.classList.remove('is-scrolling');
                resumeHeavyAnimations();
            }, 100);
        }, { passive: true });
        
        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(function() {
                // Adjust elements that depend on window size
                adjustElements();
            }, 200);
        }, { passive: true });
    }
    
    /**
     * Apply low power mode optimizations
     */
    function applyLowPowerMode() {
        console.log('📉 Applying low power mode optimizations');
        document.body.classList.add('low-power-mode');
        
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            .low-power-mode .glitch-text::before,
            .low-power-mode .glitch-text::after,
            .low-power-mode .matrix-bg::before,
            .low-power-mode .digital-noise::before,
            .low-power-mode .btn::before,
            .low-power-mode .hologram::before,
            .low-power-mode [class*="hover-"]::before,
            .low-power-mode [class*="hover-"]::after,
            .low-power-mode .cursor-dot,
            .low-power-mode .cursor-outline {
                display: none !important;
                animation: none !important;
            }
            
            .low-power-mode .event-card:hover,
            .low-power-mode .team-card:hover,
            .low-power-mode .cyber-card:hover,
            .low-power-mode .btn:hover {
                transform: none !important;
                box-shadow: 0 5px 10px rgba(0, 243, 255, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
        
        // Remove particle canvases
        document.querySelectorAll('.particle-canvas').forEach(canvas => {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        });
    }
    
    /**
     * Optimize animations for better performance
     */
    function optimizeAnimations() {
        const animatedElements = document.querySelectorAll(
            '.glitch-text, .matrix-bg, .digital-noise, .datastream-container'
        );
        
        // Only animate elements in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe all animated elements
        animatedElements.forEach(el => observer.observe(el));
        
        // Add style to only animate visible elements
        const style = document.createElement('style');
        style.textContent = `
            .glitch-text:not(.animate)::before,
            .glitch-text:not(.animate)::after,
            .matrix-bg:not(.animate)::before,
            .digital-noise:not(.animate)::before,
            .datastream-container:not(.animate) .data-stream {
                animation-play-state: paused !important;
                visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Optimize hover effects for better performance
     */
    function optimizeHoverEffects() {
        // Add simpler hover effects for better performance
        const style = document.createElement('style');
        style.textContent = `
            .event-card:hover,
            .team-card:hover,
            .cyber-card:hover {
                transform: translateY(-5px) !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
                box-shadow: 0 10px 20px rgba(0, 243, 255, 0.2) !important;
            }
            
            .is-scrolling .event-card,
            .is-scrolling .team-card,
            .is-scrolling .cyber-card,
            .is-scrolling .btn {
                transition: none !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Disable custom cursor effects
     */
    function disableCustomCursor() {
        // Remove cursor elements
        document.querySelectorAll('.cursor-dot, .cursor-outline').forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // Remove custom cursor classes
        document.body.classList.remove('custom-cursor-active');
        
        // Add styles to ensure normal cursor behavior
        const style = document.createElement('style');
        style.textContent = `
            body {
                cursor: auto !important;
            }
            
            a, button, .btn, .interactive, input[type="submit"] {
                cursor: pointer !important;
            }
            
            .cursor-dot, .cursor-outline {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Monitor performance and adjust if needed
     */
    function monitorPerformance() {
        // Only monitor if not already in low power mode
        if (settings.isLowPower) return;
        
        let frameCount = 0;
        let lastFrameTime = performance.now();
        let fpsArray = [];
        
        function checkFrame() {
            const now = performance.now();
            frameCount++;
            
            // Calculate FPS every second
            if (now - lastFrameTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (now - lastFrameTime));
                fpsArray.push(fps);
                
                // Keep last 5 FPS readings
                if (fpsArray.length > 5) {
                    fpsArray.shift();
                }
                
                // Calculate average FPS
                const avgFps = fpsArray.reduce((a, b) => a + b, 0) / fpsArray.length;
                
                // If FPS is consistently below threshold, switch to low power mode
                if (fpsArray.length >= 3 && avgFps < settings.fpsThreshold) {
                    settings.isLowPower = true;
                    applyLowPowerMode();
                    return; // Stop monitoring
                }
                
                // Reset counters
                frameCount = 0;
                lastFrameTime = now;
            }
            
            // Continue monitoring
            requestAnimationFrame(checkFrame);
        }
        
        // Start monitoring
        requestAnimationFrame(checkFrame);
    }
    
    /**
     * Pause heavy animations during scroll
     */
    function pauseHeavyAnimations() {
        document.querySelectorAll('.particle-canvas, .glitch-text, .matrix-bg').forEach(el => {
            el.classList.add('paused');
        });
    }
    
    /**
     * Resume animations after scroll
     */
    function resumeHeavyAnimations() {
        // Small delay before resuming
        setTimeout(() => {
            document.querySelectorAll('.paused').forEach(el => {
                el.classList.remove('paused');
            });
        }, 50);
    }
    
    /**
     * Adjust elements after resize
     */
    function adjustElements() {
        // Fix event card heights
        document.querySelectorAll('.event-card').forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                img.style.aspectRatio = '16/9';
            }
        });
    }
    
    // Public API
    return {
        init,
        isLowPower: () => settings.isLowPower,
        isScrolling: () => settings.isScrolling
    };
})();

// Initialize Performance Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', PerformanceManager.init);
