//————————————————————————————————————————————————————————//
//———————————————[ SCHEME-MANAGER-SCRIPT ]————————————————//
//————————————————————————————————————————————————————————//
// The scheme manager script enables triggering the scheme
// manager and switching schemes based on what is registered
// below in the HTML code. To register a new custom scheme 
// read the comments towards the end of the script as they
// will guide you towards achieving that.

// The current scheme variable.
let current_scheme = '';

// This loads the script on page load so it's ready to use.
document.addEventListener("DOMContentLoaded", function () {

    //————————————————————————————————————————————————————————//
    //———————————————————[ MAIN-VARIABLES ]———————————————————//
    //————————————————————————————————————————————————————————//
    // This collects the scheme button IDs required for 
    // triggering the manager or switching to different schemes.

    // The main scheme manager element.
    const schemes_manager = document.querySelector('.schemes_manager');

    // The scheme manager trigger button ID.
    const button_scheme = document.querySelector('#button_scheme');
    const icon_scheme = document.querySelector('#icon_scheme');

    //————————————————————————————————————————————————————————//
    //———————————————————[ SCHEME-MANAGER ]———————————————————//
    //————————————————————————————————————————————————————————//
    // When clicking on the scheme button it will open the
    // scheme manager and set it's display to grid. The 
    // registered schemes will also display themselves within
    // the manager based on the HTML code below. Cicking it
    // again or outside of the manager will cause it to close.
    button_scheme.addEventListener('click', function () {
        if (schemes_manager.style.display !== 'grid') {
            // This loads in the schemes.
            generate_schemes();
            // This ensures the dynamic elements are schemed.
            load_current_scheme()
            // This displays the schemes in the manager.
            schemes_manager.style.display = 'grid';
            setTimeout(function () {
                schemes_manager.style.opacity = '1';
            }, 50);
    
            // Adds a click event listener to the document.
            const closeSchemeManager = function (event) {
                if (schemes_manager.style.display === 'grid' && !schemes_manager.contains(event.target) && event.target !== button_scheme && event.target !== icon_scheme) {
                    // Hides the scheme manager.
                    schemes_manager.style.display = 'none';
                    // Clears the scheme manager.
                    schemes_manager.innerHTML = '';
                    document.removeEventListener('click', closeSchemeManager);
                }
            };
    
            document.addEventListener('click', closeSchemeManager);
        } else {
            // Close the scheme manager if it's already open.
            schemes_manager.style.opacity = '0';
            setTimeout(function () {
                // Hides the scheme manager.
                schemes_manager.style.display = 'none';
                // Clears the scheme manager.
                schemes_manager.innerHTML = '';
            }, 200);
        }
    });
    

    // This function will load the schemes into the manager
    // based on what has been registered at the end of the
    // script.
    function generate_schemes() {

        // This prevents non-verified schemes from showing up.
        let scheme_manager_html = '';

        // This stores the initial z-index of the first scheme.
        let scheme_zindex = 999;
        schemes.forEach((scheme) => {

            // This checks the current month.
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Months are 0.
        
            // Defines the date ranges for each month.
            const January = 1;
            const February = 2;
            const March = 3;
            const April = 4;
            const May = 5;
            const June = 6;
            const July = 7;
            const August = 8;
            const September = 9;
            const October = 10;
            const November = 11;
            const December = 12;
                
            // Checks the current month and if not matching to seasonal
            // schemes to skip them until the month arrives.
            if (currentMonth !== October && scheme.id === "scheme_spooky" || currentMonth !== February && scheme.id  === "scheme_lunar_red"  || currentMonth !== February && scheme.id  === "scheme_lunar_green" ) {
                // Blank html code when skipping schemes.
                scheme_manager_html += ``;
            } else {
                // Checks if the text color is closer to white or black
                // and sets the icon brightness based on the results.
                // Closer to white is 0% and closer to black is 100%.
                const luminance = (parseInt(scheme.text.slice(1, 3), 16) * 299 + parseInt(scheme.text.slice(3, 5), 16) * 587 + parseInt(scheme.text.slice(5, 7), 16) * 114) / 1000;
                let icon_brightness = '';

                if (luminance >= 128) {
                    // Text color is closer to white, set brightness to 100%
                    icon_brightness = 'brightness(100%)';
                } else {
                    // Text color is closer to black, set brightness to 0%
                    icon_brightness = 'brightness(0%)';
                }

                //————————————————————————————————————————————————————————//
                //—————————————————————[ HTML-CODE ]——————————————————————//
                //————————————————————————————————————————————————————————//
                // Once the scheme manager has been opened the following
                // code will be displayed within the
                // (class="schemes_manager") element in the HTML file. This
                // code will duplicate itself until all registered schemes
                // have been properly loaded into the manager.
                scheme_manager_html += `
                <div class="schemes_backdrop" style="background-color: ${scheme.shade_2}; z-index: ${scheme_zindex};">
                <div class="scheme_button" id="${scheme.id}" style="background: ${scheme.shade_1}" title="Apply Scheme" onmouseover="this.style.backgroundColor='${scheme.accent}'" onmouseout="this.style.backgroundColor='${scheme.shade_1}'">
                    <img id="${scheme.id}" src="/media/icons/feather_icons/download.svg" style="transform-origin: top left; max-width: 32px; margin: 8px; filter: ${icon_brightness};">
                </div>
                <img src="/media/icons/feather_icons/${scheme.icon}.svg" style="position: relative; top: -48px; max-width: 40px; transform-origin: top left; margin: 12px; filter: ${icon_brightness};">
                <div class="scheme_text" id="scheme_name_${scheme.name}" style="color: ${scheme.text}">${scheme.name}</div>
                </div>
                `;

                // This negates a number from the current z-index to
                // prevent overlapping so the next scheme can be fully
                // seen. The max supported schemes is currently 999.
                scheme_zindex--;
            }
        });

        // This displays the custom scheme import option.
        scheme_manager_html += `
            <div class="triangle" style=" top: 20px; right: 24px;"></div>
            <div class="schemes_backdrop" style="background-color: #111111; z-index: 0; display: none;">
                <label for="import_custom_scheme" class="scheme_button" title="Import Scheme" style="background-color: #222222"
                    <input type="file" id="import_custom_scheme" accept=".sch" style="display: none;">
                    <img id="import_custom_scheme" src="media/icons/feather_icons/upload.svg" style="transform: scale(0.30); transform-origin: top left; margin: 10px;">
                </label>
                <img src="media/icons/feather_icons/plus.svg" style="transform: scale(0.50); transform-origin: top left; margin: 10px;">
                <div class="scheme_text" id="import_custom_scheme_text">Add Scheme</div>
                <div class="tag" style="scale: 1.4; top: 110px; transform: translateX(14px);">PREVIEW</div>
            </div>
        `;
        schemes_manager.innerHTML += scheme_manager_html;

        //————————————————————————————————————————————————————————//
        //———————————————————[ IMPORT-SCHEME ]————————————————————//
        //————————————————————————————————————————————————————————//
        // When a scheme gets imported via the above html import
        // elements, the imported JSON file gets broken down into
        // variables based on the file's registered values and loads
        // these values into the apply scheme function which updates
        // the scheme base on the imported file (.sch).
        document.querySelector('#import_custom_scheme').addEventListener('change', function() {
            const fileInput = this;
            const selectedFile = fileInput.files[0];
            
            if (selectedFile) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    imported_scheme = JSON.parse(event.target.result);
                    
                    if (imported_scheme) {
                        scheme_apply(imported_scheme.id, imported_scheme.icon, imported_scheme.text, imported_scheme.accent, imported_scheme.shade_1, imported_scheme.shade_2, imported_scheme.shade_1, imported_scheme.shade_1, imported_scheme.shade_2, imported_scheme.custom_html)

                        // This saves the imported scheme to local storage so it can
                        // be automatically reloaded on refresh using the
                        // "load_local_scheme()" function at the end of the script.
                        const scheme_json = JSON.stringify(imported_scheme);
                        localStorage.setItem('local_selected_scheme', scheme_json);
                        console.log("Selected scheme saved locally!");
                    }
                };

                reader.readAsText(selectedFile);
            }
        });
    }

    //————————————————————————————————————————————————————————//
    //———————————————————[ SCHEME-SWITCH ]————————————————————//
    //————————————————————————————————————————————————————————//
    // Here is where schemes get applied when the apply scheme
    // button is pressed. It listens for clicks in the scheme
    // manager and if a scheme ID is found then it selected 
    // then applies said scheme.
    schemes_manager.addEventListener('click', function (event) {
        var scheme_id = event.target.id;
        const selected_scheme = schemes.find(scheme => scheme.id === scheme_id);

        if (selected_scheme) {
            scheme_apply(selected_scheme.id, selected_scheme.icon, selected_scheme.text, selected_scheme.accent, selected_scheme.shade_1, selected_scheme.shade_2, selected_scheme.shade_1, selected_scheme.shade_1, selected_scheme.shade_2, selected_scheme.custom_html);
        
        // This saves the selected scheme to local storage so it can
        // be automatically reloaded on refresh using the
        // "load_local_scheme()" function at the end of the script.
        const scheme_json = JSON.stringify(selected_scheme);
        localStorage.setItem('local_selected_scheme', scheme_json);
        console.log("Selected scheme saved locally!");
        }
    });
});

