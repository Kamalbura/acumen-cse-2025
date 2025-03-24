ACUMEN Placeholder Images
========================

This directory contains placeholder images used when the original images fail to load.

Files:
- placeholder.jpg       : Default generic placeholder (500x300px)
- event-placeholder.jpg : Placeholder for event cards (400x225px)
- team-placeholder.jpg  : Placeholder for team member photos (300x300px)
- sponsor-placeholder.jpg: Placeholder for sponsor logos (300x150px)

Usage:
The image-loader.js script will automatically use these placeholders when image loading fails.
You can also manually set a placeholder by using:

<img src="path/to/image.jpg" data-placeholder="event">

The data-placeholder attribute can be one of: event, team, sponsor, or default.

Note:
- Keep placeholders small in file size (<20KB each) for fast loading
- Use JPG format with medium compression for best balance of quality/size
- Maintain the aspect ratios mentioned above for each type
