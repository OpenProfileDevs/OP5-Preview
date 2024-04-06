// Function to load user data when logged in
function loadUserData(userData) {
    // Extract username from current URL
    const urlprofile = window.location.pathname.split('/').pop();

    fetch(`/data/author/${urlprofile}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User data not found');
            }
            return response.json();
        })
        .then(data => {
            // Update profile information
            const profileInfo = document.getElementById('profile_info');
            document.title = `OpenProfile 5 - ${data.username}`;
            document.querySelector('meta[property="og:title"]').setAttribute('content', `OpenProfile 5 - ${data.username}`);

            // Format join date
            const joinDate = new Date(data.todayDate);
            const formattedJoinDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            profileInfo.innerHTML = `
                <img src="/media/images/openprofile/openprofile_logo_512_jpeg.jpeg" style="width: 128px; height: 128px; border-radius: 50%;"><br>
                <div style="display: inline-flex; align-items: center; justify-items: center; transform: translate(0px, -50px)">
                    <p id="author_profile_displayname" style="font-size: 48px; font-family: NotoSans-Bold;">${data.displayname ? data.displayname : data.username}</p>
                    <img id="moderator_badge" src="/media/icons/feather_icons/shield.svg" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: #cf1516; margin-top: 10px; margin-left: 10px;">
                    <img id="contributor_badge" src="/media/icons/feather_icons/toggle-right.svg" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: #2b4eda; margin-top: 10px; margin-left: 10px;">
                    <img id="verified_badge" src="/media/icons/feather_icons/check.svg" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: #cf1516; margin-top: 10px; margin-left: 10px;">
                    <img id="promoted_badge" src="/media/icons/feather_icons/arrow-up.svg" style="width: 36px; height: 36px; padding: 4px; border-radius: 50%; background-color: #cfa715; margin-top: 10px; margin-left: 10px;">
                    <img id="premium_badge" src="/media/icons/feather_icons/openprofile_logo_not_feather_icons.svg" style="width: 36px; height: 36px; padding: 4px; border-radius: 50%; background-color: #cfa715; margin-top: 10px; margin-left: 10px;">
                </div>
                <p id="profile_username" style="display: relative; font-size: 24px; font-family: NotoSans-Medium; margin-bottom: 60px; transform: translate(0px, -120px)">@${data.username}</p>
                <p style="display: relative; font-size: 24px; font-family: NotoSans-Medium;">Joined ${formattedJoinDate}</p>
            `;

            // Get references to the images
            const moderator_badge = document.getElementById('moderator_badge');
            const verified_badge = document.getElementById('verified_badge');
            const premium_badge = document.getElementById('premium_badge');
            const contributor_badge = document.getElementById('contributor_badge');
            const promoted_badge = document.getElementById('promoted_badge');

            // Conditionally show or hide the icons based on certain conditions
            if (data.moderator == true) {
                moderator_badge.style.display = 'block';
            } else {
                moderator_badge.style.display = 'none';
            }

            if (data.verified == true) {
                verified_badge.style.display = 'block';
            } else {
                verified_badge.style.display = 'none';
            }

            if (data.premium == true) {
                premium_badge.style.display = 'block';
            } else {
                premium_badge.style.display = 'none';
            }

            if (data.contributor == true) {
                contributor_badge.style.display = 'block';
            } else {
                contributor_badge.style.display = 'none';
            }

            if (data.promoted == true) {
                promoted_badge.style.display = 'block';
            } else {
                promoted_badge.style.display = 'none';
            }

            // Check if the user is viewing their own profile
            if (userData && userData.username === urlprofile) {
                createEditProfileButton(data);
            }

        })
        .catch(error => console.error('Error fetching JSON:', error));
}

// Call the function when the page loads
window.onload = function() {
    // Check if the user is logged in and load user data accordingly
    fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // Access userData if available and use it
                const userData = data.userData;
                if (userData) {
                    // Do something with userData, for example:
                    console.log('User Data:', userData);
                }
                const account = document.getElementById('label_top_account');
                account.textContent = `Logged in with @${userData.username}`;
                // Call loadUserData when logged in
                loadUserData(userData);
            } else {
                // If not logged in, load public user data
                loadUserDataPublic();
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
};

// Function to load public user data
function loadUserDataPublic() {
    // Extract username from current URL
    const urlprofile = window.location.pathname.split('/').pop();

    fetch(`/data/author/${urlprofile}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User data not found');
            }
            return response.json();
        })
        .then(data => {
            // Update profile information
            const profileInfo = document.getElementById('profile_info');
            document.title = `OpenProfile 5 - ${data.username}`;
            document.querySelector('meta[property="og:title"]').setAttribute('content', `OpenProfile 5 - ${data.username}`);

            // Format join date
            const joinDate = new Date(data.todayDate);
            const formattedJoinDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            profileInfo.innerHTML = `
            <img src="/media/images/openprofile/openprofile_logo_512_jpeg.jpeg" style="width: 128px; height: 128px; border-radius: 50%;"><br>
            <div style="display: inline-flex; align-items: center; justify-items: center; transform: translate(0px, -50px)">
                <p id="author_profile_displayname" style="font-size: 48px; font-family: NotoSans-Bold;">${data.displayname ? data.displayname : data.username}</p>
                <img id="moderator_badge" src="/media/icons/feather_icons/shield.svg" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: #cf1516; margin-top: 10px; margin-left: 10px;">
                <img id="contributor_badge" src="/media/icons/feather_icons/toggle-right.svg" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: #2b4eda; margin-top: 10px; margin-left: 10px;">
                <img id="verified_badge" src="/media/icons/feather_icons/check.svg" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: #cf1516; margin-top: 10px; margin-left: 10px;">
                <img id="premium_badge" src="/media/icons/feather_icons/openprofile_logo_not_feather_icons.svg" style="width: 36px; height: 36px; padding: 4px; border-radius: 50%; background-color: #cfa715; margin-top: 10px; margin-left: 10px;">
            </div>
            <p id="profile_username" style="display: relative; font-size: 24px; font-family: NotoSans-Medium; margin-bottom: 60px; transform: translate(0px, -120px)">@${data.username}</p>
            <p style="display: relative; font-size: 24px; font-family: NotoSans-Medium;">Joined ${formattedJoinDate}</p>
            `;

            // Get references to the images
            const moderator_badge = document.getElementById('moderator_badge');
            const verified_badge = document.getElementById('verified_badge');
            const premium_badge = document.getElementById('premium_badge');
            const contributor_badge = document.getElementById('contributor_badge');

            // Conditionally show or hide the icons based on certain conditions
            if (data.moderator == true) {
                moderator_badge.style.display = 'block';
            } else {
                moderator_badge.style.display = 'none';
            }

            if (data.verified == true) {
                verified_badge.style.display = 'block';
            } else {
                verified_badge.style.display = 'none';
            }

            if (data.premium == true) {
                premium_badge.style.display = 'block';
            } else {
                premium_badge.style.display = 'none';
            }

            if (data.contributor == true) {
                contributor_badge.style.display = 'block';
            } else {
                contributor_badge.style.display = 'none';
            }

        })
        .catch(error => console.error('Error fetching JSON:', error));
}

// Function to create the edit profile button
function createEditProfileButton(data) {
    // Create the edit profile button
    const button = document.createElement('button');
    button.id = 'edit_user_data_profile';
    button.textContent = 'Edit Profile';
    button.style.top = '-230px'
    // Append the button to the profile_info div
    const profileInfo = document.getElementById('profile_info');
    profileInfo.appendChild(button);

    // Add an event listener to the button
    button.addEventListener('click', function() {
        // Prompt for the new value
        let newDataValue = prompt('Enter your new display name:');
        if (newDataValue !== null && newDataValue.trim() !== '') {
        // Example data for the edit
        const editData = {
                filePath: data.username,
                dataName: 'displayname',
                dataValue: newDataValue
            };

            // Send a POST request to the server
            fetch('/edit-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit data');
                }
                return response.text();
            })
            .then(message => {
                console.log(message); // Log success message
            })
            .catch(error => {
                console.error('Error editing data:', error); // Log error message
                alert('Failed to update data');
            });
            // Load in new data
            const authorProfileDisplayName = document.getElementById('author_profile_displayname')
            authorProfileDisplayName.textContent = newDataValue;
        }
    });
}
