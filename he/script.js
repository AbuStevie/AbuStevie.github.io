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
const successOverlay = document.getElementById('success-overlay');
const successAudio = document.getElementById('success-audio');
// !!! PASTE YOUR NEW SCRIPT URL FROM THE DEPLOYMENT HERE !!!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzAnQPuQmQumQ_DaE1U6iRtRe0ZPseUpHJLF8MzfhhSphrQorwCFnFcLZ7J5FDwn7_PTQ/exec';

// NEW: User Agent data collection
if (document.getElementById('user-agent-field')) {
    document.getElementById('user-agent-field').value = navigator.userAgent;
}

// --- 2. INITIALIZE LIBRARIES ---

Fancybox.bind("[data-fancybox]", {
    // --- הגדרות קיימות ---
    l10n: { CLOSE: "סגירה", NEXT: "הבא", PREV: "הקודם" },
    rtl: true,
    Hash: false, // אנחנו עדיין רוצים שההגדרה הזו תהיה כבויה

    // --- הוספת לוגיקה חדשה עם אירועים (events) ---
    on: {
        // אירוע שרץ רגע לפני ש-Fancybox מופיע
        init: (fancybox) => {
            // הוספת "מצב" להיסטוריית הדפדפן באופן ידני
            // זה יוצר "עמוד" מזויף שהכפתור "Back" יוכל לחזור ממנו
            window.history.pushState({ fancybox: true }, "");

            // יצירת "מאזין" לאירוע של שינוי בהיסטוריה (כמו לחיצה על "Back")
            window.onpopstate = (event) => {
                // אם המשתמש לחץ "Back", פשוט נסגור את Fancybox
                fancybox.close();
            };
        },

        // אירוע שרץ אחרי ש-Fancybox נסגר
        destroy: (fancybox) => {
            // אם המשתמש סגר את Fancybox (עם כפתור ה-X או Esc),
            // אנחנו צריכים "לנקות" את המצב המזויף שהוספנו להיסטוריה
            if (window.history.state && window.history.state.fancybox) {
                window.history.back(); // זה מנקה את ה-pushState שעשינו
            }
            // מנקים את המאזין כדי שלא יפריע לפעולות אחרות
            window.onpopstate = null;
        }
    }
});

function updateTabIndex(swiper) {
    swiper.slides.forEach((slide, index) => {
        const focusableElements = slide.querySelectorAll('input, textarea, button, a');
        const isSlideActive = (index === swiper.activeIndex);
        focusableElements.forEach(el => el.setAttribute('tabindex', isSlideActive ? '0' : '-1'));
    });
}

// --- NEW, COMPREHENSIVE EVENT LOGGING FOR DEBUGGING ---
// We will listen for all relevant events on the entire document to see the sequence.

console.log("Debug listeners are active. Tap a checkbox to see the event sequence.");

const eventsToLog = ['touchstart', 'touchend', 'click'];

