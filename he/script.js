// ==================================================================
// == IMPROVED HEBREW (RTL) JAVASCRIPT FILE (script.js) ==
// == OPTIMIZED FOR BETTER SWIPE GESTURES ON MOBILE & TOUCH LAPTOPS ==
// ==================================================================
// adding some comment
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

// log swipe listeners to detect conflicting listeners
document.addEventListener('touchstart', e => {
  console.log('TOUCHSTART:', e.target);
}, { capture: true });

document.addEventListener('touchmove', e => {
  console.log('TOUCHMOVE:', e.target);
}, { capture: true });

// Replace your old Swiper initialization with this new one.

const swiper = new Swiper('.swiper', {
    // --- Basic Navigation ---
    direction: 'horizontal',
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    mousewheel: false,
    rewind: false,

    // --- Balanced Swipe Feel Settings ---
    // These work well with the CSS `touch-action` fix.
    grabCursor: true,   // Shows a "grab" hand cursor on desktop.
    threshold: 10,      // User must drag at least 10px to start a swipe.
    longSwipesRatio: 0.1, // A drag of 10% of the screen width will change the slide.

    // --- This is what lets your range slider work correctly ---
    // It tells Swiper: "Do not start a page swipe if the touch starts on a range slider."
    noSwipingSelector: 'input[type="range"]',

    // --- This keeps your keyboard navigation fix working ---
    on: {
        init: updateTabIndex,
        slideChange: updateTabIndex
    }
});
/*
// --- Initialize Swiper.js with OPTIMIZED touch controls ---
const swiper = new Swiper('.swiper', {
    // --- Basic Navigation ---
    direction: 'horizontal',
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    
    // --- DISABLE CONFLICTING FEATURES ---
    mousewheel: false,
    rewind: false,
    
    // --- OPTIMIZED SWIPE SETTINGS FOR BETTER RESPONSIVENESS ---
    touchRatio: 1.4,              // Full touch sensitivity (default but explicit)
    touchAngle: 45,             // Allow swipes within 45 degrees of horizontal
    
    // --- CRITICAL: More sensitive thresholds ---
    longSwipesRatio: 0.1,      // User needs to drag only 15% of screen width
    shortSwipes: true,          // Enable quick flick gestures
    longSwipesMs: 200,          // Reduce time threshold for long swipes
    
    // --- VERY IMPORTANT: Lower resistance for better feel ---
    resistance: true,
    resistanceRatio: 0.25,      // Less resistance when reaching edges
    
    // --- GESTURE DETECTION IMPROVEMENTS ---
    threshold: 5,               // Very low threshold - start detecting swipe after 3px
    touchStartPreventDefault: false,  // Don't prevent default on touch start
    
    // --- SPEED AND RESPONSIVENESS ---
    speed: 300,                 // Faster transition speed
    followFinger: true,         // Slide follows finger during drag
    grabCursor: true,           // Show grab cursor on desktop
    
    // --- CRITICAL: Prevent conflicts with range sliders ---
    noSwiping: true,            // Enable the noSwiping feature
    noSwipingClass: 'swiper-no-swiping',
    noSwipingSelector: 'input[type="range"], .range-slider-container, input[type="text"], textarea, select, button',
    
    // --- TOUCH EVENTS OPTIMIZATION ---
    touchEventsTarget: 'wrapper', // Better touch event handling
    simulateTouch: true,          // Enable mouse simulation of touch
    allowTouchMove: true,         // Allow touch move events
    
    // --- PREVENT BOUNCE/OVERFLOW ---
    preventClicks: false,         // Don't prevent clicks after swipe
    preventClicksPropagation: false,
    
    // --- IMPROVED EDGE DETECTION ---
    watchOverflow: true,          // Watch for overflow and disable navigation if needed
    
    // --- TabIndex management and custom event handling ---
    on: {
        init: function(swiper) {
            updateTabIndex(swiper);
            console.log('Swiper initialized');
        },
        slideChange: function(swiper) {
            updateTabIndex(swiper);
            console.log('Slide changed to:', swiper.activeIndex);
        },
        touchStart: function(swiper, event) {
            // Additional logging for debugging
            console.log('Touch start detected');
        },
        touchMove: function(swiper, event) {
            // Check if we're touching a slider or input
            const target = event.target;
            if (target && (
                target.type === 'range' || 
                target.closest('.range-slider-container') ||
                target.type === 'text' ||
                target.type === 'textarea' ||
                target.tagName === 'TEXTAREA'
            )) {
                swiper.allowTouchMove = false;
            } else {
                swiper.allowTouchMove = true;
            }
        },
        touchEnd: function(swiper) {
            swiper.allowTouchMove = true; // Re-enable touch move after touch ends
        }
    }
});
*/
// --- ADDITIONAL FIX: Prevent swiper interference with range sliders ---
document.addEventListener('DOMContentLoaded', function() {
    // Add no-swiping class to all range slider containers
    const rangeContainers = document.querySelectorAll('.range-slider-container');
    rangeContainers.forEach(container => {
        container.classList.add('swiper-no-swiping');
    });
    
    // Add event listeners to range inputs for additional protection
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        input.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            swiper.allowTouchMove = false;
        });
        
        input.addEventListener('touchend', function(e) {
            setTimeout(() => {
                swiper.allowTouchMove = true;
            }, 100);
        });
        
        input.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    });
    
    // Same protection for text inputs and textareas
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        input.classList.add('swiper-no-swiping');
        input.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
        input.addEventListener('focus', function() {
            swiper.allowTouchMove = false;
        });
        input.addEventListener('blur', function() {
            setTimeout(() => {
                swiper.allowTouchMove = true;
            }, 100);
        });
    });
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
    otherText.addEventListener('input', () => { 
        otherRadio.value = otherText.value.trim(); 
        otherRadio.checked = true; 
    });
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
            otherCheckbox.value = otherText.value.trim();
        }
    });
}

// --- 5. FORM SUBMISSION LOGIC ---
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