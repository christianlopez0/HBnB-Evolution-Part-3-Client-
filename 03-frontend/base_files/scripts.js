document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission behavior

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await loginUser(email, password);

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`; // Store the token in a cookie
                    window.location.href = 'index.html'; // Redirect to the main page
                } else {
                    const errorData = await response.json();
                    displayError(errorData.message || 'Login failed. Please try again.'); // Display error message
                }
            } catch (error) {
                displayError('An error occurred. Please try again later.'); // Catch any errors and display a message
            }
        });
    }

    // Function to send the login request to the API
    async function loginUser(email, password) {
        return await fetch('https://your-api-url/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
    }

    // Function to display error messages
    function displayError(message) {
        errorMessageDiv.innerText = message; // Set the error message
        errorMessageDiv.style.display = 'block'; // Show the error message
    }
});
