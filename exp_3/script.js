// Wait for the DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // Select all the study schedule cards
    const scheduleCards = document.querySelectorAll('.schedule-card');

    // Add a click event listener to each card
    scheduleCards.forEach(card => {
        card.addEventListener('click', () => {
            
            // Toggle the 'completed' class on the card
            // If it's already completed, it removes the class. If not, it adds it.
            card.classList.toggle('completed');
            
            // Optional: If you mark it complete, remove the 'urgent' red border if it had one
            if (card.classList.contains('completed')) {
                card.classList.remove('urgent');
            }
        });
    });

});