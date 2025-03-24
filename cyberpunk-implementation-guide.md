# ACUMEN 2025 Cyberpunk Implementation Guide

This guide outlines how to implement and customize the various cyberpunk effects and features for the ACUMEN 2025 website.

## Table of Contents
1. [Setup](#setup)
2. [Core Effects](#core-effects)
3. [Interactive Elements](#interactive-elements)
4. [Page-Specific Implementation](#page-specific-implementation)
5. [Mobile & Performance Considerations](#mobile--performance-considerations)
6. [Troubleshooting](#troubleshooting)

## Setup

### Include Required Files

Add these files to each page in the specified order:

```html
<!-- In the <head> section -->
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/cyberpunk.css">
<link rel="stylesheet" href="css/cyberpunk-enhanced.css">
<link rel="stylesheet" href="css/interactive-elements.css">
<link rel="stylesheet" href="css/loading-screen.css">

<!-- Just before closing </body> tag -->
<script src="js/main.js"></script>
<script src="js/cursor-effects-enhanced.js"></script>
<script src="js/hover-effects.js"></script>
<script src="js/loading-screen.js"></script>
```

### Basic Page Structure

For optimal cyberpunk effects, structure your pages like this:

```html
<body class="circuit-bg digital-noise">
    <!-- Loading screen added automatically by loading-screen.js -->
    
    <div class="glitch-overlay"></div>
    
    <!-- Navigation -->
    <nav class="navbar">...</nav>
    
    <!-- Hero with particle effect -->
    <section class="hero-section scan-effect">
        <div class="container">
            <div class="hero-content datastream-container">
                <h1 class="glitch-text" data-text="ACUMEN 2025">ACUMEN <span class="gradient-text">2025</span></h1>
                <p class="terminal-text">Tagline text here...</p>
                <!-- Content -->
            </div>
        </div>
    </section>
    
    <!-- Divider -->
    <div class="cyber-divider"></div>
    
    <!-- Regular sections with different effects -->
    <section class="about-section matrix-bg">...</section>
    <section class="featured-section hologram">...</section>
    
    <!-- Footer -->
    <footer class="footer">...</footer>
</body>
```

## Core Effects

### Background Effects

Apply these classes to create different background effects:

- `circuit-bg`: Creates a subtle circuit board background pattern
- `matrix-bg`: Adds a matrix-like code rain background
- `digital-noise`: Adds a subtle noise texture over the entire page
- `scan-effect`: Adds a scanning line effect (good for hero sections)
- `hologram`: Adds horizontal scan lines when elements are hovered

### Text Effects

Enhance your text with these classes:

- `glitch-text`: Creates a text glitch effect (add `data-text` attribute with the same text)
- `gradient-text`: Gives text an animated color gradient
- `terminal-text`: Simulates text being typed (typewriter effect)
- `glow-text`: Makes text glow with an animated pulse
- `scramble-text`: Text scrambles when hovered over

Example:
```html
<h1 class="glitch-text" data-text="ACUMEN 2025">ACUMEN 2025</h1>
<p class="terminal-text">Initialize cyberpunk experience...</p>
<span class="gradient-text">Hyderabad's premier tech festival</span>
```

### Interactive Containers

Apply these classes to section containers:

- `cyber-card`: Creates an advanced hover effect with 3D tilt and glowing border
- `datastream-container`: Adds falling data-stream lines in the background
- `animated-border`: Creates an animated gradient border

## Interactive Elements

### Buttons

Three button styles are available:

```html
<!-- Default cyberpunk button -->
<a href="#" class="btn">Default Button</a>

<!-- Enhanced neon button with scan effect -->
<a href="#" class="btn-neon">Neon Button</a>

<!-- 3D tilt effect button -->
<a href="#" class="btn-cyber">Cyber Button</a>

<!-- Magnetic effect button -->
<a href="#" class="btn-magnetic">Magnetic Button</a>
```

### Form Elements

Use these classes for cyberpunk-styled form elements:

```html
<!-- Input with floating label -->
<div class="cyber-input-group">
    <input type="text" class="cyber-input" id="name" placeholder=" ">
    <label for="name" class="cyber-label">Your Name</label>
</div>

<!-- Checkbox -->
<label class="cyber-checkbox">
    Remember me
    <input type="checkbox">
    <span class="checkmark"></span>
</label>
```

### Cards & Panels

For event cards, team cards, etc.:

```html
<div class="event-card cyber-card">
    <img src="image.jpg" alt="Event" class="glitch-image">
    <div class="event-card-content">
        <h3 class="scramble-text">Event Title</h3>
        <p>Event description...</p>
        <a href="#" class="event-details-link btn-magnetic">View Details</a>
    </div>
    <div class="glitch-overlay"></div>
</div>
```

## Page-Specific Implementation

### Events Page

For the events page, apply these classes:

```html
<!-- Category filter tabs -->
<div class="cyber-tabs category-filters">
    <button class="cyber-tab category-btn active" data-filter="all">All Events</button>
    <!-- More category buttons -->
</div>

<!-- Event card with enhanced style -->
<div class="event-card cyber-card" data-category="technical">
    <img src="image.jpg" alt="Event" class="glitch-image">
    <!-- Card content -->
    <div class="glitch-overlay"></div>
</div>
```

### Team Page

For the team page:

```html
<div class="team-card cyber-card">
    <div class="member-image">
        <img src="member.jpg" alt="Team Member" class="glitch-image">
    </div>
    <div class="team-card-content">
        <h3 class="scramble-text">Member Name</h3>
        <p>Role/Position</p>
    </div>
    <div class="glitch-overlay"></div>
</div>
```

### Contact Page

For the contact form:

```html
<form class="contact-form">
    <div class="cyber-input-group">
        <input type="text" class="cyber-input" id="contact-name" placeholder=" ">
        <label for="contact-name" class="cyber-label">Your Name</label>
    </div>
    <!-- More inputs -->
    <button type="submit" class="btn-neon">Submit</button>
</form>
```

## Mobile & Performance Considerations

### Reducing Effects on Mobile

The scripts automatically detect touch devices and disable certain effects like custom cursors for better performance. You can manually disable effects with these classes:

```html
<div class="disable-on-mobile">
    <!-- Heavy effects that should be disabled on mobile -->
</div>
```

### Performance Optimization

For pages with many animated elements:

1. Add `data-lazy-effect="true"` attribute to defer non-essential effects until after page load
2. Use the `lite` class suffix for lighter versions of effects (`glitch-text-lite`, `cyber-card-lite`)
3. Limit the number of particles and datastream elements on a single page

## Troubleshooting

### Common Issues

1. **Effects not showing**: Make sure all CSS and JS files are properly included and in the correct order.

2. **Conflicts with other scripts**: If using jQuery or other libraries, include our scripts last.

3. **Performance issues**: Try reducing the number of animated elements or use the lite versions.

4. **Z-index problems**: If overlays or glitch effects are hidden, check the z-index hierarchy.

### CSS Variables

You can customize the cyberpunk color scheme by overriding these CSS variables:

```css
:root {
    --primary-color: #00f3ff;     /* Main cyan color */
    --neon-blue: #00f3ff;         /* Cyan/blue for glow effects */
    --neon-purple: #9d00ff;       /* Purple for accents */
    --neon-pink: #ff00c8;         /* Pink for glitch effects */
    --neon-green: #00ff9d;        /* Green for matrix effects */
    --dark-bg-1: #050510;         /* Darkest background */
    --dark-bg-2: #0a0a1b;         /* Slightly lighter background */
}
```
