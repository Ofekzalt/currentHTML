// register.js

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission from reloading the page
  
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const feedbackDiv = document.getElementById('feedback');
  
    // Clear any previous feedback
    feedbackDiv.classList.remove('success', 'error');
    feedbackDiv.style.display = 'none';
  
    // Disable the submit button to prevent multiple submissions
    document.getElementById('registerBtn').disabled = true;
  
    // Create data object
    const data = {
      email,
      password,
    };
  
    // AJAX request using Axios
    axios.post('/api/auth/register', data)
      .then(function(response) {
        // Show success message if registration is successful
        feedbackDiv.classList.add('success');
        feedbackDiv.innerHTML = 'Registration successful! Please log in.';
        feedbackDiv.style.display = 'block';
  
        // Optionally, redirect to login page
        // window.location.href = '/login';
      })
      .catch(function(error) {
        // Show error message if registration fails
        feedbackDiv.classList.add('error');
        if (error.response && error.response.data && error.response.data.message) {
          feedbackDiv.innerHTML = error.response.data.message;
        } else {
          feedbackDiv.innerHTML = 'Registration failed. Please try again.';
        }
        feedbackDiv.style.display = 'block';
      })
      .finally(function() {
        // Re-enable the submit button after the request is complete
        document.getElementById('registerBtn').disabled = false;
      });
  });
  