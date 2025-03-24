document.addEventListener('DOMContentLoaded', function() {
    // Create cursor elements
    const cursorOuter = document.createElement('div');
    const cursorInner = document.createElement('div');
    
    cursorOuter.className = 'cursor-outer';
    cursorInner.className = 'cursor-inner';
    
    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);
    
    // Position variables
    let mouseX = 0;
    let mouseY = 0;
    let cursorOuterX = 0;
    let cursorOuterY = 0;
    let cursorInnerX = 0;
    let cursorInnerY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor
    const animate = () => {
        // Smooth follow for outer cursor
        cursorOuterX += (mouseX - cursorOuterX) * 0.1;
        cursorOuterY += (mouseY - cursorOuterY) * 0.1;
        
        // Direct position for inner cursor
        cursorInnerX = mouseX;
        cursorInnerY = mouseY;
        
        // Apply positions
        cursorOuter.style.transform = `translate(${cursorOuterX}px, ${cursorOuterY}px)`;
        cursorInner.style.transform = `translate(${cursorInnerX}px, ${cursorInnerY}px)`;
        
        // Continue animation
        requestAnimationFrame(animate);
    };
    animate();
    
    // Add hover effect for clickable elements
    const hoverElements = document.querySelectorAll('a, button, .event-card, .social-icon, .nav-toggle');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursorOuter.classList.add('cursor-hover');
            cursorInner.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursorOuter.classList.remove('cursor-hover');
            cursorInner.classList.remove('cursor-hover');
        });
    });
    
    // Hide cursor when mouse leaves the window
    document.addEventListener('mouseout', function(e) {
        if (e.relatedTarget == null || e.relatedTarget.nodeName === 'HTML') {
            cursorOuter.style.opacity = '0';
            cursorInner.style.opacity = '0';
        }
    });
    
    document.addEventListener('mouseover', function() {
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });
});