eventsToLog.forEach(eventName => {
    document.addEventListener(eventName, e => {
        // We only care about events happening inside an ".option" container
        if (e.target.closest('.option')) {
            console.log(
                `EVENT: ${eventName.toUpperCase()}`, // e.g., "TOUCHSTART"
                `| TARGET: ${e.target.tagName}`,      // e.g., "INPUT" or "LABEL"
                `| ID: ${e.target.id || 'none'}`         // The ID of the element, if it has one
            );
        }
    }, { capture: true }); // Use 'capture: true' to log events in the order they happen.
});
// --- 2.1. Swiper.js Initialization ---
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

    // --- Fix: allow native vertical scroll inside slide-content ---
    touchStartPreventDefault: false,

    // --- Balanced Swipe Feel Settings ---
    grabCursor: true,   // Shows a "grab" hand cursor on desktop.
    threshold: 10,      // User must drag at least 10px to start a swipe.
    longSwipesRatio: 0.1, // A drag of 10% of the screen width will change the slide.

    // --- This is what lets your range slider work correctly ---
    noSwipingSelector: 'input[type="range"]',

    // --- Swiper Event Callbacks ---
    on: {
        init: (swiper) => {
            updateTabIndex(swiper);
            // Initial progress bar update will happen after checkRestoreState
        },
        slideChange: (swiper) => {
            // Hide onboarding nav overlay on first slide change
            if (window._onboardingHideNav) window._onboardingHideNav();
            // Instantly scroll the entire window to the top on any slide change.
            window.scrollTo({ top: 0, behavior: 'auto' });
            updateTabIndex(swiper);
            
            // Update progress bar
            updateProgressBar(swiper);
            
            // Auto-save slide index
            saveFormState();

            // Check if the new active slide is the LAST slide
            if (swiper.isEnd) {
                // If so, find its content area and scroll it to the top.
                const lastSlideContent = swiper.slides[swiper.activeIndex].querySelector('.slide-content');
                if (lastSlideContent) {
                    lastSlideContent.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
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
    
    // Same protection for text inputs and textareas (and emails)
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
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

// --- CORRECTED LOGIC FOR RADIO BUTTON "OTHER" ---
document.querySelectorAll('.radio-other-group').forEach(group => {
    
    // Find the "Other" text input first, as it's unique.
    const otherText = group.querySelector('.other-text-input');
    if (!otherText) return;

    // Find its parent '.option' container.
    const parentOption = otherText.closest('.option');
    if (!parentOption) return;

    // Now, precisely find the radio button inside that specific container.
    const otherRadio = parentOption.querySelector('input[type="radio"]');
    if (!otherRadio) return;

    // --- The logic below is now attached to the CORRECT radio button ---

    // Ensure the text input is hidden initially.
    otherText.classList.add('hidden');

    // Listen for changes on ANY radio button in the group.
    group.addEventListener('change', () => {
        // If the "Other" radio button is the one that's checked...
        if (otherRadio.checked) {
            otherText.classList.remove('hidden'); // Show the text input.
        } 
        // If any other radio button was checked...
        else {
            otherText.classList.add('hidden');    // Hide the text input.
            otherText.value = '';               // And clear its text.
        }
    });

    // Listen for typing in the text box.
    otherText.addEventListener('input', () => {
        // As the user types, dynamically update the VALUE of the "Other" radio button.
        otherRadio.value = otherText.value.trim();
        // Also, ensure the "Other" radio button is programmatically checked.
        otherRadio.checked = true;
    });
});
// --- 3. CHECKBOX "OTHER" LOGIC ---
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

// --- IMPROVED FIX FOR CHECKBOX TOUCH ISSUES ---
// Replace your current checkbox fix with this improved version

document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
    let touchHandled = false;
    let lastClickTime = 0;

    // Handle touch events
    checkbox.addEventListener('touchstart', (e) => {
        touchHandled = false;
        console.log(`Touch start on checkbox ${checkbox.id}`);
    });

    checkbox.addEventListener('touchend', (e) => {
        // Prevent the synthetic click that browsers generate after touchend
        e.preventDefault();
        
        // Only toggle if we haven't already handled this touch
        if (!touchHandled) {
            touchHandled = true;
            
            // Manually toggle the checkbox
            checkbox.checked = !checkbox.checked;
            
            // Trigger change event for any listeners that depend on it
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log(`Checkbox ${checkbox.id} toggled via touch to: ${checkbox.checked}`);
        }
    });

    // Handle mouse clicks (for desktop)
    checkbox.addEventListener('click', (e) => {
        const currentTime = Date.now();
        
        // If this click is too close to the last one, it's probably a duplicate
        if (currentTime - lastClickTime < 300) {
            e.preventDefault();
            console.log(`Duplicate click prevented on ${checkbox.id}`);
            return;
        }
        
        // If touch was handled, prevent the click
        if (touchHandled) {
            e.preventDefault();
            touchHandled = false; // Reset for next interaction
            console.log(`Click prevented after touch on ${checkbox.id}`);
            return;
        }
        
        lastClickTime = currentTime;
        console.log(`Checkbox ${checkbox.id} clicked with mouse to: ${checkbox.checked}`);
    });

    // Reset touch state when focus moves away
    checkbox.addEventListener('blur', () => {
        touchHandled = false;
    });
});

// Alternative approach - even simpler
// If the above doesn't work perfectly, try this approach instead:

/*
document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
    let isProcessing = false;

    const handleToggle = (e, source) => {
        if (isProcessing) {
            e.preventDefault();
            return;
        }

        isProcessing = true;
        console.log(`Checkbox ${checkbox.id} toggled via ${source}`);

        // Reset processing flag after a short delay
        setTimeout(() => {
            isProcessing = false;
        }, 200);
    };

    // For touch devices, use touchend instead of click
    if ('ontouchstart' in window) {
        checkbox.addEventListener('touchend', (e) => {
            e.preventDefault(); // Prevent synthetic click
            
            if (!isProcessing) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                handleToggle(e, 'touch');
            }
        });
        
        // Prevent clicks on touch devices
        checkbox.addEventListener('click', (e) => {
            e.preventDefault();
        });
    } else {
        // For mouse devices, use click
        checkbox.addEventListener('click', (e) => {
            handleToggle(e, 'mouse');
        });
    }
});
*/

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

// --- 5. This is the main submission listener. ---
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Check for keyboard "Next" button press
    const activeElement = document.activeElement;
    if (activeElement && activeElement.matches('input:not([type=submit]), textarea')) {
        swiper.slideNext();
        return; // Stop here, do not submit
    }

    // --- If we get here, it was a real submission. ---
    
    // Prepare the data from the "Other" fields first.
    prepareDataForSubmission();

    submitButton.disabled = true;
    submitButton.innerText = 'שולח...';
    
    // --- NEW, MORE ROBUST DATA COLLECTION METHOD ---
    const data = {};
    const elements = form.elements; // Get all elements in the form.

    for (let i = 0; i < elements.length; i++) {
        const field = elements[i];
        
        // Skip buttons and fields without a name
        if (!field.name || field.type === 'button' || field.type === 'submit') {
            continue;
        }

        // Handle checkboxes
        if (field.type === 'checkbox') {
            if (field.checked) {
                // If the key already exists, append the new value (for multi-select)
                if (data[field.name]) {
                    data[field.name] += ', ' + field.value;
                } else {
                    data[field.name] = field.value;
                }
            }
        } 
        // Handle radio buttons
        else if (field.type === 'radio') {
            if (field.checked) {
                data[field.name] = field.value;
            }
        } 
        // Handle all other fields (text, number, hidden, etc.)
        else {
            data[field.name] = field.value;
        }
    }
    // --- END OF NEW DATA COLLECTION METHOD ---
    
    console.log('Sending data:', data);
    
    // The iframe submission method remains the same and will now work correctly.
    submitViaIframe(data);
});

