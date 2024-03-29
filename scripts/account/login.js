function createLoginRegisterPopup() {
    const popupLoginRegisterManager = document.getElementById("login_register_account_manager");

    // HTML code for the login/register popup
    const popupHTML = `
        <div class="popup_background" id="register_popup" style="display: block; z-index: 900000;">
            <div class="popup_prompt">
                <img class="icon" id="register_close" src="media/icons/feather_icons/x.svg" style="position: absolute; cursor: pointer; top: 0px; right: 0px; scale: 0.30; margin: 10px; transform-origin: top right; z-index: 3000;">
                <div class="row" style="top: 20%; left: calc(50% - 85px); transform: translate(-50%);">
                    <div class="group" id="register_username_group" style="top: 0px; left: 0px; z-index: 17;">
                        <div class="label_tab_popup_prompt" id="register_username_label_tab">Username</div>
                        <div><input type="text" class="input_text_popup_prompt" id="register_username_input" style="width: 175px; text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your username"></div>
                    </div>
                </div>
                <div class="row" style="top: 30%; left: calc(50% - 85px); transform: translate(-50%);">
                    <div class="group" id="register_email_group" style="top: 0px; left: 0px; z-index: 17;">
                        <div class="label_tab_popup_prompt" id="register_email_label_tab">Email</div>
                        <div><input type="text" class="input_text_popup_prompt" id="register_email_input" style="width: 175px; text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your email"></div>
                    </div>
                </div>
                <div class="row" style="top: 40%; left: calc(50% - 85px); transform: translate(-50%);">
                    <div class="group" id="register_password_group" style="top: 0px; left: 0px; z-index: 17;">
                        <div class="label_tab_popup_prompt" id="register_password_label_tab">Password</div>
                        <div><input type="password" class="input_text_popup_prompt" id="register_password_input" style="width: 175px; text-align: center;" autocomplete="off" autocorrect="off" placeholder="Enter your password"></div>
                    </div>
                </div>
                <button onclick="registerUser()" style="top: 50%; left: 0px; z-index: 4999;">Register</button>
                <div class="information_text" id="information_text_register" style="top: 59%; font-size: 9px; z-index: 4999;">Already have an account? <a href="#" onclick="switchToLogin()">Login</a></div>
            </div>
        </div>
    `;

    // Set the HTML code to the popupLoginRegisterManager element
    popupLoginRegisterManager.innerHTML = popupHTML;

    // Define the variables needed to make the code work
    const registerClose = document.getElementById("register_close");

    // Close the popup when the close button is clicked
    registerClose.addEventListener("click", function() {
        const registerPopup = document.getElementById("register_popup");
        registerPopup.style.display = "none";
    });
}

// Function to handle the login/register button click event
document.getElementById("login_register_account").addEventListener("click", function() {
    createLoginRegisterPopup();
});

// Function to register a user
function registerUser() {
    const usernameInput = document.getElementById('register_username_input').value.trim();
    const registerEmailInput = document.getElementById('register_email_input').value.trim();
    const registerPasswordInput = document.getElementById('register_password_input').value.trim();
    const registrationButton = document.querySelector('.popup_prompt button');

    if (!registerEmailInput || !registerPasswordInput) {
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: usernameInput, email: registerEmailInput, password: registerPasswordInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            registrationButton.textContent = 'Success'; // Change button text to "Success"
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to log in a user
async function loginUser() {
    try {
        // Get email and password from input fields
        const loginEmailInput = document.getElementById('login_email_input').value.trim();
        const loginPasswordInput = document.getElementById('login_password_input').value.trim();

        // Fetch user data from the /users endpoint
        const response = await fetch(`/users/private/?email=${encodeURIComponent(loginEmailInput)}`);
        const userData = await response.json();

        if (!userData || !userData.email) {
            throw new Error('Email does not exist');
        }

        // Check if the provided password matches the stored password
        const passwordMatch = verifyPassword(loginPasswordInput, userData.password);

        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }

        // Generate a JWT token
        const token = userData.id;

        console.log('Login successful', token )
        account_name = userData.username
        const usertitle = document.getElementById('openprofile_title_text');
        usertitle.textContent = account_name;

        return { message: 'Login successful', token };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to verify if the provided password matches the stored password
function verifyPassword(enteredPassword, storedPassword) {
    // Compare the entered password with the stored password
    return enteredPassword === storedPassword;
}

// Function to generate an authentication token
function generateAuthToken(userId) {
    // Generate a token using userId or any other information you want to include
    return `${userId}`;
}

// Function to switch to the login form
function switchToLogin() {
    const loginButton = document.querySelector('.popup_prompt button');
    const loginButtonText = loginButton.textContent;
    const informationText = document.getElementById('information_text_register');

    if (loginButtonText === 'Login') {
        // Change button text to "Register"
        loginButton.textContent = 'Register';
        // Change information text
        informationText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchToRegister()">Register</a>';
        // Clear input fields
        document.getElementById('login_email_input').value = '';
        document.getElementById('login_password_input').value = '';
        // Remove login attributes
        document.getElementById('login_email_input').removeAttribute('required');
        document.getElementById('login_password_input').removeAttribute('required');
        // Add registration attributes
        document.getElementById('login_email_input').setAttribute('id', 'register_email_input');
        document.getElementById('login_password_input').setAttribute('id', 'register_password_input');
        document.getElementById('register_email_input').setAttribute('required', 'required');
        document.getElementById('register_password_input').setAttribute('required', 'required');
        // Update placeholder text
        document.getElementById('register_email_input').setAttribute('placeholder', 'Enter your email');
        document.getElementById('register_password_input').setAttribute('placeholder', 'Enter your password');
        // Remove onclick event from login button
        loginButton.removeAttribute('onclick');
        // Add onclick event to register button
        loginButton.setAttribute('onclick', 'registerUser()');
    } else {
        // Change button text to "Login"
        loginButton.textContent = 'Login';
        // Change information text
        informationText.innerHTML = 'Already have an account? <a href="#" onclick="switchToLogin()">Login</a>';
        // Clear input fields
        document.getElementById('register_email_input').value = '';
        document.getElementById('register_password_input').value = '';
        // Remove registration attributes
        document.getElementById('register_email_input').removeAttribute('required');
        document.getElementById('register_password_input').removeAttribute('required');
        // Add login attributes
        document.getElementById('register_email_input').setAttribute('id', 'login_email_input');
        document.getElementById('register_password_input').setAttribute('id', 'login_password_input');
        document.getElementById('login_email_input').setAttribute('required', 'required');
        document.getElementById('login_password_input').setAttribute('required', 'required');
        // Update placeholder text
        document.getElementById('login_email_input').setAttribute('placeholder', 'Enter your email');
        document.getElementById('login_password_input').setAttribute('placeholder', 'Enter your password');
        // Remove onclick event from register button
        loginButton.removeAttribute('onclick');
        // Add onclick event to login button
        loginButton.setAttribute('onclick', 'loginUser()');
    }
}
