document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await loginUser(email, password);
                handleResponse(response);
            } catch (error) {
                errorMessageDiv.textContent = 'An error occurred. Please try again.';
                errorMessageDiv.style.display = 'block';
            }
        });
    }
});

async function loginUser(email, password) {
    const response = await fetch('https://localhost5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    return response; // Return the response object for handling
}

function handleResponse(response) {
    const errorMessageDiv = document.getElementById('error-message');

    if (response.ok) {
        // Successful login
        response.json().then(data => {
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html';
        });
    } else {
        // Handle login failure
        response.json().then(data => {
            errorMessageDiv.textContent = data.message || 'Login failed. Please check your credentials.';
            errorMessageDiv.style.display = 'block';
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('https://localhost5000/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
            populateCountryFilter(places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear current content

    places.forEach(place => {
        const placeDiv = document.createElement('div');
        placeDiv.classList.add('place-card');
        placeDiv.innerHTML = `
            <img src="${place.image}" alt="${place.name}" class="place-image">
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            <p>Location: ${place.location}</p>
            <p>Price: $${place.price}/night</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        placesList.appendChild(placeDiv);
    });
}

function populateCountryFilter(places) {
    const countryFilter = document.getElementById('country-filter');
    const countries = [...new Set(places.map(place => place.country))];

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });

    countryFilter.addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        filterPlaces(selectedCountry, places);
    });
}

function filterPlaces(selectedCountry, places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear current content

    places.forEach(place => {
        if (!selectedCountry || place.country === selectedCountry) {
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('place-card');
            placeDiv.innerHTML = `
                <img src="${place.image}" alt="${place.name}" class="place-image">
                <h2>${place.name}</h2>
                <p>${place.description}</p>
                <p>Location: ${place.location}</p>
                <p>Price: $${place.price}/night</p>
                <a href="place.html?id=${place.id}" class="details-button">View Details</a>
            `;
            placesList.appendChild(placeDiv);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');
    checkAuthentication(token, placeId);
});

function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Extract place ID from query parameters
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkAuthentication(token, placeId) {
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';
        fetchPlaceDetails(token, placeId);
    }
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`https://localhost5000/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    const placeName = document.getElementById('place-name');
    placeDetails.innerHTML = ''; // Clear current content

    placeName.textContent = place.name;

    // Create elements to display the place details
    const description = document.createElement('p');
    description.textContent = place.description;

    const location = document.createElement('p');
    location.textContent = `Location: ${place.location}`;

    const price = document.createElement('p');
    price.textContent = `Price: $${place.price}/night`;

    // Create a section for images
    const imagesDiv = document.createElement('div');
    imagesDiv.classList.add('images');

    place.images.forEach(imageUrl => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = place.name;
        img.classList.add('place-image-large'); // Add appropriate class for styling
        imagesDiv.appendChild(img);
    });

    // Append all created elements to the place details section
    placeDetails.appendChild(imagesDiv);
    placeDetails.appendChild(description);
    placeDetails.appendChild(location);
    placeDetails.appendChild(price);
}
document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    const reviewForm = document.getElementById('review-form');

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById('review-text').value;
            const reviewRating = document.getElementById('review-rating').value;

            // Make AJAX request to submit review
            await submitReview(token, placeId, reviewText, reviewRating);
        });
    }
});

function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html'; // Redirect to index page if not authenticated
    }
    return token; // Return the token for later use
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Extract place ID from query parameters
}

async function submitReview(token, placeId, reviewText, reviewRating) {
    try {
        const response = await fetch('https://localhost5000/reviews', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                placeId: placeId,
                reviewText: reviewText,
                rating: reviewRating
            })
        });

        handleResponse(response);
    } catch (error) {
        console.error('Error submitting review:', error);
        document.getElementById('message').innerText = 'An error occurred while submitting your review. Please try again.';
    }
}

function handleResponse(response) {
    const messageDiv = document.getElementById('message');

    if (response.ok) {
        messageDiv.innerText = 'Review submitted successfully!';
        document.getElementById('review-form').reset(); // Clear the form
    } else {
        messageDiv.innerText = 'Failed to submit review: ' + response.statusText;
    }
}
