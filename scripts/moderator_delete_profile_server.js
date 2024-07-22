// Ensure this function is defined elsewhere to fetch the cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('click', async function(event) {
    const element = event.target;

    if (element.id && element.id.startsWith('moderator_deleteprofile_')) {
        const authorId = element.id.replace('moderator_deleteprofile_', ''); // Get author id from element id

        try {
            // Fetch the logged-in user ID
            const response = await fetch('/check-login');
            const data = await response.json();

            if (!data.loggedIn) {
                console.log('User not logged in');
                return; // Exit if user is not logged in
            }

            const userData = data.userData;
            const userid = userData.id;
            console.log('Logged-in user ID:', userid);

            // Get the token from cookies
            const token = getCookie('token');

            if (!token) {
                console.log('No token found in cookies');
                return; // Exit the function if no token is found
            } else {
                console.log('token found:', token);
            }

            // Check if the user is a moderator
            if (!userData.moderator) {
                console.log('User is not a moderator');
                return; // Exit if the user is not a moderator
            }

            // Fetch authors data
            const authorsResponse = await fetch(`/profiles-fetch`);
            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }

            const authors = await authorsResponse.json();
            const author = authors.find(author => author.id == authorId);
            if (!author) {
                throw new Error('Author not found');
            }

            ownerloggedin_delete = author.owner; // Set ownerloggedin_delete

            // Prompt user to type profile ID for confirmation
            const typedProfileId = prompt(`Type the profile ID (${authorId}) to confirm deletion:`);
            if (typedProfileId === null) {
                console.log('Deletion canceled.');
                return;
            }

            // Verify typed profile ID and proceed with deletion
            if (typedProfileId === authorId) {
                if (confirm(`Are you sure you want to delete profile with ID ${authorId}?`)) {
                    // Make a request to delete the profile
                    const deleteResponse = await fetch(`/moderator-delete-profile/${userid}/${authorId}/${ownerloggedin_delete}/${token}`, {
                        method: 'DELETE'
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('Failed to delete profile');
                    }

                    const result = await deleteResponse.json();
                    console.log('Profile deleted:', result);
                    window.location.reload(); // Reload the page after successful deletion
                }
            } else {
                console.log('Typed profile ID does not match. Deletion canceled.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
