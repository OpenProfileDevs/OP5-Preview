// Event listener for document click event
document.addEventListener('click', function(event) {
    const element = event.target;

    // Check if the clicked element has an id starting with 'editprofile_'
    if (element.id && element.id.startsWith('editprofile_')) {
        const authorId = element.id.replace('editprofile_', ''); // Get author id from element id

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


                if (authorId === authorId) {
                    // Forward to the edit URL if the profile ID matches
                    window.location.href = `/editor/${authorId}`;
                } else {
                    console.log('Typed profile ID does not match. editing canceled.');
                }
            })
            .catch(error => console.error('Error fetching authors:', error));
    }
});