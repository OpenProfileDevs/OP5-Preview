var ownerloggedin_delete = null;

// Event listener for document click event
document.addEventListener('click', function(event) {
    const element = event.target;

    // Check if the clicked element has an id starting with 'banaccount_'
    if (element.id && element.id.startsWith('verify_')) {
        const authorId = element.id.replace('verify_', ''); // Get author id from element id

        // Fetch author's data
        fetch(`/authors-fetch`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch authors');
                }
                return response.json();
            })
            .then(authors => {
                // Find the author with the matching id
                const author = authors.find(author => author.id == authorId);
                if (!author) {
                    throw new Error('Author not found');
                }

                ownerloggedin_delete = author.owner; // Set ownerloggedin_delete

                // Prompt user to type profile ID for confirmation
                const typedProfileId = prompt(`Type the author ID (${authorId}) to confirm verify:`);
                if (typedProfileId === null) {
                    console.log('verify canceled.');
                    return;
                }

                // Verify typed profile ID and proceed with banning
                if (typedProfileId === authorId) {
                    if (confirm(`Are you sure you want to verify author with ID ${authorId}?`)) {
                        // Make a request to mark the author as verify
                        fetch(`/mark-as-verified/${author.username}`, {
                            method: 'PUT' // Use PUT method to mark as verify
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to verify author');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Author verified:', data);
                            // Optionally update UI or perform other actions upon successful banning
                            window.location.reload(); // Reload the page after banning
                        })
                        .catch(error => console.error('Error verifying author:', error));
                    }
                } else {
                    console.log('Typed profile ID does not match. verify canceled.');
                }
            })
            .catch(error => console.error('Error fetching authors:', error));
    }
});