//————————————————————————————————————————————————————————//
//——————————————————[ SCHEME-FUNCTION ]———————————————————//
//————————————————————————————————————————————————————————//
// When the apply scheme button has been pressed the
// selected scheme fetches the data from the JSON and loads
// it into this function which replaces the color of all
// the elements listed in the element variables section
// below.

function scheme_apply(scheme_id, scheme_icon, scheme_text, scheme_accent, scheme_shade_1, scheme_shade_2, scheme_shade_1, scheme_shade_1, scheme_shade_2, scheme_custom_html) {

    // Sets current scheme variable.
    current_scheme = {
        id: scheme_id,
        icon: scheme_icon,
        text: scheme_text,
        accent: scheme_accent,
        shade_1: scheme_shade_1,
        shade_2: scheme_shade_2,
        shade_1: scheme_shade_1,
        shade_1: scheme_shade_1,
        shade_2: scheme_shade_2,
        custom_html: scheme_custom_html,
    };
    
    // Convert current_scheme to JSON string
    current_scheme = JSON.stringify(current_scheme);
    
    console.log(current_scheme);
    

    //————————————————————————————————————————————————————————//
    //—————————————————[ ELEMENT-VARIABLES ]——————————————————//
    //————————————————————————————————————————————————————————//
    // This collects the document's element IDs that will be
    // modified by the switching of schemes. If further elements
    // are added to the HTML file or HTML code that aren't part
    // of the profile pages and you want them to be modified
    // by schemes, add their IDs on a new line using the same
    // format as below. Use "All" if there are more than one of
    // the same element in the HTML file.

    // This ID is used for changing the icon seen in the scheme
    // button based off the active scheme.
    const icon_scheme = document.querySelector('#icon_scheme');

    // The below IDs are all used for changing the colors of
    // the non-profile page elements based off the active
    // scheme.
    const link = document.querySelector('link');
    const body = document.querySelector('body');
    const a = document.querySelectorAll('a');
    const li = document.querySelectorAll('.menu li');
    const schemes_layer = document.querySelector('.schemes_layer');
    const loading_image = document.querySelector('#loading_image')
    const loader_social_button = document.querySelectorAll('.loader_social_button')
    const loading_message = document.querySelectorAll('.loading_message');
    const icon = document.querySelectorAll('.icon')
    const banner = document.querySelectorAll('.banner')
    const top = document.querySelector('.top');
    const changelog_popup = document.querySelectorAll('.changelog_popup');
    const side_button = document.querySelectorAll('.side_button');
    const top_button = document.querySelectorAll('.top_button');
    const bottom_button = document.querySelectorAll('.bottom_button');
    const control_button = document.querySelectorAll('.control_button');
    const modify_button = document.querySelectorAll('.modify_button');
    const schemes_manager = document.querySelector('.schemes_manager');
    const tag = document.querySelectorAll('.tag');
    const circle_outer = document.querySelectorAll('.circle_outer');
    const circle_inner = document.querySelectorAll('.circle_inner');
    const information_text = document.querySelectorAll('.information_text');
    const label_left = document.querySelectorAll('.label_left');
    const label_right = document.querySelectorAll('.label_right');
    const triangle = document.querySelectorAll('.triangle')
    const label_top = document.querySelectorAll('.label_top')
    const label_bottom = document.querySelectorAll('.label_bottom')
    const side_lower_button = document.querySelectorAll('.side_lower_button')
    const openprofile_title_text = document.querySelector('#openprofile_title_text')
    const openprofile_text = document.querySelector('#openprofile_text')
    const openprofile_title_logo = document.querySelector('#openprofile_title_logo')
    const center = document.querySelector('.center')

    //const popup_prompt = document.querySelector('.popup_prompt');
    
    //————————————————————————————————————————————————————————//
    //————————————————————[ SCHEME-APPLY ]————————————————————//
    //————————————————————————————————————————————————————————//
    // Here is where the scheme application process visually
    // starts using the above variables.

    // Sets the scheme icon to the scheme manager button.
    //icon_scheme.src = `media/icons/feather_icons/${scheme_icon}.svg`;

    // Sets the scheme of the default elements.
    body.style.backgroundColor = scheme_shade_1;
    center.style.color = scheme_text;

    a.forEach((a) => {
        a.style.color = scheme_accent;
    });

    loader_social_button.forEach((loader_social_button) => {
        loader_social_button.style.backgroundColor = scheme_shade_2;
        loader_social_button.addEventListener('mouseover', () => {
            loader_social_button.style.backgroundColor = scheme_accent;
        });
        loader_social_button.addEventListener('mouseout', () => {
            loader_social_button.style.backgroundColor = scheme_shade_2;
        });
    });

    // Checks if the text color is closer to white or black
    // and sets the icon brightness based on the results.
    // Closer to white is 0% and closer to black is 100%.
    const luminance = (parseInt(scheme_text.slice(1, 3), 16) * 299 + parseInt(scheme_text.slice(3, 5), 16) * 587 + parseInt(scheme_text.slice(5, 7), 16) * 114) / 1000;

    if (luminance >= 128) {
        // Text color is closer to white, set brightness to 100%
        icon.forEach((icon) => {
            icon.style.filter = 'brightness(100%)';
        });
        openprofile_title_logo.style.filter = 'brightness(100%)';
    } else {
        // Text color is closer to black, set brightness to 0%
        icon.forEach((icon) => {
            icon.style.filter = 'brightness(0%)';
        });
        openprofile_title_logo.style.filter = 'brightness(0%)';
    }


    // Checks if an image associated with the selected scheme
    // exists using the scheme ID to access the media directory
    // and if exists will update the overall application icon.
    // This is only compatible with official schemes or
    // developers who hold a privately forked version on their
    // device.

    // This removes "scheme_" from the beginning of the scheme
    // ID then uses the raw name to search the media directory
    // for an existing icon.

    const scheme_raw_name = scheme_id.replace(/^scheme_/, '');
    const loading_image_check = `/media/schemes/${scheme_raw_name}/${scheme_raw_name}_app_icon.png`;

    const loading_image_new = new Image();
    loading_image_new.onload = function () {
        if (this.complete) {
            // If the image exists, apply it to loading_image.
            loading_image.src = loading_image_check;
            link.href = loading_image_check;
        }
        // Continue with the code, whether the image exists or not.
        callback(true);
    };

    // Start loading the image.
    loading_image_new.src = loading_image_check;

    loading_message.forEach((loadingMessage) => {
        loadingMessage.style.color = scheme_text;
    });

    // Sets the scheme of the main elements.
    top.style.backgroundColor = scheme_shade_2;

    // Sets the scheme of the banner elements.
    banner.forEach((banner) => {
        banner.style.backgroundColor = scheme_accent;
    });

    // Sets the scheme of the pop-up elements.
    changelog_popup.forEach((changelog_popup) => {
        changelog_popup.style.backgroundColor = scheme_accent;
    });

    // Sets the scheme of the pop-up elements.
    triangle.forEach((triangle) => {
        triangle.style.borderTop = `100px solid ${scheme_accent}`;
    });

    side_button.forEach((side_button) => {
        side_button.style.backgroundColor = scheme_shade_2;
        side_button.addEventListener('mouseover', () => {
            side_button.style.backgroundColor = scheme_accent;
        });
        side_button.addEventListener('mouseout', () => {
            side_button.style.backgroundColor = scheme_shade_2;
        });
    });

    side_lower_button.forEach((side_lower_button) => {
        side_lower_button.style.backgroundColor = scheme_shade_2;
        side_lower_button.addEventListener('mouseover', () => {
            side_lower_button.style.backgroundColor = scheme_accent;
        });
        side_lower_button.addEventListener('mouseout', () => {
            side_lower_button.style.backgroundColor = scheme_shade_2;
        });
    });

    top_button.forEach((top_button) => {
        top_button.style.backgroundColor = scheme_accent;
        top_button.style.color = "#ffffff";
    });

    bottom_button.forEach((bottom_button) => {
            bottom_button.style.backgroundColor = scheme_shade_2;
    });

    control_button.forEach((control_button) => {
            control_button.style.backgroundColor = scheme_shade_2;
            control_button.addEventListener('mouseover', () => {
                control_button.style.backgroundColor = scheme_accent;
            });
            control_button.addEventListener('mouseout', () => {
                control_button.style.backgroundColor = scheme_shade_2;
            });
    });

    // Sets the scheme of the app control buttons.
    control_button.forEach((control_button) => {
        if (control_button.id == 'app_close' || control_button.id == 'app_minimize' || control_button.id == 'app_hide') {
            control_button.style.backgroundColor = scheme_accent;     
        }
    });

    modify_button.forEach((modify_button) => {
        modify_button.style.backgroundColor = scheme_accent;
    });

    // Sets the scheme of the scheme manager elements.
    schemes_manager.style.backgroundColor = scheme_accent;
    
    // Sets the scheme of the additional elements.
    tag.forEach((tag) => {
        tag.style.backgroundColor = scheme_accent;
    });

    circle_outer.forEach((circle_outer) => {
        circle_outer.style.border = `50px solid ${scheme_shade_1}`;
    });

    circle_inner.forEach((circle_inner) => {
        circle_inner.style.backgroundColor = scheme_shade_2;
    });

    information_text.forEach((information_text) => {
        information_text.style.backgroundColor = scheme_shade_1;
        information_text.style.color = scheme_text;
    });

    // Sets the scheme of the label elements.
    label_left.forEach((label_left) => {
        label_left.style.backgroundColor = scheme_accent;
    });

    label_right.forEach((label_right) => {
        label_right.style.backgroundColor = scheme_accent;
    });
    label_top.forEach((label_top) => {
        label_top.style.backgroundColor = scheme_accent;
    });
    label_bottom.forEach((label_bottom) => {
        label_bottom.style.backgroundColor = scheme_accent;
    });

    // Sets the scheme of the menu elements.
    li.forEach((li) => {
        li.style.backgroundColor = scheme_shade_1;
        li.style.color = scheme_text;
        li.addEventListener('mouseover', () => {
            li.style.backgroundColor = scheme_accent;
        });
        li.addEventListener('mouseout', () => {
            li.style.backgroundColor = scheme_shade_1;
        });
    });

    // Extra Stuff
    openprofile_title_text.style.color = scheme_text;
    openprofile_text.style.color = scheme_text;
    //popup_prompt.style.backgroundColor = scheme_shade_2;

    // Sets and clears the scheme custom html code if any.
    let schemes_layer_html = ``;
    schemes_layer_html = `
        ${scheme_custom_html}
    `;
    schemes_layer.innerHTML = schemes_layer_html;
}

