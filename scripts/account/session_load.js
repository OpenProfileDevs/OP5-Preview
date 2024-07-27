function checkLoggedIn() {
    fetch('/check-login')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check login status');
            }
            return response.json();
        })
        .then(data => {
            if (data.loggedIn) {
                const userData = data.userData;
                if (userData) {
                    console.log('User Data:', userData);

                    // Update UI with logged-in user information
                    const accountLabel = document.getElementById('label_top_account');
                    accountLabel.textContent = `Logged in with @${userData.username}`;

                    // Fetch authors data
                    fetch(`/authors-fetch`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch authors');
                            }
                            return response.json();
                        })
                        .then(authors => {
                            // Convert todayDate and todayTime to Date objects and combine them into a single property for sorting
                            authors.forEach(author => {
                                const joinDateTime = new Date(`${author.todayDate} ${author.todayTime}`);
                                author.joinDateTime = joinDateTime;
                            });

                            // Find the author with the same ID as the logged-in user
                            const loggedInUserAuthor = authors.find(author => author.id === userData.id);
                            let newpfp = null;
                            if (loggedInUserAuthor) {
                                console.log('Logged-in user author:', loggedInUserAuthor);

                                const home_header = document.getElementById('home_header');
                                if (home_header) {
                                    home_header.textContent = `${loggedInUserAuthor.displayname}`
                                }

                                const home_info = document.getElementById('home_info');
                                if (home_info) {
                                    home_info.innerHTML = `Welcome back to OpenProfile, <a href="/author/${userData.username}">@${userData.username}</a><br><br><br>OpenProfile is a collaborative application for authors to create and share original characters using an advanced template and a public database.`;
                                }

                                if (userData.premium == true) {
                                    const premium_button_text = document.getElementById('premium_button_text');
                                    premium_button_text.textContent = `You're Premium!`;
                                    premium_button_text.style.backgroundColor = `#efbe0b`;
                                }

                                if (userData.early == true) {
                                    const premium_button_text = document.getElementById('premium_button_text');
                                    premium_button_text.textContent = `You got life-time premium!`;
                                    premium_button_text.style.backgroundColor = `#8515cf`;
                                }

                                const path = window.location.pathname;
                                const segments = path.split('/');
                                const urlauthor = segments.length ? segments[segments.length - 1] : null;                            
                                const edit_user_data_author = document.getElementById('edit_user_data_author')
                                if (edit_user_data_author) {
                                    if (`${urlauthor}` === `${loggedInUserAuthor.username}`) {
                                        document.getElementById('edit_user_data_author').style.display = 'inline-flex';
                                    } else {
                                        document.getElementById('edit_user_data_author').style.display = 'none';
                                    }
                                }

                                newpfp = loggedInUserAuthor.pfp;
            
                                if (!loggedInUserAuthor.pfp) {
                                    newpfp = "/media/images/openprofile_author_pfp.png"
                                }
                                
                                // Update UI with author's profile picture
                                const iconAccount = document.getElementById('icon_account_logged');
                                iconAccount.src = newpfp; // Assuming pfp is the profile picture URL
                                iconAccount.style.borderRadius = "1000px";
                                iconAccount.style.maxWidth = '100%';
                                iconAccount.style.maxHeight = '100%';
                                iconAccount.style.objectFit = 'cover';
                                iconAccount.style.scale = '1';
                                iconAccount.style.transform = 'translate(-4px, -4px)';
                            } else {
                                console.log('Logged-in user author not found');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching authors:', error.message);
                            // Handle fetch authors error appropriately
                        });
                }
            } else {
                console.log('User is not logged in');
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
}

// Call the function when the page loads
window.onload = function() {
    checkLoggedIn();
};