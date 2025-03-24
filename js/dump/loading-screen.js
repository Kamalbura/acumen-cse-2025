/**
 * Cyberpunk Loading Screen
 * Creates an immersive loading experience while the site loads
 */

// Create and inject loading screen as early as possible
(function createLoadingScreen() {
    // Create loading screen elements
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <img src="img/acumen-logo.png" alt="ACUMEN Logo">
                <div class="logo-glitch"></div>
                <div class="logo-glitch"></div>
            </div>
            <div class="loading-progress-container">
                <div class="loading-progress-bar" id="loading-progress"></div>
            </div>
            <div class="loading-text">INITIALIZING SYSTEM</div>
            <div class="loading-percentage">0%</div>
        </div>
    `;
    
    // Add style to prevent flickering during load
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #0a0a1b !important;
        }
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0a0a1b;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        .loading-screen.hide {
            opacity: 0;
            visibility: hidden;
        }
        .page-content {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .page-content.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Inject into document as first body child
    document.body.insertBefore(loadingScreen, document.body.firstChild);
    
    // Create wrapper for page content to control visibility
    window.addEventListener('DOMContentLoaded', function() {
        // Wrap all content except loading screen in page-content div
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';
        
        // Move all body children except loading screen into wrapper
        const children = Array.from(document.body.children);
        children.forEach(child => {
            if (!child.classList.contains('loading-screen') && child !== pageContent) {
                pageContent.appendChild(child);
            }
        });
        
        document.body.appendChild(pageContent);
    });
    
    // Create data stream elements for background effect
    for (let i = 0; i < 10; i++) {
        createDataStream(loadingScreen);
    }
    
    // Helper function to create data streams
    function createDataStream(parent) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        
        const height = Math.floor(Math.random() * 100) + 50;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const leftPos = Math.random() * 100;
        
        stream.style.height = `${height}px`;
        stream.style.left = `${leftPos}%`;
        stream.style.top = `-${height}px`;
        stream.style.opacity = Math.random() * 0.5 + 0.1;
        stream.style.animation = `stream-fall ${duration}s ${delay}s linear infinite`;
        
        parent.appendChild(stream);
    }
    
    // Add animation style
    document.head.appendChild(style);
})();

// Main loading functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get loading screen elements
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const loadingText = document.querySelector('.loading-text');
    const pageContent = document.querySelector('.page-content');
    
    if (!loadingScreen || !loadingProgress) return;
    
    // Loading messages
    const loadingMessages = [
        'INITIALIZING SYSTEM',
        'CALIBRATING INTERFACE',
        'LOADING COMPONENTS',
        'CONNECTING TO NETWORK',
        'RENDERING CYBERPUNK ELEMENTS',
        'FINALIZING STARTUP'
    ];
    
    // Track loading progress
    let progress = 0;
    let resourcesLoaded = 0;
    let totalResources = 0;
    
    // Count images and other resources
    totalResources = document.querySelectorAll('img').length + 
                    document.querySelectorAll('script').length +
                    document.querySelectorAll('link[rel="stylesheet"]').length;
    
    // Ensure some minimum resources to track
    totalResources = Math.max(totalResources, 10);
    
    // Update progress based on resources loaded
    function updateProgress(increment) {
        resourcesLoaded += increment;
        
        // Calculate progress percentage, max 100
        const newProgress = Math.min(Math.floor((resourcesLoaded / totalResources) * 100), 100);
        
        if (newProgress > progress) {
            progress = newProgress;
            
            // Update progress bar width
            loadingProgress.style.width = `${progress}%`;
            
            // Update percentage text
            loadingPercentage.textContent = `${progress}%`;
            
            // Update loading message
            const messageIndex = Math.min(Math.floor(progress / 20), loadingMessages.length - 1);
            loadingText.textContent = loadingMessages[messageIndex];
            
            // When complete (or almost complete), hide the loading screen
            if (progress >= 100) {
                setTimeout(() => {
                    if (pageContent) {
                        pageContent.classList.add('loaded');
                    }
                    
                    loadingScreen.classList.add('hide');
                    
                    // Remove loading screen after transition
                    setTimeout(() => {
                        if (loadingScreen.parentNode) {
                            loadingScreen.remove();
                        }
                    }, 500);
                }, 300);
            }
        }
    }
    
    // Start with some initial progress
    updateProgress(1);
    
    // Track image loading
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            updateProgress(1);
        } else {
            img.addEventListener('load', () => updateProgress(1));
            img.addEventListener('error', () => updateProgress(1));
        }
    });
    
    // Simulate loading for scripts and CSS
    document.querySelectorAll('script, link[rel="stylesheet"]').forEach(() => {
        setTimeout(() => updateProgress(1), Math.random() * 500);
    });
    
    // Ensure loading screen is removed after a timeout (in case of issues)
    setTimeout(() => {
        if (pageContent) {
            pageContent.classList.add('loaded');
        }
        
        if (loadingScreen && loadingScreen.parentNode) {
            loadingScreen.classList.add('hide');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }
    }, 5000);
});

// Add page transition effects when navigating
document.addEventListener('DOMContentLoaded', function() {
    // Find all internal links
    document.querySelectorAll('a').forEach(link => {
        // Only process internal links that go to other pages
        const href = link.getAttribute('href');
        if (href && href.indexOf('#') !== 0 && 
            href.indexOf('http') !== 0 && 
            href.indexOf('mailto:') !== 0 && 
            href.indexOf('tel:') !== 0) {
            
            link.addEventListener('click', function(e) {
                // Get the destination URL
                const destUrl = this.getAttribute('href');
                
                // Only process if it's not the current page
                if (destUrl && destUrl !== window.location.pathname) {
                    e.preventDefault();
                    
                    // Create transition overlay
                    const transitionOverlay = document.createElement('div');
                    transitionOverlay.className = 'page-transition-overlay';
                    transitionOverlay.innerHTML = `
                        <div class="transition-content">
                            <div class="transition-progress"></div>
                            <div class="transition-text">LOADING...</div>
                        </div>
                    `;
                    
                    document.body.appendChild(transitionOverlay);
                    
                    // Add overlay styles
                    const style = document.createElement('style');
                    style.textContent = `
                        .page-transition-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.9);
                            z-index: 9999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        }
                        
                        .transition-content {
                            text-align: center;
                        }
                        
                        .transition-progress {
                            width: 150px;
                            height: 3px;
                            background: rgba(0, 243, 255, 0.2);
                            margin-bottom: 15px;
                            position: relative;
                            overflow: hidden;
                        }
                        
                        .transition-progress::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: var(--primary-color, #00f3ff);
                            animation: progress-slide 1s ease infinite;
                        }
                        
                        .transition-text {
                            color: var(--primary-color, #00f3ff);
                            font-family: 'Orbitron', sans-serif;
                            font-size: 14px;
                            letter-spacing: 2px;
                        }
                        
                        @keyframes progress-slide {
                            0% { left: -100%; }
                            100% { left: 100%; }
                        }
                    `;
                    
                    document.head.appendChild(style);
                    
                    // Fade in overlay
                    setTimeout(() => {
                        transitionOverlay.style.opacity = '1';
                        
                        // Navigate after short delay
                        setTimeout(() => {
                            window.location.href = destUrl;
                        }, 500);
                    }, 10);
                }
            });
        }
    });
});
