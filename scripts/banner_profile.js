function showBanner0() {
    const top = document.querySelector('.top');
    const center = document.querySelector('.center');
    const banner_0 = document.getElementById('banner_0');
    const banner_0_text = document.getElementById('banner_0_text');
    const bannerClose = document.getElementById('banner_0_close');
    const storedText = localStorage.getItem('bannerText');

    if (!storedText || storedText !== banner_0_text.textContent) {
        banner_0.style.display = 'block';
        top.style.transform = 'translateY(48px)';
        center.style.transform = 'translate(-50%, 48px)';
    } else {
        top.style.transform = 'translateY(0px)';
    }

    // Handle the close button click event
    bannerClose.addEventListener('click', () => {
        // Save to browser
        localStorage.setItem('bannerText', banner_0_text.textContent);

        // Apply Actions
        banner_0.style.opacity = '0'; // Set opacity to 0 for the transition effect
        banner_0.style.transform = 'translateY(-48px)'; // Move the banner off the screen
        center.style.transform = 'translate(-50%, 0px)';;
        top.style.transform = 'translateY(0px)';

        setTimeout(() => {
            banner_0.style.display = 'none'; // Hide the banner after the transition
        }, 200); // Wait for the transition duration (0.2s)
    });
}