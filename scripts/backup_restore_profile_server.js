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

        // Check if the clicked element has an id starting with 'restorebackupprofile_'
        if (element.id && element.id.startsWith('restorebackupprofile_')) {
            // Extract the version number after the second underscore
            const idParts = element.id.split('_');
            if (idParts.length >= 3) {
                const authorId = idParts[1];
                const versionNumber = idParts[2];

                // Confirm the restore action
                const confirmRestore = confirm(`Are you sure you want to restore profile ${authorId} version ${versionNumber}?`);
                
                if (!confirmRestore) {
                    console.log('Profile restoration canceled by user.');
                    return; // Exit the function if user cancels
                }

                try {
                    // Directly make a request to restore the profile
                    const deleteResponse = await fetch(`/restore-backup-profile/${authorId}/${versionNumber}/${token}`, {
                        method: 'DELETE'
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('Failed to restore profile');
                    }

                    const deleteData = await deleteResponse.json();
                    console.log('Profile restored:', deleteData);

                    // Update UI based on the restoration
                    const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
                    const toggle_left_menu_2 = document.querySelector('#toggle_left_menu_2');
                    const toggle_left_menu_3 = document.querySelector('#toggle_left_menu_3');
                    
                    toggle_left_menu_2.style.display = 'block';
                    
                    if (toggle_left_menu_1.classList.contains('side_button_active')) {
                        await fetchAuthorsAndRender();
                    }
                    if (toggle_left_menu_2.classList.contains('side_button_active')) {
                        await fetchAuthorsAndRender2();
                    }
                    if (toggle_left_menu_3.classList.contains('side_button_active')) {
                        await fetchAuthorsAndRender3();
                    }
                } catch (error) {
                    console.error('Error restoring profile:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
});
