var ownerloggedin = null;
var ownerloggedinName = null;
let moderator = null;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/check-login');
        const data = await response.json();

        if (data.loggedIn) {
            const userData = data.userData;
            ownerloggedin = userData.id;
            ownerloggedinName = userData.username;
            moderator = userData.moderator;
        }
    } catch (error) {
        console.error('Error:', error);
    }

    try {
        const authorsResponse = await fetch(`/profiles-fetch`);
        const authors = await authorsResponse.json();

        // Extract the last part of the URL
        const lastPartOfURL = window.location.pathname.split('/').pop();

        // Filter profiles based on the extracted value
        const filteredAuthors = authors.filter(author => author.owner2 === lastPartOfURL);

        // Process filtered authors
        filteredAuthors.forEach(author => {
            const joinDateTime = new Date(`${author.updatedDate} ${author.updatedTime}`);
            author.joinDateTime = joinDateTime;
        });

        const sortedAuthors = sortAuthors(filteredAuthors);

        const viewsResponse = await fetch('/views');
        const views = await viewsResponse.json();

        const authorsInfo = document.getElementById('profiles_info');

        sortedAuthors.forEach(author => {
            const joinDate = new Date(`${author.updatedDate} ${author.updatedTime}`);
            const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const authorDiv = document.createElement('div');
            const customImageUrl = '/media/images/openprofile/openprofile_logo_512_jpeg.jpeg';
            const authorPfpUrl = author.pfp;

            authorDiv.classList.add('profile-card');
            if (authorPfpUrl.startsWith('https')) {
                authorDiv.style.backgroundImage = `url('${authorPfpUrl}')`;
            } else {
                authorDiv.style.backgroundImage = `url('${customImageUrl}')`;
            }
            authorDiv.onclick = function() {
                //window.location.href = `${window.location.origin}/profile/${author.url}`;
            };

            const badges = [];
            if (author.promoted) badges.push({ src: '/media/icons/promo.svg', scale: '1', label: "Promoted Profile" });
            if (author.verified) badges.push({ src: '/media/icons/tick.svg', scale: '1', label: "Official Profile"  });

            const borderStyle2 = author.verified ? '2px solid #ce1616' : '';
            authorDiv.style.border = borderStyle2;

            const borderStyle = author.promoted ? '2px solid #cfa715' : '';
            authorDiv.style.border = borderStyle;

            const badgesHTML = badges.map(badge => `
                <div class="badge-icon" style="overflow: visible;">
                    <img class="icon" src="${badge.src}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; margin-top: 10px; margin-left: 0px; transform: scale(${badge.scale});">
                    <div class="label_top" style="top: 18px;">${badge.label}</div>
                </div>
                `).join('');

            const admin = [];
            //if (moderator) admin.push({ src: '/media/icons/promo.svg', scale: '1', id: `moderator_promoteprofile_${author.id}` });
            //if (moderator) admin.push({ src: '/media/icons/tick.svg', scale: '1', id: `moderator_verifyprofile_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/trash-x.svg', scale: '1', id: `moderator_deleteprofile_${author.id}` });

            const profileADMIN = admin.map(admin => `
                <div class="admin-icon" style="overflow: visible;">
                    <img class="icon" id="${admin.id}" src="${admin.src}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; transform: scale(${admin.scale}); cursor: pointer;">
                    <div class="label_left">Show Backups</div>
                </div>
            `).join('');

            const viewCount = views[author.id] ? views[author.id].total : 0;

            const licenseElement = (author.license)
            const authorLicense = licenseElement ? author.license : 'License not marked';

            authorDiv.innerHTML = `
                <a id="authorDiv" href="${window.location.origin}/profile/${author.url}">
                    <div class="content">
                        <p class="version">v${author.profile_version}</p>
                        <p class="name">${author.display_name}</p>
                        <p class="byline">By @${author.owner2}</p>
                        <img class="icon" src="/media/icons/clock.svg"
                        style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                        margin-top: 10px; margin-left: 4px;
                        transform: scale(0.6) translate(-50px, 24px); opacity: 0;
                        cursor: pointer; z-index: 100">
                        <p class="update-date" id="update-date">🕑 ${fullVisualDate} • 👁️ ${viewCount}</p>
                        <p class="license" id="license">${authorLicense}</p>
                    </div>
                </a>
                <div class="badges">
                    ${badgesHTML}
                </div>
                <div class="mod_tools">
                    ${profileADMIN}
                </div>
            `;
            authorsInfo.appendChild(authorDiv);
        });
    } catch (error) {
        console.error('Error fetching authors or views:', error);
    }
});

function sortAuthors(authors) {
    // Separate promoted and non-promoted profiles
    const promotedAuthors = authors.filter(author => author.promoted);
    const nonPromotedAuthors = authors.filter(author => !author.promoted);

    // Randomly select 2 promoted profiles
    const selectedPromotedAuthors = getRandomItems(promotedAuthors, 2);

    // Mark these selected profiles for inclusion and adjust remaining promoted profiles
    const remainingPromotedAuthors = promotedAuthors
        .filter(author => !selectedPromotedAuthors.includes(author))
        .map(author => ({ ...author, promoted: false }));

    // Combine selected promoted profiles and remaining promoted profiles
    const allPromoted = [...selectedPromotedAuthors, ...remainingPromotedAuthors];

    // Sort the combined promoted and non-promoted profiles
    const sortedAuthors = [...allPromoted, ...nonPromotedAuthors].sort((a, b) => {
        // Sort by promoted status
        if (a.promoted && !b.promoted) {
            return -1;
        } else if (!a.promoted && b.promoted) {
            return 1;
        }

        // Within promoted or non-promoted, sort by verified status
        if (a.promoted === b.promoted) {
            if (a.verified && !b.verified) {
                return -1;
            } else if (!a.verified && b.verified) {
                return 1;
            }
        }

        // Sort by join date in descending order
        return b.joinDateTime - a.joinDateTime;
    });

    // Return the sorted array
    return sortedAuthors;
}

function getRandomItems(array, numItems) {
    const shuffled = array.slice(0); // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled.slice(0, numItems);
}