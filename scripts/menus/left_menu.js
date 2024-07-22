document.addEventListener("DOMContentLoaded", function () {

    // Main variables
    const toggle_left_menu_1 = document.querySelector('#toggle_left_menu');
    const toggle_left_menu_2 = document.querySelector('#toggle_left_menu_2');
    const toggle_left_menu_3 = document.querySelector('#toggle_left_menu_3');
    const toggle_left_menu_4 = document.querySelector('#toggle_left_menu_4');
    const left = document.querySelector('.left');
    const center = document.querySelector('.center');
    const left_inner = document.querySelector('.left_inner');
    const toggle_left_menu_option_1 = document.querySelector('#toggle_left_menu_option');
    const toggle_left_menu_option_2 = document.querySelector('#toggle_left_menu_option_2');
    const toggle_left_menu_option_3 = document.querySelector('#toggle_left_menu_option_3');
    const toggle_left_menu_option_4 = document.querySelector('#toggle_left_menu_option_4');

    let lastPressedButton = 'button1';

    function toggleMenu1() {
        if (lastPressedButton === 'button1') {
            closeMenu1();
        } else {
            openMenu1();
        }
        load_local_scheme(); // Call once per button click
    }

    function toggleMenu2() {
        if (lastPressedButton === 'button2') {
            closeMenu2();
        } else {
            openMenu2();
        }
        load_local_scheme(); // Call once per button click
    }

    function toggleMenu3() {
        if (lastPressedButton === 'button3') {
            closeMenu3();
        } else {
            openMenu3();
        }
        load_local_scheme(); // Call once per button click
    }

    function toggleMenu4() {
        if (lastPressedButton === 'button4') {
            closeMenu4();
        } else {
            openMenu4();
        }
        load_local_scheme(); // Call once per button click
    }

    function openMenu1() {
        left_inner.style.transform = "translateX(94px)";
        center.style.left = "50%";
        left.style.borderRadius = "0px";
        toggle_left_menu_option_1.option = "option_1";
        toggle_left_menu_option_1.textContent = "Hide Profiles"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_option_2.option = "option_2";
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        fetchAuthorsAndRender();
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_1.classList.add('side_button_active');
        toggle_left_menu_2.classList.remove('side_button_active');
        toggle_left_menu_3.classList.remove('side_button_active');
        toggle_left_menu_4.classList.remove('side_button_active');
        lastPressedButton = 'button1'; // Set last pressed button
    }

    function closeMenu1() {
        left_inner.style.transform = "translateX(-396px)";
        center.style.left = "38.5%";
        left.style.borderRadius = "0px 32px 32px 0px";
        toggle_left_menu_option_1.option = "option_2";
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_1.classList.remove('side_button_active');
        lastPressedButton = null; // Reset last pressed button
    }

    function openMenu2() {
        left_inner.style.transform = "translateX(94px)";
        center.style.left = "50%";
        left.style.borderRadius = "0px";
        toggle_left_menu_option_2.option = "option_2";
        toggle_left_menu_4.classList.remove('side_button_active');
        toggle_left_menu_option_2.textContent = "Hide Deleted"; // TEMP ONLY
        toggle_left_menu_option_1.option = "option_2";
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_3.classList.remove('side_button_active');
        fetchAuthorsAndRender2();
        toggle_left_menu_2.classList.add('side_button_active');
        toggle_left_menu_1.classList.remove('side_button_active');
        lastPressedButton = 'button2'; // Set last pressed button
    }

    function closeMenu2() {
        left_inner.style.transform = "translateX(-396px)";
        center.style.left = "38.5%";
        left.style.borderRadius = "0px 32px 32px 0px";
        toggle_left_menu_option_2.option = "option_1";
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_2.classList.remove('side_button_active');
        lastPressedButton = null; // Reset last pressed button
    }

    function openMenu3() {
        left_inner.style.transform = "translateX(94px)";
        center.style.left = "50%";
        left.style.borderRadius = "0px";
        toggle_left_menu_option_2.option = "option_2";
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_option_3.textContent = "Hide Backups"; // TEMP ONLY
        toggle_left_menu_option_1.option = "option_2";
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        fetchAuthorsAndRender3();
        toggle_left_menu_2.classList.remove('side_button_active');
        toggle_left_menu_3.classList.add('side_button_active');
        toggle_left_menu_1.classList.remove('side_button_active');
        toggle_left_menu_4.classList.remove('side_button_active');
        lastPressedButton = 'button3'; // Set last pressed button
    }

    function closeMenu3() {
        left_inner.style.transform = "translateX(-396px)";
        center.style.left = "38.5%";
        left.style.borderRadius = "0px 32px 32px 0px";
        toggle_left_menu_option_2.option = "option_1";
        toggle_left_menu_option_3.option = "option_1";
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_3.classList.remove('side_button_active');
        lastPressedButton = null; // Reset last pressed button
    }

    function openMenu4() {
        left_inner.style.transform = "translateX(94px)";
        center.style.left = "50%";
        left.style.borderRadius = "0px";
        toggle_left_menu_option_2.option = "option_2";
        toggle_left_menu_option_3.option = "option_2";
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Hide Published"; // TEMP ONLY
        toggle_left_menu_option_1.option = "option_2";
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        fetchAuthorsAndRender4();
        toggle_left_menu_2.classList.remove('side_button_active');
        toggle_left_menu_4.classList.add('side_button_active');
        toggle_left_menu_1.classList.remove('side_button_active');
        toggle_left_menu_3.classList.remove('side_button_active');
        lastPressedButton = 'button4'; // Set last pressed button
    }

    function closeMenu4() {
        left_inner.style.transform = "translateX(-396px)";
        center.style.left = "38.5%";
        left.style.borderRadius = "0px 32px 32px 0px";
        toggle_left_menu_option_2.option = "option_1";
        toggle_left_menu_option_3.textContent = "Show Backups"; // TEMP ONLY
        toggle_left_menu_option_2.textContent = "Show Deleted"; // TEMP ONLY
        toggle_left_menu_option_1.textContent = "Show Profiles"; // TEMP ONLY
        toggle_left_menu_option_4.textContent = "Show Published"; // TEMP ONLY
        toggle_left_menu_4.classList.remove('side_button_active');
        lastPressedButton = null; // Reset last pressed button
    }

    toggle_left_menu_1.addEventListener('click', toggleMenu1);
    toggle_left_menu_2.addEventListener('click', toggleMenu2);
    toggle_left_menu_3.addEventListener('click', toggleMenu3);
    toggle_left_menu_4.addEventListener('click', toggleMenu4);
});