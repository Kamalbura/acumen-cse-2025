/**
 * Performance Monitor
 * Identifies and fixes performance bottlenecks
 */
(function() {
    // Configuration
    const config = {
        enableMonitoring: true,
        logTimings: true,
        disableHeavyAnimations: false,
        optimizeImages: true,
        deferNonEssential: true
    };
    
    // Track performance metrics
    const metrics = {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        interactionTimes: [],
        resourceLoadTimes: {}
    };
    
    // Initialize monitoring
    function init() {
        if (!config.enableMonitoring) return;
        
        // Track page load performance
        trackPageLoad();
        
        // Track resource loading
        trackResources();
        
        // Track user interactions
        trackInteractions();
        
        // Apply optimizations after DOM loaded
        document.addEventListener('DOMContentLoaded', applyOptimizations);
        
        // Final analysis after page is fully loaded
        window.addEventListener('load', analyzePerformance);
    }
    
    // Track basic page load metrics
    function trackPageLoad() {
        // Record navigation start time
        metrics.navigationStart = performance.timing.navigationStart;
        
        // Track first contentful paint
        const paintObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    metrics.firstContentfulPaint = entry.startTime;
                    if (config.logTimings) {
                        console.log(`First Contentful Paint: ${entry.startTime.toFixed(1)}ms`);
                    }
                }
            }
        });
        
        paintObserver.observe({type: 'paint', buffered: true});
    }
    
    // Track resource loading performance
    function trackResources() {
        // Create observer for resource timing entries
        const resourceObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                // Only track certain resource types
                if (entry.initiatorType === 'link' || 
                    entry.initiatorType === 'script' || 
                    entry.initiatorType === 'img') {
                    
                    const resource = entry.name.split('/').pop();
                    metrics.resourceLoadTimes[resource] = entry.duration;
                    
                    // Log slow resources (>300ms)
                    if (entry.duration > 300 && config.logTimings) {
                        console.warn(`Slow resource: ${resource} - ${entry.duration.toFixed(1)}ms`);
                    }
                }
            }
        });
        
        resourceObserver.observe({entryTypes: ['resource'], buffered: true});
    }
    
    // Track user interactions
    function trackInteractions() {
        // Track click response times
        document.addEventListener('click', (e) => {
            const start = performance.now();
            
            setTimeout(() => {
                const duration = performance.now() - start;
                metrics.interactionTimes.push(duration);
                
                // Log slow interactions (>100ms)
                if (duration > 100 && config.logTimings) {
                    console.warn(`Slow interaction response: ${duration.toFixed(1)}ms`);
                }
            }, 0);
        });
    }
    
    // Apply performance optimizations
    function applyOptimizations() {
        // Check device capabilities
        const isLowPowerDevice = detectLowPowerDevice();
        
        // Apply appropriate optimizations
        if (isLowPowerDevice) {
            document.body.classList.add('low-power-mode');
        }
        
        // Optimize images
        if (config.optimizeImages) {
            optimizeImages();
        }
        
        // Disable heavy animations if configured or on low-power devices
        if (config.disableHeavyAnimations || isLowPowerDevice) {
            disableHeavyAnimations();
        }
        
        // Defer non-essential resources
        if (config.deferNonEssential) {
            deferNonEssentialResources();
        }
    }
    
    // Check for low power device
    function detectLowPowerDevice() {
        // Check for low battery
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    document.body.classList.add('low-power-mode');
                    console.log('Low battery detected, enabling power-saving mode');
                    return true;
                }
            });
        }
        
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return true;
        }
        
        // Check hardware concurrency (proxy for CPU power)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
            return true;
        }
        
        // Check device memory API
        if ('deviceMemory' in navigator && navigator.deviceMemory <= 4) {
            return true;
        }
        
        // Check for mobile device as a fallback indicator
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Optimize images on the page
    function optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            // Skip already optimized images
            if (img.hasAttribute('data-optimized')) return;
            
            // Add lazy loading where not already specified
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add appropriate size attributes if missing
            if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                // When image loads, set width/height to prevent layout shifts
                img.onload = function() {
                    if (!this.hasAttribute('width')) {
                        this.setAttribute('width', this.naturalWidth);
                    }
                    if (!this.hasAttribute('height')) {
                        this.setAttribute('height', this.naturalHeight);
                    }
                };
            }
            
            // Mark as optimized
            img.setAttribute('data-optimized', 'true');
        });
    }
    
    // Disable heavy animations
    function disableHeavyAnimations() {
        // Add class to disable animations
        document.body.classList.add('reduce-animations');
        
        // Add style to disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
            .reduce-animations * {
                animation-duration: 0.001s !important;
                transition-duration: 0.001s !important;
            }
            
            .reduce-animations .glitch-text::before,
            .reduce-animations .glitch-text::after,
            .reduce-animations .digital-noise::before,
            .reduce-animations .matrix-bg {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Defer loading of non-essential resources
    function deferNonEssentialResources() {
        // Defer non-critical images
        document.querySelectorAll('img').forEach(img => {
            // Skip images that are in viewport or close to it
            if (isInViewport(img, 300)) return;
            
            // Replace with lazy loading version
            const origSrc = img.getAttribute('src');
            if (origSrc && !img.getAttribute('data-src')) {
                img.setAttribute('data-src', origSrc);
                img.removeAttribute('src');
                
                // Load when near viewport
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const target = entry.target;
                            target.src = target.getAttribute('data-src');
                            observer.unobserve(target);
                        }
                    });
                }, {rootMargin: '200px'});
                
                observer.observe(img);
            }
        });
        
        // Defer non-critical CSS
        document.querySelectorAll('link[rel="stylesheet"]:not([data-critical="true"])').forEach(link => {
            // Skip if already handled
            if (link.hasAttribute('data-deferred')) return;
            
            link.setAttribute('media', 'print');
            link.setAttribute('onload', "this.media='all'");
            link.setAttribute('data-deferred', 'true');
        });
    }
    
    // Check if element is in viewport (with optional margin)
    function isInViewport(element, margin = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom + margin >= 0 &&
            rect.right + margin >= 0 &&
            rect.top - margin <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left - margin <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Final analysis after page load
    function analyzePerformance() {
        // Calculate total page load time
        metrics.pageLoadTime = performance.now();
        
        if (config.logTimings) {
            console.log(`Total page load time: ${metrics.pageLoadTime.toFixed(1)}ms`);
            
            // Find slowest resources
            const sortedResources = Object.entries(metrics.resourceLoadTimes)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
                
            console.log('Top 5 slowest resources:');
            sortedResources.forEach(([resource, time]) => {
                console.log(`${resource}: ${time.toFixed(1)}ms`);
            });
        }
        
        // Add performance report to devtools console
        if (isDevMode()) {
            console.groupCollapsed('📊 Performance Report');
            console.log('Page Load Time:', metrics.pageLoadTime.toFixed(1) + 'ms');
            console.log('First Contentful Paint:', metrics.firstContentfulPaint.toFixed(1) + 'ms');
            console.log('Average Interaction Time:', 
                (metrics.interactionTimes.reduce((a, b) => a + b, 0) / 
                 Math.max(1, metrics.interactionTimes.length)).toFixed(1) + 'ms');
            console.groupEnd();
        }
    }
    
    // Helper to check if we're in dev mode
    function isDevMode() {
        return localStorage.getItem('devMode') === 'true' || 
              window.location.hostname === 'localhost' || 
              window.location.search.includes('debug=true');
    }
    
    // Initialize when script loads
    init();
})();
