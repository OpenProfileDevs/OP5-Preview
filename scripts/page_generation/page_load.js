    const fileListEndpoint = '/fileList';
    const element = document.getElementById('your_element_id');
    var current_page = -1;
    var current_z = 99;
    var field_z = 9998;

    // Fetch the file list and folder path
    fetch(fileListEndpoint)
    .then(response => response.json())
    .then(({ folderPath, files }) => {
        files.forEach(fileName => {
        if (fileName.endsWith('.pge')) {
            const filePath = `/${folderPath}/${fileName}`;
            fetch(filePath)
            .then(response => response.json())
            .then(data => {
                // Process the data as needed
                createPage(data);
                //console.log(data);
            })
            .catch(error => console.error(`Error fetching JSON from ${filePath}:`, error));
        }
        });
    })
    .catch(error => console.error('Error fetching file list:', error));

    function createPage(data) {
        const page_loader = document.getElementById('center');
        current_page++;
        current_z--;
        const p_number = data.page_number 
        const current_index = (99 - p_number);

        // Original code for creating a page
        page_loader.innerHTML += `<div class="page" id="page_${p_number}" style="z-index: ${current_index}; top: 0px;">
        <div class="row" style="z-index: 9999; top: 12px;">
            <!--————————————————————————————————————————————————————————-->
            <!--———————————————————[ PAGE-display_name-${p_number} ]————————————————————-->
            <!--————————————————————————————————————————————————————————-->
            <div class="group" id="page_display_name_${p_number}_group" style="left: 0px; width: 352px;">
                <div class="label_tab" id="page_display_name_label_tab">Display Name
                    <div class="status_box" id="page_display_name_${p_number}_status" style="display: none;">STATUS_TEXT
                        <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                    </div>
                </div>
                <div><input type="text" class="input_1" id="page_display_name_${p_number}" autocomplete="off" autocorrect="off" placeholder="What is the character's display name?"></div>
                <div class="help_box" id="page_display_name_help_box" style="width: calc(328px + 8px);">What is the character's display name? This will be shown in the profile list.</div>
                <div class="input_dot" id="page_display_name_${p_number}_verified" style="display: none;">
                    <a id="page_display_name_${p_number}_verified_source" href="https://www.example.com" target="_blank" tabindex="-1">
                    <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div></a>
                </div>
                <div class="input_dot" id="page_display_name_${p_number}_generated" style="display: none;">
                    <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                </div>
                <div class="input_dot" id="page_display_name_${p_number}_locked" style="display: none; top: 54px;">
                    <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                </div>
                <div class="input_dot" id="page_display_name_${p_number}_history" style="display: none; top: 54px;">
                    <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                </div>
            </div>
            <!--————————————————————————————————————————————————————————-->
            <!--—————————————————————[ BRAND-ICON ]—————————————————————-->
            <!--————————————————————————————————————————————————————————-->
            <div class="group" id="brand_icon_group" style="top: -18px; left: 376px;" title="Brand Banner">
                <div><input id="brand_icon_media_input" type="file" accept="image/*,video/*" style="display: none; height: 96px; width: calc(328px + 24px);">
                    <label for="brand_icon_media_input">
                        <div class="image_input_2" id="brand_icon_container" style="width: calc(328px + 24px); height: 96px; border-radius: 12px;">
                            <img class="brand_icon_selected_image" id="brand_icon_selected_image" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 100%; max-height: 100%; opacity: 0.35; cursor: pointer; z-index: 30;" src="/media/icons/feather_icons/plus.svg">
                            <img class="brand_icon_selected_image" id="brand_icon_selected_image" style="border-radius: 12px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 100%; max-height: 100%; display: none;  z-index: 30;" src="" alt="Selected Media">
                            <video class="brand_icon_selected_video" id="brand_icon_selected_video" controls style="border-radius: 12px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 100%; max-height: 100%; display: none; z-index: 30;"></video>
                        </div>
                    </label>
                </div>
                <script src="scripts/media/import/brand_icon_import_media.js"></script>
            </div>
            <!--————————————————————————————————————————————————————————-->
            <!--———————————————————[ WRITTEN-DATE-${p_number} ]———————————————————-->
            <!--————————————————————————————————————————————————————————-->
            <div class="group" id="pfp_${p_number}_group" style="left: 752px;">
                <div class="label_tab" id="pfp_label_tab">Picture Link
                    <div class="status_box" id="pfp_${p_number}_status" style="display: none;">STATUS_TEXT
                        <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                    </div>
                </div>
                <div><input type="text" class="input_1" id="pfp_${p_number}" autocomplete="off" autocorrect="off" placeholder="What does the character looks like?"></div>
                <div class="help_box" id="pfp_help_box" style="width: calc(328px + 8px);">Include a direct picture link to represent the character. This will be shown in the profile list.</div>
                <div class="input_dot" id="pfp_${p_number}_input_dot" style="display: none;">
                    <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div>
                </div>
                <div class="input_dot" id="pfp_${p_number}_input_dot" style="display: none;">
                    <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                </div>
                <div class="input_dot" id="pfp_${p_number}_input_dot" style="display: none; top: 54px;">
                    <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                </div>
                <div class="input_dot" id="pfp_${p_number}_input_dot" style="display: none; top: 54px;">
                    <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                    <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                </div>
            </div>
        </div>
    </div>`;

        const inner_page_loader = document.getElementById(`page_${data.page_number}`);
        const numRows = 21;
        const numSlots = 3;

        // Loop through rows
        for (let row = 1; row <= numRows; row++) {
            // Create a div for the row
            field_z--;
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            rowDiv.style.zIndex = field_z;

            // Loop through slots in each row
            for (let slot = 1; slot <= numSlots; slot++) {
                const key = `row${row}.slot${slot}.type`;
                const labelkey = `row${row}.slot${slot}.label`;
                const idkey = `row${row}.slot${slot}.id`;
                const placeholderkey = `row${row}.slot${slot}.placeholder`;
                const helpkey = `row${row}.slot${slot}.help`;

                const type = parseInt(getNestedValue(data, key));
                const label = getNestedValue(data, labelkey);
                const id = getNestedValue(data, idkey);
                const placeholder = getNestedValue(data, placeholderkey);
                const help = getNestedValue(data, helpkey);

                // Calculate positionX based on slot index
                const positionX = (slot - 1) * 376;

                // Create slot div based on type
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('group');
                slotDiv.id = `${id}_group`;
                slotDiv.style.left = `${positionX}px`;

                switch (type) {
                    case 0:
                        slotDiv.innerHTML = ``;
                        break;
                    case 1:
                        slotDiv.innerHTML = `<!--————————————————————————————————————————————————————————-->
                        <!--———————————————————[ ${id} ]———————————————————-->
                        <!--————————————————————————————————————————————————————————-->
                            <div class="label_tab" id="${id}_label_tab">${label}
                                <div class="status_box" id="${id}_status" style="display: none;">STATUS_TEXT
                                    <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                                </div>
                            </div>
                            <div><input type="text" class="input_1" id="${id}" autocomplete="off" autocorrect="off" placeholder="${placeholder}"></div>
                            <div class="help_box" id="${id}_help_box" style="width: calc(328px + 8px);">${help}</div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div>
                            </div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                            </div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                            </div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                            </div>`;
                        break;
                    case 2:
                        slotDiv.innerHTML = `<!--————————————————————————————————————————————————————————-->
                        <!--———————————————————[ ${id} ]———————————————————-->
                        <!--————————————————————————————————————————————————————————-->
                            <div class="label_tab" id="${id}_label_tab">${label}
                                <div class="status_box" id="${id}_status" style="display: none;">STATUS_TEXT
                                    <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                                </div>
                            </div>
                            <div><input type="text" class="input_1" id="${id}" style="width: 704px;" autocomplete="off" autocorrect="off" placeholder="${placeholder}"></div>
                            <div class="help_box" id="${id}_help_box" style="width: calc(704px + 8px);">${help}</div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div>
                            </div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                            </div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                            </div>
                            <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                            </div>`;
                            break;
                        case 3:
                            slotDiv.innerHTML = `<!--————————————————————————————————————————————————————————-->
                            <!--———————————————————[ ${id} ]———————————————————-->
                            <!--————————————————————————————————————————————————————————-->
                                <div class="label_tab" id="${id}_label_tab">${label}
                                    <div class="status_box" id="${id}_status" style="display: none;">STATUS_TEXT
                                        <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                                    </div>
                                </div>
                                <div><input type="text" class="input_1" id="${id}" style="width: 1080px;" autocomplete="off" autocorrect="off" placeholder="${placeholder}"></div>
                                <div class="help_box" id="${id}_help_box" style="width: calc(1080px + 8px);">${help}</div>
                                <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                    <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                    <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div>
                                </div>
                                <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                    <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                    <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                                </div>
                                <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                    <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                    <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                                </div>
                                <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                    <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                    <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                                </div>`;
                                break;
                            case 4:
                                slotDiv.innerHTML = `<!--————————————————————————————————————————————————————————-->
                                <!--———————————————————[ ${id} ]———————————————————-->
                                <!--————————————————————————————————————————————————————————-->
                                    <div class="label_tab" id="${id}_label_tab">${label}
                                        <div class="status_box" id="${id}_status" style="display: none;">STATUS_TEXT
                                            <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                                        </div>
                                    </div>
                                    <div><textarea type="text" id="${id}" style="width: 1080px; height: 300px" autocomplete="off" autocorrect="off" placeholder="${placeholder}"></textarea></div>
                                    <div class="help_box" id="${id}_help_box" style="width: calc(1080px + 8px); top: 303px">${help}</div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                        <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div>
                                    </div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                        <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                                    </div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                        <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                                    </div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                        <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                                    </div>`;
                                break;
                            case 5:
                                slotDiv.innerHTML = `<!--————————————————————————————————————————————————————————-->
                                <!--———————————————————[ ${id} ]———————————————————-->
                                <!--————————————————————————————————————————————————————————-->
                                    <div class="label_tab" id="${id}_label_tab">${label}
                                        <div class="status_box" id="${id}_status" style="display: none;">STATUS_TEXT
                                            <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px; font-family: NotoSans-Regular;">STATUS_TEXT_ALT</div>
                                        </div>
                                    </div>
                                    <div><textarea type="text" id="${id}" style="width: 1080px; height: 550px" autocomplete="off" autocorrect="off" placeholder="${placeholder}"></textarea></div>
                                    <div class="help_box" id="${id}_help_box" style="width: calc(1080px + 8px); top: 553px">${help}</div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                        <img src="/media/icons/feather_icons/check.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: -30px;">Verified</div>
                                    </div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none;">
                                        <img src="/media/icons/feather_icons/database.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: -30px; left: -14px;">Generated</div>
                                    </div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                        <img src="/media/icons/feather_icons/lock.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: 42px; left: -6px;">Locked</div>
                                    </div>
                                    <div class="input_dot" id="${id}_input_dot" style="display: none; top: 54px;">
                                        <img src="/media/icons/feather_icons/calendar.svg" style="height: 20px; transform-origin: top left; margin: 4px;">
                                        <div class="label_bottom" style="scale: 1.7; top: 42px; left: -10px;">History</div>
                                    </div>`;
                                    break;            
                                }

                // Append slot div to row div
                rowDiv.appendChild(slotDiv);
            }

            // Append row div to inner page loader
            inner_page_loader.appendChild(rowDiv);
        }
    }

    // Helper function to get nested values from a string key
    function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, cur) => acc[cur], obj);
    }
