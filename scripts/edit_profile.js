// Function to get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Handle the button click event to switch to the edit popup
document.getElementById("edit_profile").addEventListener("click", async function() {

    // Get the current URL path
    const path = window.location.pathname;

    // Split the path into segments and get the last segment
    const segments = path.split('/');
    const urlProfile = segments.length ? segments[segments.length - 1] : null;
    console.log(urlProfile);

    // Fetch the logged-in user ID
    try {
        const response = await fetch('/check-login');
        const data = await response.json();

        if (data.loggedIn) {
            const { id: userid, username: owner2 } = data.userData;
            console.log('Logged-in user ID:', userid);

            // Get the token from cookies
            const token = getCookie('token');

            if (!token) {
                console.log('No token found in cookies');
                return;
            } else {
                console.log('Token found:', token);
            }

            // Fetch authors data based on logged-in user ID and token
            const authorsResponse = await fetch(`/profiles-edit/${userid}/${token}`);

            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }

            const authors = await authorsResponse.json();

            if (authors.length > 0) {
                // Check if the profile ID matches any author ID
                const author = authors.find(author => author.id == urlProfile);

                if (author) {
                    console.log('Author profile found:', author);
                    window.userData = author;
                    switchToEditPopup(data.userData.id, owner2, urlProfile);
                } else {
                    console.log('No matching author profile found.');
                }
            } else {
                console.log('No authors found.');
            }
        } else {
            console.log('User not logged in');
        }
    } catch (error) {
        console.error('Error fetching login status or authors:', error);
    }
});

function switchToEditPopup(owner, owner2, urlProfile) {
    const profile_popup = document.getElementById('profile_popup');
    const popup_background = document.getElementById('popup_background');

    const inputHTML = `
        <div class="popup_prompt" style="height: 430px; top: 60px">
            <img class="icon" onclick="closeInputPopup()" id="input_close" src="/media/icons/feather_icons/x.svg" style="position: absolute; top: 10px; right: 10px; scale: 0.30; transform-origin: top right; z-index: 3000;">
            <div class="group" style="top: 20px; left: 38px">
                <label class="label_tab" for="character_display_name">Character's Display Name</label>
                <input type="text" class="input_text_popup_prompt" id="character_display_name" placeholder="What is the oc's name">
            </div>
            <div class="group" style="top: 120px; left: 38px">
                <label class="label_tab" for="character_pfp">Character's Display Picture</label>
                <input type="text" class="input_text_popup_prompt" id="character_pfp" placeholder="What does the oc look like?">
            </div>
            <div class="group" style="top: 220px; left: 38px">
                <label class="label_tab" for="character_license">Character's Copyright Status</label>
                <input type="text" class="input_text_popup_prompt" id="character_license" placeholder="What is the oc's license?">
            </div>
            <div class="group" style="top: 320px; left: 38px">
                <label class="label_tab" for="brand_banner">Brand Banner</label>
                <input type="text" class="input_text_popup_prompt" id="brand_banner" placeholder="What franchise does this oc belong too?">
            </div>
            <button class="top_button" id="save_profile_button" style="padding: 20px; color: #fff; background-color: #ce1616; border: none; border-radius: 32px; cursor: pointer; top: 220px; left: -4px">Save Profile</button>
        </div>
    `;
    profile_popup.innerHTML = inputHTML;
    load_local_scheme();
    profile_popup.style.display = 'block';
    popup_background.style.display = 'block';

    // Populate the input fields with the existing data
    const userData = window.userData;
    if (userData) {
        document.getElementById('character_display_name').value = userData.display_name || '';
        document.getElementById('character_pfp').value = userData.pfp || '';
        document.getElementById('character_license').value = userData.license || '';
        document.getElementById('brand_banner').value = userData.brand_banner || '';
    }

    document.getElementById("save_profile_button").addEventListener("click", () => saveProfile(owner, owner2, urlProfile));
}

async function saveProfile(owner, owner2, urlProfile) {
    const displayName = document.getElementById("character_display_name").value;
    const pfpurl = document.getElementById('character_pfp').value || '/media/images/openprofile/openprofile_logo_512_jpeg.jpeg';
    const copyrightStatus = document.getElementById("character_license").value;
    const brand_banner = document.getElementById("brand_banner").value;

    try {
        const today = new Date();
        const todayDate = today.toLocaleDateString('en-CA');
        const todayTime = today.toLocaleTimeString('en-GB', { hour12: false });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Function to increment the version number
        function incrementVersion(version) {
            let parts = version.split('.').map(Number);
            parts[2] += 1;

            if (parts[2] >= 1000) {
                parts[2] = 0;
                parts[1] += 1;
            }
            
            if (parts[1] >= 10) {
                parts[1] = 0;
                parts[0] += 1;
            }
            
            return parts.join('.');
        }

        let profile_version_number = window.userData.profile_version || '0.0.1';
        profile_version_number = incrementVersion(profile_version_number);

        const jsonData = {
            profile_version: profile_version_number,
            id: urlProfile,
            owner: owner,
            owner2: owner2,
            visibility: "private",
            updatedDate: todayDate,
            updatedTime: todayTime,
            updatedzone: timezone,
            display_name: displayName,
            pfp: pfpurl,
            license: copyrightStatus,
            brand_banner: brand_banner
        };

        const response = await fetch('/save-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: jsonData, fileName: displayName })
        });

        if (response.ok) {
            console.log('Profile saved successfully.');
            const toggle_left_menu = document.querySelector('#toggle_left_menu');
            if (toggle_left_menu.classList.contains('side_button_active')) {
                closeInputPopup();
                if (typeof fetchAuthorsAndRender === 'function') {
                    fetchAuthorsAndRender();
                } else {
                    console.warn('fetchAuthorsAndRender function is not defined.');
                }
            }
        } else {
            console.error('Failed to save profile:', response.statusText, jsonData);
        }
    } catch (error) {
        console.error('Error saving profile:', error);
    }
}

function closeInputPopup() {
    const profile_popup = document.getElementById('profile_popup');
    const popup_background = document.getElementById('popup_background');
    profile_popup.style.display = 'none';
    popup_background.style.display = 'none';
}
