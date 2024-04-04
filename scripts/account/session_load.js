// Check if the user is logged in and show a popup if logged in
function checkLoggedIn() {
    fetch('/check-login') // Assuming this route checks if the user is logged in
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // Access userData if available and use it
                const userData = data.userData;
                if (userData) {
                    // Do something with userData, for example:
                    console.log('User Data:', userData);
                }
                //alert('You are logged in!'); // Show a popup if logged in
                const account = document.getElementById('label_top_account');
                account.textContent = `Logged in with @${userData.username}`;
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
}

// Call the function when the page loads
window.onload = function() {
    checkLoggedIn();
};