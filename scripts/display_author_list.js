var ownerloggedin = null;
var ownerloggedinName = null;
let moderator = null;
let appadmin = null;
let newpfp = null;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/check-login');
        const data = await response.json();

        if (data.loggedIn) {
            const userData = data.userData;
            ownerloggedin = userData.id;
            ownerloggedinName = userData.username;
            moderator = userData.moderator;
            appadmin = userData.admin;
        }
    } catch (error) {
        console.error('Error:', error);
    }

    try {
        const authorsResponse = await fetch(`/authors-fetch`);
        const authors = await authorsResponse.json();

        authors.forEach(author => {
            const joinDateTime = new Date(`${author.todayDate} ${author.todayTime}`);
            author.joinDateTime = joinDateTime;
        });

        const sortedAuthors = sortAuthors(authors);

        const viewsResponse = await fetch('/views');
        const views = await viewsResponse.json();

        const authorsInfo = document.getElementById('authors_info');

        sortedAuthors.forEach(author => {
            const joinDate = new Date(`${author.todayDate} ${author.todayTime}`);
            const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            const authorDiv = document.createElement('div');
            authorDiv.classList.add('author1-card');
            authorDiv.style.top = "38px"
            authorDiv.onclick = function() {
                //window.location.href = `${window.location.origin}/author/${author.username}`;
            };

            const badges = [];
            if (author.promoted) badges.push({ src: '/media/icons/promo.svg', scale: '1', label: "Promoted Author" });
            if (author.bughunter) badges.push({ src: '/media/icons/bug.svg', scale: '1', label: "Entomologist"  });
            if (author.contributor) badges.push({ src: '/media/icons/github.svg', scale: '1', label: "OpenProfile Contributor"  });
            if (author.premium) badges.push({ src: '/media/icons/diamond.svg', scale: '1', label: "Premium Author"  });
            if (author.early) badges.push({ src: '/media/icons/early.svg', scale: '1', label: "Precursor"  });
            if (author.verified) badges.push({ src: '/media/icons/tick.svg', scale: '1', label: "Notable Author"  });
            if (author.moderator) badges.push({ src: '/media/icons/shield.svg', scale: '1', label: "OpenProfile Moderator"  });

            const borderStyle2 = author.verified ? '2px solid #ce1616' : '';
            authorDiv.style.border = borderStyle2;

            const borderStyle = author.promoted ? '2px solid #cfa715' : '';
            authorDiv.style.border = borderStyle;

            const badgesHTML = badges.map(badge => `
                <div class="badge-icon" style="overflow: visible;">
                    <img class="icon" src="${badge.src}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; margin-top: 10px; margin-left: 0px; transform: scale(${badge.scale});">
                    <div class="label_top" style="top: 78px;">${badge.label}</div>
                </div>
                `).join('');

            const same = author.id
            const sameuser = (ownerloggedin == same)

            newpfp = author.pfp;
            
            if (!author.pfp) {
                newpfp = "/media/images/openprofile_author_pfp.png"
            }

            const admin = [];
            if (appadmin && !sameuser) admin.push({ src: '/media/icons/shield.svg', scale: '1', id: `admin_moderatorauthor_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/promo.svg', scale: '1', id: `moderator_promoauthor_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/bug.svg', scale: '1', id: `moderator_bughunterauthor_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/github.svg', scale: '1', id: `moderator_contributorauthor_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/diamond.svg', scale: '1', id: `moderator_premiumauthor_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/early.svg', scale: '1', id: `moderator_earlyauthor_${author.id}` });
            if (moderator) admin.push({ src: '/media/icons/tick.svg', scale: '1', id: `moderator_verifyauthor_${author.id}` });
            if (moderator && !sameuser) admin.push({ src: '/media/icons/trash-x.svg', scale: '1', id: `moderator_deleteauthor_${author.id}` });

            const profileADMIN = admin.map(admin => `
                <div class="admin-icon" style="overflow: visible;">
                    <img class="icon" id="${admin.id}" src="${admin.src}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; transform: scale(${admin.scale}); cursor: pointer;">
                    <div class="label_left">Show Backups</div>
                </div>
            `).join('');

            const viewCount = views[author.id] ? views[author.id].total : 0;

            authorDiv.innerHTML = `
                <a id="authorDiv" href="${window.location.origin}/author/${author.username}">
                    <div class="content">
                        <img src="${newpfp}"
                        style="position: absolute; left: -6px; width: 64px; height: 64px; border-radius: 100%;">
                        <p class="name" style="position: absolute;">${author.displayname}</p>
                        <p class="byline">@${author.username}</p>
                        <img class="icon" src="/media/icons/clock.svg"
                        style="width: 28px; height: 28px; padding: 8px; border-radius: 50%;
                        margin-top: 10px; margin-left: 4px;
                        transform: scale(0.6) translate(-50px, 24px); opacity: 0;
                        cursor: pointer; z-index: 100">
                        <p class="update-date" id="update-date">🕑 Joined ${fullVisualDate} • 👁️ ${viewCount}</p>
                        <div class="badges">
                            ${badgesHTML}
                        </div>
                    </div>
                </a>
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
    // Separate authors into priority and non-priority groups
    const priorityAuthors = authors.filter(author => author.promoted || author.moderator || author.verified);
    const nonPriorityAuthors = authors.filter(author => !(author.promoted || author.moderator || author.verified));

    // Sort priority authors by criteria: promoted first, then moderator/verified, then join date
    const sortedPriorityAuthors = priorityAuthors.sort((a, b) => {
        // First criterion: promoted status
        if (a.promoted && !b.promoted) return -1;
        if (!a.promoted && b.promoted) return 1;

        // Second criterion: join date
        return b.joinDateTime - a.joinDateTime;
    });

    // Sort non-priority authors by join date in descending order
    const sortedNonPriorityAuthors = nonPriorityAuthors.sort((a, b) => {
        return b.joinDateTime - a.joinDateTime;
    });

    // Combine sorted priority and non-priority authors
    const sortedAuthors = [...sortedPriorityAuthors, ...sortedNonPriorityAuthors];

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