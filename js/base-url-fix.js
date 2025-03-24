// This script helps resolve path issues when deployed to GitHub Pages
(function() {
  const basePath = document.location.hostname.includes('github.io') 
    ? '/' + window.location.pathname.split('/')[1] + '/' 
    : '/';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Fix CSS links
    document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
      if (link.href.startsWith(window.location.origin) && !link.href.includes('cdnjs') && !link.href.includes('fonts.googleapis')) {
        link.href = link.href.replace(window.location.origin, window.location.origin + basePath);
      }
    });
    
    // Fix JS links
    document.querySelectorAll('script[src]').forEach(function(script) {
      if (script.src.startsWith(window.location.origin)) {
        script.src = script.src.replace(window.location.origin, window.location.origin + basePath);
      }
    });
  });
})();
