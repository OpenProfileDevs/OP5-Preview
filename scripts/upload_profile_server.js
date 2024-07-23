var loggedIn = null;

// Function to get the token (assuming it's stored in a cookie or some other way)
function getToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    console.warn('No token found in cookies.');
    return null;
}

// Function to check if the user is logged in and upload the file if logged in
async function checkLoggedInAndUploadFile(file) {
    try {
        const response = await fetch('/check-login');
        if (!response.ok) {
            console.error('Failed to check login status. Response status:', response.status);
            throw new Error('Failed to check login status');
        }
        const data = await response.json();
        if (data.loggedIn) {
            console.log('User Data:', data.userData);
            loggedIn = data.loggedIn;

            const userData = data.userData;
            if (!userData || !userData.id || !userData.username) {
                console.error('User data is incomplete:', userData);
                return;
            }

            const token = getToken(); // Get the token

            if (!token) {
                console.error('No token found');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            console.log('Uploading file with token:', token);
            console.log('File details:', file);

            const uploadResponse = await fetch(`/upload-profile/${userData.id}/${userData.username}/${token}`, {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                if (uploadResponse.status === 403) {
                    console.error('Access Forbidden: The server is denying access. Check if the token and ID are correct.', errorText);
                } else if (uploadResponse.status === 401) {
                    console.error('Unauthorized: The token might be missing or invalid.', errorText);
                } else {
                    console.error('Failed to upload file. Status:', uploadResponse.status, 'Response:', errorText);
                }
                return;
            }

            const result = await uploadResponse.json();
            console.log('File uploaded successfully:', result);
            fetchAuthorsAndRender(); // Assuming this function is defined elsewhere
            // Handle the result if needed
        } else {
            console.error('User not logged in.');
            loggedIn = false;
            throw new Error('User not logged in');
        }
    } catch (error) {
        console.error('Error in checkLoggedIn:', error);
        throw error;
    }
}

// Add a change event listener to the file input
document.getElementById('loadFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Selected file:', file);
        checkLoggedInAndUploadFile(file); // Call the checkLoggedInAndUploadFile function
    } else {
        console.warn('No file selected.');
    }
});