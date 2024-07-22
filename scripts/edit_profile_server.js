// Function to get a specific cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to fetch profiles and check for a matching profile ID
async function fetchProfilesAndCheck(profileId) {
    try {
        // Fetch the logged-in user ID
        const response = await fetch('/check-login');
        if (!response.ok) throw new Error('Failed to check login status');
        const data = await response.json();

        if (!data.loggedIn) {
            console.log('User not logged in');
            return; // Exit if user is not logged in
        }

        const userData = data.userData;
        const userId = userData.id;
        console.log('Logged-in user ID:', userId);

        // Get the token from cookies
        const token = getCookie('token');
        if (!token) {
            console.log('No token found in cookies');
            return; // Exit the function if no token is found
        } else {
            console.log('Token found:', token);
        }

        // Fetch profiles data based on logged-in user ID and token
        const profilesResponse = await fetch(`/profiles-edit/${userId}/${token}`);
        if (!profilesResponse.ok) throw new Error('Failed to fetch profiles');

        const profiles = await profilesResponse.json();
        if (profiles.length === 0) {
            window.location.href = '/profiles';
            throw new Error('No profiles found');
        }

        // Find the profile with the matching id
        const profile = profiles.find(profile => profile.id == profileId);
        if (!profile) {
            window.location.href = '/editor';
            throw new Error('Profile not found');
        }

        console.log(`Profile owner: ${profile.owner}`);
        console.log(`Logged-in user: ${userId}`);

        // Proceed with editing if the logged-in user matches the owner of the profile
        if (String(userId) === String(profile.owner)) {
            const currentPath = window.location.pathname;
            const expectedPath = `/editor/${profileId}`;

            if (currentPath === expectedPath) {
                console.log('Already on the editor page for this profile.');
                // You may choose to handle the case here if needed
                // No redirection needed
            } else {
                console.log('Starting edit session for this profile.');
                window.location.href = expectedPath; // Redirect to the editor page with the profile ID
            }
        } else {
            console.log('Logged-in user is not the owner of the profile. Editing canceled.');
        }
    } catch (error) {
        console.error('Error fetching or processing profiles:', error);
    }
}

// Event listener for document click event
document.addEventListener('click', function(event) {
    const element = event.target;

    // Check if the clicked element has an id starting with 'editprofile_'
    if (element.id && element.id.startsWith('editprofile_')) {
        const profileId = element.id.replace('editprofile_', '');

        // Check if the profile ID matches the one in the URL
        const pathSegments = window.location.pathname.split('/');
        const profileIdFromUrl = pathSegments[pathSegments.length - 1];

        if (profileId === profileIdFromUrl) {
            console.log('Clicked profile ID matches the current profile ID. Redirecting to the editor page.');
            window.location.href = `/editor`;
        } else {
            if (window.location.pathname === '/editor/') {
                window.location.href = '/editor';
            } else {
                fetchProfilesAndCheck(profileId);
            }
        }
    }
});

// Redirect to /editor if the URL ID doesn't exist or is invalid
const pathSegments = window.location.pathname.split('/');
const profileIdFromUrl = pathSegments[pathSegments.length - 1];

if (window.location.pathname === '/editor') {
    console.log('Currently on the /editor page, no redirection needed.');
} else if (!profileIdFromUrl || isNaN(profileIdFromUrl)) {
    window.location.href = '/editor';
} else {
    fetchProfilesAndCheck(profileIdFromUrl);
}