function submitViaIframe(data) {
    const iframe = document.createElement('iframe');
    iframe.name = 'submitFrame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = SCRIPT_URL;
    hiddenForm.target = iframe.name;
    hiddenForm.style.display = 'none';
    
    const jsonInput = document.createElement('input');
    jsonInput.type = 'hidden';
    jsonInput.name = 'data';
    jsonInput.value = JSON.stringify(data);
    hiddenForm.appendChild(jsonInput); // Corrected this line from my previous response too
    
    document.body.appendChild(hiddenForm);

    const showSuccessScreen = () => {
        if (form.style.display !== 'none') {
            // Clear saved form progress on successful submission
            localStorage.removeItem('electronic_producers_ct_state');
            
            form.style.display = 'none';
            successOverlay.style.display = 'flex';
            if (successAudio) {
                successAudio.play().catch(e => console.error("Audio play failed:", e));
            }
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
            if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
        }
    };
    
    // Action for when submission is successful
    iframe.onload = showSuccessScreen;
    
    // KEEP your existing, detailed error logic
    iframe.onerror = function() {
        console.error('Form submission failed');
        submitButton.disabled = false;
        submitButton.innerText = 'שלח את כל התשובות';
        formStatus.innerText = 'שגיאה בשליחה. אנא נסה שוב.';
        formStatus.style.color = 'red';
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
    };
    
    hiddenForm.submit();
    
    // The fallback timeout now calls the new success function
    setTimeout(showSuccessScreen, 5000);
}

// ==================================================================
// == 6. PROGRESS BAR AND AUTO-SAVE LOGIC FOR V3.0 ==
// ==================================================================

// Update the progress bar visual filling and text
function updateProgressBar(swiperInstance) {
    if (!swiperInstance) return;
    const totalSlides = swiperInstance.slides.length - 1;
    const currentSlide = swiperInstance.activeIndex;
    const percentage = Math.round((currentSlide / totalSlides) * 100);
    
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressBarFill) {
        progressBarFill.style.width = percentage + '%';
        
        // Dynamically change battery fill color based on level
        if (percentage <= 20) {
            progressBarFill.style.backgroundColor = '#dc3545'; // Red
        } else if (percentage <= 50) {
            progressBarFill.style.backgroundColor = '#ffc107'; // Orange/Yellow
        } else {
            progressBarFill.style.backgroundColor = '#28a745'; // Green
        }
    }
    if (progressPercentage) {
        progressPercentage.innerText = percentage + '% הושלם';
    }
}

