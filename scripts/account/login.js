var isButtonClickable = true;

// Function to handle the login/register button click event
document.getElementById("login_register_account").addEventListener("click", function() {
    switchToLogin();
    load_local_scheme();
});

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
            localStorage.setItem('token', responseData.token); // You can change this to sessionStorage if you want the token to be session-based
            localStorage.setItem('username', responseData.username);
            const storedUsername = localStorage.getItem('username');

            // Redirect to a new page or perform any other actions for a successful login
            //window.location.href = `/author/${storedUsername}`; // Redirect to the author's page
            closeloginpopup()

            // Set the user label
            label_top_account.textContent = storedUsername;

            // Access and use other user data if needed
            const userId = responseData.user.id;
            const userName = responseData.user.name;
            // You can perform further actions with the user data here
        } else {
            // If login fails, display an error message
            if (response.status === 401 && responseData.message === 'Please verify your email within 24 hours.') {
                alert('Please verify your email within 24 hours.');
            } if (response.status === 402 && responseData.message === 'You have been banned. If you believe this was a mistake, email "support@openprofile.app".') {
                alert('You have been banned. If you believe this was a mistake, email "support@openprofile.app".');
            } else {
                alert('Login failed. Please check your email and password.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle any errors that occur during the login process
        alert('You are logged in!');
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
        <div class="popup_prompt" style="height: 300px;">
            <img class="icon" onclick="closeloginpopup()" id="login_close" src="/media/icons/feather_icons/x.svg" style="position: absolute; cursor: pointer; top: 0px; right: 0px; scale: 0.30; margin: 10px; transform-origin: top right; z-index: 3000;">
            <div class="group" id="login_email_group" style="top: 32px; left: 38px; z-index: 17;">
                <div class="label_tab" id="login_email_label_tab">Email</div>
                <div><input type="text" class="input_text_popup_prompt" id="login_email_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your email"></div>
            </div>
            <div class="group" id="login_password_group" style="top: 132px; left: 38px; z-index: 17;">
                <div class="label_tab" id="login_password_label_tab">Password</div>
                <div><input type="password" class="input_text_popup_prompt" id="login_password_input" style="text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your password"></div>
            </div>
            <button onclick="loginUser()" style="top: 120px; left: 0px; z-index: 4999;">Login</button>
            <a href="${window.location.origin}/discord-auth"><button style="top: 120px; left: 0px; z-index: 4999;">Login with Discord</button></a>
            <div class="h-captcha" data-sitekey="a1709015-a704-4a60-b17f-f3383b6e2238"></div>
            <script src="https://hcaptcha.com/1/api.js" async defer></script>
            <div class="information_text" id="information_text_login" style="top: 68%; font-size: 10px; z-index: 4999; cursor: pointer;" onclick="switchToRegister()">Don't have an account? Click to register.</div>
        </div>
    </div>
    `;
    popupLoginRegisterManager.innerHTML = loginHTML;
}

function switchToRegister() {
    const popupLoginRegisterManager = document.getElementById("login_register_account_manager");

    const registerHTML = `
    <div class="popup_background" id="closeloginpopup" style="display: block; z-index: 900000;">
        <div class="popup_prompt" style="height: 460px;">
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
            <button onclick="registerUser()" style="top: 216px; left: 0px; z-index: 4999;">Register</button>
            <a href="${window.location.origin}/discord-auth"><button style="top: 215px; left: 0px; z-index: 4999;">Register with Discord</button></a>
            <div class="h-captcha" data-sitekey="a1709015-a704-4a60-b17f-f3383b6e2238"></div>
            <script src="https://hcaptcha.com/1/api.js" async defer></script>
            <div class="information_text" id="information_text_register" style="top: 83%; font-size: 10px; z-index: 4999; cursor: pointer;" onclick="switchToLogin()">Already have an account? Click to login.</div>
        </div>
    </div>
    `;

    popupLoginRegisterManager.innerHTML = registerHTML;
}

function closeloginpopup() {
    const closeloginpopup = document.getElementById('closeloginpopup')
    closeloginpopup.style.display = "none";
}