/**
 * Countdown Timer
 * Calculates and displays time remaining until ACUMEN 2025
 */
(function() {
    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Get countdown elements
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        const countdownElement = document.getElementById('eventCountdown');
        
        // Make sure countdown elements exist
        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
            console.error('Countdown elements not found');
            return;
        }
        
        // Set event date - April 10, 2025 at 9:00 AM
        const eventDate = new Date('April 10, 2025 09:00:00').getTime();
        
        // Update the countdown every second
        function updateCountdown() {
            // Get current date and time
            const now = new Date().getTime();
            
            // Find the time remaining between now and the event date
            const timeRemaining = eventDate - now;
            
            // Check if we've already passed the event date
            if (timeRemaining < 0) {
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                
                // Add class to show event has started
                if (countdownElement) {
                    countdownElement.classList.add('event-started');
                }
                
                return;
            }
            
            // Calculate time units
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            
            // Add leading zeros if necessary
            const formatNumber = num => num < 10 ? `0${num}` : num;
            
            // Update the countdown values
            daysElement.textContent = formatNumber(days);
            hoursElement.textContent = formatNumber(hours);
            minutesElement.textContent = formatNumber(minutes);
            secondsElement.textContent = formatNumber(seconds);
            
            // Add animation effect
            daysElement.classList.add('pulse');
            hoursElement.classList.add('pulse');
            minutesElement.classList.add('pulse');
            secondsElement.classList.add('pulse');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                daysElement.classList.remove('pulse');
                hoursElement.classList.remove('pulse');
                minutesElement.classList.remove('pulse');
                secondsElement.classList.remove('pulse');
            }, 700);
        }
        
        // Run once immediately to avoid delay
        updateCountdown();
        
        // Update every second
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        // Add pulsing animation to the numbers
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .countdown-value.pulse {
                animation: pulse 0.7s ease;
            }
            
            .event-started .countdown-item {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
        
        // Clean up interval when page is hidden
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(countdownInterval);
            } else {
                updateCountdown();
                countdownInterval = setInterval(updateCountdown, 1000);
            }
        });
    });
})();
