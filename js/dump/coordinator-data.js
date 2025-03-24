/**
 * Coordinator Data Extractor
 * This script extracts coordinator information from team.html
 * and makes it available for use in other pages
 */

// Store coordinator data in this object
const coordinatorData = {
    technical: null,
    nonTechnical: null,
    gaming: null,
    hackathon: null,
    registration: null,
    webDesign: null,
    loaded: false
};

// Function to extract coordinator data from team.html
function extractCoordinatorData() {
    // If data is already loaded, return the data
    if (coordinatorData.loaded) {
        return Promise.resolve(coordinatorData);
    }
    
    // Determine correct path
    const pathPrefix = window.location.pathname.split('/').length > 2 ? '../' : '';
    
    // Fetch team.html content
    return fetch(pathPrefix + 'team.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load team data');
            }
            return response.text();
        })
        .then(html => {
            // Create a DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find coordinator elements - adjust selectors based on actual team.html structure
            const coordinatorElements = doc.querySelectorAll('.team-member.student-coordinator');
            
            // Process each coordinator
            coordinatorElements.forEach(element => {
                // Extract information
                const name = element.querySelector('.member-name')?.textContent.trim();
                const role = element.querySelector('.member-role')?.textContent.trim();
                const email = element.querySelector('.member-email')?.textContent.trim();
                const phone = element.querySelector('.member-phone')?.textContent.trim();
                
                // Fix image path if needed
                let image = element.querySelector('.member-image img')?.src;
                if (image && image.startsWith('file://')) {
                    // Extract just the filename
                    const imageName = image.split('/').pop();
                    image = pathPrefix + 'img/team/' + imageName;
                }
                
                // Determine coordinator type from role
                let type = null;
                if (role && role.toLowerCase().includes('technical')) type = 'technical';
                else if (role && role.toLowerCase().includes('non-technical')) type = 'nonTechnical';
                else if (role && role.toLowerCase().includes('gaming')) type = 'gaming';
                else if (role && role.toLowerCase().includes('hackathon')) type = 'hackathon';
                else if (role && role.toLowerCase().includes('registration')) type = 'registration';
                else if (role && (role.toLowerCase().includes('web') || role.toLowerCase().includes('design'))) type = 'webDesign';
                
                // Store coordinator data
                if (type && name) {
                    coordinatorData[type] = {
                        name,
                        role,
                        email: email || 'contact@acumen2025.com',
                        phone: phone || 'N/A',
                        image: image || pathPrefix + 'img/placeholder.jpg'
                    };
                }
            });
            
            coordinatorData.loaded = true;
            return coordinatorData;
        })
        .catch(error => {
            console.error('Error fetching coordinator data:', error);
            // Provide fallback data when fetch fails
            provideFallbackData();
            return coordinatorData;
        });
}

// Provide fallback data when fetch fails
function provideFallbackData() {
    const pathPrefix = window.location.pathname.split('/').length > 2 ? '../' : '';
    coordinatorData.technical = {
        name: 'Technical Coordinator',
        role: 'Technical Events Coordinator',
        email: 'technical@acumen2025.com',
        phone: 'Contact Administration',
        image: pathPrefix + 'img/placeholder.jpg'
    };
    coordinatorData.nonTechnical = {
        name: 'Non-Technical Coordinator',
        role: 'Non-Technical Events Coordinator',
        email: 'events@acumen2025.com',
        phone: 'Contact Administration',
        image: pathPrefix + 'img/placeholder.jpg'
    };
    coordinatorData.loaded = true;
}

// Function to get coordinator data on a page
function getCoordinatorData() {
    return extractCoordinatorData();
}

// Function to populate coordinator cards on contact page
function populateCoordinatorCards() {
    getCoordinatorData().then(data => {
        const container = document.querySelector('.coordinators-grid');
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Add each coordinator
        Object.values(data).forEach(coordinator => {
            // Skip the 'loaded' property
            if (coordinator === true) return;
            if (!coordinator) return;
            
            const card = document.createElement('div');
            card.className = 'coordinator-card';
            card.innerHTML = `
                <div class="coordinator-image">
                    <img src="${coordinator.image}" alt="${coordinator.name}">
                </div>
                <div class="coordinator-info">
                    <h3>${coordinator.name}</h3>
                    <p>${coordinator.role}</p>
                    <div class="contact-details">
                        <a href="tel:${coordinator.phone}"><i class="fas fa-phone"></i> ${coordinator.phone}</a>
                        <a href="mailto:${coordinator.email}"><i class="fas fa-envelope"></i> ${coordinator.email}</a>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // If we're on the contact page, populate coordinator cards
    if (window.location.pathname.includes('contact.html')) {
        populateCoordinatorCards();
    }
});
