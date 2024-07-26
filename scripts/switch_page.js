const nextPage = document.getElementById('next_page');
const previousPage = document.getElementById('previous_page');
let currentPosition = 10;
let animationId; // Store the animation frame ID

// Function to scroll to the top smoothly
function scrollToTop() {
  const currentY = window.scrollY;
  const easeIn = t => t * t;
  const newY = currentY - 100 * easeIn(currentY / 300);
  window.scrollTo(0, newY);
  if (newY > 0) {
    animationId = requestAnimationFrame(scrollToTop);
  }
}

// Cancel animation frame on mouse wheel
window.addEventListener('wheel', () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
});

// Switch to a specific page
function switchToPage(pageId, target) {
  console.log(pageId);
  const pageElement = document.getElementById(`page_${pageId}`);
  if (pageElement) {
    const currentPage = document.getElementById(`page_${currentPosition}`);
    
    setTimeout(() => {
      scrollToTop(); // Smoothly scroll to the top
    }, 300);
    
    if (target === "next") {
      currentPage.style.animation = "page_slide_out 0.4s linear";
      currentPage.style.left = "-140vw";
    } else if (target === "previous") {
      pageElement.style.animation = "page_slide_in 0.4s linear";
      pageElement.style.left = "0vw";
    }

    currentPosition = pageId; // Update the current position
  } else {
    console.log(`Page ${pageId} does not exist.`);
  }
}

// Find the next available page ID within the range, excluding hidden pages
function findAvailablePage(startPageId, maxSearchRange, direction) {
  for (let i = 0; i <= maxSearchRange; i++) {
    const pageId = direction === 'forward' ? startPageId + i : startPageId - i;
    const pageElement = document.getElementById(`page_${pageId}`);
    if (pageElement && pageElement.style.display !== 'none') {
      return pageId;
    }
  }
  return null; // No available page found within the range
}

// Event listener for next page button
nextPage.addEventListener('click', () => {
  const nextPageId = currentPosition + 1;
  const availablePageId = findAvailablePage(nextPageId, 10, 'forward');
  if (availablePageId !== null) {
    switchToPage(availablePageId, "next");
  }
});

// Event listener for previous page button
previousPage.addEventListener('click', () => {
  const previousPageId = currentPosition - 1;
  const availablePageId = findAvailablePage(previousPageId, 10, 'backward');
  if (availablePageId !== null) {
    switchToPage(availablePageId, "previous");
  }
});
