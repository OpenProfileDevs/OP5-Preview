document.addEventListener("DOMContentLoaded", () => {
  // Extract profile ID from the URL
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
  const profileId = segments.pop() || segments.pop(); // Handle trailing slash

  // Make a GET request to the server
  fetch(`/view/${profileId}`)
    .then(response => response.text())
    .then(data => {
      console.log(data); // Log the response for debugging
    })
    .catch(error => console.error('Error:', error));
});