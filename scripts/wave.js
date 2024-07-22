document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('user_check_hello');

    // Check if message is already sent to prevent multiple sends
    if (localStorage.getItem('discordwavesent') === 'sent') {
        if (button) {
            button.style.display = "none";
        }
        //return;
    }

    // Add event listener to handle button click
    button.addEventListener('click', function() {
        // Check if the user is logged in and load user data accordingly
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // Access userData if available and use it
                    const userData = data.userData;
                    const name = `@${userData.username}`;
                    const button = document.getElementById('user_check_hello');

                    redactAndSendMessage(name, button);
                } else {
                    // If not logged in, prompt user to input name
                    promptUsername();
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    });
});

// Function to prompt the user to input their name
function promptUsername() {
    const button = document.getElementById('user_check_hello');
    let name = prompt('Please enter your username so we can send a wave to our Discord server:');
    if (name !== null && name !== '') {
        // Check if the username contains only Latin characters, spaces, and digits
        const latinAndNumbersRegex = /^[a-zA-Z0-9 ]+$/;
        if (!latinAndNumbersRegex.test(name)) {
            alert('Username must contain only Latin characters, numbers, and spaces.');
            return; // Exit the function if the username is invalid
        }
        // Truncate the name if it exceeds 16 characters
        if (name.length > 16) {
            name = name.substring(0, 16);
            alert('Username has been truncated to 16 characters.');
        }
        name = `guest_${name}`
        // Send wave with the provided name
        redactAndSendMessage(name, button);
    }
}

// Adjust redactAndSendMessage function to accept the button parameter
function redactAndSendMessage(name, button) {
    localStorage.setItem('discordwavesent', 'sent');
    button.style.display = "none";
    stopVibration();
    alert('Thanks for your wave on Discord! Join our server to see your wave: discord.gg/w6aV9gkz8g');
    redactName(name)
        .then(redactedName => {
            const message = `<:openprofile_wave_icon:1263080718511243304> **${redactedName}** sent a wave from web!`;
            sendMessageToDiscord(message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}