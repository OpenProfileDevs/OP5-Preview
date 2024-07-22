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
    
    // Function to check if the user is logged in
    function checkLoggedIn() {
        return fetch('/check-login')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to check login status');
                }
                return response.json();
            })
            .then(data => {
                if (data.loggedIn) {
                    console.log('User Data:', data.userData);
                    return data.userData;
                } else {
                    throw new Error('User not logged in');
                }
            });
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
    
    // Add a click event listener to the button
    async function handleSaveButtonClick() {
        try {
            const userData = await checkLoggedIn(); // Ensure user is logged in
            const profileId = getIdFromUrl();
            const token = getToken();
    
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const response = await fetch(`/download-profile/${userData.id}/${profileId}/${token}`);
    
            if (!response.ok) {
                if (response.status === 403) {
                    console.error('Access Forbidden: The server is denying access. Check if the token and ID are correct.');
                } else if (response.status === 401) {
                    console.error('Unauthorized: The token might be missing or invalid.');
                } else {
                    console.error('Failed to fetch the file. Status:', response.status);
                }
                return;
            }

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

            const new_id = generateRandomString(32)
    
            const newId = new_id; // New ID
            const newUrl = new_id; // New URL
            const newUrl2 = new_id; // New URL2
            const content = await response.text(); // Get file content as text
    
            // Modify the file content
            const modifiedContent = modifyFileContent(content, newId, newUrl, newUrl2);
    
            // Create a Blob with the modified content
            const blob = new Blob([modifiedContent], { type: 'application/json' });
    
            // Create a link element and trigger a download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${new_id}.op5`; // Name the file after the new ID
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    // Attach the event listener to the button
    saveButton.addEventListener('click', handleSaveButtonClick);
    

