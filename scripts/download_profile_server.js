const saveButton = document.getElementById('saveButton');

// Function to get the last segment of the URL
function getIdFromUrl() {
    const url = window.location.href;
    const segments = url.split('/');
    return segments[segments.length - 1];
}

// Function to get the token (assuming it's stored in a cookie or some other way)
function getToken() {
    // Example to get the token from cookies
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to modify file content
function modifyFileContent(content, newId, newUrl, newUrl2) {
    let json;
    try {
        json = JSON.parse(content);
    } catch (error) {
        throw new Error('Failed to parse file content');
    }

    // Remove existing id, url, and url2 fields
    delete json['id'];
    delete json['url'];
    delete json['url2'];
    delete json['owner'];
    delete json['owner2'];
    delete json['visibility'];

    // Assign new values
    json['id'] = newId;
    json['url'] = newUrl;
    json['url2'] = newUrl2;

    // Convert back to JSON string and return
    return JSON.stringify(json, null, 2);
}

// Function to generate a random string
function generateRandomString(length) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const lettersLength = letters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * lettersLength);
        result += letters[randomIndex];
    }
    return result;
}

// Function to check if the user is logged in and handle save button click
async function handleSaveButtonClick() {
    try {
        const response = await fetch('/check-login');
        if (!response.ok) {
            throw new Error('Failed to check login status');
        }
        const data = await response.json();
        if (data.loggedIn) {
            const userData = data.userData;
            console.log('User Data:', userData);

            const profileId = getIdFromUrl();
            const token = getToken();

            if (!token) {
                console.error('No token found');
                return;
            }

            const downloadResponse = await fetch(`/download-profile/${userData.id}/${profileId}/${token}`);

            if (!downloadResponse.ok) {
                if (downloadResponse.status === 403) {
                    console.error('Access Forbidden: The server is denying access. Check if the token and ID are correct.');
                } else if (downloadResponse.status === 401) {
                    console.error('Unauthorized: The token might be missing or invalid.');
                } else {
                    console.error('Failed to fetch the file. Status:', downloadResponse.status);
                }
                return;
            }

            const newId = generateRandomString(32); // New ID
            const newUrl = newId; // New URL
            const newUrl2 = newId; // New URL2
            const content = await downloadResponse.text(); // Get file content as text

            // Modify the file content
            const modifiedContent = modifyFileContent(content, newId, newUrl, newUrl2);

            // Create a Blob with the modified content
            const blob = new Blob([modifiedContent], { type: 'application/json' });

            // Create a link element and trigger a download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${newId}.op5`; // Name the file after the new ID
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('User not logged in');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Attach the event listener to the button
saveButton.addEventListener('click', handleSaveButtonClick);
