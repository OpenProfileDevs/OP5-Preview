document.addEventListener("DOMContentLoaded", function() {
    let saveTimeout = null; // Variable to hold timeout ID

    // Function to simulate a click event
    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    // Function to save data
    function saveData() {
        const saveButton = document.getElementById('saveButtonServer');
        console.log('Saving data...');
        simulateClick(saveButton);
    }

    // Function to handle input change events
    function handleInputChange(event) {
        const target = event.target;
        if (target.classList.contains('input_1') || target.tagName.toLowerCase() === 'textarea') {
            console.log('Input change detected in input_1 or textarea, saving data.');
            // Clear previous timeout, if any
            clearTimeout(saveTimeout);
            // Schedule save after a short delay (e.g., 300ms)
            saveTimeout = setTimeout(saveData, 300);
        }
    }

    // Add event listener for input change
    document.addEventListener('input', handleInputChange);
});