// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Event listener for document click event
document.addEventListener('click', async function(event) {
    const element = event.target;

    // Check if the clicked element has an id starting with 'promoteprofile_'
    if (element.id && element.id.startsWith('promoteprofile_')) {
        const authorId = element.id.replace('promoteprofile_', ''); // Get author id from element id

        try {
            // Fetch the logged-in user ID
            const response = await fetch('/check-login');
            const data = await response.json();

            if (data.loggedIn) {
                const userData = data.userData;
                const userId = userData.id;
                console.log('Logged-in user ID:', userId);

                // Get the token from cookies
                const token = getCookie('token');

                if (!token) {
                    console.log('No token found in cookies');
                    return; // Exit the function if no token is found
                } else {
                    console.log('Token found:', token);
                }

                // Fetch authors data based on logged-in user ID and token
                const authorsResponse = await fetch(`/profiles-edit/${userId}/${token}`);
                if (!authorsResponse.ok) {
                    throw new Error('Failed to fetch authors data');
                }

                // Get current date and time
                const today = new Date();
                const todayDate = today.toLocaleDateString('en-CA');
                const todayTime = today.toLocaleTimeString('en-GB', { hour12: false });
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Function to increment the version number
                function incrementVersion(version) {
                    let [major, minor, patch] = version.split('.').map(Number);
                    
                    patch += 1;
                    if (patch >= 1000) {
                        patch = 0;
                        minor += 1;
                    }
                    if (minor >= 10) {
                        minor = 0;
                        major += 1;
                    }
                    
                    return `${major}.${minor}.${patch}`;
                }

                const authors = await authorsResponse.json();

                // Debugging: Check the fetched authors
                console.log('Fetched authors:', authors);

                // Find the author with the matching id
                const author = authors.find(author => author.id == authorId);
                if (!author) {
                    throw new Error('Author not found');
                }

                console.log('Selected author:', author);

                // Check if the logged-in user is the owner or a moderator
                if (userId === author.owner || userData.moderator) {
                    // Determine action based on author verification status
                    const action = author.promoted ? 'unpromote' : 'promote';

                    // Increment version number
                    let profile_version_number = author.profile_version || '0.0.1';
                    profile_version_number = incrementVersion(profile_version_number);

                    if (action === 'promote') {
                        // Check how many profiles owned by the author are already promoted
                        const ownedProfiles = authors.filter(profile => profile.owner == author.owner); // Ensure correct comparison
                        const promotedCount = ownedProfiles.filter(profile => profile.promoted).length;

                        // Debugging: Check the owned profiles and count
                        console.log('Owned profiles:', ownedProfiles);
                        console.log('Number of promoted profiles:', promotedCount);

                        if (promotedCount >= 2) {
                            alert('You can only promote up to two profiles at a time.');
                            return; // Exit the function if the limit is reached
                        }

                        // Promote the author if not already promoted
                        if (!author.promoted) {
                            // Update the author data
                            author.promoted = true;

                            // Save the updated author profile
                            const saveResponse = await fetch('/save-profile', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    fileName: author.id,
                                    data: {
                                        ...author,
                                        visibility: "private",
                                        updatedDate: todayDate,
                                        updatedTime: todayTime,
                                        updatedzone: timezone,
                                        promoted: true,
                                        profile_version: profile_version_number
                                    }
                                })
                            });

                            if (saveResponse.ok) {
                                console.log('Author promoted and profile saved:', authorId);
                                const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
                                if (toggle_left_menu_1.classList.contains('side_button_active')) {
                                    fetchAuthorsAndRender();
                                }
                                // Optionally update UI or perform other actions upon successful verification
                                //window.location.reload(); // Reload the page after verification
                            } else {
                                throw new Error('Failed to save author profile');
                            }
                        } else {
                            console.log('Author is already promoted.');
                        }
                    } else if (action === 'unpromote') {
                        // Unpromote the author if already promoted
                        if (author.promoted) {
                            // Update the author data
                            author.promoted = false;

                            // Save the updated author profile
                            const saveResponse = await fetch('/save-profile', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    fileName: author.id,
                                    data: {
                                        ...author,
                                        visibility: "private",
                                        updatedDate: todayDate,
                                        updatedTime: todayTime,
                                        updatedzone: timezone,
                                        promoted: false,
                                        profile_version: profile_version_number
                                    }
                                })
                            });

                            if (saveResponse.ok) {
                                console.log('Author unpromoted and profile saved:', authorId);
                                const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
                                if (toggle_left_menu_1.classList.contains('side_button_active')) {
                                    fetchAuthorsAndRender();
                                }
                                // Optionally update UI or perform other actions upon successful un-verification
                                //window.location.reload(); // Reload the page after un-verification
                            } else {
                                throw new Error('Failed to save author profile');
                            }
                        } else {
                            console.log('Author is not promoted.');
                        }
                    }
                } else {
                    console.log('You do not have permission to promote/unpromote this author.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
