// Function to show the modal dialog with a delay
function showTextPopup() {
  const popup = document.getElementById('changelog_popup');
  const changelogPopupVersion = document.getElementById('changelog_popup_version');
  const storedText = localStorage.getItem('updateText');
  const currentVersion = changelogPopupVersion.textContent.trim();

  // Display the popup
  function displayPopup() {
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.opacity = '1';
    }, 0); // Ensure transition effect
  }

  // Close the popup
  function closeModal() {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.style.display = 'none';
      localStorage.setItem('updateText', currentVersion);
    }, 200); // 200ms for transition
  }

  // Handle click events outside the popup
  function handleClickOutside(event) {
    if (popup.style.display === 'block' && !popup.contains(event.target) && !modalClose.contains(event.target)) {
      closeModal();
    }
  }

  // Initialize the popup display with a delay
  function initPopup() {
    if (!storedText || (storedText !== currentVersion && changelogPopupVersion.textContent !== "")) {
      setTimeout(displayPopup, 2000); // Delay before showing the popup
    }
  }

  // Add event listeners
  const modalClose = document.getElementById('changelog_popup_close');
  if (modalClose) {
    modalClose.addEventListener('click', (event) => {
      if (event.target.id !== 'button_official' && event.target.id !== 'icon_official') {
        closeModal();
      }
    });
  }

  document.addEventListener('click', modalClose);

  // Cleanup event listeners after transition
  popup.addEventListener('transitionend', () => {
    if (popup.style.display === 'none') {
      document.removeEventListener('click', modalClose);
    }
  });

  // Execute the popup initialization
  initPopup();
}

document.addEventListener('DOMContentLoaded', () => {
  // Function to show the modal manually
  function manualChangelog() {
    const popup = document.getElementById('changelog_popup');
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.opacity = '1';
    }, 0); // Ensure transition effect
  }

  // Event listener for the button click
  const showChangelogButton = document.getElementById('button_official');
  const iconOfficial = document.getElementById('icon_official');

  if (showChangelogButton) {
    showChangelogButton.addEventListener('click', manualChangelog);
  }

  if (iconOfficial) {
    iconOfficial.addEventListener('click', manualChangelog);
  }

  // Delay the entire script by 1.5 seconds
  setTimeout(() => {
    showTextPopup();
  }, 1500); // 1.5 seconds delay
});
