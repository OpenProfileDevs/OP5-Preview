async function fetchAuthorsAndRender() {
    try {
        // Fetch the logged-in user ID
        const response = await fetch('/check-login');
        const data = await response.json();
        if (data.loggedIn) {
            const userData = data.userData;
            const userid = userData.id;
            console.log("Check login returns:", userData);
            const verified_account = userData.verified == true;
            console.log(verified_account);
            let premium_account = null
            if (userData.verified == true || userData.premium == true || userData.early == true) {
                premium_account = true;
            }

            console.log('Logged-in user ID:', userid);

            // Get the token from cookies
            const token = getCookie('token');

            if (!token) {
                console.log('No token found in cookies');
                return; // Exit the function if no token is found
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
                // Create a map to store the latest version of each author by ID
                const latestAuthorsMap = new Map();

                authors.forEach(author => {
                    const existingAuthor = latestAuthorsMap.get(author.id);
                    if (!existingAuthor || author.version > existingAuthor.version) {
                        latestAuthorsMap.set(author.id, author);
                    }
                });

                // Convert the map back to an array
                const latestAuthors = Array.from(latestAuthorsMap.values());

                // Convert updatedDate and updatedTime to Date objects and combine them into a single property for sorting
                latestAuthors.forEach(author => {
                    const joinDateTime = new Date(`${author.updatedDate} ${author.updatedTime}`);
                    author.joinDateTime = joinDateTime;
                });

                // Sort authors based solely on join date/time in descending order
                latestAuthors.sort((a, b) => b.joinDateTime - a.joinDateTime);

                const authorsInfo = document.getElementById('authors_info');
                authorsInfo.innerHTML = ''; // Clear existing content

                latestAuthors.forEach(author => {
                    const joinDate = new Date(`${author.updatedDate} ${author.updatedTime}`);
                    const joinDate2 = new Date(`${author.createdDate} ${author.createdTime}`);
                    const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    const fullVisualDate2 = joinDate2.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                    const authorDiv = document.createElement('div');
                    authorDiv.classList.add('author_card');
                    authorDiv.style.display = 'flex';
                    authorDiv.style.flexDirection = 'column';
                    authorDiv.style.alignItems = 'center';

                    const badges = [];
                    if (author.verified) badges.push({ src: '/media/icons/feather_icons/check.svg', backgroundColor: '#cf1516', scale: '0.8' });
                    if (author.promoted) badges.push({ src: '/media/icons/feather_icons/arrow-up.svg', backgroundColor: '#cfa715', scale: '0.8' });

                    const badgesHTML = badges.map(badge => `
                        <img class="badge-icon" src="${badge.src}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; background-color: ${badge.backgroundColor}; margin-top: 10px; margin-left: 4px; transform: scale(${badge.scale});">
                    `).join('');

                    const admin = [];
                    const adminauthor = true;
                    const verified = author.verified == true;
                    const promoted = author.promoted == true;

                    //if (adminauthor) admin.push({ src: '/media/icons/feather_icons/edit-3.svg', scale: '0.8', id: `editprofile_${author.id}` });
                    if (adminauthor) admin.push({ src: '/media/icons/trash-x.svg', scale: '1', id: `deleteprofile_${author.id}`, class: "icon" });
                    if (adminauthor) admin.push({ src: `/media/icons/promo${promoted ? '-gold' : ''}.svg`, scale: `${premium_account ? '1' : '0'}`, id: `promoteprofile_${author.id}`, class: "icon_promo_editor" });
                    if (adminauthor) admin.push({ src: `/media/icons/tick${verified ? '-red' : ''}.svg`, scale: `${verified_account ? '1' : '0'}`, id: `verifyprofile_${author.id}`, class: "icon_tick_editor" });

                    var profileADMIN = admin.map(admin => `
                    <img class="icon" id="${admin.id}" src="${admin.src}"
                    style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                    margin-top: 10px; margin-left: 0px;
                    transform: scale(${admin.scale}) translate(0px, 0px);
                    cursor: pointer; z-index: 100">
                    `).join('');

                    const authorId = author.id;
                    const urlPath = window.location.pathname;
                    const urlParts = urlPath.split('/');
                    const profileId = urlParts[urlParts.length - 1];
                    if (profileId == authorId) {
                        profileADMIN = '';
                    }

                    function convertTo12Hour(timeString) {
                        const [hours, minutes] = timeString.split(':').map(Number);
                        const period = hours >= 12 ? 'PM' : 'AM';
                        const hours12 = hours % 12 || 12; // Convert '0' hour to '12'
                        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                    }

                    // Example usage:
                    const updatedTime24 = author.updatedTime;
                    const updatedTime12 = convertTo12Hour(updatedTime24);
                    console.log(updatedTime12); // Output: "01:19:52 AM"
                    const visibility = (author.visibility == "private");

                    authorDiv.innerHTML = `
                        <div class="author-card" style="background-image: url('${author.pfp}');">
                            <div class="content" id="editprofile_${author.id}">
                                <img class="visibility" src="/media/icons/${visibility ? 'lock' : 'world'}.svg"</img>
                                <p class="version">v${author.profile_version}</p>
                                <p class="name">${author.display_name}</p>
                                <img class="icon" src="/media/icons/clock.svg"
                                style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                                margin-top: 10px; margin-left: 4px;
                                transform: scale(0.6) translate(-50px, 24px); opacity: 0.8;
                                cursor: pointer; z-index: 100">
                                <p class="update-date" id="update-date">${fullVisualDate} • ${updatedTime12}</p>
                                <p class="license" id="license">${author.license}</p>
                                <div class="badges">
                                    ${profileADMIN}
                                </div>
                            </div>
                        </div>
                    `;

                    authorsInfo.appendChild(authorDiv);
                    // Select the update-date element within the newly appended authorDiv
                    const updateDatePlaceholder = authorDiv.querySelector('.update-date');
                    // Check and update the content of update-date element
                    if (updateDatePlaceholder.textContent.trim() === 'Updated on Invalid Date') {
                        updateDatePlaceholder.textContent = `Updated on ${fullVisualDate2}`;
                    }
                });

                load_local_scheme();

                // Add a placeholder author card with opacity 0 for layout consistency
                const placeholderDiv = document.createElement('div');
                placeholderDiv.classList.add('author_card');
                placeholderDiv.style.display = 'flex';
                placeholderDiv.style.flexDirection = 'column';
                placeholderDiv.style.alignItems = 'center';
                placeholderDiv.innerHTML = `
                    <div class="author-card" style="opacity: 0; cursor: default"></div>
                `;
                authorsInfo.appendChild(placeholderDiv);
            } else {
                fetchAuthorsAndRender2();
            }
        }
    } catch (error) {
        console.error(error);
    }
    }


    async function fetchAuthorsAndRender2() {
        try {
            // Fetch the logged-in user ID
        const response = await fetch('/check-login');
        const data = await response.json();
        if (data.loggedIn) {
            const userData = data.userData;
            const userid = userData.id;
            console.log("Check login returns:", userData);
            const verified_account = userData.verified == true;
            console.log(verified_account);
            let premium_account = null
            if (userData.verified == true || userData.premium == true || userData.early == true) {
                premium_account = true;
            }

            console.log('Logged-in user ID:', userid);

            // Get the token from cookies
            const token = getCookie('token');

            if (!token) {
                console.log('No token found in cookies');
                return; // Exit the function if no token is found
            } else {
                console.log('Token found:', token);
            }

            // Fetch authors data based on logged-in user ID and token
            const authorsResponse = await fetch(`/profiles-edit-2/${userid}/${token}`);

            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }
            
            const authors = await authorsResponse.json();

                // Check if authors exist and show or hide the button accordingly
                if (authors.length > 0) {
                    toggle_left_menu_2.style.display = 'block';
                } else {
                    toggle_left_menu_2.style.display = 'none';
                }

                // Convert updatedDate and updatedTime to Date objects and combine them into a single property for sorting
                authors.forEach(author => {
                    const joinDateTime = new Date(`${author.updatedDate} ${author.updatedTime}`);
                    author.joinDateTime = joinDateTime;
                });
            // Sort authors based solely on join date/time in descending order
            authors.sort((a, b) => b.joinDateTime - a.joinDateTime);


            const authorsInfo = document.getElementById('authors_info');
            authorsInfo.innerHTML = ''; // Clear existing content

            authors.forEach(author => {
                const joinDate = new Date(`${author.updatedDate} ${author.updatedTime}`);
                const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                const authorDiv = document.createElement('div');
                authorDiv.classList.add('author_card');
                authorDiv.style.display = 'flex';
                authorDiv.style.flexDirection = 'column';
                authorDiv.style.alignItems = 'center';

                
                const admin = [];
                    const adminauthor = true;
                    const verified = author.verified == true;
                    const promoted = author.promoted == true;

                    //if (adminauthor) admin.push({ src: '/media/icons/feather_icons/edit-3.svg', scale: '0.8', id: `editprofile_${author.id}` });
                    if (adminauthor) admin.push({ src: '/media/icons/clock.svg', scale: '1', id: `restoreprofile_${author.id}`, class: "icon" });
                    if (adminauthor) admin.push({ src: `/media/icons/promo${promoted ? '-gold' : ''}.svg`, scale: `${premium_account ? '1' : '0'}`, id: `promoteprofile_${author.id}`, class: "icon_promo_editor" });
                    if (adminauthor) admin.push({ src: `/media/icons/tick${verified ? '-red' : ''}.svg`, scale: `${verified_account ? '1' : '0'}`, id: `verifyprofile_${author.id}`, class: "icon_tick_editor" });

                    var profileADMIN = admin.map(admin => `
                    <img class="icon" id="${admin.id}" src="${admin.src}"
                    style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                    margin-top: 10px; margin-left: 0px;
                    transform: scale(${admin.scale}) translate(0px, 0px);
                    cursor: pointer; z-index: 100">
                    `).join('');

                function convertTo12Hour(timeString) {
                    const [hours, minutes] = timeString.split(':').map(Number);
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours % 12 || 12; // Convert '0' hour to '12'
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                }

                // Example usage:
                const updatedTime24 = author.updatedTime;
                const updatedTime12 = convertTo12Hour(updatedTime24);
                console.log(updatedTime12); // Output: "01:19:52 AM"
                const visibility = (author.visibility == "private");
                
                authorDiv.innerHTML = `
                    <div class="author-card" style="background-image: url('${author.pfp}');">
                        <div class="content">
                            <img class="visibility" src="/media/icons/${visibility ? 'lock' : 'world'}.svg"</img>
                            <p class="version">v${author.profile_version}</p>
                            <p class="name">${author.display_name}</p>
                            <img class="icon" src="/media/icons/clock.svg"
                                style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                                margin-top: 10px; margin-left: 4px;
                                transform: scale(0.6) translate(-50px, 24px); opacity: 0.8;
                                cursor: pointer; z-index: 100">
                            <p class="update-date" id="update-date">${fullVisualDate} • ${updatedTime12}</p>
                            <p class="license" id="license">${author.license}</p>
                            <div class="badges">
                                ${profileADMIN}
                            </div>
                        </div>
                    </div>
                `;
                authorsInfo.appendChild(authorDiv);
            });
            load_local_scheme()
    
            // Add a placeholder author card with opacity 0 for layout consistency
            const placeholderDiv = document.createElement('div');
            placeholderDiv.classList.add('author_card');
            placeholderDiv.style.display = 'flex';
            placeholderDiv.style.flexDirection = 'column';
            placeholderDiv.style.alignItems = 'center';
            placeholderDiv.innerHTML = `
                <div class="author-card" style="opacity: 0; cursor: default"></div>
            `;
            authorsInfo.appendChild(placeholderDiv);
        }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchAuthorsAndRender3() {
        try {
            // Fetch the logged-in user ID
        const response = await fetch('/check-login');
        const data = await response.json();
        if (data.loggedIn) {
            const userData = data.userData;
            const userid = userData.id;
            console.log("Check login returns:", userData);
            const verified_account = userData.verified == true;
            console.log(verified_account);
            let premium_account = null
            if (userData.verified == true || userData.premium == true || userData.early == true) {
                premium_account = true;
            }

            console.log('Logged-in user ID:', userid);

            // Get the token from cookies
            const token = getCookie('token');

            if (!token) {
                console.log('No token found in cookies');
                return; // Exit the function if no token is found
            } else {
                console.log('Token found:', token);
            }

            // Fetch authors data based on logged-in user ID and token
            const authorsResponse = await fetch(`/profiles-edit-3/${userid}/${token}`);

            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }
            
            const authors = await authorsResponse.json();

                // Check if authors exist and show or hide the button accordingly
                if (authors.length > 0) {
                    toggle_left_menu_3.style.display = 'block';
                } else {
                    toggle_left_menu_3.style.display = 'none';
                }

                // Convert updatedDate and updatedTime to Date objects and combine them into a single property for sorting
                authors.forEach(author => {
                    const joinDateTime = new Date(`${author.updatedDate} ${author.updatedTime}`);
                    author.joinDateTime = joinDateTime;
                });
            // Sort authors based solely on join date/time in descending order
            authors.sort((a, b) => b.joinDateTime - a.joinDateTime);


            const authorsInfo = document.getElementById('authors_info');
            authorsInfo.innerHTML = ''; // Clear existing content

            authors.forEach(author => {
                const joinDate = new Date(`${author.updatedDate} ${author.updatedTime}`);
                const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                const authorDiv = document.createElement('div');
                authorDiv.classList.add('author_card');
                authorDiv.style.display = 'flex';
                authorDiv.style.flexDirection = 'column';
                authorDiv.style.alignItems = 'center';

                const admin = [];
                    const adminauthor = true;
                    const verified = author.verified == true;
                    const promoted = author.promoted == true;

                    //if (adminauthor) admin.push({ src: '/media/icons/feather_icons/edit-3.svg', scale: '0.8', id: `editprofile_${author.id}` });
                    if (adminauthor) admin.push({ src: '/media/icons/clock.svg', scale: '1', id: `restorebackupprofile_${author.id}_${author.profile_version}`, class: "icon" });
                    if (adminauthor) admin.push({ src: `/media/icons/promo${promoted ? '-gold' : ''}.svg`, scale: `${premium_account ? '1' : '0'}`, id: `promoteprofile_${author.id}`, class: "icon_promo_editor" });
                    if (adminauthor) admin.push({ src: `/media/icons/tick${verified ? '-red' : ''}.svg`, scale: `${verified_account ? '1' : '0'}`, id: `verifyprofile_${author.id}`, class: "icon_tick_editor" });
    
                    var profileADMIN = admin.map(admin => `
                    <img class="icon" id="${admin.id}" src="${admin.src}"
                    style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                    margin-top: 10px; margin-left: 0px;
                    transform: scale(${admin.scale}) translate(0px, 0px);
                    cursor: pointer; z-index: 100">
                    `).join('');

                function convertTo12Hour(timeString) {
                    const [hours, minutes] = timeString.split(':').map(Number);
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours % 12 || 12; // Convert '0' hour to '12'
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                }

                // Example usage:
                const updatedTime24 = author.updatedTime;
                const updatedTime12 = convertTo12Hour(updatedTime24);
                console.log(updatedTime12); // Output: "01:19:52 AM"
                const visibility = (author.visibility == "private");

                authorDiv.innerHTML = `
                    <div class="author-card" style="background-image: url('${author.pfp}');">
                        <div class="content">
                            <img class="visibility" src="/media/icons/${visibility ? 'lock' : 'world'}.svg"</img>
                            <p class="version">v${author.profile_version}</p>
                            <p class="name">${author.display_name}</p>
                            <img class="icon" src="/media/icons/clock.svg"
                                style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                                margin-top: 10px; margin-left: 4px;
                                transform: scale(0.6) translate(-50px, 24px); opacity: 0.8;
                                cursor: pointer; z-index: 100">
                            <p class="update-date" id="update-date">${fullVisualDate} • ${updatedTime12}</p>
                            <p class="license" id="license">${author.license}</p>
                            <div class="badges">
                                ${profileADMIN}
                            </div>
                        </div>
                    </div>
                `;
                authorsInfo.appendChild(authorDiv);
            });
            load_local_scheme()
    
            // Add a placeholder author card with opacity 0 for layout consistency
            const placeholderDiv = document.createElement('div');
            placeholderDiv.classList.add('author_card');
            placeholderDiv.style.display = 'flex';
            placeholderDiv.style.flexDirection = 'column';
            placeholderDiv.style.alignItems = 'center';
            placeholderDiv.innerHTML = `
                <div class="author-card" style="opacity: 0; cursor: default"></div>
            `;
            authorsInfo.appendChild(placeholderDiv);
        }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchAuthorsAndRender4() {
        try {
            // Fetch the logged-in user ID
        const response = await fetch('/check-login');
        const data = await response.json();
        if (data.loggedIn) {
            const userData = data.userData;
            const userid = userData.id;
            console.log("Check login returns:", userData);
            const verified_account = userData.verified == true;
            console.log(verified_account);
            let premium_account = null
            if (userData.verified == true || userData.premium == true || userData.early == true) {
                premium_account = true;
            }

            console.log('Logged-in user ID:', userid);

            // Fetch authors data based on logged-in user ID and token
            const authorsResponse = await fetch(`/profiles-edit-4/${userid}`);

            if (!authorsResponse.ok) {
                throw new Error('Failed to fetch authors');
            }
            
            const authors = await authorsResponse.json();

                // Check if authors exist and show or hide the button accordingly
                if (authors.length > 0) {
                    toggle_left_menu_4.style.display = 'block';
                } else {
                    toggle_left_menu_4.style.display = 'none';
                }

                // Convert updatedDate and updatedTime to Date objects and combine them into a single property for sorting
                authors.forEach(author => {
                    const joinDateTime = new Date(`${author.updatedDate} ${author.updatedTime}`);
                    author.joinDateTime = joinDateTime;
                });
            // Sort authors based solely on join date/time in descending order
            authors.sort((a, b) => b.joinDateTime - a.joinDateTime);


            const authorsInfo = document.getElementById('authors_info');
            authorsInfo.innerHTML = ''; // Clear existing content

            authors.forEach(author => {
                const joinDate = new Date(`${author.updatedDate} ${author.updatedTime}`);
                const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                const authorDiv = document.createElement('div');
                authorDiv.classList.add('author_card');
                authorDiv.style.display = 'flex';
                authorDiv.style.flexDirection = 'column';
                authorDiv.style.alignItems = 'center';

                const admin = [];
                    const adminauthor = true;
                    const verified = author.verified == true;
                    const promoted = author.promoted == true;

                    //if (adminauthor) admin.push({ src: '/media/icons/feather_icons/edit-3.svg', scale: '0.8', id: `editprofile_${author.id}` });
                    if (adminauthor) admin.push({ src: `/media/icons/promo${promoted ? '-gold' : ''}.svg`, scale: `${premium_account ? '1' : '0'}`, id: `promoteprofile_${author.id}`, class: "icon_promo_editor" });
                    if (adminauthor) admin.push({ src: `/media/icons/tick${verified ? '-red' : ''}.svg`, scale: `${verified_account ? '1' : '0'}`, id: `verifyprofile_${author.id}`, class: "icon_tick_editor" });
                    if (adminauthor) admin.push({ src: '/media/icons/clock.svg', scale: '0', class: "icon" });

                    var profileADMIN = admin.map(admin => `
                    <img class="icon" id="${admin.id}" src="${admin.src}"
                    style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                    margin-top: 10px; margin-left: 0px;
                    transform: scale(${admin.scale}) translate(0px, 0px);
                    cursor: pointer; z-index: 100">
                    `).join('');

                function convertTo12Hour(timeString) {
                    const [hours, minutes] = timeString.split(':').map(Number);
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours % 12 || 12; // Convert '0' hour to '12'
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                }

                // Example usage:
                const updatedTime24 = author.updatedTime;
                const updatedTime12 = convertTo12Hour(updatedTime24);
                console.log(updatedTime12); // Output: "01:19:52 AM"
                const visibility = (author.visibility == "private");
                
                authorDiv.innerHTML = `
                    <div class="author-card" style="background-image: url('${author.pfp}');">
                        <div class="content">
                            <img class="visibility" src="/media/icons/${visibility ? 'lock' : 'world'}.svg"</img>
                            <p class="version">v${author.profile_version}</p>
                            <p class="name">${author.display_name}</p>
                            <img class="icon" src="/media/icons/clock.svg"
                                style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                                margin-top: 10px; margin-left: 4px;
                                transform: scale(0.6) translate(-50px, 24px); opacity: 0.8;
                                cursor: pointer; z-index: 100">
                            <p class="update-date" id="update-date">${fullVisualDate} • ${updatedTime12}</p>
                            <p class="license" id="license">${author.license}</p>
                            <div class="badges">
                                ${profileADMIN}
                            </div>
                        </div>
                    </div>
                `;
                authorsInfo.appendChild(authorDiv);
            });
            load_local_scheme()
    
            // Add a placeholder author card with opacity 0 for layout consistency
            const placeholderDiv = document.createElement('div');
            placeholderDiv.classList.add('author_card');
            placeholderDiv.style.display = 'flex';
            placeholderDiv.style.flexDirection = 'column';
            placeholderDiv.style.alignItems = 'center';
            placeholderDiv.innerHTML = `
                <div class="author-card" style="opacity: 0; cursor: default"></div>
            `;
            authorsInfo.appendChild(placeholderDiv);
        }
        } catch (error) {
            console.error('Error:', error);
        }
    }

// Call the function on DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(fetchAuthorsAndRender, 500); // Delay of 0.5 seconds (500 milliseconds)
});
document.addEventListener('DOMContentLoaded', fetchAuthorsAndRender2);
document.addEventListener('DOMContentLoaded', fetchAuthorsAndRender3);
document.addEventListener('DOMContentLoaded', fetchAuthorsAndRender4);