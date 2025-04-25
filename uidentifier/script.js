document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resultDiv = document.getElementById('result');
    
    // Add event listeners
    generateBtn.addEventListener('click', generateIdentifiers);
    copyBtn.addEventListener('click', copyToClipboard);
    
    /**
     * Generates unique identifiers based on user input
     */
    function generateIdentifiers() {
        // Get user inputs
        const length = parseInt(document.getElementById('length').value, 10);
        const count = parseInt(document.getElementById('count').value, 10);
        const exceptions = document.getElementById('exceptions').value
            .split('\n')
            .filter(line => line.trim() !== '');
        
        // Get selected character sets
        let charSet = '';
        const checkboxes = document.querySelectorAll('input[name="letters"]:checked');
        checkboxes.forEach(checkbox => {
            charSet += checkbox.value;
        });
        
        // Add custom characters
        const customChars = document.getElementById('custom').value;
        charSet += customChars;
        
        // Remove duplicates from character set
        charSet = [...new Set(charSet.split(''))].join('');
        
        // Validate inputs
        if (charSet.length === 0) {
            showError('Please select at least one character set or add custom characters.');
            return;
        }
        
        if (length <= 0) {
            showError('Number of digits must be greater than 0.');
            return;
        }
        
        if (count <= 0) {
            showError('Number of IDs must be greater than 0.');
            return;
        }
        
        // Generate unique identifiers
        const identifiers = generateUniqueIds(charSet, length, count, exceptions);
        
        // Display results
        displayResults(identifiers);
    }
    
    /**
     * Generates unique identifiers based on the given parameters
     * @param {string} charSet - The set of characters to use
     * @param {number} length - The length of each identifier
     * @param {number} count - The number of identifiers to generate
     * @param {string[]} exceptions - IDs to exclude
     * @returns {string[]} - Array of unique identifiers
     */
    function generateUniqueIds(charSet, length, count, exceptions) {
        const result = new Set();
        const exceptionsSet = new Set(exceptions);
        
        // Maximum attempts to avoid infinite loop
        const maxAttempts = count * 10;
        let attempts = 0;
        
        while (result.size < count && attempts < maxAttempts) {
            const id = generateRandomId(charSet, length);
            
            // Add to result if not in exceptions and not already generated
            if (!exceptionsSet.has(id) && !result.has(id)) {
                result.add(id);
            }
            
            attempts++;
        }
        
        return Array.from(result);
    }
    
    /**
     * Generates a random identifier of the specified length using the given character set
     * @param {string} charSet - The set of characters to use
     * @param {number} length - The length of the identifier
     * @returns {string} - A random identifier
     */
    function generateRandomId(charSet, length) {
        let result = '';
        const charSetLength = charSet.length;
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charSetLength);
            result += charSet.charAt(randomIndex);
        }
        
        return result;
    }
    
    /**
     * Displays the generated identifiers in the result div
     * @param {string[]} identifiers - Array of identifiers to display
     */
    function displayResults(identifiers) {
        if (identifiers.length === 0) {
            resultDiv.innerHTML = '<p>No unique identifiers could be generated with the given constraints.</p>';
            return;
        }
        
        let html = '';
        identifiers.forEach((id, index) => {
            html += `<div class="id-item">${index + 1}. ${id}</div>`;
        });
        
        resultDiv.innerHTML = html;
    }
    
    /**
     * Copies all generated identifiers to the clipboard
     */
    function copyToClipboard() {
        if (!resultDiv.textContent.trim()) {
            return;
        }
        
        // Get all IDs without the numbering
        const idItems = document.querySelectorAll('.id-item');
        const textToCopy = Array.from(idItems)
            .map(item => item.textContent.replace(/^\d+\.\s/, ''))
            .join('\n');
        
        // Create a temporary textarea element to copy from
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess();
            } else {
                showError('Failed to copy to clipboard');
            }
        } catch (err) {
            showError('Failed to copy to clipboard: ' + err);
        }
        
        document.body.removeChild(textarea);
    }
    
    /**
     * Shows a temporary success message when copying is successful
     */
    function showCopySuccess() {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }
    
    /**
     * Shows an error message in the result div
     * @param {string} message - The error message to display
     */
    function showError(message) {
        resultDiv.innerHTML = `<p style="color: #e74c3c;">${message}</p>`;
    }
});
