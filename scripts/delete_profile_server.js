var ownerloggedin_delete = null;

// Event listener for document click event
document.addEventListener('click', function(event) {
    const element = event.target;

    // Check if the clicked element has an id starting with 'deleteprofile_'
    if (element.id && element.id.startsWith('deleteprofile_')) {
        const authorId = element.id.replace('deleteprofile_', ''); // Get author id from element id

        // Fetch authors data
        fetch(`/profiles-fetch`)
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
                const typedProfileId = prompt(`Type the profile ID (${authorId}) to confirm deletion:`);
                if (typedProfileId === null) {
                    console.log('Deletion canceled.');
                    return;
                }

                // Verify typed profile ID and proceed with deletion
                if (typedProfileId === authorId) {
                    if (confirm(`Are you sure you want to delete profile with ID ${authorId}?`)) {
                        // Make a request to delete the profile
                        fetch(`/delete-profile/${authorId}/${ownerloggedin_delete}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to delete profile');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Profile deleted:', data);
                            window.location.reload()
                            // Optionally update UI or perform other actions upon successful deletion
                        })
                        .catch(error => console.error('Error deleting profile:', error));
                    }
                } else {
                    console.log('Typed profile ID does not match. Deletion canceled.');
                }
            })
            .catch(error => console.error('Error fetching authors:', error));
    }
});