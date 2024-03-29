document.addEventListener('DOMContentLoaded', () => {
    const brand_icon_mediaInput = document.getElementById('brand_icon_media_input');
    const brand_icon_container = document.querySelector('.image_input_2');
    const brand_icon_selectedImages = document.querySelectorAll('.brand_icon_selected_image'); // Select all elements with the class
    const brand_icon_selectedVideo = document.querySelector('.brand_icon_selected_video');
    const brand_icon_label_text = document.querySelectorAll('.brand_icon_label_text');
    const page_outer = document.querySelectorAll('.page_outer');
    const label_tab = document.querySelectorAll('.label_tab');
    const page_indicator = document.querySelectorAll('.page_indicator');
    const page_inner = document.querySelectorAll('.page_inner');
    const input_text = document.querySelectorAll('.input_text');
    const textarea = document.querySelectorAll('textarea');
    const image_input = document.querySelectorAll('.image_input');
    const brand_icon_iconImage = document.querySelector('.brand_icon_icon_image');
    const help_box_tab = document.querySelectorAll('.help_box_tab');
    const history_tab = document.querySelectorAll('.history_tab');
    const social_button = document.querySelectorAll('.social_button');
    const watch_button = document.querySelectorAll('.watch_button');
    const input_text_legal = document.querySelectorAll('.input_text_legal');

    let brand_icon_fileInputOpened = false;

    // Function to convert RGB values to a hex color code
    function rgbToHex(r, g, b) {
        return `#${((1 << 8) | r).toString(16).slice(1)}${((1 << 8) | g).toString(16).slice(1)}${((1 << 8) | b).toString(16).slice(1)}`;
    }

    // Function to darken a hex color
    function darkenhexColors(hexColors, factor) {
        // Remove the '#' symbol
        hexColors = hexColors.replace(/^#/, '');

        // Convert to RGB
        const r = parseInt(hexColors.slice(0, 2), 16);
        const g = parseInt(hexColors.slice(2, 4), 16);
        const b = parseInt(hexColors.slice(4, 6), 16);

        // Darken the color
        const newR = Math.max(0, r - factor);
        const newG = Math.max(0, g - factor);
        const newB = Math.max(0, b - factor);

        // Convert back to hex
        return rgbToHex(newR, newG, newB);
    }

    // Function to determine if a color is close to black or white
    function isCloseToBlackOrWhite(color) {
        // Calculate the luminance of the color
        const luminance = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255;

        // Define thresholds for black and white
        const blackThreshold = 0.1;
        const whiteThreshold = 0.9;

        // Check if the color is close to black or white
        return luminance < blackThreshold || luminance > whiteThreshold;
    }

    brand_icon_mediaInput.addEventListener('change', (event) => {
        const brand_icon_selectedFile = event.target.files[0];

        if (brand_icon_selectedFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const brand_icon_mediaType = brand_icon_selectedFile.type;
                if (brand_icon_mediaType.startsWith('image/')) {
                    // Handle images
                    brand_icon_container.style.backgroundColor = '#00000000';

                    // Set the image source for all elements with the class
                    brand_icon_selectedImages.forEach((imageElement) => {
                        imageElement.src = e.target.result;
                        imageElement.style.display = 'block';
                        imageElement.style.opacity = '1';
                        imageElement.style.backgroundColor = '#00000000';
                    });

                    // Hide the video element
                    brand_icon_selectedVideo.style.display = 'none';

                    // Clears the text
                    brand_icon_label_text.forEach((imageElement) => {
                        imageElement.textContent = '';
                    });
                } else if (brand_icon_mediaType.startsWith('video/')) {
                    // Handle videos
                    brand_icon_container.style.backgroundColor = '#76809900';

                    // Set the video source
                    brand_icon_selectedVideo.src = e.target.result;
                    brand_icon_selectedVideo.style.display = 'block';

                    // Hide the image element
                    brand_icon_selectedImages.forEach((imageElement) => {
                        imageElement.style.display = 'none';
                    });

                    // Clear the label text
                    brand_icon_label_text.textContent = '';
                }
            };

            reader.readAsDataURL(brand_icon_selectedFile);
        }
    });

    console.log("Brand Icon Media Script is running");
});