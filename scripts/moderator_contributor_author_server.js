// Ensure this function is defined elsewhere to fetch the cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('click', async function(event) {
    const element = event.target;

    if (element.id && element.id.startsWith('moderator_contributorauthor_')) {
        const authorId = element.id.replace('moderator_contributorauthor_', ''); // Get author id from element id

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
            const authorsResponse = await fetch(`/authors-fetch`);
            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }

            const authors = await authorsResponse.json();
            const author = authors.find(author => author.id == authorId);
            if (!author) {
                throw new Error('Author not found');
            }

            const ownerloggedin_contributor = author.owner; // Set ownerloggedin_contributor

            // Prompt user to type author ID for confirmation
            const typedProfileId = prompt(`Type the author ID (${authorId}) to confirm contributor:`);
            if (typedProfileId === null) {
                console.log('contributor canceled.');
                return;
            }

            // contributor typed author ID and proceed with contributor
            if (typedProfileId === authorId) {
                if (confirm(`Are you sure you want to contributor author with ID ${authorId}?`)) {
                    // Make a request to contributor the profile
                    const contributorResponse = await fetch(`/moderator-contributor-author/${userid}/${authorId}/${ownerloggedin_contributor}/${token}`, {
                        method: 'DELETE'
                    });

                    if (!contributorResponse.ok) {
                        throw new Error('Failed to contributor profile');
                    }

                    const result = await contributorResponse.json();
                    console.log('Profile verified:', result);
                    window.location.reload(); // Reload the page after successful contributor
                }
            } else {
                console.log('Typed author ID does not match. contributor canceled.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});