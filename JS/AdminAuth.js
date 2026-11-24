
/* =========================================================
   NOAH'S ARK
   ADMINISTRATOR AUTHENTICATION
========================================================= */

const ADMIN_API_URL = 'http://127.0.0.1:5000/api/admin/auth';

const ADMIN_TOKEN_KEY = 'noahsArkAdminToken';
const ADMIN_USER_KEY = 'noahsArkAdminUser';


/* =========================================================
   DOM ELEMENTS
========================================================= */

const loginForm = document.getElementById('adminLoginForm');
const loginMessage = document.getElementById('loginMessage');

const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');

const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('togglePassword');


/* =========================================================
   DISPLAY LOGIN MESSAGE
========================================================= */

function showLoginMessage(message, type = 'error') {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.classList.remove(
        'hidden',
        'bg-red-500/10',
        'border-red-500/30',
        'text-red-300',
        'bg-green-500/10',
        'border-green-500/30',
        'text-green-300'
    );

    if (type === 'success') {

        loginMessage.classList.add(
            'bg-green-500/10',
            'border',
            'border-green-500/30',
            'text-green-300'
        );

    } else {

        loginMessage.classList.add(
            'bg-red-500/10',
            'border',
            'border-red-500/30',
            'text-red-300'
        );

    }

}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

if (togglePasswordButton && passwordInput) {

    togglePasswordButton.addEventListener('click', () => {

        const isPasswordHidden =
            passwordInput.type === 'password';

        passwordInput.type =
            isPasswordHidden ? 'text' : 'password';

        togglePasswordButton.setAttribute(
            'aria-label',
            isPasswordHidden ? 'Hide password' : 'Show password'
        );

        togglePasswordButton.innerHTML = isPasswordHidden
            ? '<i data-lucide="eye-off" class="w-4 h-4"></i>'
            : '<i data-lucide="eye" class="w-4 h-4"></i>';

        if (window.lucide) {
            lucide.createIcons();
        }

    });

}


/* =========================================================
   CHECK EXISTING SESSION
========================================================= */

if (loginForm) {

    const existingToken =
        localStorage.getItem(ADMIN_TOKEN_KEY);

    if (existingToken) {

        window.location.replace('./admin dashboard.html');

    }

}


/* =========================================================
   ADMINISTRATOR LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        if (!loginForm.reportValidity()) {
            return;
        }

        const email = document
            .getElementById('email')
            .value
            .trim();

        const password = passwordInput.value;

        if (!email || !password) {

            showLoginMessage(
                'Please enter your administrator email and password.'
            );

            return;

        }


        /* Disable button while processing */

        loginButton.disabled = true;

        loginButtonText.textContent = 'Authenticating...';


        try {

            const response = await fetch(
                `${ADMIN_API_URL}/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const result = await response.json();


            /* Handle unsuccessful login */

            if (!response.ok || !result.success) {

                showLoginMessage(
                    result.message || 'Login failed. Please try again.'
                );

                return;

            }


            /* Validate authentication response */

            if (!result.token || !result.admin) {

                showLoginMessage(
                    'The server returned an incomplete authentication response.'
                );

                return;

            }


            /* Accept administrator role only */

            if (result.admin.role !== 'admin') {

                showLoginMessage(
                    'Your account does not have administrator dashboard access.'
                );

                return;

            }


            /* Save authenticated session */

            localStorage.setItem(
                ADMIN_TOKEN_KEY,
                result.token
            );

            localStorage.setItem(
                ADMIN_USER_KEY,
                JSON.stringify(result.admin)
            );


            showLoginMessage(
                'Login successful. Opening your dashboard...',
                'success'
            );


            /* Redirect to administrator dashboard */

            setTimeout(() => {

                window.location.replace('./admin dashboard.html');

            }, 700);


        } catch (error) {

            console.error('Administrator login error:', error);

            showLoginMessage(
                'Unable to connect to the server. Please check that the backend is running.'
            );

        } finally {

            loginButton.disabled = false;

            loginButtonText.textContent = 'Sign In Securely';

        }

    });

}
/* =========================================================
   ADMIN DASHBOARD SESSION VERIFICATION
========================================================= */

window.requireAdminSession = async function () {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!token) {
        window.location.replace('./admin-login.html');
        return false;
    }

    try {
        const response = await fetch(
            'http://127.0.0.1:5000/api/admin/dashboard',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_USER_KEY);

            window.location.replace('./admin-login.html');
            return false;
        }

        if (!response.ok) {
            throw new Error('Unable to verify administrator session.');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error('Administrator session verification failed.');
        }

        const admin = JSON.parse(
            localStorage.getItem(ADMIN_USER_KEY) || 'null'
        );

        if (!admin || admin.role !== 'admin') {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_USER_KEY);

            window.location.replace('./admin-login.html');
            return false;
        }

        window.currentAdmin = admin;

        return true;

    } catch (error) {
        console.error('Session verification error:', error);

        alert(
            'Unable to verify your administrator session. ' +
            'Please make sure the backend server is running.'
        );

        return false;
    }
};


/* =========================================================
   ADMIN LOGOUT
========================================================= */

window.adminLogout = function () {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    window.location.replace('./admin-login.html');
};