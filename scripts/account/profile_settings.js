// Function to load user data when logged in or public
function loadUserData(userData) {
    const urlprofile = window.location.pathname.split('/').pop();

    // Fetch user profile data
    fetch(`/data/author/${urlprofile}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User data not found');
            }
            return response.json();
        })
        .then(data => {
            // Check if the user is banned
            if (data.banned) {
                console.log('User is banned');
                return; // Return early if banned
            }

            // Update profile information
            updateProfileInfo(data, userData);

            // Check if the user is viewing their own profile
            if (userData && userData.username === urlprofile) {
                createEditProfileButton(data);
                createDiscordProfileButton();
            }

            // Fetch profiles for the specified author
            fetchProfiles(urlprofile);
        })
        .catch(error => console.error('Error fetching user data:', error));
}

// Function to update profile information
function updateProfileInfo(data, userData) {
    
    const profileInfo = document.getElementById('profile_info');
    const joinDate = new Date(data.todayDate);
    const formattedJoinDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    profileInfo.innerHTML = `
        <img src="${data.pfp}" style="width: 128px; height: 128px; border-radius: 50%;"><br>
        <div style="display: inline-flex; align-items: center; justify-items: center; transform: translate(0px, -50px)">
            <p id="author_profile_displayname" style="font-size: 48px; font-family: NotoSans-Bold;">${data.displayname ? data.displayname : data.username}</p>
            ${renderBadge(data.moderator, 'shield.svg', '#cf1516')}
            ${renderBadge(data.contributor, 'toggle-right.svg', '#2b4eda')}
            ${renderBadge(data.verified, 'check.svg', '#cf1516')}
            ${renderBadge(data.premium, 'openprofile_logo_not_feather_icons.svg', '#cfa715')}
            ${renderBadge(data.early, 'bold.svg', '#7b15cf')}
            
        </div>
        <p id="profile_username" style="display: relative; font-size: 24px; font-family: NotoSans-Medium; margin-bottom: 60px; transform: translate(0px, -120px)">@${data.username}</p>
        <p id="profile_names" style="display: relative; font-size: 24px; font-family: NotoSans-Medium; margin-bottom: 60px; transform: translate(0px, -160px)">Characters: </p>
        <p style="display: relative; font-size: 24px; font-family: NotoSans-Medium;">Joined ${formattedJoinDate}</p>
    `;

    function renderBadge(condition, icon, color) {
        return condition ? `<img src="/media/icons/feather_icons/${icon}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: ${color}; margin-top: 10px; margin-left: 10px;">` : '';
    }
}

// Function to fetch and display profiles
function fetchProfiles(urlprofile) {
    fetch(`/profiles-fetch-author/${urlprofile}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profiles');
            }
            return response.json();
        })
        .then(data => {
            const profileNamesElement = document.getElementById('profile_names');
            const profiles = data.profiles;

            console.log(`Total matching profiles: ${data.totalMatchingProfiles}`);

            profiles.forEach((profile, index) => {
                const profileLink = document.createElement('a');
                profileLink.href = `https://preview.openprofile.app/profile/${profile.url}`;
                profileLink.textContent = profile.displayname;
                profileLink.target = "_blank";
                profileNamesElement.appendChild(profileLink);

                if (index !== profiles.length - 1) {
                    profileNamesElement.appendChild(document.createTextNode(', '));
                }
            });
        })
        .catch(error => console.error('Error fetching profiles:', error));
}

// Function to create edit profile button
function createEditProfileButton(data) {
    const button = document.createElement('button');
    button.id = 'edit_user_data_profile';
    button.textContent = 'Edit Profile';
    button.style.top = '-230px';
    const profileInfo = document.getElementById('profile_info');
    profileInfo.appendChild(button);

    button.addEventListener('click', () => {
        let newDataValue = prompt('Enter your new display name:', data.displayname || '');
        let pfpurl = prompt('Enter the URL of your new profile picture (leave blank for none):', data.pfp || '');

        // Validate URLs and handle user input
        validateAndUpdate(data, newDataValue, pfpurl);
    });
}

// Function to create edit profile button
function createDiscordProfileButton() {
    const button = document.createElement('button');
    button.id = 'edit_user_data_profile';
    button.textContent = 'Edit Profile';
    button.style.top = '-230px';
    const profileInfo = document.getElementById('discord_info');
    profileInfo.appendChild(button);
}

// Validate user input and update profile
function validateAndUpdate(data, newDataValue, pfpurl) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
    
    if (!pfpurl) {
        pfpurl = "/media/images/openprofile/openprofile_logo_512_jpeg.jpeg";
    }

    if (pfpurl !== "/media/images/openprofile/openprofile_logo_512_jpeg.jpeg" && !urlPattern.test(pfpurl)) {
        alert("That's not a valid URL.");
        return;
    }

    // Fetch the blacklist
    fetch('/blacklist.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch blacklist');
            }
            return response.text();
        })
        .then(blacklist => {
            const blacklistArray = blacklist.split(',').map(word => word.trim().toLowerCase());

            // Ensure newDataValue is lowercase for comparison
            const lowerCaseValue = newDataValue.trim().toLowerCase();

            // Check if the newDataValue exactly matches any blacklisted word
            if (isBlacklisted(lowerCaseValue, blacklistArray)) {
                alert('Usernames must be community friendly.');
                return;
            }

            // If no blacklisted words found, proceed with updating profile data
            const combinedData = {
                editData: {
                    filePath: data.username,
                    dataName: 'displayname',
                    dataValue: newDataValue,
                },
                editData2: {
                    filePath: data.username,
                    dataName: 'pfp',
                    dataValue: pfpurl,
                },
            };

            fetch('/edit-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(combinedData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit data');
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Edit successful:', responseData);
                alert('Profile updated successfully.');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error editing data:', error);
                alert('Failed to update profile. Please try again later.');
            });
        })
        .catch(error => {
            console.error('Error fetching blacklist:', error);
            alert('Failed to fetch blacklist. Please try again later.');
        });
}

// Check if newDataValue is blacklisted
function isBlacklisted(newDataValue, blacklist) {
    // Check if newDataValue exactly matches any blacklisted word
    return blacklist.includes(newDataValue);
}

// Call the function when the page loads
window.onload = function () {
    fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            const account = document.getElementById('label_top_account');
            if (data.loggedIn) {
                account.textContent = `Logged in with @${data.userData.username}`;
                loadUserData(data.userData);
            } else {
                loadUserDataPublic();
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
};

// Function to load public user data
function loadUserDataPublic() {
    const urlprofile = window.location.pathname.split('/').pop();
    fetch(`/data/author/${urlprofile}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User data not found');
            }
            return response.json();
        })
        .then(userData => {
            updateProfileInfo(userData, null);
            fetchProfiles(urlprofile);
        })
        .catch(error => console.error('Error fetching public user data:', error));
}