// Save form state to localStorage
function saveFormState() {
    if (!form || !swiper) return;
    
    const data = {};
    const elements = form.elements;

    for (let i = 0; i < elements.length; i++) {
        const field = elements[i];
        
        // Skip fields without name or buttons
        if (!field.name || field.type === 'button' || field.type === 'submit' || field.id === 'user-agent-field') {
            continue;
        }

        if (field.type === 'checkbox') {
            if (!data[field.name]) {
                data[field.name] = [];
            }
            if (field.checked) {
                data[field.name].push(field.value);
            }
        } 
        else if (field.type === 'radio') {
            if (field.checked) {
                data[field.name] = field.value;
            }
        } 
        else {
            data[field.name] = field.value;
        }
    }
    
    // Save state of other text inputs by ID (including those that might be disabled)
    const extraInputs = {};
    document.querySelectorAll('.other-text-input').forEach(input => {
        extraInputs[input.id] = {
            value: input.value,
            disabled: input.disabled,
            hidden: input.classList.contains('hidden')
        };
    });

    const state = {
        formData: data,
        extraInputs: extraInputs,
        currentSlide: swiper.activeIndex,
        timestamp: Date.now()
    };

    localStorage.setItem('electronic_producers_ct_state', JSON.stringify(state));
}

// Restore form state from parsed state object
function restoreFormState(state) {
    if (!state) return;
    
    const { formData, extraInputs, currentSlide } = state;

    // Restore standard form elements
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        const field = elements[i];
        if (!field.name) continue;

        if (field.type === 'checkbox') {
            const savedVals = formData[field.name];
            if (Array.isArray(savedVals)) {
                field.checked = savedVals.includes(field.value);
            }
        } 
        else if (field.type === 'radio') {
            const savedVal = formData[field.name];
            if (savedVal !== undefined) {
                field.checked = (field.value === savedVal);
            }
        } 
        else {
            const savedVal = formData[field.name];
            if (savedVal !== undefined) {
                field.value = savedVal;
            }
        }
    }

    // Restore extra inputs (other text boxes)
    if (extraInputs) {
        for (const id in extraInputs) {
            const inputEl = document.getElementById(id);
            if (inputEl) {
                inputEl.value = extraInputs[id].value;
                inputEl.disabled = extraInputs[id].disabled;
                if (extraInputs[id].hidden) {
                    inputEl.classList.add('hidden');
                } else {
                    inputEl.classList.remove('hidden');
                }
            }
        }
    }

    // Sync searchable dropdown search input
    const countryHidden = document.getElementById('q1b');
    const countrySearch = document.getElementById('country-search');
    if (countryHidden && countrySearch) {
        countrySearch.value = countryHidden.value || '';
    }

    // Trigger change event to let validation/logic run
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Go to saved slide index
    setTimeout(() => {
        swiper.slideTo(currentSlide, 0);
        updateProgressBar(swiper);
    }, 100);
}

// Check if there is saved state on load and display prompt
function checkRestoreState() {
    const savedStateStr = localStorage.getItem('electronic_producers_ct_state');
    if (!savedStateStr) {
        // Just init progress bar to 0%
        updateProgressBar(swiper);
        return;
    }
    
    try {
        const state = JSON.parse(savedStateStr);
        // Show restore modal
        const restoreModal = document.getElementById('restore-modal');
        if (restoreModal) {
            restoreModal.style.display = 'flex';
            
            document.getElementById('btn-restore-yes').addEventListener('click', () => {
                restoreFormState(state);
                restoreModal.style.display = 'none';
            });
            
            document.getElementById('btn-restore-no').addEventListener('click', () => {
                localStorage.removeItem('electronic_producers_ct_state');
                restoreModal.style.display = 'none';
                updateProgressBar(swiper);
            });
        }
    } catch(e) {
        console.error("Error parsing saved state:", e);
        localStorage.removeItem('electronic_producers_ct_state');
        updateProgressBar(swiper);
    }
}

