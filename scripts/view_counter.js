document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Extract ID or username from the URL
    const url = new URL(window.location.href);
    const segments = url.pathname.split('/');
    const idOrUsername = segments.pop() || segments.pop(); // Handle trailing slash

    console.log('Extracted ID or Username:', idOrUsername);

    // Determine whether to fetch profiles or authors based on the URL path
    let dataType;
    let fetchUrl;
    let id;

    if (url.pathname.startsWith('/profile')) {
      dataType = 'profiles';
      fetchUrl = '/profiles-fetch';
    } else if (url.pathname.startsWith('/author')) {
      dataType = 'authors';
      fetchUrl = '/authors-fetch'; // Adjust the endpoint if needed
    } else {
      throw new Error('Unknown URL path');
    }

    // Fetch the relevant data based on the URL path
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${fetchUrl}`);
    }
    const data = await response.json();

    console.log('Fetched Data:', data);

    // Process the fetched data
    let item;
    if (dataType === 'profiles') {
      item = data.find(profile => profile.url === idOrUsername || profile.url2 === idOrUsername);
    } else if (dataType === 'authors') {
      item = data.find(author => author.username === idOrUsername);
    }

    if (item) {
      id = item.id; // Extract profile or author ID
      console.log('Found ID:', id);

      // Make a GET request to view the specific profile or author
      const viewResponse = await fetch(`/view/${id}`);
      if (!viewResponse.ok) {
        throw new Error(`Failed to fetch view data from /view/${id}`);
      }
      const viewData = await viewResponse.text();

      // Log the response for debugging
      console.log('View Data:', viewData);
    } else {
      console.error(`${dataType.slice(0, -1).toUpperCase()} not found`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});