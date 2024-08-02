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
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication(); // Check if the user is authenticated on page load
});

// Function to get a cookie value by its name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check user authentication
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block'; // Show login link if not authenticated
    } else {
        loginLink.style.display = 'none'; // Hide login link if authenticated
        fetchPlaces(token); // Fetch places data if authenticated
    }
}

// Fetch places data from the API
async function fetchPlaces(token) {
    try {
        const response = await fetch('http://localhost:3000/places', { // Replace with your API URL
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include JWT in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places); // Pass the data to displayPlaces function
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

// Populate the places list
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear current content

    places.forEach(place => {
        const placeDiv = document.createElement('div');
        placeDiv.className = 'place-card';
        placeDiv.innerHTML = `
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            <p><strong>Location:</strong> ${place.location}</p>
            <p><strong>Country:</strong> ${place.country}</p>
        `;
        placesList.appendChild(placeDiv); // Append each place to the list
    });

    // Add filtering functionality
    setupFiltering(places); // Call function to set up filtering
}

// Set up filtering functionality
function setupFiltering(places) {
    const filterDropdown = document.getElementById('country-filter');

    filterDropdown.addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        filterPlaces(selectedCountry, places); // Filter places based on selection
    });
}

// Filter places based on selected country
function filterPlaces(selectedCountry, places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear the current list

    const filteredPlaces = selectedCountry ? 
        places.filter(place => place.country === selectedCountry) : places;

    filteredPlaces.forEach(place => {
        const placeDiv = document.createElement('div');
        placeDiv.className = 'place-card';
        placeDiv.innerHTML = `
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            <p><strong>Location:</strong> ${place.location}</p>
            <p><strong>Country:</strong> ${place.country}</p>
        `;
        placesList.appendChild(placeDiv); // Append filtered places
    });
}
