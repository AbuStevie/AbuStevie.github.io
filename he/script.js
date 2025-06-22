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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzAnQPuQmQumQ_DaE1U6iRtRe0ZPseUpHJLF8MzfhhSphrQorwCFnFcLZ7J5FDwn7_PTQ/exec';


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
// Replace your form.addEventListener('submit', ...) section with this:

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
    
    // Use iframe method to bypass CORS
    submitViaIframe(data);
});

function submitViaIframe(data) {
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'submitFrame';
    document.body.appendChild(iframe);
    
    // Create a form that targets the iframe
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = SCRIPT_URL;
    hiddenForm.target = 'submitFrame';
    hiddenForm.style.display = 'none';
    
    // Create a hidden input with JSON data
    const jsonInput = document.createElement('input');
    jsonInput.type = 'hidden';
    jsonInput.name = 'data';
    jsonInput.value = JSON.stringify(data);
    hiddenForm.appendChild(jsonInput);
    
    // Add all form data as individual inputs (backup method)
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        hiddenForm.appendChild(input);
    });
    
    document.body.appendChild(hiddenForm);
    
    // Handle iframe load event
    iframe.onload = function() {
        console.log('Form submitted successfully');
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
        formStatus.innerText = '';
        
        // Clean up
        setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
            if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
        }, 1000);
    };
    
    // Handle iframe error
    iframe.onerror = function() {
        console.error('Form submission failed');
        submitButton.disabled = false;
        submitButton.innerText = 'שלח את כל התשובות';
        formStatus.innerText = 'שגיאה בשליחה. אנא נסה שוב.';
        formStatus.style.color = 'red';
        
        // Clean up
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
    };
    
    // Submit the form
    hiddenForm.submit();
    
    // Fallback timeout (in case onload doesn't fire)
    setTimeout(() => {
        if (document.body.contains(iframe)) {
            console.log('Submission completed (timeout fallback)');
            form.style.display = 'none';
            thankYouMessage.style.display = 'block';
            formStatus.innerText = '';
            
            // Clean up
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
            if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
        }
    }, 5000);
}