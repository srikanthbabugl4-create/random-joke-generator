// Joke API endpoints
const JOKE_APIs = {
    general: 'https://v2.jokeapi.dev/joke/General?type=single',
    programming: 'https://v2.jokeapi.dev/joke/Programming?type=single',
    'knock-knock': 'https://v2.jokeapi.dev/joke/Knock-Knock?type=single',
    any: 'https://v2.jokeapi.dev/joke/Any?type=single'
};

// DOM Elements
const jokeText = document.getElementById('joke-text');
const newJokeBtn = document.getElementById('new-joke-btn');
const copyBtn = document.getElementById('copy-btn');
const categorySelect = document.getElementById('category');
const loader = document.getElementById('loader');
const statusMessage = document.getElementById('status-message');

let currentJoke = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    newJokeBtn.addEventListener('click', fetchJoke);
    copyBtn.addEventListener('click', copyToClipboard);
    categorySelect.addEventListener('change', fetchJoke);
});

/**
 * Fetch a random joke from the API
 */
async function fetchJoke() {
    const category = categorySelect.value;
    const apiUrl = JOKE_APIs[category];

    // Show loader and disable buttons
    showLoader(true);
    newJokeBtn.disabled = true;
    copyBtn.disabled = true;
    statusMessage.textContent = 'Loading...';
    statusMessage.className = '';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.message || 'Failed to fetch joke');
        }

        // Display the joke
        currentJoke = data.joke;
        jokeText.textContent = currentJoke;
        statusMessage.textContent = '✓ Joke loaded!';
        statusMessage.className = 'success';

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeText.textContent = 'Oops! Failed to load a joke. Please try again.';
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.className = 'error';
    } finally {
        // Hide loader and enable buttons
        showLoader(false);
        newJokeBtn.disabled = false;
        copyBtn.disabled = false;
    }
}

/**
 * Copy current joke to clipboard
 */
function copyToClipboard() {
    if (!currentJoke) {
        statusMessage.textContent = 'No joke to copy!';
        statusMessage.className = 'error';
        return;
    }

    navigator.clipboard.writeText(currentJoke).then(() => {
        statusMessage.textContent = '✓ Copied to clipboard!';
        statusMessage.className = 'success';

        // Reset message after 2 seconds
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 2000);
    }).catch(error => {
        console.error('Failed to copy:', error);
        statusMessage.textContent = 'Failed to copy joke';
        statusMessage.className = 'error';
    });
}

/**
 * Toggle loader visibility
 */
function showLoader(show) {
    if (show) {
        loader.classList.add('active');
    } else {
        loader.classList.remove('active');
    }
}

// Fetch a joke on page load
window.addEventListener('load', fetchJoke);