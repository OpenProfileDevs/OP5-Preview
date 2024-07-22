// Ensure this function is defined elsewhere to fetch the cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('click', async function(event) {
    const element = event.target;

    if (element.id && element.id.startsWith('admin_moderatorauthor_')) {
        const authorId = element.id.replace('admin_moderatorauthor_', ''); // Get author id from element id

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

            // Check if the user is an admin
            if (!userData.admin) {
                console.log('User is not an admin');
                return; // Exit if the user is not an admin
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

            const ownerloggedin_moderator = author.owner; // Set ownerloggedin_moderator

            // Prompt user to type author ID for confirmation
            const typedProfileId = prompt(`Type the author ID (${authorId}) to confirm moderator:`);
            if (typedProfileId === null) {
                console.log('moderator canceled.');
                return;
            }

            // moderator typed author ID and proceed with moderator
            if (typedProfileId === authorId) {
                if (confirm(`Are you sure you want to moderator author with ID ${authorId}?`)) {
                    // Make a request to moderator the profile
                    const moderatorResponse = await fetch(`/admin-moderator-author/${userid}/${authorId}/${ownerloggedin_moderator}/${token}`, {
                        method: 'DELETE'
                    });

                    if (!moderatorResponse.ok) {
                        throw new Error('Failed to moderator profile');
                    }

                    const result = await moderatorResponse.json();
                    console.log('Profile verified:', result);
                    window.location.reload(); // Reload the page after successful moderator
                }
            } else {
                console.log('Typed author ID does not match. moderator canceled.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});