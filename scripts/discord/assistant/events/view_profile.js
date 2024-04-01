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
        const response = await fetch('/save-session-profile', {
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
async function handleUserJoinProfile() {
    const userID = generateRandomUserID();
    const joinTime = new Date().getTime();
    userSessions[userID] = { joinTime };
    console.log(`User ID ${userID} joined at ${new Date(joinTime).toLocaleString()}`);

    try {
        // Fetch user's country
        const country = await fetchUserCountry();
        
        // Get full country object based on country code
        const countryInfo = getCountryInfo(country);
        
        // Extract country name and flag from the country information
        const { name, emoji } = countryInfo;
        
        // Construct session data with full country name and flag
        const sessionData = `➡️ **@user_${userID}** viewed PROFILE_NAME from **${name}** ${emoji}`;
        
        // Send message to server with session data
        await sendSessionDataToServer(sessionData);
    } catch (error) {
        console.error(`Error sending join message to server for User ID ${userID}:`, error);
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

async function handleUserLeave(userID) {
    if (userSessions[userID]) {
        const joinTime = userSessions[userID].joinTime;
        const sessionTime = Math.round((new Date().getTime() - joinTime) / (1000 * 60)); // Calculate session time in minutes
        console.log(`User ID ${userID} left. Session time: ${sessionTime} minutes`);

        try {
            // Fetch user's country
            const country = await fetchUserCountry();
            
            // Get full country object based on country code
            const countryInfo = getCountryInfo(country);
            
            // Extract country name and flag from the country information
            const { name, emoji } = countryInfo;

            // Send session time to server
            await sendSessionDataToServer(`⬅️ **@user_${userID}** left PROFILE_NAME - __Session: ${sessionTime} minutes__`);
        } catch (error) {
            console.error(`Error sending leave message to server for User ID ${userID}:`, error);
        }

        // Delete user session
        delete userSessions[userID];
    } else {
        try {
            // Send message to server
            await sendSessionDataToServer(`User ID ${userID} left. But no record of join time found.`);
        } catch (error) {
            console.error(`Error sending leave message to server for User ID ${userID}:`, error);
        }

        console.log(`User ID ${userID} left. But no record of join time found.`);
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