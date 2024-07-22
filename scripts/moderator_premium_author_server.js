// Ensure this function is defined elsewhere to fetch the cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('click', async function(event) {
    const element = event.target;

    if (element.id && element.id.startsWith('moderator_premiumauthor_')) {
        const authorId = element.id.replace('moderator_premiumauthor_', ''); // Get author id from element id

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

            const ownerloggedin_premium = author.owner; // Set ownerloggedin_premium

            // Prompt user to type author ID for confirmation
            const typedProfileId = prompt(`Type the author ID (${authorId}) to confirm premium:`);
            if (typedProfileId === null) {
                console.log('premium canceled.');
                return;
            }

            // premium typed author ID and proceed with premium
            if (typedProfileId === authorId) {
                if (confirm(`Are you sure you want to premium author with ID ${authorId}?`)) {
                    // Make a request to premium the profile
                    const premiumResponse = await fetch(`/moderator-premium-author/${userid}/${authorId}/${ownerloggedin_premium}/${token}`, {
                        method: 'DELETE'
                    });

                    if (!premiumResponse.ok) {
                        throw new Error('Failed to premium profile');
                    }

                    const result = await premiumResponse.json();
                    console.log('Profile verified:', result);
                    window.location.reload(); // Reload the page after successful premium
                }
            } else {
                console.log('Typed author ID does not match. premium canceled.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});