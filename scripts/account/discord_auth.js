document.getElementById('login_discord').addEventListener('click', () => {
    const fullUrl = `${window.location.origin}/discord-auth`;
    window.location.href = fullUrl;
  });

  // Function to log in a user
  async function discordloginUser() {
    try {
      const response = await fetch('/session-discord-user');
      const userData = await response.json();

      if (!userData) {
        throw new Error('User data not available');
      }

      const data = {
        email: userData.email, // Adjust this according to your fetched user data structure
      };

      const loginResponse = await fetch('/login-discord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await loginResponse.json();

      if (loginResponse.ok && responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('username', responseData.username);
        const storedUsername = localStorage.getItem('username');

        window.location.href = `/author/${storedUsername}`;
        // Update your UI or perform other actions as needed
      } else {
        if (loginResponse.status === 402 && responseData.message === 'You have been banned. If you believe this was a mistake, email "support@openprofile.app".') {
          alert('You have been banned. If you believe this was a mistake, email "support@openprofile.app".');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Check if redirected from Discord and trigger the login function
  window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isRedirectedFromDiscord = urlParams.has('code');

    if (isRedirectedFromDiscord) {
      discordloginUser();
    }
  });


  async function discordloginUser() {
    try {
      // Extract token and username from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const username = urlParams.get('username');

      if (token && username) {
        // Store token and username in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        // Redirect to the user's author page
        window.location.href = `/author/${username}`;
        checkLoggedIn()
      } else {
        console.error('Token or username not found in URL parameters');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  // Trigger the login function on page load
  window.addEventListener('load', () => {
    discordloginUser();
  });