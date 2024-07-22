var ownerloggedin = null;
var ownerloggedinName = null;
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
        const authorsResponse = await fetch('/authors-fetch');
        const authors = await authorsResponse.json();

        authors.forEach(author => {
            const joinDateTime = new Date(`${author.todayDate} ${author.todayTime}`);
            author.joinDateTime = joinDateTime;
        });

        const viewsResponse = await fetch('/views');
        const views = await viewsResponse.json();

        const authorsInfo = document.getElementById('center');

        // Extract the last segment of the URL (after the last '/')
        const currentUsername = window.location.pathname.split('/').pop();

        authors.forEach(author => {
            // Only display authors whose username matches the last segment of the URL
            if (author.username === currentUsername) {
                const joinDate = new Date(`${author.todayDate} ${author.todayTime}`);
                const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                const authorDiv = document.createElement('div');
                authorDiv.classList.add('author2-card');
                authorDiv.style.top = "66px";
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

            const badgesHTML = badges.map(badge => `
                <div class="badge-icon" style="overflow: visible;">
                    <img class="icon" src="${badge.src}" style="width: 28px; height: 28px; padding: 8px; border-radius: 50%; margin-top: 10px; margin-left: 0px; transform: scale(${badge.scale});">
                    <div class="label_top" style="top: 128px;">${badge.label}</div>
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
                            style="position: absolute; left: -6px; width: 96px; height: 96px; border-radius: 100%;">
                            <p class="name" style="position: absolute;">${author.displayname}</p>
                            <p class="byline">@${author.username}</p>
                            <img class="icon" src="/media/icons/clock.svg"
                            style="width: 48px; height: 48px; padding: 8px; border-radius: 50%;
                            margin-top: 10px; margin-left: 4px;
                            transform: scale(0.6) translate(-50px, 24px); opacity: 0;
                            cursor: pointer; z-index: 100">
                            <p class="update-date" id="update-date">Joined ${fullVisualDate}</p>
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
            }
        });
    } catch (error) {
        console.error('Error fetching authors or views:', error);
        window.location.href = '/authors';
    }
});