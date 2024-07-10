// This loads the script on page load so it's ready to use.
document.addEventListener("DOMContentLoaded", function () {

    //————————————————————————————————————————————————————————//
    //———————————————————[ MAIN-VARIABLES ]———————————————————//
    //————————————————————————————————————————————————————————//
    const toggle_left_menu = document.querySelector('#toggle_left_menu');
    const left = document.querySelector('.left');
    const center = document.querySelector('.center');
    const left_inner = document.querySelector('.left_inner');
    const toggle_left_menu_option = document.querySelector('#toggle_left_menu_option');

    toggle_left_menu.addEventListener('click', function () {
        if (left_inner.style.transform === "translateX(-432px)") {
            left_inner.style.transform = "translateX(96px)";
            center.style.left = "50%";
            left.style.borderRadius = "0px";
            toggle_left_menu_option.option = "option_1";
            toggle_left_menu_option.textContent = "Hide Profiles"; // TEMP ONLY
        } else {
            left_inner.style.transform = "translateX(-432px)";
            center.style.left = "38.5%";
            left.style.borderRadius = "0px 32px 32px 0px";
            toggle_left_menu_option.option = "option_2";
            toggle_left_menu_option.textContent = "Show Profiles"; // TEMP ONLY
        }
    });
});