// JavaScript Validation for Login Page
document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Get input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    // Get error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const mobileError = document.getElementById('mobileError');

    // Regular Expressions for validation
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    let isValid = true;

    // Validate Name
    if (name === "" || !nameRegex.test(name)) {
        nameError.style.display = "block";
        isValid = false;
    } else {
        nameError.style.display = "none";
    }

    // Validate Email
    if (!emailRegex.test(email)) {
        emailError.style.display = "block";
        isValid = false;
    } else {
        emailError.style.display = "none";
    }

    // Validate Mobile
    if (!mobileRegex.test(mobile)) {
        mobileError.style.display = "block";
        isValid = false;
    } else {
        mobileError.style.display = "none";
    }

    // If all fields are valid, redirect to index.html (Home Page)
    if (isValid) {
        window.location.href = "index.html"; 
    }
});