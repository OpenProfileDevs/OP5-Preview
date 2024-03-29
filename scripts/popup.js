// Function to show the modal dialog
function showTextPopup() {
  const popup = document.getElementById('changelog_popup');
  const changelog_popup_version = document.getElementById('changelog_popup_version');
  const storedText = localStorage.getItem('updateText');
  const notification_dot_official = document.getElementById('notification_dot_official');

  // Check if the stored text is different from the current one or if it's not stored
  if (!storedText || storedText !== changelog_popup_version.textContent) {
    // Display the popup with opacity transition
    popup.style.display = 'block';
    popup.style.opacity = '1';
    notification_dot_official.display = 'block';
    // Assuming load_current_scheme() function is defined elsewhere
    load_current_scheme();
  }

  // Close the modal with delay and opacity transition on left-click
  const modal = document.getElementById('changelog_popup_close');
  modal.addEventListener('click', (event) => {
    if (!event.target.classList.contains('social_buttons')) {
      popup.style.opacity = '0'; // Set opacity to 0 for the transition effect
      // Save the updated text to localStorage
      localStorage.setItem('updateText', changelog_popup_version.textContent);
      
      // Hide the modal after the transition
      setTimeout(() => {
        popup.style.display = 'none';
      }, 200); // Wait for the transition duration (0.2s)
    }
  });
}

function manualchangelog() {
  const popup = document.getElementById('changelog_popup');
  popup.style.display = 'block';
  popup.style.opacity = '1';
}