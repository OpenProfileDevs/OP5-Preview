setTimeout(function() {
        // Fetch the profile data
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // Access userData if available and use it
                    const userData = data.userData;
                    if (userData) {
                        // Do something with userData, for example:
                        console.log('User Data:', userData);
                    }
                    const account = document.getElementById('label_top_account');
                    account.textContent = `Logged in with @${userData.username}`;
                    // Call loadUserData when logged in
                } else {
                    // If not logged in, load public user data
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });

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

                // Apply specific values to elements whose IDs start with "page_author" or "written_date"
                for (const key in userData) {
                    if (Object.hasOwnProperty.call(userData, key)) {
                        const value = userData[key];
                        const elements = document.querySelectorAll(`[id^="page_author"], [id^="written_date"]`);
                        elements.forEach(element => {
                            if (element.id.startsWith("page_author")) {
                                // Convert element to a clickable link
                                element.href = `https://preview.openprofile.app/author/${userData.owner}`;
                                element.value = `@${userData.owner2}`;
                                element.target = '_blank'; // Open link in a new tab
                            } else if (element.id.startsWith("written_date")) {
                                const joinDate = new Date(`${userData.createdDate} ${userData.createdTime}`);
                                const fullVisualDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                element.value = fullVisualDate;
                            }
                        });
                    }
                }

                // Log user data in the console
                console.log('User Data:', userData);
            })
            .catch(error => {
                console.error('Error fetching userData:', error);
            });
}, 2000); // 5000 milliseconds = 5 seconds