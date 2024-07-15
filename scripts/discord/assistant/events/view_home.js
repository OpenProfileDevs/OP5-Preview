const userSessions = {};

function generateRandomUserID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomUserID = '';
    for (let i = 0; i < 5; i++) {
        randomUserID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomUserID;
}

async function sendSessionDataToServer(sessionData) {
    try {
        const response = await fetch('/save-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: sessionData }),
        });

        if (!response.ok) {
            throw new Error('Failed to send session data to server');
        }

        console.log('Session data sent to server successfully');
    } catch (error) {
        console.error('Error sending session data to server:', error);
    }
}

// Example usage
async function handleUserJoinHome() {
    const joinTime = new Date().getTime();

    try {
        // Fetch user's country
        const country = await fetchUserCountry();
        
        // Get full country object based on country code
        const countryInfo = getCountryInfo(country);
        
        // Extract country name and flag from the country information
        const { name, emoji } = countryInfo;

        fetch('/check-login') // Assuming this route checks if the user is logged in
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // Access userData if available and use it
                    const userData = data.userData;
                    if (userData) {
                        // Do something with userData and specificElementData, for example:
                        console.log('User Data:', userData);
                        const sessionData = `➡️ **@${userData.username}** viewed **OpenProfile 5 Homepage** from **${name}** ${emoji}`;
                        // Send message to server with session data
                        sendSessionDataToServer(sessionData);
                    }
                } else {
                    // If not logged in, handle accordingly
                    const sessionData = `➡️ **Guest** viewed **OpenProfile 5 Homepage** from **${name}** ${emoji}`;
                    // Send message to server with session data
                    sendSessionDataToServer(sessionData);
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    } catch (error) {
        console.error('Error handling user join profile:', error);
    }

    // Call other functions or perform other actions here
}
async function fetchUserCountry() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('Failed to fetch IP address');
        }
        const { ip } = await response.json();
        const countryResponse = await fetch(`https://ipapi.co/${ip}/country/`);
        if (!countryResponse.ok) {
            throw new Error('Failed to fetch user country');
        }
        const country = await countryResponse.text();
        return country;
    } catch (error) {
        console.error('Error fetching user country:', error);
        return 'Unknown'; // Return a default value if country cannot be fetched
    }
}

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
        // Page is being hidden (user switched to another tab or closed the window)
        const userIds = Object.keys(userSessions);
        for (const userID of userIds) {
            await handleUserLeave(userID);
        }
    }
});