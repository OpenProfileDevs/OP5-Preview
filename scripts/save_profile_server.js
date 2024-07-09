const saveButtonServer = document.getElementById('saveButtonServer');
saveButtonServer.addEventListener('click', async function () {
    try {
        const response = await fetch('/check-login');
        const data = await response.json();

        if (data.loggedIn) {
            const userData = data.userData;
            const owner = userData.id;
            const owner2 = userData.username;

            let fileName = document.getElementById('page_display_name_1').value;
            let pfpurl = document.getElementById('pfp_1').value;

            const uniqueID = document.getElementById('uniqueID').textContent;

            // Check if the profile exists and get its data
            const profileResponse = await fetch(`/profile/json/${uniqueID}`);
            if (!profileResponse.ok) {
                alert('Profile not found.');
                return;
            }

            const profileData = await profileResponse.json();

            // Check if the logged-in user is the owner of the profile
            if (profileData.owner !== owner) {
                alert("You can't save a profile you don't own.");
                return;
            }

            const today = new Date();
            var todayDate = today.toISOString().split('T')[0];
            var todayTime = today.toTimeString().split(' ')[0];
            var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const groups = document.querySelectorAll('.group');
            const jsonData = {
                "#": "Import this file over at OpenProfile 5 -> https://preview.openprofile.com",
                "#APP-VERSION": "PREVIEW",
                "#PROFILE-VERSION": "1.0.0",
                id: uniqueID,
                url: uniqueID,
                url2: uniqueID,
                owner: owner,
                owner2: owner2,
                updatedDate: todayDate,
                updatedTime: todayTime,
                updatedzone: timezone,
                verified: false,
                promoted: false,
                page_display_name_1: fileName,
                pfp_1: pfpurl
            };

            groups.forEach((group) => {
                const group_id = group.id.replace('_group', '');
                const label_tab = group.querySelector(`#${group_id}_label_tab`);
                const input_text = document.getElementById(`${group_id}`);
            
                if (label_tab && input_text) {
                    let input_content = input_text.value.replace(/\n/g, "\\n");
                    
                    if (input_content.trim() !== '') {
                        jsonData[group_id] = input_content;
                    } else {
                        console.log(`Input field for "${label_tab.textContent}" is blank.`);
                    }
                }
            });

            const saveResponse = await fetch('/save-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: jsonData, fileName: fileName, owner: owner })
            });

            if (saveResponse.ok) {
                console.log('File saved successfully.', jsonData);
                alert('Character saved to your profile.');
            } else {
                console.error('Failed to save file:', saveResponse.statusText, jsonData);
            }
        } else {
            alert('You need to be logged in to save online.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Fetch profile data and update HTML elements
const urlProfile = window.location.pathname.split('/').pop();
fetch(`/profile/json/${urlProfile}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(userData => {
        // Log the fetched user data
        console.log('Fetched User Data:', userData);

        // Update HTML elements with data from userData
        for (const key in userData) {
            if (Object.hasOwnProperty.call(userData, key)) {
                const value = userData[key];
                const element = document.getElementById(key);
                if (element) {
                    // Replace <br> with newline characters for form input fields
                    const formattedValue = value.replace(/<br>/g, '\n');
                    element.value = formattedValue;

                    // Replace newline characters with <br> for other elements
                    const displayValue = value.replace(/\n/g, '<br>');
                    element.innerHTML = displayValue;
                }
            }
        }
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
    });
