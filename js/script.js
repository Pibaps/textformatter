const textInput = document.getElementById('textInput');
const outputText = document.getElementById('outputText');
const toggleStyleBtn = document.getElementById('toggleStyleBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const copyTextBtn = document.getElementById('copyTextBtn');
const downloadTextBtn = document.getElementById('downloadTextBtn');
const copyConfirmation = document.getElementById('copyConfirmation');
const fontSelect = document.getElementById('fontSelect');
let isBoldItalic = false;  // Default to bold only
let isDarkMode = false;

// Convert to bold sans-serif characters
const toBoldSans = (text) => {
    const boldMap = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
        'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
        'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
        'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
        'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
        'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲',
        '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
};

// Convert to bold italic sans-serif characters
const toBoldItalicSans = (text) => {
    const boldItalicMap = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂',
        'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉',
        'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐',
        'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜',
        'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣',
        'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪',
        'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲',
        '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(char => boldItalicMap[char] || char).join('');
};

// Update the character and word count
textInput.addEventListener('input', () => {
    const text = textInput.value;
    outputText.textContent = isBoldItalic ? toBoldItalicSans(text) : toBoldSans(text);
    charCount.textContent = `${text.length} characters`;
    wordCount.textContent = `${text.split(/\s+/).filter(word => word.length > 0).length} words`;
});

// Toggle between Bold and Bold Italic
toggleStyleBtn.addEventListener('click', () => {
    isBoldItalic = !isBoldItalic;
    toggleStyleBtn.textContent = isBoldItalic ? "Switch to Bold" : "Switch to Bold Italic";
    const text = textInput.value;
    outputText.textContent = isBoldItalic ? toBoldItalicSans(text) : toBoldSans(text);
    outputText.style.transform = "scale(1.1)";
    setTimeout(() => outputText.style.transform = "scale(1)", 300);
});

// Toggle dark mode
themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
});

// Copy text to clipboard
copyTextBtn.addEventListener('click', () => {
    const textToCopy = outputText.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyConfirmation.classList.add('show');
        setTimeout(() => {
            copyConfirmation.classList.remove('show');
            copyConfirmation.classList.add('hide');
            setTimeout(() => {
                copyConfirmation.classList.remove('hide');
            }, 500); // Match the transition duration in CSS
        }, 2000); // Duration to show the confirmation
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

// Download text as .txt file
downloadTextBtn.addEventListener('click', () => {
    const textToDownload = outputText.textContent;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Copy invisible character to clipboard
copyInvisible.addEventListener('click', () => {
    const invisibleChar = '\u3164'; // Hangul Filler character
    navigator.clipboard.writeText(invisibleChar).then(() => {
        copyConfirmation.classList.add('show');
        setTimeout(() => {
            copyConfirmation.classList.remove('show');
            copyConfirmation.classList.add('hide');
            setTimeout(() => {
                copyConfirmation.classList.remove('hide');
            }, 500); // Match the transition duration in CSS
        }, 2000); // Duration to show the confirmation
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

// Change font family
fontSelect.addEventListener('change', () => {
    const selectedFont = fontSelect.value;
    outputText.style.fontFamily = selectedFont;
});