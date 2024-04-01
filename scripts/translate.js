// Automatically collect the IDs of elements with the "group" class
const groupElements = Array.from(document.getElementsByClassName("group"));
const groupIDs = groupElements.map(element => element.id);

// Rest of the code remains the same
function translateAllGroups(groupIDs, language) {
    // Save the selected language in local storage
    localStorage.setItem('selectedLanguage', language);

    groupIDs.forEach((groupID) => {
        // Define the translation file based on the selected language and group
        const translationFile = `translations/${language}.json`;

        // Fetch and use the translation data
        fetch(translationFile)
            .then((response) => {
                if (!response.ok) {
                    //throw new Error('Failed to load translation file');
                }                
                return response.json();
            })
            .then((translations) => {
                // Adjust groupID to remove "group" and add "ID_"
                const adjustedGroupID = `${groupID.replace('_group', '')}`;

                // Check if translation data exists for the adjusted group ID
                if (translations[adjustedGroupID]) {
                    const translation = translations[adjustedGroupID];

                    // Replace text with translated text for the group
                    document.getElementById(`${adjustedGroupID}_label_tab`).textContent = translation.label_tab;
                    document.getElementById(`${adjustedGroupID}`).placeholder = translation.placeholder;
                    document.getElementById(`${adjustedGroupID}_help_box`).textContent = translation.help_box;
                } else {
                    //console.error(`Translation not found for group: ${adjustedGroupID}`);
                }
            })
            .catch((error) => {
                //console.error(error);
            });
    });
}



function translateSpecificElements(language) {
    const elementsToTranslate = ['loading_message_maintenance', 'loading_message_spooky_1', 'loading_message_spooky_2', 'loading_message_spooky_3', 'loading_message_spooky_4', 'loading_message_spooky_5', 'loading_message_spooky_6',
    'banner_0_text', 'popup_0_text1', 'popup_0_text2', 'popup_0_text3', 'popup_0_text4', 'scheme_name_midnight', 'scheme_name_daylight', 'scheme_name_spooky', 'name_information'];

    const translationFile = `translations/${language}.json`;

    fetch(translationFile)
        .then((response) => {
            if (!response.ok) {
                //throw Error('Failed to load translation file');
            }
            return response.json();
        })
        .then((translations) => {
            elementsToTranslate.forEach((elementID) => {
                const element = document.getElementById(elementID);

                if (element) {
                    if (translations[elementID]) {
                        const translation = translations[elementID];

                        if (translation.value !== undefined) {
                            element.value = translation.value;
                        }
                        element.textContent = translation.text_content;
                    } else {
                        //console.error(`Translation not found for element: ${elementID}`);
                    }
                } else {
                    //console.error(`Element not found: ${elementID}`);
                }
            });
        })
        .catch((error) => {
            //console.error(error);
        });
}



// Function to translate an individual element with options
function translateIndividualElement(elementID, data, language) {
    // Define the translation file based on the selected language and element
    const translationFile = `translations/${language}.json`;

    //console.log("Fetching translation data for:", elementID);

    // Fetch and use the translation data for the individual element
    fetch(translationFile)
        .then((response) => {
            if (!response.ok) {
                //console.error("Failed to load translation file for:", elementID);
                throw new Error('Failed to load translation file');
            }
            return response.json();
        })
        .then((translations) => {
            //console.log("Fetched translation data for:", elementID);
            if (translations[elementID]) {
                //console.log("Found translation for:", elementID);

                const translation = translations[elementID];
                const optionKey = data ? 'option_2' : 'option_1';

                if (translation[optionKey]) {
                    //console.log("Found translation for option:", optionKey);
                    const optionTranslation = translation[optionKey];
                    document.getElementById(elementID).textContent = optionTranslation.text_content;
                } else {
                    //console.error(`Translation not found for option ${optionKey} of element: ${elementID}`);
                }
            } else {
                //console.error(`Translation not found for element: ${elementID}`);
            }
        })
        .catch((error) => {
            //console.error(error);
        });
}

// Helper function to close the context menu
function closeContextMenu() {
    const contextMenu = document.querySelector("#contextMenu");
    contextMenu.style.display = "none";
}

// Get a reference to the language buttons by their IDs
const EnUsButton = document.getElementById('en-us');
const deDeButton = document.getElementById("de-de");
const frChButton = document.getElementById("fr-ch");

// Add event listeners to the language buttons
EnUsButton.addEventListener('click', () => {
    closeContextMenu()
    translateAllGroups(groupIDs, 'en-us');
    translateAllElements('en-us');
});

deDeButton.addEventListener('click', () => {
    closeContextMenu()
    translateAllGroups(groupIDs, 'de-de');
    translateAllElements('de-de');
});

frChButton.addEventListener('click', () => {
    closeContextMenu()
    translateAllGroups(groupIDs, 'fr-ch');
    translateAllElements('fr-ch');
});