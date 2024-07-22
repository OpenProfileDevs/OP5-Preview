// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to increment the version number
function incrementVersion(version) {
    const parts = version.split('.').map(Number);
    parts[2] = (parts[2] + 1) % 1000;
    if (parts[2] === 0) {
        parts[1] = (parts[1] + 1) % 10;
        if (parts[1] === 0) {
            parts[0] += 1;
        }
    }
    return parts.join('.');
}

// Function to handle profile update
async function handleProfileUpdate() {
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
        console.log(`Logged-in user ID: ${userid}`);

        // Fetch authors data
        const authorsResponse = await fetch(`/profiles-edit/${userid}/${token}`);
        if (!authorsResponse.ok) throw new Error('Failed to fetch authors');

        const authors = await authorsResponse.json();
        if (authors.length === 0) {
            console.log('No authors found.');
            if (typeof fetchAuthorsAndRender2 === 'function') {
                fetchAuthorsAndRender2();  // Ensure this function is defined
            }
            return;
        }

        const author = authors.find(author => author.id === urlProfile);
        if (!author) {
            console.log('No matching author profile found.');
            return;
        }

        console.log(`Author profile found: ${JSON.stringify(author)}`);
        window.userData = author;

        const owner = userid;

        // Prepare data for saving
        const today = new Date();
        const todayDate = today.toLocaleDateString('en-CA');
        const todayTime = today.toLocaleTimeString('en-GB', { hour12: false });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const visibility = author.visibility === "private" ? "public" : "private";
        let profile_version_number = author.profile_version || '0.0.1';
        profile_version_number = incrementVersion(profile_version_number);

        const jsonData = {
            profile_version: profile_version_number,
            id: urlProfile,
            owner: owner,
            owner2: owner2,
            updatedDate: todayDate,
            updatedTime: todayTime,
            updatedzone: timezone,
        };

        console.log(`Payload being sent to /update-visibility-profile: ${JSON.stringify({ data: jsonData, fileName: author.id, visibility: visibility })}`);

        // Update profile visibility
        const visibilityResponse = await fetch(`/update-visibility-profile/${urlProfile}/${userid}/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: jsonData, fileName: author.id, visibility: visibility })
        });

        if (!visibilityResponse.ok) {
            console.error(`Failed to update profile visibility: ${visibilityResponse.statusText}`);
            return;
        }

        console.log('Profile visibility updated successfully.');
        if (typeof fetchAuthorsAndRender === 'function') {
            location.reload()
        }

        // Close popup and refresh UI if needed
        const toggleLeftMenu = document.querySelector('#toggle_left_menu');
        if (toggleLeftMenu && toggleLeftMenu.classList.contains('side_button_active')) {
            // Add logic to close popup or perform additional UI updates if needed
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Handle button click event
document.getElementById("public_profile").addEventListener("click", async function() {
    console.log('Button clicked');
    await handleProfileUpdate();
});
