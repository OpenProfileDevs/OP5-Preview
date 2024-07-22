// Function to get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Handle the button click event to switch to the edit popup
document.getElementById("edit_user_data_author").addEventListener("click", async function() {
    // Get the current URL path
    const path = window.location.pathname;
    const segments = path.split('/');
    const urlauthor = segments.length ? segments[segments.length - 1] : null;
    console.log('Author ID from URL:', urlauthor);

    try {
        const response = await fetch('/check-login');
        const data = await response.json();

        if (data.loggedIn) {
            const userData = data.userData;
            const owner = userData.id;
            const owner2 = userData.username;
            console.log('Logged-in user ID:', owner);

            const token = getCookie('token');
            if (!token) {
                console.log('No token found in cookies');
                return;
            } else {
                console.log('Token found:', token);
            }

            // Fetch all authors
            const authorsResponse = await fetch(`/authors-fetch`);
            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }

            const authors = await authorsResponse.json();
            if (authors.length > 0) {
                // Correct the comparison here
                const author = authors.find(author => author.username === urlauthor);
                if (author) {
                    console.log('Author found:', author);
                    window.userData = author;
                    switchToEditPopup(owner, owner2, urlauthor);
                } else {
                    console.log('No matching author found.');
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

function switchToEditPopup(owner, owner2, urlauthor) {
    const author_popup = document.getElementById('author_popup');
    const popup_background = document.getElementById('popup_background');

    if (!author_popup || !popup_background) {
        console.error('Popup elements not found');
        return;
    }

    const inputHTML = `
        <div class="popup_prompt" style="height: 240px; top: 0px">
            <img class="icon" onclick="closeInputPopup()" id="input_close" src="/media/icons/feather_icons/x.svg" style="position: absolute; top: 10px; right: 10px; scale: 0.30; transform-origin: top right; z-index: 3000;">
            <div class="group" style="top: 20px; left: 38px">
                <label class="label_tab" for="author_display_name">Author's Display Name</label>
                <input type="text" class="input_text_popup_prompt" id="author_display_name" placeholder="What is your display name?">
            </div>
            <div class="group" style="top: 120px; left: 38px">
                <label class="label_tab" for="author_pfp">Author's Profile Picture</label>
                <input type="text" class="input_text_popup_prompt" id="author_pfp" placeholder="What picture do you want to use?">
            </div>
            <button class="top_button" id="create_author_button" style="padding: 20px; color: #fff; background-color: #ce1616; border: none; border-radius: 32px; cursor: pointer; top: 116px; left: -4px">Save Settings</button>
        </div>
    `;

    author_popup.innerHTML = inputHTML;
    load_local_scheme()
    author_popup.style.display = 'block';
    popup_background.style.display = 'block';
    let authorID = window.userData.id
    if (window.userData) {
        const displayNameInput = document.getElementById('author_display_name');
        const pfpInput = document.getElementById('author_pfp');
        const licenseInput = document.getElementById('author_license');

        if (displayNameInput) {
            displayNameInput.value = window.userData.displayname || '';
        }
        if (pfpInput) {
            pfpInput.value = window.userData.pfp || '';
        }
        if (licenseInput) {
            licenseInput.value = window.userData.license || '';
        }
        authorID = window.userData.id
    }

    const saveButton = document.getElementById("create_author_button");
    if (saveButton) {
        saveButton.addEventListener("click", () => saveAuthor(owner, authorID, urlauthor));
    }
}

function closeInputPopup() {
    const author_popup = document.getElementById('author_popup');
    const popup_background = document.getElementById('popup_background');
    author_popup.style.display = 'none';
    popup_background.style.display = 'none';
}

async function saveAuthor(owner, authorID, urlauthor) {
    const displayName = document.getElementById("author_display_name").value;
    const pfpurl = document.getElementById('author_pfp').value || 'http://localhost:3000/media/images/openauthor/openauthor_logo_512_jpeg.jpeg';

    if (!displayName || !pfpurl) {
        console.error('Required fields are missing.');
        return;
    }

    try {
        const jsonData = {
            username: urlauthor,
            displayname: displayName,
            pfp: pfpurl,
        };

        const response = await fetch(`/authors-edit/${owner}/${authorID}/${getCookie('token')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: jsonData })
        });

        if (response.ok) {
            console.log('Author saved successfully.');
            closeInputPopup();
            window.location.reload();
        } else {
            const errorData = await response.json();
            console.error('Failed to save author:', errorData.message, jsonData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}