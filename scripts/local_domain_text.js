document.addEventListener('DOMContentLoaded', function() {
    const domain = window.location.origin; // Get the current domain (e.g., https://preview.openprofile.app)
    
    // Select all anchor tags with class 'top_button'
    const links = document.querySelectorAll('#local_domain_text');
    
    // Loop through each link and set its href attribute
    links.forEach(function(link) {
        const path = link.getAttribute('href'); // Get the original path from href attribute
        const newHref = domain + path; // Combine domain with the original path
        link.setAttribute('href', newHref); // Set the new href attribute
    });
});