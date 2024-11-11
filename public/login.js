const form = document.getElementById('loginForm');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = emailField.value;
    const password = passwordField.value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          
        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem('user', JSON.stringify(data.user));  // Optionally store user data in localStorage
            window.location.href = "/";
        } else {
            alert(data.message);  // Show error message from the backend
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert("Something went wrong. Please try again.");
    }
});