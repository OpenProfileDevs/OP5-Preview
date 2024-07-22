setTimeout(async function() {
    try {
        // Fetch profiles data
        const profilesResponse = await fetch(`/profiles-fetch`);
        if (!profilesResponse.ok) {
            window.location.href = '/profiles';
            throw new Error('Failed to fetch profiles');
        }

        const profiles = await profilesResponse.json();
        if (profiles.length === 0) {
            window.location.href = '/profiles';
            throw new Error('No profiles found');
        }

        // Extract the profile ID from the URL
        const pathSegments = window.location.pathname.split('/');
        const profileIdFromUrl = pathSegments[pathSegments.length - 1];

        // Find the profile that matches the ID from the URL
        const profile = profiles.find(profile => profile.url == profileIdFromUrl || profile.url2 == profileIdFromUrl);
        if (!profile) {
            window.location.href = '/profiles';
            throw new Error('Profile not found');
        }

        // Log the fetched profile data
        console.log('Fetched Profile Data:', profile);

        // Update HTML elements with data from profile
        for (const key in profile) {
            if (Object.hasOwnProperty.call(profile, key)) {
                const value = profile[key];
                const element = document.getElementById(key);
                if (element) {
                    if (element.tagName.toLowerCase() === 'textarea') {
                        // Convert \n to new lines for textarea
                        element.value = value.replace(/\\n/g, '\n');
                    } else {
                        // Replace <br> with newline characters for form input fields
                        element.value = value.replace(/<br>/g, '\n');
                        // Replace newline characters with <br> for other elements
                        element.innerHTML = value.replace(/\n/g, '<br>');
                    }
                }
            }
        }
        // Update brand banner images
        const brand_banners = document.querySelectorAll('.brand_icon_selected_image');
        brand_banners.forEach(brand_banner => {
            brand_banner.src = profile.brand_banner || '/media/images/openprofile/openprofile_banner_t_png.png';
        }); 

        // Log profile data in the console
        console.log('Profile Data:', profile);
        // Make all textarea and input_1 elements not writable
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.readOnly = true;
        });

        const input1 = document.querySelectorAll('.input_1');
        input1.forEach(input => {
            input.readOnly = true;
        });

        const help_boxs = document.querySelectorAll('.help_box');
        help_boxs.forEach(help_box => {
            help_box.style.display = "none";
        });

        // Check for active URLs and handle redirection if necessary
        const urlResponse = await fetch('/fetch-profiles');
        if (urlResponse.ok) {
            const urls = await urlResponse.json();
            const currentUrl = window.location.pathname; // Using pathname to match with fetched URLs

            // Find the URL in the fetched URLs list
            const isActiveUrl = urls.some(url => url.url === currentUrl || url.url2 === currentUrl);

            if (!isActiveUrl) {
                // Redirect to /profiles if the current URL is not found
                window.location.href = '/profiles';
            }
        } else {
            console.error('Failed to fetch profile URLs');
        }

    } catch (error) {
        console.error('Error fetching or processing profile data:', error);
    }
}, 2000); // 2000 milliseconds = 2 seconds

// Helper function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}