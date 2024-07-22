// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Event listener for document click event
document.addEventListener('click', async function(event) {
    const element = event.target;
    const urlProfile = window.location.pathname.split('/').pop();
    const token = getCookie('token');
    
    if (!token) {
        console.log('No token found in cookies');
        return;
    }

    try {
        // Check login status
        const response = await fetch('/check-login');
        const data = await response.json();

        if (!data.loggedIn) {
            console.log('User not logged in');
            return;
        }

        const { id: userid, username: owner2 } = data.userData;
        //console.log(`Logged-in user ID: ${userid}`);

        // Check if the clicked element has an id starting with 'deleteprofile_'
        if (element.id && element.id.startsWith('deleteprofile_')) {
            const authorId = element.id.replace('deleteprofile_', ''); // Get author id from element id

            try {
                // Directly make a request to delete the profile
                const deleteResponse = await fetch(`/delete-profile/${authorId}/${token}`, {
                    method: 'DELETE'
                });

                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete profile');
                }

                const deleteData = await deleteResponse.json();
                console.log('Profile deleted:', deleteData);

                // Update UI based on the deletion
                const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
                const toggle_left_menu_2 = document.querySelector('#toggle_left_menu_2');
                toggle_left_menu_2.style.display = 'block';
                
                if (toggle_left_menu_1.classList.contains('side_button_active')) {
                    await fetchAuthorsAndRender();
                }
                if (toggle_left_menu_2.classList.contains('side_button_active')) {
                    await fetchAuthorsAndRender2();
                }
            } catch (error) {
                console.error('Error deleting profile:', error);
                alert('You need to first unpublish your public profile using the globe button on the top right to delete your profile. This button will appear visible when editing a profile.')
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
});