const saveButtonServer = document.getElementById('saveButtonServer');
saveButtonServer.addEventListener('click', async function () {
    try {
        // Check login status
        const response = await fetch('/check-login');
        const data = await response.json();

        if (!data.loggedIn) {
            console.log('User not logged in.');
            return;
        }

        const userData = data.userData;
        const owner = userData.id;
        const owner2 = userData.username;

        // Extract uniqueID from URL path
        const path = window.location.pathname;
        const segments = path.split('/');
        const uniqueID = segments.length ? segments[segments.length - 1] : null;
        console.log('Unique ID:', uniqueID);

        // Get current date and time
        const today = new Date();
        const todayDate = today.toLocaleDateString('en-CA');
        const todayTime = today.toLocaleTimeString('en-GB', { hour12: false });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        console.log('Updated Date:', todayDate);
        console.log('Updated Time:', todayTime);
        console.log('Timezone:', timezone);

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

        // Function to get cookie value
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        // Get the token from cookies
        const token = getCookie('token');

        if (!token) {
            console.log('No token found in cookies');
            return;
        } else {
            console.log('Token found:', token);
        }

        // Fetch authors data
        const authorsResponse = await fetch(`/profiles-edit/${owner}/${token}`);

        if (!authorsResponse.ok) {
            throw new Error('Failed to fetch authors');
        }

        const authors = await authorsResponse.json();
        console.log('Fetched authors:', authors);

        // Find the author with the matching uniqueID
        const currentAuthor = authors.find(author => author.id === uniqueID);

        if (!currentAuthor) {
            console.error('Author not found. ID:', uniqueID);
            return;
        }

        // Increment version number
        let profile_version_number = currentAuthor.profile_version || '0.0.1';
        profile_version_number = incrementVersion(profile_version_number);

        // Prepare data for saving
        const groups = document.querySelectorAll('.group');
        const jsonData = {
            "#": "Import this file over at OpenProfile 5 -> https://preview.openprofile.com",
            "#APP-VERSION": "PREVIEW",
            profile_version: profile_version_number,
            owner: owner,
            owner2: owner2,
            id: `${uniqueID}`,
            url: `${uniqueID}`,
            url2: `${uniqueID}`,
            visibility: "private",
            updatedDate: todayDate,
            updatedTime: todayTime,
            updatedzone: timezone,
        };

        groups.forEach((group) => {
            const group_id = group.id.replace('_group', '');
            const input_text = document.getElementById(group_id);

            if (input_text) {
                let input_content = input_text.value.replace(/\n/g, "\\n");
                jsonData[group_id] = input_content; // Save input content
            }
        });

        // Save profile data
        const saveResponse = await fetch('/save-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: jsonData, fileName: uniqueID, owner: owner })
        });

        if (saveResponse.ok) {
            console.log('Profile saved successfully.');
            const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
            if (toggle_left_menu_1.classList.contains('side_button_active')) {
                fetchAuthorsAndRender();
            }
        } else {
            console.error('Failed to save file:', saveResponse.statusText, jsonData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