//————————————————————————————————————————————————————————//
//——————————————————————[ SCHEMES ]———————————————————————//
//————————————————————————————————————————————————————————//
// Here you will find all the registered schemes. Each and
// every scheme registered in here will appear in the
// scheme manager. If for any reason it doesn't, then
// scheme was improperly registered. All schemes will load
// in the registration order. If you wish to reorder them,
// simply move them around.
//
// When registering a new scheme, copy the following piece
// of code below and paste it where it says to paste at
// the bottom of the registered schemes.
//
// {
//     "name": "NAME",
//     "id": "scheme_NAME",
//     "author": "YOUR_USERNAME",
//     "version": "v5.0.090", (match current app version)
//     "tag": "TYPE", (put either RELEASE, BETA, or PREVIEW)
//     "icon": "ICON_NAME", (https://feathericons.com/)
//     "text": "HEX_CODE",
//     "accent": "HEX_CODE",
//     "shade_1": "HEX_CODE",
//     "shade_2": "HEX_CODE",
//     "custom_html": "<div></div>", (experienced users only)
// },
//
// When customizing your scheme, replace all in capital
// letters with your own custom value based on the text.
// Do not include the parenthesis outside of " ", ".

// This JSON contains the list of registered schemes.
const fileListEndpoint2 = '/schemeList';

