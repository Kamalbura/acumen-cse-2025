/**
 * Countdown Timer
 * Handles the countdown display on the home page
 */

(function() {
    // Set the countdown date (March 15, 2025)
    const countdownDate = new Date("March 15, 2025 00:00:00").getTime();
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = countdownDate - now;
        
        // If the countdown is over, display event started message
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById("countdown-days").innerHTML = "00";
            document.getElementById("countdown-hours").innerHTML = "00";
            document.getElementById("countdown-minutes").innerHTML = "00";
            document.getElementById("countdown-seconds").innerHTML = "00";
            return;
        }
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Add a leading zero if the value is less than 10
        const formatTime = (time) => (time < 10 ? "0" : "") + time;
        
        // Display the result in the corresponding elements
        document.getElementById("countdown-days").innerHTML = formatTime(days);
        document.getElementById("countdown-hours").innerHTML = formatTime(hours);
        document.getElementById("countdown-minutes").innerHTML = formatTime(minutes);
        document.getElementById("countdown-seconds").innerHTML = formatTime(seconds);
        
        // Add glitch effect to changing digits
        addGlitchEffect("countdown-seconds");
        if (seconds === 59) addGlitchEffect("countdown-minutes");
        if (minutes === 59 && seconds === 59) addGlitchEffect("countdown-hours");
        if (hours === 23 && minutes === 59 && seconds === 59) addGlitchEffect("countdown-days");
        
    }, 1000);
    
    /**
     * Add a brief glitch effect to changing digits
     */
    function addGlitchEffect(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Add glitch class
        element.classList.add('digit-glitch');
        
        // Remove after animation completes
        setTimeout(() => {
            element.classList.remove('digit-glitch');
        }, 500);
    }
})();
