// Ensure this function is defined elsewhere to fetch the cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('click', async function(event) {
    const element = event.target;

    if (element.id && element.id.startsWith('moderator_deleteauthor_')) {
        const authorId = element.id.replace('moderator_deleteauthor_', ''); // Get author id from element id

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
                console.log('Token found:', token);
            }

            // Check if the user is a moderator
            if (!userData.moderator) {
                console.log('User is not a moderator');
                return; // Exit if the user is not a moderator
            }

            // Fetch authors data
            const authorsResponse = await fetch(`/authors-fetch`);
            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }

            const authors = await authorsResponse.json();
            const author = authors.find(author => author.id == authorId);
            if (!author) {
                throw new Error('Author not found');
            }

            const ownerloggedin_delete = author.owner; // Set ownerloggedin_delete

            // Prompt user to type author ID for confirmation
            const typedProfileId = prompt(`Type the author ID (${authorId}) to confirm ban:`);
            if (typedProfileId === null) {
                console.log('Deletion canceled.');
                return;
            }

            // Verify typed author ID and proceed with deletion
            if (typedProfileId === authorId) {
                // Prompt for the ban reason
                const banReason = prompt('Please enter the reason for banning this author:');
                if (banReason === null || banReason.trim() === '') {
                    console.log('Ban reason is required. Deletion canceled.');
                    return;
                }

                if (confirm(`Are you sure you want to ban author with ID ${authorId}?`)) {
                    // Make a request to delete the profile, including the ban reason
                    const deleteResponse = await fetch(`/moderator-delete-author/${userid}/${authorId}/${ownerloggedin_delete}/${token}/${banReason}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ reason: banReason })
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('Failed to delete profile');
                    }

                    const result = await deleteResponse.json();
                    console.log('Profile deleted:', result);
                    window.location.reload(); // Reload the page after successful deletion
                }
            } else {
                console.log('Typed author ID does not match. Deletion canceled.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
