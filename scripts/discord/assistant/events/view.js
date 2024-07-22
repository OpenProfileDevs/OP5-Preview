const userSessions = {};

function generateRandomUserID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomUserID = '';
    for (let i = 0; i < 5; i++) {
        randomUserID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomUserID;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
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
async function handleUserDiscordView() {
    const joinTime = new Date().getTime();
    const pathname = window.location.pathname;
    let urlEnding = pathname.split('/').pop(); // Extract URL ending
    if (!urlEnding) {
        urlEnding = 'homepage'; // Assign default value if URL ending is empty or null
    }
    
    const isAuthor = pathname.includes('/author/'); // Check if URL contains /author/
    const isEditor = pathname.includes('/editor/'); // Check if URL contains /author/

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
                let sessionData;
                if (data.loggedIn) {
                    // Access userData if available and use it
                    const userData = data.userData;
                    if (userData) {
                        // Do something with userData and specificElementData, for example:
                        console.log('User Data:', userData);
                        sessionData = `<:openprofile_view_icon:1262897067844567101> **@${userData.username}** ${isEditor ? 'is editing' : 'viewed'} **${isAuthor ? '@' : ''}${urlEnding}** from **${name}** ${emoji}`;
                    }
                } else {
                    // If not logged in, generate or get guest ID and handle accordingly
                    let guestID = getCookie('guestID');
                    if (!guestID) {
                        guestID = generateRandomUserID();
                        setCookie('guestID', guestID, 30);
                    }
                    sessionData = `<:openprofile_view_icon:1262897067844567101> **Guest_${guestID}** viewed **${isAuthor ? '@' : ''}${urlEnding}** from **${name}** ${emoji}`;
                }
                // Send message to server with session data
                sendSessionDataToServer(sessionData);
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

// Run handleUserJoin function when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await handleUserDiscordView();
});