// Reorganize CT slides into two columns (left for text/answers, right for main image)
function setupCTSplitLayout() {
    const ctSlides = document.querySelectorAll('.ct-slide');
    const isMobile = window.innerWidth <= 768;

    ctSlides.forEach(slide => {
        const slideContent = slide.querySelector('.slide-content');
        if (!slideContent) return;

        let leftCol = slideContent.querySelector('.ct-left-column');
        let rightCol = slideContent.querySelector('.ct-right-column');
        const mainImgLinks = Array.from(slideContent.querySelectorAll('a[data-fancybox]:not(.image-answer-options a)'));

        if (!leftCol || !rightCol) {
            // First time setup
            slideContent.classList.add('ct-split-layout');

            leftCol = document.createElement('div');
            leftCol.className = 'ct-column ct-left-column'; // Text & Answers
            
            rightCol = document.createElement('div');
            rightCol.className = 'ct-column ct-right-column'; // Main Image

            const children = Array.from(slideContent.childNodes);
            children.forEach(child => {
                if (mainImgLinks.includes(child)) {
                    if (child === mainImgLinks[0]) {
                        rightCol.appendChild(child);
                    } else {
                        // Second image (code block)
                        if (isMobile) {
                            leftCol.appendChild(child);
                        } else {
                            rightCol.appendChild(child);
                        }
                    }
                } else {
                    leftCol.appendChild(child);
                }
            });

            slideContent.innerHTML = '';
            slideContent.appendChild(rightCol); // Right/Top (main image)
            slideContent.appendChild(leftCol);  // Left/Bottom (questions & answers)
        } else {
            // Already split, handle resize for multiple images
            if (mainImgLinks.length > 1) {
                const secondImgLink = mainImgLinks[1];
                if (isMobile) {
                    // In mobile, move second image (code block) to left column, under question text but before options
                    const optionsGrid = leftCol.querySelector('.options, .image-answer-options');
                    if (optionsGrid && secondImgLink.parentNode !== leftCol) {
                        leftCol.insertBefore(secondImgLink, optionsGrid);
                    } else if (!leftCol.contains(secondImgLink)) {
                        leftCol.appendChild(secondImgLink);
                    }
                } else {
                    // In desktop, move second image to right column, under first image
                    if (secondImgLink.parentNode !== rightCol) {
                        rightCol.appendChild(secondImgLink);
                    }
                }
            }
        }
    });
}

// Global list of countries (English names, as required for Google Sheets)
const countriesList = [
    "Israel", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
    "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", 
    "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", 
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", 
    "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Jamaica", "Japan", "Jordan", 
    "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", 
    "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", 
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", 
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", 
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", 
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"
];

// Initialize custom searchable country select component
function setupSearchableCountryDropdown() {
    const container = document.getElementById('country-select-container');
    const searchInput = document.getElementById('country-search');
    const optionsWrapper = container ? container.querySelector('.custom-select-options-wrapper') : null;
    const optionsList = document.getElementById('country-options-list');
    const hiddenInput = document.getElementById('q1b');

    if (!container || !searchInput || !optionsList || !hiddenInput) return;

    // Detect if RTL / Hebrew (to keep Israel at top)
    const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'he';
    let sortedCountries;
    if (isRtl) {
        // Hebrew: Israel at the top, then alphabetically sorted rest
        sortedCountries = ["Israel", ...countriesList.filter(c => c !== "Israel").sort()];
    } else {
        // English: Everything sorted alphabetically
        sortedCountries = [...countriesList].sort();
    }

    function renderOptions(filterText = "") {
        optionsList.innerHTML = '';
        const searchVal = filterText.toLowerCase().trim();
        const filtered = sortedCountries.filter(country => 
            country.toLowerCase().includes(searchVal)
        );

        if (filtered.length === 0) {
            const noResultsLi = document.createElement('li');
            noResultsLi.className = 'custom-select-option no-results';
            noResultsLi.innerText = isRtl ? 'אין תוצאות מתאימות' : 'No matching results';
            optionsList.appendChild(noResultsLi);
            return;
        }

        filtered.forEach(country => {
            const li = document.createElement('li');
            li.className = 'custom-select-option';
            if (hiddenInput.value === country) {
                li.classList.add('selected');
            }
            li.innerText = country;
            li.addEventListener('click', () => {
                hiddenInput.value = country;
                searchInput.value = country;
                
                // Trigger change event to save the state
                hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
                closeDropdown();
            });
            optionsList.appendChild(li);
        });
    }

    function openDropdown() {
        container.classList.add('open');
        optionsWrapper.style.display = 'block';
        if (typeof swiper !== 'undefined') {
            swiper.allowTouchMove = false;
        }
    }

    function closeDropdown() {
        container.classList.remove('open');
        optionsWrapper.style.display = 'none';
        if (typeof swiper !== 'undefined') {
            swiper.allowTouchMove = true;
        }
    }

    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
        openDropdown();
        renderOptions(searchInput.value);
    });

    searchInput.addEventListener('focus', () => {
        openDropdown();
    });

    searchInput.addEventListener('input', () => {
        openDropdown();
        renderOptions(searchInput.value);
        
        const typedVal = searchInput.value.trim().toLowerCase();
        const matchingCountry = sortedCountries.find(c => c.toLowerCase() === typedVal);
        if (matchingCountry) {
            hiddenInput.value = matchingCountry;
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            hiddenInput.value = '';
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            closeDropdown();
            if (hiddenInput.value) {
                searchInput.value = hiddenInput.value;
            } else {
                searchInput.value = '';
            }
        }
    });

    renderOptions();

    optionsWrapper.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
}

