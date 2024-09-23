// script.js

let selectedPronouns = {};
let selectedName = '';

// Check if name or pronouns are saved in localStorage
window.onload = () => {
    const storedPronouns = localStorage.getItem('pronouns');
    const storedName = localStorage.getItem('name');
    const dontAskAgain = localStorage.getItem('dontAskAgain');

    if (storedPronouns) {
        const pronouns = JSON.parse(storedPronouns);
        updatePronouns(pronouns);
    } else if (storedName) {
        updateName(storedName);
    }

    // Show or hide the popup based on 'Don't ask again' preference
    const popupElement = document.getElementById('pronoun-popup');
    if (popupElement) {
        if (dontAskAgain) {
            popupElement.classList.add('hidden');
        } else {
            popupElement.classList.remove('hidden');
        }
    }
};

// Function to select predefined pronouns
function selectPronouns(subject, object, possessive, possessivePronoun, number) {
    selectedPronouns = { subject, object, possessive, possessivePronoun, number };
    selectedName = ''; // Clear name if pronouns are selected

    // Remove 'selected' class from all pronoun buttons
    document.querySelectorAll('.pronoun-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add 'selected' class to the clicked button
    event.target.classList.add('selected');

    clearOtherSelections('pre-selected');
}

// Function to clear other selections
function clearOtherSelections(selectionType) {
    if (selectionType === 'custom') {
        document.querySelectorAll('.pronoun-btn').forEach(btn => btn.classList.remove('selected'));
        selectedPronouns = {}; // Clear selected pronouns
        selectedName = ''; // Clear name
        const nameInput = document.getElementById('name-input');
        if (nameInput) nameInput.value = ''; // Clear name input
    } else if (selectionType === 'name') {
        document.querySelectorAll('.pronoun-btn').forEach(btn => btn.classList.remove('selected'));
        selectedPronouns = {}; // Clear selected pronouns
        const fields = ['custom-subject', 'custom-object', 'custom-possessive', 'custom-possessive-pronoun'];
        fields.forEach(id => {
            const field = document.getElementById(id);
            if (field) field.value = '';
        });
    }
}

// Function to submit selection
function submitSelection() {
    // Check if a predefined pronoun is selected
    const pronounSelected = Object.keys(selectedPronouns).length > 0;
    const nameInputElement = document.getElementById('name-input');
    const nameInput = nameInputElement ? nameInputElement.value.trim() : '';

    // Check for custom pronouns
    const customSubjectElement = document.getElementById('custom-subject');
    const customObjectElement = document.getElementById('custom-object');
    const customPossessiveElement = document.getElementById('custom-possessive');
    const customPossessivePronounElement = document.getElementById('custom-possessive-pronoun');
    const customNumberElement = document.getElementById('custom-number');

    const customSubject = customSubjectElement ? customSubjectElement.value.trim() : '';
    const customObject = customObjectElement ? customObjectElement.value.trim() : '';
    const customPossessive = customPossessiveElement ? customPossessiveElement.value.trim() : '';
    const customPossessivePronoun = customPossessivePronounElement ? customPossessivePronounElement.value.trim() : '';
    const customNumber = customNumberElement ? customNumberElement.value : '';

    const customPronounsFilled = customSubject && customObject && customPossessive && customPossessivePronoun;

    if (nameInput) {
        selectedName = nameInput;
        selectedPronouns = {};
        localStorage.setItem('name', selectedName);
        updateName(selectedName);
    } else if (customPronounsFilled) {
        selectedPronouns = {
            subject: customSubject,
            object: customObject,
            possessive: customPossessive,
            possessivePronoun: customPossessivePronoun,
            number: customNumber
        };
        selectedName = '';
        localStorage.setItem('pronouns', JSON.stringify(selectedPronouns));
        updatePronouns(selectedPronouns);
    } else if (pronounSelected) {
        localStorage.setItem('pronouns', JSON.stringify(selectedPronouns));
        updatePronouns(selectedPronouns);
    } else {
        alert('Please select or enter your pronouns or name.');
        return; // Stop the function if no selection is made
    }

    // Store 'Don't ask again' preference
    const dontAskAgainCheckbox = document.getElementById('dont-ask-again');
    if (dontAskAgainCheckbox && dontAskAgainCheckbox.checked) {
        localStorage.setItem('dontAskAgain', true);
    } else {
        localStorage.removeItem('dontAskAgain');
    }

    const popupElement = document.getElementById('pronoun-popup');
    if (popupElement) {
        popupElement.classList.add('hidden'); // Hide the popup
    }
}

// Function to update the page with the name
function updateName(name) {
    const capitalizedName = capitalizeFirstLetter(name);

    // Set the greeting
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = 'Welcome to Our Inclusive Demo Site!';
    }

    document.querySelectorAll('.pronoun-subject').forEach(el => {
        el.textContent = el.classList.contains('start-of-sentence') ? capitalizedName : name;
    });
    document.querySelectorAll('.pronoun-object').forEach(el => el.textContent = name);

    // Handle possessive form for names
    document.querySelectorAll('.pronoun-possessive, .pronoun-possessive-pronoun').forEach(el => {
        const possessiveForm = name.endsWith('s') || name.endsWith('S') ? name + "'" : name + "'s";
        const textContent = el.classList.contains('start-of-sentence') ? capitalizeFirstLetter(possessiveForm) : possessiveForm;
        el.textContent = textContent;
    });

    // Reflexive pronoun for names (e.g., "themselves" becomes "themself" or "Alex")
    document.querySelectorAll('.pronoun-reflexive').forEach(el => el.textContent = name);

    // Update pronoun-verb elements (e.g., is)
    document.querySelectorAll('.pronoun-verb').forEach(el => el.textContent = 'is'); // Names are singular

    // Conjugate other verbs (assuming singular for names)
    document.querySelectorAll('.verb').forEach(el => {
        const baseVerb = el.getAttribute('data-verb');
        const isAtSentenceStart = el.classList.contains('start-of-sentence');
        let conjugatedVerb = conjugateVerb(baseVerb, 'singular');
        if (isAtSentenceStart) {
            conjugatedVerb = capitalizeFirstLetter(conjugatedVerb);
        }
        el.textContent = conjugatedVerb;
    });
}

