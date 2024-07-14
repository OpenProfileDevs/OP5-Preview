// Function to check if element exists
function checkElement() {
    const element = document.getElementById('full_name');
    if (element) {
        // Element found, do nothing
        console.log('Element found!');
    } else {
        // Element not found, reload the script
        console.log('Element not found, reloading script...');
        window.location.reload();
    }
}

// Function to run checkElement after page load
function runCheckAfterLoad() {
    // Set a timeout to check for the element after 1 second
    setTimeout(checkElement, 1000);
}

// Event listener for when the page finishes loading
window.addEventListener('load', runCheckAfterLoad);