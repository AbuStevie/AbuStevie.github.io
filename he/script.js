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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby10OR8nyUlRPImqJ53GNevrfjEcQgtlEECMePuP8VpIalQhHM9vIDVh106zF2s15kbag/exec';


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
// --- 5. FORM SUBMISSION LOGIC ---
// // Replace your form submission code with this:

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
    formStatus.innerText = 'שולח נתונים...';
    formStatus.style.color = 'blue';
    
    const formData = new FormData(form);
    const data = {};
    const keys = [...new Set(formData.keys())];
    keys.forEach(key => {
        const values = formData.getAll(key);
        data[key] = (values.length === 1) ? values[0] : values.join(', ');
    });

    console.log('Sending data:', data);

    // Try a simpler fetch approach
    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Success:', responseData);
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
        formStatus.innerText = '';
    })
    .catch((error) => {
        console.error('Fetch error details:', error);
        submitButton.disabled = false;
        submitButton.innerText = 'שלח את כל התשובות';
        formStatus.innerText = `שגיאה: ${error.message}. אנא נסה שוב.`;
        formStatus.style.color = 'red';
        
        // Try alternative approach if CORS fails
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            console.log('CORS error detected, trying alternative method...');
            tryAlternativeSubmission(data);
        }
    });
});

// Alternative submission method using a form POST (bypasses CORS)
function tryAlternativeSubmission(data) {
    formStatus.innerText = 'מנסה שיטה חלופית...';
    formStatus.style.color = 'orange';
    
    // Create a hidden form for direct POST submission
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = SCRIPT_URL;
    hiddenForm.style.display = 'none';
    
    // Add all data as hidden inputs
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        hiddenForm.appendChild(input);
    });
    
    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    
    // Show success message after a delay (since we can't get response from form submit)
    setTimeout(() => {
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
        formStatus.innerText = '';
    }, 2000);
}