// This will store the schemes extracted from the fetched data
const schemes = [];

// Fetch the file list and folder path
fetch(fileListEndpoint2)
  .then(response => response.json())
  .then(({ folderPath, files }) => {
    files.forEach(fileName => {
      if (fileName.endsWith('.sch')) {
        const filePath = `/${folderPath}/${fileName}`;
        fetch(filePath)
          .then(response => response.json())
          .then(data => {
            // Assuming the received data structure matches the format you provided
            const scheme = {
              name: data.name,
              id: data.id,
              author: data.author,
              version: data.version,
              tag: data.tag,
              icon: data.icon,
              text: data.text,
              accent: data.accent,
              shade_1: data.shade_1,
              shade_2: data.shade_2,
              custom_html: data.custom_html
            };
            // Push the scheme object to the schemes array
            schemes.push(scheme);
            console.log("Scheme added:", scheme);
          })
          .catch(error => console.error(`Error fetching JSON from ${filePath}:`, error));
      }
    });
  })
  .catch(error => console.error('Error fetching file list:', error));

//————————————————————————————————————————————————————————//
//————————————————————[ SCHEME-LOAD ]—————————————————————//
//————————————————————————————————————————————————————————//
// This function is made to be used externally to load the
// locally saved scheme on app reload. Each time a scheme
// is applied it will overwrite the previous save.
function load_local_scheme() {
    const loaded_scheme_json = localStorage.getItem('local_selected_scheme');
    console.log("Locally saved scheme applied!");

    if (loaded_scheme_json) {
        const loaded_scheme = JSON.parse(loaded_scheme_json);
        scheme_apply(loaded_scheme.id, loaded_scheme.icon, loaded_scheme.text, loaded_scheme.accent, loaded_scheme.shade_1, loaded_scheme.shade_2, loaded_scheme.shade_1, loaded_scheme.shade_1, loaded_scheme.shade_2, loaded_scheme.custom_html);
    }
}

