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
        let color = '#ffffff';
        let size = '20px';
        let font = 'NotoSans-Regular'
        let formatting = '';
        let endformatting = '';
        let lineformatting = '';
        if (line.startsWith('+')) {
          color = '#ffffff';
          size = '20px';
          font = 'NotoSans-Regular'
          formatting = '';
          endformatting = '';
          lineformatting = '';
        } else if (line.startsWith('-')) {
          color = '#ffffff';
          size = '20px';
          font = 'NotoSans-Regular'
          formatting = '';
          endformatting = '';
          lineformatting = '';
        } else if (line.startsWith('#')) {
          line = line.replace(/^# \s*/, '');
          color = '#ffffff';
          size = '24px';
          font = 'NotoSans-Bold'
          formatting = '<center>';
          endformatting = '</center>';
          lineformatting = '<hr style="opacity: 0.25;">';
        }
        return `${lineformatting}<span style="color: ${color}; font-size: ${size}; font-family: ${font};">${formatting}${line}${endformatting}</span>`;
      }).join('');

      // Display the formatted changelog in a div with the ID "changelog" and version indicator
      const changelogDiv = document.getElementById('changelog_popup_changelog');
      const changelogName = document.getElementById('changelog_popup_version');
      const changelogTopVersion = document.getElementById('openprofile_version_text');
      changelogDiv.innerHTML = `${formattedHTML}`;
      changelogName.innerHTML = `What's new in ${name}</a>?<br><div style="font-size: 16px; font-family: NotoSans-Regular;"> Released ${formattedDate}!</div>`;
      changelogTopVersion.textContent = versionString
      load_dynamic_elements_scheme();
    } else {
      console.error('Error fetching latest release:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching latest release:', error);
  }
})();