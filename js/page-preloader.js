/**
 * Preloader script to prevent white flash on page load
 * This script ensures critical styles are applied before content is visible
 */
(function() {
  // Add a preloader element to the page
  const preloader = document.createElement('div');
  preloader.id = 'page-preloader';
  preloader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #050510;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.5s ease-in-out;
  `;
  
  // Add a loading spinner
  const spinner = document.createElement('div');
  spinner.className = 'preloader-spinner';
  spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 4px solid rgba(0, 243, 255, 0.3);
    border-radius: 50%;
    border-top-color: #00f3ff;
    animation: spin 1s linear infinite;
  `;
  
  // Add animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Add spinner to preloader
  preloader.appendChild(spinner);
  
  // Add to document as early as possible
  if (document.body) {
    document.body.appendChild(preloader);
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(preloader);
    });
  }
  
  // Hide preloader when page is fully loaded
  window.addEventListener('load', function() {
    // Give a slight delay to ensure all resources are processed
    setTimeout(function() {
      preloader.style.opacity = '0';
      // Remove from DOM after transition completes
      setTimeout(function() {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 500);
    }, 300);
  });
})();