// This function is made to be used externally to load the
// active scheme for dynamic elements. Each time a scheme
// is applied it will NOT overwrite the previous save.
function load_current_scheme() {
    const loaded_scheme_json = current_scheme

    if (loaded_scheme_json) {
        const loaded_scheme = JSON.parse(loaded_scheme_json);
        scheme_apply(loaded_scheme.id, loaded_scheme.icon, loaded_scheme.text, loaded_scheme.accent, loaded_scheme.shade_1, loaded_scheme.shade_2, loaded_scheme.shade_1, loaded_scheme.shade_1, loaded_scheme.shade_2, loaded_scheme.custom_html);
    }
}

// This function is made to be used externally to apply an
// official scheme via ID. This function will NOT overwrite
// the local save.
function load_specific_scheme(schemeId) {
    const loaded_specific_scheme = schemes.find((scheme) => scheme.id === schemeId);

    if (loaded_specific_scheme) {
        scheme_apply(loaded_specific_scheme.id, loaded_specific_scheme.icon, loaded_specific_scheme.text, loaded_specific_scheme.accent, loaded_specific_scheme.shade_1, loaded_specific_scheme.shade_2, loaded_specific_scheme.shade_1, loaded_specific_scheme.shade_1, loaded_specific_scheme.shade_2, loaded_specific_scheme.custom_html);

    } else {
        console.log(`Scheme with ID ${schemeId} not found.`);
    }
}

// YOU HAVE REACHED THE END OF THE SCRIPT! IF YOU BELIEVE
// ERRORS ARE PRESENT, PLEASE REPORT IT TO US OR CONTRIBUTE
// A FIX TO IT. THANK YOU!
//
// GITHUB: https://github.com/OpenProfileApp/OP5-Preview



// DEVELOPER ONLY - DO NOT TOUCH
//${scheme.tag !== "BETA" && scheme.tag !== "PREVIEW" ? '' : `<div class="tag" style="scale: 1.4; top: 110px; transform: translateX(14px);">${scheme.tag}</div>`}