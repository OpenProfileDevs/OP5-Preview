// GET APP DATA
(async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/openprofileapp/op5-preview/releases/latest`);
  
      if (response.status === 200) {
        const release = await response.json();
        const changelog = release.body;
        const name = release.name;
        const releaseDate = new Date(release.published_at);
        // Only take the version ID
        const versionString = `${name}`;
        const releaseId = versionString.replace(/ Preview$/, '');
        const releaseLink = `https://github.com/OpenProfileApp/OP5-Preview/releases/tag/${releaseId}`;
  
        // Function to format the date as requested
      function formatDate(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return `today`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `yesterday`;
        } else {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `on ${month}/${day}/${year}`;
        }
    }
  
        const formattedDate = formatDate(releaseDate);
  
        // Replace "*" or "+" or "-" with "*<br>", "+<br>", or "-<br>"
        const formattedChangelog = changelog.replace(/\n/g, '<br>');
  
        // Split the changelog text by "<br>" to process each line
        const changelogLines = formattedChangelog.split('<br>');
  
        // Format the text based on the character following "<br>"
        const formattedHTML = changelogLines.map(line => {
          let color = '#BBBBBB';
          let size = '13px';
          let formatting = '';
          let endformatting = '';
          let lineformatting = '';
          if (line.startsWith('+')) {
            color = '#558423';
            size = '13px';
            formatting = '';
            endformatting = '';
            lineformatting = '';
          } else if (line.startsWith('-')) {
            color = '#d12828';
            size = '13px';
            formatting = '';
            endformatting = '';
            lineformatting = '';
          } else if (line.startsWith('#')) {
            line = line.replace(/^# \s*/, '');
            color = '#5C6AE3';
            size = '18px';
            formatting = '<center>';
            endformatting = '</center>';
            lineformatting = '<hr style="opacity: 0.25;">';
          }
          return `${lineformatting}<span style="color: ${color}; font-size: ${size}">${formatting}${line}${endformatting}</span>${lineformatting}`;
        }).join('<br>');
  
        
        
        // SAVING
const saveButton = document.getElementById('saveButton');

// Add a click event listener to the button
saveButton.addEventListener('click', function () {
    // Prompt user for file name
    const fileName = prompt("Enter the name for the save file:");

    if (fileName) { // Check if user provided a file name
        const groups = document.querySelectorAll('.group');
        let output = '';

        output += '"#": "Import this file over at OpenProfile 5 -> https://preview.openprofile.com",\n\n\n'
        output += `"#APP-VERSION": "${versionString}",\n`
        output += '"#PROFILE-VERSION": "1.0.0",\n\n\n'

        groups.forEach((group, index) => {
            const group_id = group.id.replace('_group', '');
            const label_tab = group.querySelector(`#${group_id}_label_tab`);
            const input_text = document.getElementById(`${group_id}`);

            if (label_tab && input_text) {
                const label_content = label_tab.textContent;
                const input_content = input_text.value.replace(/\n/g, "\\n"); // Replace newlines with '\n'

                if (input_content.trim() !== '') {
                    // Customize the format as needed
                    output += `"${group_id}": "${input_content}"`;
                    
                    // Add a comma and newline only if it's not the last group
                    if (index !== groups.length - 1) {
                        output += ',\n\n';
                    }
                } else {
                    console.log(`Input field for "${label_content}" is blank.`);
                }
            }
        });

        // Remove the final comma if it exists
        output = output.replace(/,\n\n$/, '');

        // Wrap the content in a JSON object if needed
        output = `{\n${output}\n}`;

        // Create a Blob with the custom JSON content
        const blob = new Blob([output], { type: 'application/json' });

        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.op5`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});



// LOADING
const fileInput = document.getElementById('loadFileInput');

// Add a change event listener to the file input
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const jsonData = JSON.parse(e.target.result, (key, value) => {
                // Replace occurrences of "\\n" with "\n"
                if (typeof value === 'string') {
                    return value.replace(/\\n/g, '\n');
                }
                return value;
            });

            Object.keys(jsonData).forEach(key => {
                const element = document.getElementById(key);

                if (element) {
                    // Check if the element is an input field
                    if (element.tagName === 'INPUT') {
                        element.value = jsonData[key];
                    } else {
                        // If it's not an input field, update the text content
                        element.textContent = jsonData[key];
                    }
                }
            });
        };

        reader.readAsText(file);
    }
});


      } else {
        console.error('Error fetching latest release:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching latest release:', error);
    }
  })();