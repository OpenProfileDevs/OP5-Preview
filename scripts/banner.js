function showBanner0() {
    const top = document.querySelector('.top');
    const left = document.querySelector('.left');
    const center = document.querySelector('.center');
    const right = document.querySelector('.right');
    const banner_0 = document.getElementById('banner_0');
    const bannerClose = document.getElementById('banner_0_close');

    banner_0.style.display = 'block';
    top.style.transform = 'translateY(40px)';
    left.style.transform = 'translateY(40px)';
    center.style.transform = 'translate(-50%, calc(-50% + 32px))';
    right.style.transform = 'translateY(40px)';

    // Handle the close button click event
    bannerClose.addEventListener('click', () => {
        banner_0.style.opacity = '0'; // Set opacity to 0 for the transition effect
        banner_0.style.transform = 'translateY(-40px)'; // Move the banner off the screen
        top.style.transform = 'translateY(0px)';
        left.style.transform = 'translateY(0px)';
        center.style.transform = 'translate(-50%, -50%)';
        right.style.transform = 'translateY(0px)';

        setTimeout(() => {
            banner_0.style.display = 'none'; // Hide the banner after the transition
        }, 200); // Wait for the transition duration (0.2s)
    });
}