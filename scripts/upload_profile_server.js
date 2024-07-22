// Function to get the token (assuming it's stored in a cookie or some other way)
function getToken() {
    // Example to get the token from cookies
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    console.warn('No token found in cookies.');
    return null;
}

// Function to check if the user is logged in
async function checkLoggedIn() {
    try {
        const response = await fetch('/check-login');
        if (!response.ok) {
            console.error('Failed to check login status. Response status:', response.status);
            throw new Error('Failed to check login status');
        }
        const data = await response.json();
        if (data.loggedIn) {
            console.log('User Data:', data.userData);
            return data.userData;
        } else {
            console.error('User not logged in.');
            throw new Error('User not logged in');
        }
    } catch (error) {
        console.error('Error in checkLoggedIn:', error);
        throw error;
    }
}

// Function to handle file upload
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const userData = await checkLoggedIn(); // Ensure user is logged in
        const token = getToken(); // Get the token

        if (!token) {
            console.error('No token found');
            return;
        }

        console.log('Uploading file with token:', token);
        console.log('File details:', file);

        const response = await fetch(`/upload-profile/${userData.id}/${userData.username}/${token}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 403) {
                console.error('Access Forbidden: The server is denying access. Check if the token and ID are correct.', errorText);
            } else if (response.status === 401) {
                console.error('Unauthorized: The token might be missing or invalid.', errorText);
            } else {
                console.error('Failed to upload file. Status:', response.status, 'Response:', errorText);
            }
            return;
        }

        const result = await response.json();
        console.log('File uploaded successfully:', result);
        fetchAuthorsAndRender();
        // Handle the result if needed
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Add a change event listener to the file input
document.getElementById('loadFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Selected file:', file);
        uploadFile(file); // Call the upload function
    } else {
        console.warn('No file selected.');
    }
});