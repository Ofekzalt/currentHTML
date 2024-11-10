document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission from reloading the page

    // Get form data
    const formData = new FormData(this);
    const feedbackDiv = document.getElementById('feedback');

    // Clear any previous feedback
    feedbackDiv.classList.remove('success', 'error');
    feedbackDiv.style.display = 'none';

    // Disable the submit button to prevent multiple submissions
    document.getElementById('registerBtn').disabled = true;

    // AJAX request using Axios
    axios.post('/api/auth/register', formData)
        .then(function(response) {
            // Show success message if registration is successful
            feedbackDiv.classList.add('success');
            feedbackDiv.innerHTML = 'Registration successful! Please log in.';
            feedbackDiv.style.display = 'block';

            // Optionally, you could redirect the user to the login page after success:
            // window.location.href = '/login.html';
        })
        .catch(function(error) {
            // Show error message if registration fails
            feedbackDiv.classList.add('error');
            feedbackDiv.innerHTML = 'Registration failed. Please try again.';
            feedbackDiv.style.display = 'block';
        })
        .finally(function() {
            // Re-enable the submit button after the request is complete
            document.getElementById('registerBtn').disabled = false;
        });
});