// Victory Audio Visibility/Focus Handlers (Page Visibility API - onPause/onResume behavior)
function handleVisibilityChange() {
    if (!successAudio) return;
    const isSuccessActive = successOverlay && successOverlay.style.display === 'flex';
    if (isSuccessActive) {
        if (document.hidden) {
            successAudio.pause();
        } else {
            successAudio.play().catch(e => console.error("Audio play failed:", e));
        }
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('blur', () => {
    if (successAudio && successOverlay && successOverlay.style.display === 'flex') {
        successAudio.pause();
    }
});
window.addEventListener('focus', () => {
    if (successAudio && successOverlay && successOverlay.style.display === 'flex' && !document.hidden) {
        successAudio.play().catch(e => console.error("Audio play failed:", e));
    }
});

// Setup auto-save event listeners
form.addEventListener('input', saveFormState);
form.addEventListener('change', saveFormState);

// Trigger check after DOMContentLoaded / init
document.addEventListener('DOMContentLoaded', () => {
    setupCTSplitLayout();
    setupSearchableCountryDropdown();
    checkRestoreState();
});

// Handle resize event dynamically for CT layouts
window.addEventListener('resize', setupCTSplitLayout);

// === Onboarding overlay logic ===
(function() {
    const scrollOverlay = document.getElementById('onboarding-scroll');
    const navOverlay = document.getElementById('onboarding-nav');
    if (!scrollOverlay || !navOverlay) return;

    const slide1Content = document.querySelector('#slide-1-onboarding .slide-content');
    let scrollDone = false;
    let navDone = false;

    function hideOverlay(el, cb) {
        el.classList.add('fade-out');
        setTimeout(() => { el.style.display = 'none'; if (cb) cb(); }, 400);
    }

    // Phase 1: hide scroll hint on first scroll, show nav hint
    if (slide1Content) {
        slide1Content.addEventListener('scroll', function onScroll() {
            if (scrollDone) return;
            scrollDone = true;
            slide1Content.removeEventListener('scroll', onScroll);
            hideOverlay(scrollOverlay, () => {
                if (navDone) return;
                navOverlay.style.display = 'flex';
            });
        }, { passive: true });
    }

    // Also hide scroll hint after 4s if user doesn't scroll (content fits screen)
    setTimeout(() => {
        if (!scrollDone) {
            scrollDone = true;
            hideOverlay(scrollOverlay, () => {
                if (navDone) return;
                navOverlay.style.display = 'flex';
            });
        }
    }, 4000);

    // Phase 2: hide nav hint on slide change
    document.addEventListener('swiper-slide-changed', () => {
        if (navDone) return;
        navDone = true;
        hideOverlay(navOverlay);
    });

    // Hook into Swiper slideChange event
    const origSlideChange = window._onboardingSlideChange;
    window._onboardingHideNav = function() {
        if (navDone) return;
        navDone = true;
        hideOverlay(navOverlay);
    };
})();