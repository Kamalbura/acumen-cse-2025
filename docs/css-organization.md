# ACUMEN Website CSS Organization

This document explains the organization of CSS files in the ACUMEN 2025 website project.

## Core CSS Files

| File | Purpose |
|------|---------|
| `consolidated.css` | Main styles, layout, components, and base elements |
| `cyberpunk.css` | Cyberpunk theme effects (glitch, neon, hologram) |
| `compatibility.css` | Cross-browser compatibility and device-specific fixes |
| `navbar.css` | Navigation styling for desktop and mobile |
| `a11y-helper.css` | Accessibility enhancements |
| `homepage-enhancements.css` | Homepage-specific styling |
| `event-pages.css` | Styling for event detail pages |
| `faq-accordion.css` | FAQ component styling |

## How the CSS is Organized

### 1. Core Structure
- **consolidated.css** contains the core layout, typography, colors, and components
- Variable definitions are in this file (colors, fonts, spacings)
- Basic responsive design breakpoints

### 2. Theme Effects
- **cyberpunk.css** contains specialized visual effects for the cyberpunk theme
- All animation definitions
- Glitch effects, terminal text, hologram, neon effects
- Performance optimizations for effects

### 3. Page-Specific Styles
- **homepage-enhancements.css** for homepage-specific styling
- **event-pages.css** for event detail pages
- These files only contain styles specific to those page types

### 4. Compatibility Layer
- **compatibility.css** addresses browser-specific issues
- Contains fixes for Safari, Firefox, Edge, and mobile devices
- Performance optimizations for various devices

## Naming Conventions

- All class names use kebab-case: `.hero-element` not `.heroElement`
- Sections are prefixed with their name: `.about-section`, `.event-section`
- Component states use descriptive suffixes: `.btn-primary`, `.nav-links.active`

## Media Queries

Media queries are organized by component within each file. The main breakpoints used are:
- Mobile: `max-width: 768px`
- Tablet: `max-width: 992px`
- Desktop: `min-width: 993px`

## Optimization Notes

1. Animations are disabled for users who prefer reduced motion
2. Heavy effects are conditionally loaded based on device capabilities
3. Performance optimizations are applied for mobile devices
4. Custom properties (CSS variables) are used for theme consistency

## Future CSS Updates

When adding new CSS:

1. Determine if it's a core style, theme effect, or page-specific
2. Add to the appropriate file based on categorization
3. Follow the existing naming conventions
4. Use CSS variables for colors and spacing
5. Include appropriate browser compatibility code
6. Add responsive styles within the same section

Redundant CSS files have been moved to the `/dump/css` directory for reference.
