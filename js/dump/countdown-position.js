/**
 * Ensures proper positioning of countdown timer
 */
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle hero layout adjustments
  const adjustHeroLayout = () => {
    const heroContainer = document.querySelector('.hero-container');
    const countdownContainer = document.querySelector('.countdown-container');
    
    if (!heroContainer || !countdownContainer) return;
    
    // Add glow effect to countdown container on load
    countdownContainer.style.animation = 'pulse-glow 3s infinite alternate';
    
    // Create style for animation if it doesn't exist
    if (!document.getElementById('countdown-animation')) {
      const style = document.createElement('style');
      style.id = 'countdown-animation';
      style.textContent = `
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); }
          100% { box-shadow: 0 0 20px rgba(0, 243, 255, 0.5), 0 0 30px rgba(0, 243, 255, 0.3); }
        }
      `;
      document.head.appendChild(style);
    }
  };
  
  // Initialize and call on window resize
  adjustHeroLayout();
  window.addEventListener('resize', adjustHeroLayout);
});