// Function to update the page with pronouns
function updatePronouns(pronouns) {
    const number = pronouns.number;

    // Set greeting for pronouns
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = 'Welcome to Our Inclusive Demo Site!';
    }

    document.querySelectorAll('.pronoun-subject').forEach(el => {
        const subject = el.classList.contains('start-of-sentence') ? capitalizeFirstLetter(pronouns.subject) : pronouns.subject;
        el.textContent = subject;
    });
    document.querySelectorAll('.pronoun-object').forEach(el => el.textContent = pronouns.object);
    document.querySelectorAll('.pronoun-possessive').forEach(el => {
        const possessive = el.classList.contains('start-of-sentence') ? capitalizeFirstLetter(pronouns.possessive) : pronouns.possessive;
        el.textContent = possessive;
    });
    document.querySelectorAll('.pronoun-possessive-pronoun').forEach(el => {
        const possessivePronoun = el.classList.contains('start-of-sentence') ? capitalizeFirstLetter(pronouns.possessivePronoun) : pronouns.possessivePronoun;
        el.textContent = possessivePronoun;
    });

    // Handle reflexive pronouns
    document.querySelectorAll('.pronoun-reflexive').forEach(el => {
        let reflexive;
        if (pronouns.subject.toLowerCase() === 'they') {
            reflexive = 'themselves';
        } else if (pronouns.subject.toLowerCase() === 'he') {
            reflexive = 'himself';
        } else if (pronouns.subject.toLowerCase() === 'she') {
            reflexive = 'herself';
        } else {
            // For custom pronouns, attempt to form the reflexive by adding 'self' or 'selves'
            reflexive = pronouns.object + (number === 'singular' ? 'self' : 'selves');
        }
        el.textContent = reflexive;
    });

    // Update pronoun-verb elements
    document.querySelectorAll('.pronoun-verb').forEach(el => {
        el.textContent = number === 'plural' ? 'are' : 'is';
    });

    // Conjugate other verbs
    document.querySelectorAll('.verb').forEach(el => {
        const baseVerb = el.getAttribute('data-verb');
        const isAtSentenceStart = el.classList.contains('start-of-sentence');
        let conjugatedVerb = conjugateVerb(baseVerb, number);
        if (isAtSentenceStart) {
            conjugatedVerb = capitalizeFirstLetter(conjugatedVerb);
        }
        el.textContent = conjugatedVerb;
    });
}

// Function to reset pronouns or name and show the popup again
function resetPronouns() {
    localStorage.removeItem('pronouns');
    localStorage.removeItem('name');
    localStorage.removeItem('dontAskAgain');
    const popupElement = document.getElementById('pronoun-popup');
    if (popupElement) {
        popupElement.classList.remove('hidden'); // Show the popup
    }
    location.reload(); // Reload the page to reset content
}

// Function to conjugate verbs based on grammatical number
function conjugateVerb(verb, number) {
    const irregularVerbs = {
        'be': { singular: 'is', plural: 'are' },
        'have': { singular: 'has', plural: 'have' },
        'do': { singular: 'does', plural: 'do' },
        'go': { singular: 'goes', plural: 'go' },
        'visit': { singular: 'visits', plural: 'visit' },
        'experience': { singular: 'experiences', plural: 'experience' },
        'enjoy': { singular: 'enjoys', plural: 'enjoy' },
        'make': { singular: 'makes', plural: 'make' },
        'prefer': { singular: 'prefers', plural: 'prefer' },
        'have': { singular: 'has', plural: 'have' },
        // Add more irregular verbs as needed
    };

    const verbLower = verb.toLowerCase();

    if (irregularVerbs[verbLower]) {
        const conjugatedVerb = irregularVerbs[verbLower][number];
        return matchCapitalization(verb, conjugatedVerb);
    }

    if (number === 'singular') {
        if (
            verbLower.endsWith('s') ||
            verbLower.endsWith('sh') ||
            verbLower.endsWith('ch') ||
            verbLower.endsWith('x') ||
            verbLower.endsWith('z') ||
            verbLower.endsWith('o')
        ) {
            return matchCapitalization(verb, verb + 'es');
        } else if (
            verbLower.endsWith('y') &&
            !isVowel(verbLower.charAt(verbLower.length - 2))
        ) {
            return matchCapitalization(verb, verb.slice(0, -1) + 'ies');
        } else {
            return matchCapitalization(verb, verb + 's');
        }
    } else {
        return verb;
    }
}

// Helper function to check if a character is a vowel
function isVowel(char) {
    return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
}

// Helper function to match the capitalization of the original verb
function matchCapitalization(originalVerb, conjugatedVerb) {
    if (originalVerb.charAt(0) === originalVerb.charAt(0).toUpperCase()) {
        return conjugatedVerb.charAt(0).toUpperCase() + conjugatedVerb.slice(1);
    }
    return conjugatedVerb;
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
