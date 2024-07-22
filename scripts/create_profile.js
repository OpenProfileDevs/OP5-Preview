// Function to handle the button click event
document.getElementById("icon_create").addEventListener("click", function() {
    switchToInputPopup();
});

function switchToInputPopup() {
    const profile_popup = document.getElementById('profile_popup');
    const popup_background = document.getElementById('popup_background');

    const inputHTML = `
        <div class="popup_prompt" style="height: 340px; top: 60px">
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
            <button class="top_button" id="create_profile_button" style="padding: 20px; color: #fff; background-color: #ce1616; border: none; border-radius: 32px; cursor: pointer; top: 168px; left: -4px">Create Profile</button>
        </div>
    `;
    profile_popup.innerHTML = inputHTML;
    load_local_scheme()
    profile_popup.style.display = 'block';
    popup_background.style.display = 'block';

    // Ensure the event listener is added after the button is inserted into the DOM
    document.getElementById("create_profile_button").addEventListener("click", async function() {
        const displayName = document.getElementById("character_display_name").value;
        const copyrightStatus = document.getElementById("character_license").value;

        try {
            const response = await fetch('/check-login');
            const data = await response.json();
            const response2 = await fetch('/iduniqueload');
            const data2 = await response2.json();

            if (data.loggedIn) {
                const userData = data.userData;
                const owner = userData.id;
                const owner2 = userData.username;
                let pfpurl = document.getElementById('character_pfp').value;
                if (!pfpurl) {
                    pfpurl = 'https://preview.openprofile.app/media/images/openprofile/openprofile_logo_512_jpeg.jpeg';
                }
                const profileid = data2.id

                // Get current date and time in local timezone
                const today = new Date();
                const todayDate = today.toLocaleDateString('en-CA');
                const todayTime = today.toLocaleTimeString('en-GB', { hour12: false });

                // Get local timezone name
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                console.log('Created Date:', today);
                console.log('Created Time:', todayDate);
                console.log('Timezone:', todayTime);

                const groups = document.querySelectorAll('.group');
                const jsonData = {
                    "#": "Import this file over at OpenProfile 5 -> https://preview.openprofile.com",
                    "#APP-VERSION": "PREVIEW",
                    profile_version: '0.0.1',
                    owner: owner,
                    owner2: owner2,
                    id: `${profileid}`,
                    url: `${profileid}`,
                    url2: `${profileid}`,
                    updatedDate: todayDate,
                    updatedTime: todayTime,
                    updatedzone: timezone,
                    verified: false,
                    promoted: false,
                    display_name: displayName,
                    pfp: pfpurl,
                    visibility: "private",
                    license: copyrightStatus
                };

                groups.forEach((group) => {
                    const group_id = group.id.replace('_group', '');
                    const label_tab = group.querySelector(`#${CSS.escape(group_id)}_label_tab`);
                    const input_text = document.getElementById(`${CSS.escape(group_id)}`);

                    if (label_tab && input_text) {
                        let input_content = input_text.value.replace(/\n/g, "\\n");

                        if (input_content.trim() !== '') {
                            jsonData[group_id] = input_content;
                        } else {
                            //console.log(`Input field for "${label_tab.textContent}" is blank.`);
                        }
                    }
                });

                const saveResponse = await fetch('/create-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: jsonData, fileName: displayName })
                });

                if (saveResponse.ok) {
                    console.log('Profile saved successfully.');
                    const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
                    if (toggle_left_menu_1.classList.contains('side_button_active')) {
                        closeInputPopup()
                        fetchAuthorsAndRender();
                    }
                } else {
                    console.error('Failed to save file:', saveResponse.statusText, jsonData);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function closeInputPopup() {
    const profile_popup = document.getElementById('profile_popup');
    const popup_background = document.getElementById('popup_background');
    profile_popup.style.display = 'none';
    popup_background.style.display = 'none';
}
