function createLoginRegisterPopup() {
    const popupLoginRegisterManager = document.getElementById("login_register_account_manager");

    // HTML code for the login/register popup
    const popupHTML = `
        <div class="popup_background" id="register_popup" style="display: block; z-index: 900000;">
            <div class="popup_prompt">
                <img class="icon" id="register_close" src="/media/icons/feather_icons/x.svg" style="position: absolute; cursor: pointer; top: 0px; right: 0px; scale: 0.30; margin: 10px; transform-origin: top right; z-index: 3000;">
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
                <button onclick="registerUser()" style="top: 180px; left: 0px; z-index: 4999;">Register</button>
                <div class="information_text" id="information_text_register" style="top: 77%; font-size: 10px; z-index: 4999;">Already have an account? <a href="#" onclick="switchToLogin()">Login</a></div>
            </div>
        </div>
    `;

    // Set the HTML code to the popupLoginRegisterManager element
    popupLoginRegisterManager.innerHTML = popupHTML;
    load_local_scheme()

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

    // Hash the password locally
    const hashedPassword = sha256(registerPasswordInput);

    // Check if the email already exists
    fetch(`/check-email?email=${encodeURIComponent(registerEmailInput)}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                // Email already exists, display an error message
                alert('Email already exists. Please use a different email.');
            } else {
                // Email doesn't exist, proceed with registration
                fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username: usernameInput, email: registerEmailInput, password: hashedPassword })
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
        })
        .catch(error => {
            console.error('Error checking email:', error);
        });
}

// Function to hash a string using SHA-256 with CryptoJS
function sha256(input) {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

// Function to log in a user
async function loginUser() {
    try {
        // Get email and password from input fields
        const loginEmailInput = document.getElementById('login_email_input').value.trim();
        const loginPasswordInput = document.getElementById('login_password_input').value.trim();
        const label_top_account = document.getElementById('label_top_account');

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
            window.location.href = `/author/${storedUsername}`; // Redirect to the dashboard page

            // Set the user label
            label_top_account.textContent = storedUsername;

            // Access and use other user data if needed
            const userId = responseData.user.id;
            const userName = responseData.user.name;
            // You can perform further actions with the user data here
        } else {
            // If login fails, display an error message
            alert('Login failed. Please check your email and password.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle any errors that occur during the login process
        alert('An error occurred during login. Please try again later.');
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
        document.getElementById('register_username_input').style.display = 'block';
        document.getElementById('register_username_label_tab').style.display = 'block';
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
        document.getElementById('register_username_input').style.display = 'none';
        document.getElementById('register_username_label_tab').style.display = 'none';
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
