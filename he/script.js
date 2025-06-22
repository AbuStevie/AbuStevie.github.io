// ==================================================================
// == CORRECT & FINAL HEBREW (RTL) JAVASCRIPT FILE (script.js) ==
// == FINAL VERSION                                              ==
// ==================================================================


// --- 1. SETUP: GET ELEMENTS & CONFIGURATION ---
const form = document.getElementById('research-form');
const submitButton = document.getElementById('submit-button');
const formStatus = document.getElementById('form-status');
const thankYouMessage = document.getElementById('thank-you-message');
// !!! PASTE YOUR NEW SCRIPT URL FROM THE DEPLOYMENT HERE !!!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfvGUo2uJNFgZS0CnONVGfQAkh5IlTeIk-xJVjQEBPZX4ijYTnx6nWAaBf3m2kS8ILHg/exec';


// --- 2. INITIALIZE LIBRARIES ---
Fancybox.bind("[data-fancybox]", {
    l10n: { CLOSE: "סגירה", NEXT: "הבא", PREV: "הקודם" },
    rtl: true,
});

function updateTabIndex(swiper) {
    swiper.slides.forEach((slide, index) => {
        const focusableElements = slide.querySelectorAll('input, textarea, button, a');
        const isSlideActive = (index === swiper.activeIndex);
        focusableElements.forEach(el => el.setAttribute('tabindex', isSlideActive ? '0' : '-1'));
    });
}

const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    mousewheel: false,
    rewind: false,
    allowTouchMove: true,
    on: {
        init: updateTabIndex,
        slideChange: updateTabIndex
    }
});


// --- 3. UI INTERACTION LOGIC FOR "OTHER" OPTIONS ---
document.querySelectorAll('.radio-other-group').forEach(group => {
    const otherRadio = group.querySelector('input[type="radio"][value=""]');
    const otherText = group.querySelector('.other-text-input');
    if (!otherRadio || !otherText) return;
    group.addEventListener('change', () => {
        otherText.classList.toggle('hidden', !otherRadio.checked);
        if (!otherRadio.checked) otherText.value = '';
    });
    otherText.addEventListener('input', () => { otherRadio.value = otherText.value.trim(); otherRadio.checked = true; });
});

document.querySelectorAll('.checkbox-other-group').forEach(group => {
    const otherText = group.querySelector('.other-text-input');
    if (!otherText) return;
    const parentOption = otherText.closest('.option');
    if (!parentOption) return;
    const otherCheckbox = parentOption.querySelector('input[type="checkbox"]');
    if (!otherCheckbox) return;
    otherText.disabled = true;
    otherCheckbox.addEventListener('change', () => {
        otherText.disabled = !otherCheckbox.checked;
        if (otherCheckbox.checked) otherText.focus();
        else otherText.value = '';
    });
});


// --- 4. DATA PREPARATION & SUBMISSION ---
function prepareDataForSubmission() {
    document.querySelectorAll('.checkbox-other-group').forEach(group => {
        const otherText = group.querySelector('.other-text-input');
        if (!otherText) return;
        const parentOption = otherText.closest('.option');
        if (!parentOption) return;
        const otherCheckbox = parentOption.querySelector('input[type="checkbox"]');
        if (otherCheckbox && otherCheckbox.checked && otherText.value.trim() !== '') {
            // BUG FIX: Set the *value* of the checkbox to the text content
            otherCheckbox.value = otherText.value.trim();
        }
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const activeElement = document.activeElement;
    if (activeElement && activeElement.matches('input:not([type=submit]), textarea')) {
        swiper.slideNext();
        return;
    }
    
    prepareDataForSubmission();
    submitButton.disabled = true;
    submitButton.innerText = 'שולח...';
    const formData = new FormData(form);
    const data = {};
    const keys = [...new Set(formData.keys())];
    keys.forEach(key => {
        const values = formData.getAll(key);
        data[key] = (values.length === 1) ? values[0] : values.join(', ');
    });

    // The Fetch Call
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', // Essential for cross-origin requests
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(responseData => {
        console.log('Success:', responseData);
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
    })
    .catch((error) => {
        console.error('Error during fetch:', error);
        submitButton.disabled = false;
        submitButton.innerText = 'שלח את כל התשובות';
        formStatus.innerText = `שגיאה: ${error.message}. אנא נסה שוב.`;
        formStatus.style.color = 'red';
    });
});

if (document.getElementById('participantID')) {
    document.getElementById('participantID').value = 'P' + Date.now();
}