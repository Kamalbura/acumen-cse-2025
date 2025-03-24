/**
 * Registration Form Handler
 * Handles event loading, form interactions, and submission
 */
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const form = document.getElementById('registrationForm');
    const eventsGrid = document.getElementById('eventsGrid');
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const teamInfoSection = document.getElementById('teamInfoSection');
    const noEventsSelected = document.getElementById('noEventsSelected');
    let selectedEvents = [];
    
    // Constants
    const TEAM_EVENT_CATEGORIES = {
        'technical': ['ai_imagination', 'project_expo', 'shark_tank'],
        'coding': ['code_relay'],
        'non-technical': ['treasure_hunt', 'human_snakes_ladders']
    };
    
    // ==================== Fetch Events from events.html ====================
    function fetchEvents() {
        // Show loading indicator
        eventsGrid.innerHTML = `
            <div class="loading-events">
                <div class="spinner"></div>
                <p>Loading events...</p>
            </div>
        `;
        
        fetch('events.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const eventCards = doc.querySelectorAll('.event-card');
                
                if (eventCards && eventCards.length > 0) {
                    processEvents(eventCards);
                } else {
                    // If events not found, use fallback events
                    console.warn('Events not found in events.html, using fallback data');
                    loadFallbackEvents();
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                loadFallbackEvents();
            });
    }
    
    // Process event cards from events.html
    function processEvents(eventCards) {
        // Clear loading indicator
        eventsGrid.innerHTML = '';
        
        // Process each event card
        eventCards.forEach(card => {
            // Extract event data from card
            const category = card.getAttribute('data-category') || 'technical';
            const eventName = card.querySelector('h3')?.textContent || 'Event';
            const description = card.querySelector('p')?.textContent || 'No description available';
            const icon = card.querySelector('.event-icon i')?.className || 'fas fa-calendar-alt';
            
            // Generate price based on category
            let price;
            let teamSize = 'Individual';
            const isTeamEvent = isTeamEventCategory(category, eventName.toLowerCase().replace(/\s+/g, '_'));
            
            switch(category) {
                case 'technical':
                    price = isTeamEvent ? 500 : 300;
                    if (isTeamEvent) teamSize = 'Team (2-4)';
                    break;
                case 'coding':
                    price = isTeamEvent ? 400 : 250;
                    if (isTeamEvent) teamSize = 'Team (2-3)';
                    break;
                case 'gaming':
                    price = 200;
                    break;
                case 'non-technical':
                    price = isTeamEvent ? 300 : 150;
                    if (isTeamEvent) teamSize = 'Team (2-4)';
                    break;
                default:
                    price = 250;
            }
            
            // Create registration event card
            createEventCard(
                eventName,
                category,
                description,
                icon,
                price,
                teamSize,
                isTeamEvent
            );
        });
    }
    
    // Create event card for registration
    function createEventCard(name, category, description, iconClass, price, teamSize, isTeamEvent) {
        const eventId = name.toLowerCase().replace(/\s+/g, '_');
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-category', category);
        
        card.innerHTML = `
            <input type="checkbox" name="events[]" value="${eventId}" data-price="${price}" data-team="${isTeamEvent}" data-category="${category}">
            <div class="event-header">
                <div class="event-icon"><i class="${iconClass}"></i></div>
                <div class="event-info">
                    <div class="event-name">${name}</div>
                    <div class="event-type">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                </div>
            </div>
            <div class="event-description">${description}</div>
            <div class="event-meta">
                <div class="event-fee">₹${price}</div>
                <div class="event-team-size">${teamSize}</div>
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', function(e) {
            // Don't toggle when clicking on links or input directly
            if (e.target.tagName === 'A' || e.target.tagName === 'INPUT') return;
            
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            // Update selected status
            if (checkbox.checked) {
                this.classList.add('selected');
                addEventToSummary(eventId, name, price);
            } else {
                this.classList.remove('selected');
                removeEventFromSummary(eventId);
            }
            
            // Check if we need to show team section
            updateTeamSection();
        });
        
        eventsGrid.appendChild(card);
    }
    
    // Fallback event data if fetch fails
    function loadFallbackEvents() {
        eventsGrid.innerHTML = '';
        
        const fallbackEvents = [
            { name: "AI Imagination", category: "technical", description: "Create innovative solutions using AI tools", 
              icon: "fas fa-brain", price: 500, teamSize: "Team (2-4)", isTeam: true },
            { name: "Bug Busters", category: "coding", description: "Code debugging competition", 
              icon: "fas fa-bug", price: 300, teamSize: "Individual", isTeam: false },
            { name: "Call of Duty", category: "gaming", description: "Gaming tournament", 
              icon: "fas fa-gamepad", price: 200, teamSize: "Individual", isTeam: false },
            { name: "Treasure Hunt", category: "non-technical", description: "Campus-wide treasure hunt", 
              icon: "fas fa-map-marked-alt", price: 300, teamSize: "Team (2-4)", isTeam: true }
        ];
        
        fallbackEvents.forEach(event => {
            createEventCard(
                event.name,
                event.category,
                event.description,
                event.icon,
                event.price,
                event.teamSize,
                event.isTeam
            );
        });
    }
    
    // Check if an event belongs to a team category
    function isTeamEventCategory(category, eventId) {
        return TEAM_EVENT_CATEGORIES[category] && 
               TEAM_EVENT_CATEGORIES[category].includes(eventId);
    }
    
    // ==================== Event Selection & Summary ====================
    // Add event to order summary
    function addEventToSummary(eventId, eventName, price) {
        // Remove "no events selected" message if present
        if (noEventsSelected && noEventsSelected.parentNode === orderSummaryItems) {
            orderSummaryItems.removeChild(noEventsSelected);
        }
        
        // Add event to selected events array
        selectedEvents.push({
            id: eventId,
            name: eventName,
            price: price
        });
        
        // Create summary item
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.setAttribute('data-event', eventId);
        
        summaryItem.innerHTML = `
            <div class="summary-item-name">${eventName}</div>
            <div class="summary-item-price">₹${price}</div>
        `;
        
        orderSummaryItems.appendChild(summaryItem);
        
        // Update total
        updateTotal();
    }
    
    // Remove event from order summary
    function removeEventFromSummary(eventId) {
        // Remove from selected events array
        selectedEvents = selectedEvents.filter(event => event.id !== eventId);
        
        // Remove from DOM
        const summaryItem = orderSummaryItems.querySelector(`[data-event="${eventId}"]`);
        if (summaryItem) {
            orderSummaryItems.removeChild(summaryItem);
        }
        
        // Show "no events selected" if no events left
        if (selectedEvents.length === 0 && noEventsSelected) {
            orderSummaryItems.appendChild(noEventsSelected);
        }
        
        // Update total
        updateTotal();
    }
    
    // Update total amount
    function updateTotal() {
        let total = 0;
        selectedEvents.forEach(event => {
            total += event.price;
        });
        
        totalAmountDisplay.textContent = `₹${total}`;
    }
    
    // Update team section visibility based on selected events
    function updateTeamSection() {
        // Check if any team events are selected
        const teamEventSelected = document.querySelector('input[type="checkbox"][data-team="true"]:checked') !== null;
        
        // Show/hide team section
        teamInfoSection.style.display = teamEventSelected ? 'block' : 'none';
        
        // Update requirement for team name field
        const teamNameInput = document.getElementById('teamName');
        if (teamNameInput) {
            teamNameInput.required = teamEventSelected;
            
            // Update label class
            const teamNameLabel = document.querySelector('label[for="teamName"]');
            if (teamNameLabel) {
                if (teamEventSelected) {
                    teamNameLabel.classList.add('required');
                } else {
                    teamNameLabel.classList.remove('required');
                }
            }
        }
    }
    
    // ==================== Team Member Management ====================
    // Add team member fields
    const addMemberBtn = document.getElementById('addMemberBtn');
    const teamMembers = document.getElementById('teamMembers');
    let memberCounter = 0;
    
    if (addMemberBtn && teamMembers) {
        addMemberBtn.addEventListener('click', function() {
            if (memberCounter < 3) { // Limit to 3 additional members (4 total including captain)
                memberCounter++;
                
                const memberDiv = document.createElement('div');
                memberDiv.className = 'team-member';
                memberDiv.innerHTML = `
                    <h4>Team Member ${memberCounter + 1} <button type="button" class="remove-member"><i class="fas fa-times"></i></button></h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="member${memberCounter}Name" class="required">Full Name</label>
                            <input type="text" id="member${memberCounter}Name" name="teamMembers[${memberCounter}].name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="member${memberCounter}Email" class="required">Email</label>
                            <input type="email" id="member${memberCounter}Email" name="teamMembers[${memberCounter}].email" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="member${memberCounter}Phone">Phone</label>
                            <input type="tel" id="member${memberCounter}Phone" name="teamMembers[${memberCounter}].phone">
                        </div>
                        
                        <div class="form-group">
                            <label for="member${memberCounter}College">College</label>
                            <input type="text" id="member${memberCounter}College" name="teamMembers[${memberCounter}].college">
                        </div>
                    </div>
                `;
                
                teamMembers.appendChild(memberDiv);
                
                // Add remove functionality
                const removeBtn = memberDiv.querySelector('.remove-member');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        teamMembers.removeChild(memberDiv);
                        memberCounter--;
                        updateTeamMemberLabels();
                        
                        // Show add button if we've gone below the limit
                        if (memberCounter < 3) {
                            addMemberBtn.style.display = 'block';
                        }
                    });
                }
                
                // Hide add button if we've reached the limit
                if (memberCounter === 3) {
                    addMemberBtn.style.display = 'none';
                }
            }
        });
    }
    
    // Update team member numbering
    function updateTeamMemberLabels() {
        const memberDivs = teamMembers.querySelectorAll('.team-member');
        memberDivs.forEach((div, index) => {
            const heading = div.querySelector('h4');
            if (heading) {
                // Replace the text node but keep the button
                const button = heading.querySelector('button');
                heading.textContent = `Team Member ${index + 2} `;
                heading.appendChild(button);
            }
        });
    }
    
    // ==================== Payment Method Handling ====================
    // Initialize payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    const upiDetails = document.getElementById('upiDetails');
    const cashDetails = document.getElementById('cashDetails');
    const bankDetails = document.getElementById('bankDetails');
    const transactionIdField = document.getElementById('transactionId');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update visual selection
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Show relevant payment details
            const paymentMethod = radio.value;
            upiDetails.style.display = paymentMethod === 'upi' ? 'flex' : 'none';
            cashDetails.style.display = paymentMethod === 'cash' ? 'block' : 'none';
            bankDetails.style.display = paymentMethod === 'bank' ? 'block' : 'none';
            
            // Update transaction ID field requirement
            if (paymentMethod === 'upi' || paymentMethod === 'bank') {
                transactionIdField.setAttribute('required', 'required');
                transactionIdField.parentElement.querySelector('label').classList.add('required');
            } else {
                transactionIdField.removeAttribute('required');
                transactionIdField.parentElement.querySelector('label').classList.remove('required');
            }
        });
    });
    
    // UPI ID copy button functionality
    document.getElementById('copyUpiBtn')?.addEventListener('click', function() {
        const upiId = 'acumen2025@okaxis';
        navigator.clipboard.writeText(upiId).then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = 'Copy';
            }, 2000);
        });
    });
    
    // Mobile UPI deep linking
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const upiId = "acumen2025@okaxis";
        
        // Add mobile UPI button
        if (upiDetails) {
            const mobilePayBtn = document.createElement('button');
            mobilePayBtn.className = 'btn btn-primary';
            mobilePayBtn.style.marginTop = '15px';
            mobilePayBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> Pay via UPI App';
            
            mobilePayBtn.addEventListener('click', function() {
                const amount = totalAmountDisplay.textContent.replace('₹', '');
                const encodedName = encodeURIComponent("ACUMEN 2025");
                const encodedNote = encodeURIComponent("Registration Payment");
                const upiLink = `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${encodedNote}`;
                
                window.location.href = upiLink;
            });
            
            upiDetails.querySelector('.upi-info').appendChild(mobilePayBtn);
        }
    }
    
    // ==================== Form Validation ====================
    // Add enhanced form field focus effects
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('focus', function() {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                group.classList.remove('focused');
                
                // Basic validation on blur
                if (input.required && !input.value.trim()) {
                    input.classList.add('error');
                    const errorElement = group.querySelector('.form-error-message');
                    if (errorElement) errorElement.classList.add('show');
                } else {
                    input.classList.remove('error');
                    const errorElement = group.querySelector('.form-error-message');
                    if (errorElement) errorElement.classList.remove('show');
                }
            });
        }
    });
    
    // Vasavi College student checkbox
    const isVasaviStudentCheckbox = document.getElementById('isVasaviStudent');
    const collegeInput = document.getElementById('college');
    
    if (isVasaviStudentCheckbox && collegeInput) {
        isVasaviStudentCheckbox.addEventListener('change', function() {
            if (this.checked) {
                collegeInput.value = 'Vasavi College of Engineering';
                collegeInput.setAttribute('readonly', 'readonly');
            } else {
                collegeInput.value = '';
                collegeInput.removeAttribute('readonly');
            }
        });
    }
    
    // Full form validation
    function validateForm() {
        let isValid = true;
        
        // Clear all previous errors
        document.querySelectorAll('.form-error-message.show').forEach(error => {
            error.classList.remove('show');
        });
        
        // Validate required fields
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                const errorElement = field.parentElement.querySelector('.form-error-message');
                if (errorElement) errorElement.classList.add('show');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Validate email format if not empty
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value)) {
                emailField.classList.add('error');
                const errorElement = emailField.parentElement.querySelector('.form-error-message');
                if (errorElement) errorElement.classList.add('show');
                isValid = false;
            }
        }
        
        // Validate phone format if not empty
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value) {
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phoneField.value.replace(/\D/g, ''))) {
                phoneField.classList.add('error');
                const errorElement = phoneField.parentElement.querySelector('.form-error-message');
                if (errorElement) errorElement.classList.add('show');
                isValid = false;
            }
        }
        
        // Validate at least one event is selected
        if (selectedEvents.length === 0) {
            const eventsError = document.getElementById('eventsError');
            if (eventsError) eventsError.classList.add('show');
            isValid = false;
        }
        
        // Validate team name if team event is selected
        const teamEventSelected = document.querySelector('input[type="checkbox"][data-team="true"]:checked') !== null;
        const teamNameField = document.getElementById('teamName');
        
        if (teamEventSelected && teamNameField && !teamNameField.value.trim()) {
            teamNameField.classList.add('error');
            const errorElement = document.getElementById('teamNameError');
            if (errorElement) errorElement.classList.add('show');
            isValid = false;
        }
        
        // Validate transaction ID for UPI/bank transfers
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        if ((paymentMethod === 'upi' || paymentMethod === 'bank') && transactionIdField) {
            if (!transactionIdField.value.trim()) {
                transactionIdField.classList.add('error');
                const errorElement = document.getElementById('transactionIdError');
                if (errorElement) errorElement.classList.add('show');
                isValid = false;
            }
        }
        
        // Validate terms agreement
        const termsCheckbox = document.getElementById('termsAgreement');
        if (termsCheckbox && !termsCheckbox.checked) {
            const errorElement = document.getElementById('termsError');
            if (errorElement) errorElement.classList.add('show');
            isValid = false;
        }
        
        return isValid;
    }
    
    // ==================== Form Submission ====================
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show processing indicator
            document.getElementById('processingIndicator').classList.add('active');
            
            // Simulate form submission (replace with actual AJAX submission)
            setTimeout(function() {
                // Hide form and show success message
                form.style.display = 'none';
                document.getElementById('successMessage').classList.add('show');
                
                // Generate random registration ID
                const timestamp = new Date().getTime().toString().slice(-6);
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                document.getElementById('registrationId').textContent = `ACU-${timestamp}-${random}`;
                
                // Hide processing indicator
                document.getElementById('processingIndicator').classList.remove('active');
                
                // Scroll to success message
                document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('input.error, select.error, textarea.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // ==================== Event Filtering ====================
    // Initialize event filtering
    const filterButtons = document.querySelectorAll('.events-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter events
            const eventCards = document.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // ==================== Initialize ====================
    fetchEvents();
});
