/**
 * Visual Enhancements
 * Fallback script for visual effects
 */
(function() {
    console.log('🎨 Loading visual enhancements');
    
    // Add subtle animations to elements
    document.addEventListener('DOMContentLoaded', function() {
        // Add glow effect to primary elements
        document.querySelectorAll('.btn-primary, .section-title span, .glitch-text').forEach(el => {
            el.style.animation = 'glow 2s infinite alternate';
        });
        
        // Add subtle animations to event cards
        document.querySelectorAll('.event-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        });
        
        // Add necessary CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glow {
                from { text-shadow: 0 0 5px rgba(0, 243, 255, 0.5); }
                to { text-shadow: 0 0 15px rgba(0, 243, 255, 0.8); }
            }
            
            @keyframes fadeInUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    });
    
    // Create a placeholder for the event image if needed
    if (document.querySelector('.about-image img')) {
        const aboutImg = document.querySelector('.about-image img');
        aboutImg.onerror = function() {
            this.src = createPlaceholderImage('About Acumen', 400, 300);
        };
    }
    
    // Helper function to create a placeholder image
    function createPlaceholderImage(text, width, height) {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="#0a0a1b"/>
                <rect x="5" y="5" width="${width-10}" height="${height-10}" fill="none" stroke="#00f3ff" stroke-width="2"/>
                <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#00f3ff" text-anchor="middle">
                    ${text}
                </text>
            </svg>
        `;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
})();
