// --- LTR VERSION ---

// Initialize Fancybox (no specific RTL settings needed for English)
Fancybox.bind("[data-fancybox]", {
    l10n: {
        CLOSE: "Close",
        NEXT: "Next",
        PREV: "Previous",
    },
});

// Initialize Swiper.js
const swiper = new Swiper('.swiper', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    mousewheel: false,
    rewind: false,
    allowTouchMove: true,
});

// --- Upgraded Form Submission Logic (Handles Checkboxes) ---
const form = document.getElementById('research-form');
const submitButton = document.getElementById('submit-button');
const formStatus = document.getElementById('form-status');
const thankYouMessage = document.getElementById('thank-you-message');

// !!! IMPORTANT: PASTE YOUR WEB APP URL HERE
const SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

// Generate a simple unique ID for the participant
if (document.getElementById('participantID')) {
    document.getElementById('participantID').value = 'P' + Date.now();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    const formData = new FormData(form);
    const data = {};
    const keys = [...new Set(formData.keys())];

    keys.forEach(key => {
        const values = formData.getAll(key);
        if (values.length === 1) {
            data[key] = values[0];
        } else {
            data[key] = values.join(', '); // Join checkbox values
        }
    });

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(responseData => {
        console.log('Success:', responseData);
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
    })
    .catch((error) => {
        console.error('Error:', error);
        submitButton.disabled = false;
        submitButton.innerText = 'Submit All Responses';
        formStatus.innerText = 'Error: Could not submit. Please try again.';
        formStatus.style.color = 'red';
    });
});