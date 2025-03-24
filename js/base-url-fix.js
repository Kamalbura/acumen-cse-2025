// This script helps resolve path issues when deployed to GitHub Pages
(function() {
  // Determine if we're on GitHub Pages and get the correct base path
  const isGitHub = document.location.hostname.includes('github.io');
  const basePath = isGitHub 
    ? '/' + window.location.pathname.split('/')[1] + '/' 
    : '/';
    
  // Add a meta tag to indicate the base path for other scripts
  const meta = document.createElement('meta');
  meta.name = 'base-path';
  meta.content = basePath;
  document.head.appendChild(meta);
  
  // Fix paths immediately for critical resources
  function fixResourcePaths() {
    // Fix CSS links
    document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"]').forEach(function(link) {
      if (link.href.startsWith(window.location.origin) && 
          !link.href.includes('cdnjs') && 
          !link.href.includes('fonts.googleapis')) {
        
        // Check if path doesn't already have the base path
        if (isGitHub && !link.href.includes(basePath)) {
          link.href = link.href.replace(window.location.origin, window.location.origin + basePath);
        }
      }
    });
    
    // Fix JS links
    document.querySelectorAll('script[src]').forEach(function(script) {
      if (script.src.startsWith(window.location.origin)) {
        // Check if path doesn't already have the base path
        if (isGitHub && !script.src.includes(basePath)) {
          script.src = script.src.replace(window.location.origin, window.location.origin + basePath);
        }
      }
    });
    
    // Fix image paths when they load
    document.querySelectorAll('img').forEach(function(img) {
      if (img.src.startsWith(window.location.origin)) {
        // Check if path doesn't already have the base path
        if (isGitHub && !img.src.includes(basePath)) {
          img.src = img.src.replace(window.location.origin, window.location.origin + basePath);
        }
      }
    });
    
    // Log confirmation
    console.log('Base URL fix applied: ' + basePath);
  }
  
  // Run immediately for resources in the head
  fixResourcePaths();
  
  // Also run on DOM content loaded for resources added later
  document.addEventListener('DOMContentLoaded', fixResourcePaths);
})();
