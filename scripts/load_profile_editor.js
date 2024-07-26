setTimeout(async function() {
    try {
        // Fetch the logged-in user ID
        const response = await fetch('/check-login');
        const data = await response.json();
        
        if (!data.loggedIn) {
            console.log('User not logged in');
            return; // Exit if user is not logged in
        }
        
        const userData = data.userData;
        const userid = userData.id;
        console.log('Logged-in user ID:', userid);

        // Get the token from cookies
        const token = getCookie('token');

        if (!token) {
            console.log('No token found in cookies');
            return; // Exit the function if no token is found
        } else {
            console.log('Token found:', token);
        }

        // Fetch profiles data based on logged-in user ID and token
        const profilesResponse = await fetch(`/profiles-edit/${userid}/${token}`);

        if (!profilesResponse.ok) {
            throw new Error('Failed to fetch profiles');
        }

        const profiles = await profilesResponse.json();

        if (profiles.length === 0) {
            throw new Error('No profiles found');
        }

        // Get the last segment from the URL path
        const pathSegments = window.location.pathname.split('/'); // Split the path into segments
        const lastSegment = pathSegments[pathSegments.length - 1]; // Get the last segment

        // Find the profile with the matching id from URL parameters
        const profile = profiles.find(profile => profile.id == lastSegment);

        if (!profile) {
            throw new Error('Profile not found');
        }

        // Update profile publish status
        const profile_publish_status = document.getElementById('profile_publish_status');
        if (profile.visibility == "public") {
            profile_publish_status.textContent = "Unpublish Profile";
        }

        // Log the fetched profile data
        console.log('Fetched Profile Data:', profile);

        // Update HTML elements with data from userData
        for (const key in profile) {
            if (Object.hasOwnProperty.call(profile, key)) {
                const value = profile[key];
                const element = document.getElementById(key);
                if (element) {
                    if (typeof value === 'string') {
                        if (element.tagName.toLowerCase() === 'textarea') {
                            // Convert \n to new lines for textarea
                            const formattedValue = value.replace(/\\n/g, '\n');
                            element.value = formattedValue;
                        } else {
                            // Replace <br> with newline characters for form input fields
                            const formattedValue = value.replace(/<br>/g, '\n');
                            element.value = formattedValue;

                            // Replace newline characters with <br> for other elements
                            const displayValue = value.replace(/\n/g, '<br>');
                            element.innerHTML = displayValue;
                        }
                    } else {
                        element.value = value;
                    }
                }
            }
        }

        const pages = ['page_41', 'page_42', 'page_43', 'page_44'];

        pages.forEach(page => {
            const element = document.getElementById(page);
            console.log(`Checking element with ID: ${page}`);
            if (element && !profile[page]) {
                console.log(`Hiding element with ID: ${page}`);
                element.style.display = 'none';
            }
        });

        // Update brand banner images
        const brand_banners = document.querySelectorAll('.brand_icon_selected_image');
        brand_banners.forEach(brand_banner => {
            brand_banner.src = profile.brand_banner || '/media/images/openprofile/openprofile_banner_t_png.png';
        });

        // Log profile data in the console
        console.log('Profile Data:', profile);
    } catch (error) {
        console.error('Error fetching or processing profile data:', error);
    }
}, 2000); // 2000 milliseconds = 2 seconds

// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}