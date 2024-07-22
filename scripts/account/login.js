var isButtonClickable = true;

// Function to handle the login/register button click event
document.getElementById("login_register_account").addEventListener("click", function() {
    function checkLoggedIn() {
        fetch('/check-login')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to check login status');
                }
                return response.json();
            })
            .then(data => {
                if (data.loggedIn) {
                    const userData = data.userData;
                    if (userData) {
                        console.log('User Data:', userData);
                    }
                    logout();
                } else {
                    switchToLogin();
                    load_local_scheme();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    checkLoggedIn();
});

// Utility function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a specific cookie by name
function getCookie(name) {
    let cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

  async function autoLogin() {
    try {
        // Get a specific cookie by name
        const token = getCookie('token');

        if (!token) {
        console.log('No token found in cookies');
        } else {
        console.log('Token found:', token);
        // Use the token as needed
        }

      // Send request to /login-auto endpoint with token in the request body
      const loginResponse = await fetch('/login-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }) // Pass token in the request body
      });
  
      if (loginResponse.ok) {
        const responseData = await loginResponse.json();
        console.log(`Auto-logging in user with username: ${responseData.username}`);
        // Optionally, you can handle further actions after successful login
      } else {
        console.log('Auto-login failed:', loginResponse.statusText);
        // Handle failed login attempt
      }
    } catch (error) {
      console.error('Auto-login failed:', error);
      // Handle error
    }
  }
  
  

function registerUser() {
    if (!isButtonClickable) {
        alert("Please wait 5 seconds before submitting again.");
        return;
    }
    setTimeout(() => {
        isButtonClickable = true;
    }, 5000);
    isButtonClickable = false;

    const usernameInput = document.getElementById('register_username_input').value.trim();
    const registerEmailInput = document.getElementById('register_email_input').value.trim();
    const registerPasswordInput = document.getElementById('register_password_input').value.trim();
    const confirmregisterPasswordInput = document.getElementById('confirm_register_password_input').value.trim();
    const registrationButton = document.querySelector('.popup_prompt button');

    if (!usernameInput || !registerEmailInput || !registerPasswordInput || !confirmregisterPasswordInput) {
        alert(`Please fill in all fields.`);
        return;
    }

    if (registerPasswordInput !== confirmregisterPasswordInput) {
        alert(`Password doesn't match.`);
        return;
    }

    // Regular expression to match only lowercase letters, numbers, and underscores with a max of 16 characters
    const usernameRegex = /^[a-z0-9_]{3,16}$/;
    if (!usernameRegex.test(usernameInput)) {
        alert('Username can only contain lowercase letters, numbers, and underscores (_) and must be between 3 and 16 characters long. Please choose a valid username.');
        return;
    }
        
    // Function to extract the domain from an email address
    function extractDomain(registerEmailInput) {
        return registerEmailInput.split('@')[1];
    }

    // Define the allowed email domains
    const allowedDomains = ['openprofile.app', 'avatarkage.com', 'gmail.com', 'outlook.com', 'protonmail.com', 'protonmail.me']; // Add your allowed domains here

    // Check if the email domain is allowed
    const emailDomain = extractDomain(registerEmailInput);
    if (!allowedDomains.includes(emailDomain)) {
        alert(`Only "gmail.com", "outlook.com", and "protonmail.com/me" can be used to register.`);
        return res.status(400).json({ success: false, message: 'Email domain not allowed' });
    }
    
    // Call validateUsernameAndRegister to check if the username is valid and proceed with registration
    validateUsernameAndRegister(usernameInput, registerEmailInput, registerPasswordInput, registrationButton);
}

// Function to validate the username, check if it exists in the blacklist, and proceed with registration if valid
function validateUsernameAndRegister(username, email, password, button) {
    // Fetch the blacklist of words and check if the username and email already exist
    Promise.all([
        fetch('/blacklist.txt').then(response => response.ok ? response.text() : Promise.reject('Failed to fetch blacklist')),
        fetch(`/check-username?username=${encodeURIComponent(username)}`).then(response => response.ok ? response.json() : Promise.reject('Failed to check username')),
        fetch(`/check-email?email=${encodeURIComponent(email)}`).then(response => response.ok ? response.json() : Promise.reject('Failed to check email'))
    ])
    .then(([blacklist, usernameCheck, emailCheck]) => {
        const blacklistArray = blacklist.split(',').map(word => word.trim().toLowerCase());
        const lowercaseUsername = username.toLowerCase();
        const containsBlacklistedWord = blacklistArray.some(word => lowercaseUsername.includes(word));


        if (usernameCheck.exists) {
            alert('Username already exists. Please choose a different username.');
            return;
        }

        if (emailCheck.exists) {
            alert('Email already exists. Please use a different email.');
            return;
        }

        // If all checks pass, proceed with registration
        const hashedPassword = sha256(password);
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, email: email, password: hashedPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Registration successful, change button text to "Success"
                button.textContent = 'Success';
                switchToLogin();
                alert('Please check your email for an account activation link.');
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again later.');
    });
}

// Function to hash a string using SHA-256 with CryptoJS
function sha256(input) {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

// Function to log in a user
async function loginUser() {
    if (!isButtonClickable) {
        alert("Please wait 5 seconds before submitting again.");
        return;
    }
    setTimeout(() => {
        isButtonClickable = true;
    }, 5000);
    isButtonClickable = false;
    try {
        // Get email and password from input fields
        const loginEmailInput = document.getElementById('login_email_input').value.trim();
        const loginPasswordInput = document.getElementById('login_password_input').value.trim();
        const label_top_account = document.getElementById('label_top_account');

        if (!loginEmailInput || !loginPasswordInput) {
            alert(`Please fill in all fields.`);
            return;
        }

        // Prepare the data to send in the POST request
        const data = {
            email: loginEmailInput,
            password: loginPasswordInput
        };

        // Send a POST request to the /login endpoint
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Parse the JSON response
        const responseData = await response.json();

        // Check if the response contains a token
        if (response.ok && responseData.token) {
            // If login is successful, store the token and username in localStorage or sessionStorage
            if (response.ok && responseData.token) {
                label_top_account.textContent = `Logged in with @${responseData.username}`;
                closeloginpopup();
            }

            // Set the user label
            label_top_account.textContent = storedUsername;

            // Access and use other user data if needed
            const userId = responseData.user.id;
            const userName = responseData.user.name;
            // You can perform further actions with the user data here
        } else {
            // If login fails, display an error message
            if (response.status === 401) {
                alert('If you recently created an account, please verify your email within 24 hours.');
            } else if (response.status === 402) {
                alert('You have been banned. If you believe this was a mistake, email "support@openprofile.app"');
            } else {
                alert('There was an error logging you in.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle any errors that occur during the login process
        //alert('You are logged in!');
    }
}

// Function to verify if the provided hashed password matches the stored hashed password
function verifyPassword(enteredHashedPassword, storedHashedPassword) {
    // Compare the entered hashed password with the stored hashed password
    return enteredHashedPassword === storedHashedPassword;
}

// Function to generate an authentication token
function generateAuthToken(userId) {
    // Generate a token using userId or any other information you want to include
    return `${userId}`;
}

function switchToLogin() {
    const popupLoginRegisterManager = document.getElementById("login_register_account_manager");

    const loginHTML = `
    <div class="popup_background" id="closeloginpopup" style="display: block; z-index: 900000;">
        <div class="popup_prompt" style="height: 300px; top: 540px;">
            <img class="icon" onclick="closeloginpopup()" id="login_close" src="/media/icons/feather_icons/x.svg" style="position: absolute; cursor: pointer; top: 0px; right: 0px; scale: 0.30; margin: 10px; transform-origin: top right; z-index: 3000;">
            <div class="group" id="login_email_group" style="top: 32px; left: 38px; z-index: 17;">
                <div class="label_tab" id="login_email_label_tab">Email</div>
                <div><input type="text" class="input_text_popup_prompt" id="login_email_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your email"></div>
            </div>
            <div class="group" id="login_password_group" style="top: 132px; left: 38px; z-index: 17;">
                <div class="label_tab" id="login_password_label_tab">Password</div>
                <div><input type="password" class="input_text_popup_prompt" id="login_password_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your password"></div>
            </div>
            <button onclick="loginUser()" class="top_button" style="padding: 20px; color: #fff; background-color: #ce1616; border: none; border-radius: 32px; cursor: pointer; top: 146px; left: -4px">Login</button>
            <a href="${window.location.origin}/discord-auth"><button class="top_button_1" style="padding: 20px; color: #fff; background-color: #5865f2; border: none; border-radius: 32px; cursor: pointer; top: 146px; left: 4px; text-indent: 28px;">Login with Discord
                <img src="/media/icons/media_icons/discord.svg" style="position: absolute; left: 8px; height: 20px; transform-origin: top left; margin: 6px;">
            </button></a>
            <div class="h-captcha" data-sitekey="a1709015-a704-4a60-b17f-f3383b6e2238"></div>
            <script src="https://hcaptcha.com/1/api.js" async defer></script>
            <div class="information_text" id="information_text_login" style="top: 68%; font-size: 10px; z-index: 4999; cursor: pointer; border-radius: 100px" onclick="switchToRegister()">Don't have an account? Click to register.</div>
        </div>
    </div>
    `;
    popupLoginRegisterManager.innerHTML = loginHTML;
    load_local_scheme()
}

function switchToRegister() {
    const popupLoginRegisterManager = document.getElementById("login_register_account_manager");

    const registerHTML = `
    <div class="popup_background" id="closeloginpopup" style="display: block; z-index: 900000;">
        <div class="popup_prompt" style="height: 480px;">
            <img class="icon" id="register_close" onclick="closeloginpopup()" src="/media/icons/feather_icons/x.svg" style="position: absolute; cursor: pointer; top: 0px; right: 0px; scale: 0.30; margin: 10px; transform-origin: top right; z-index: 3000;">
            <div class="group" id="register_username_group" style="top: 25px; left: 38px; z-index: 17;">
                <div class="label_tab" id="register_username_label_tab">Username</div>
                <div><input type="text" class="input_text_popup_prompt" id="register_username_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your username"></div>
            </div>
            <div class="group" id="register_email_group" style="top: 125px; left: 38px; z-index: 17;">
                <div class="label_tab" id="register_email_label_tab">Email</div>
                <div><input type="text" class="input_text_popup_prompt" id="register_email_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your email"></div>
            </div>
            <div class="group" id="register_password_group" style="top: 225px; left: 38px; z-index: 17;">
                <div class="label_tab" id="register_password_label_tab">Password</div>
                <div><input type="password" class="input_text_popup_prompt" id="register_password_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your password"></div>
            </div>
            <div class="group" id="confirm_register_password_group" style="top: 325px; left: 38px; z-index: 17;">
                <div class="label_tab" id="confirm_register_password_label_tab">Confirm Password</div>
                <div><input type="password" class="input_text_popup_prompt" id="confirm_register_password_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your password"></div>
            </div>
            <button onclick="registerUser()" class="top_button" style="padding: 20px; color: #fff; background-color: #ce1616; border: none; border-radius: 32px; cursor: pointer; top: 240px; left: -4px">Register</button>
            <a href="${window.location.origin}/discord-auth"><button class="top_button_1" style="padding: 20px; color: #fff; background-color: #5865f2; border: none; border-radius: 32px; cursor: pointer; top: 240px; left: 4px; text-indent: 28px;">Register with Discord
                <img src="/media/icons/media_icons/discord.svg" style="position: absolute; left: 8px; height: 20px; transform-origin: top left; margin: 6px;">
            </button></a>
            <div class="h-captcha" data-sitekey="a1709015-a704-4a60-b17f-f3383b6e2238"></div>
            <script src="https://hcaptcha.com/1/api.js" async defer></script>
            <div class="information_text" id="information_text_register" style="top: 81%; font-size: 10px; z-index: 4999; cursor: pointer; border-radius: 100px" onclick="switchToLogin()">Already have an account? Click to login.</div>
        </div>
    </div>
    `;
    popupLoginRegisterManager.innerHTML = registerHTML;
    load_local_scheme()
}
function closeloginpopup() {
    const closeloginpopup = document.getElementById('closeloginpopup')
    closeloginpopup.style.display = "none";
    checkLoggedIn()
}

document.addEventListener("DOMContentLoaded", () => {
    autoLogin();
});

async function logout() {
    try {
        // Retrieve the token from cookies
        const token = getCookie('token');
        if (!token) {
            alert('No token found in cookies.');
            return;
        }

        // Send a POST request to the /logout endpoint with the token as a URL parameter
        const response = await fetch(`/logout/${token}`, {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent with the request
        });

        if (response.ok) {
            const data = await response.json();
            //alert(data.message); // Display success message
            window.location.href = '/'; // Redirect to login page or home
        } else {
            const errorData = await response.json();
            alert(`Logout failed: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred while logging out.');
    }
}

// Example implementation of getCookie function
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
