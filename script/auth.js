// ==========================================
// KULTURA AUTHENTICATION SYSTEM (LOCAL BACKEND)
// ==========================================

// 1. DATABASE MANAGEMENT (localStorage)
const DB_KEY = 'kulturaDB';

function getDB() {
    const db = localStorage.getItem(DB_KEY);
    if (!db) {
        // Init Check
        const initDB = { users: [] };
        localStorage.setItem(DB_KEY, JSON.stringify(initDB));
        return initDB;
    }
    return JSON.parse(db);
}

function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// 2. HELPER: TOAST (Reused from script.js logic if available, else simple alert fallback)
function showAuthToast(message, type = 'success') {
    // Create toast dynamically since we might not have main script.js loaded here yet
    let toast = document.getElementById('auth-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'auth-toast';
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(20,20,20,0.9); color: white; padding: 15px 30px;
            border-radius: 50px; z-index: 3000; display: none; font-family: 'Poppins', sans-serif;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.display = 'block';
    if (type === 'error') toast.style.border = '1px solid #e74c3c';
    else toast.style.border = 'none';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// 3. AUTH CONTROLLER
const Auth = {
    signUp: function (username, email, password) {
        const db = getDB();
        // Check if email exists
        const exists = db.users.find(u => u.email === email);
        if (exists) {
            showAuthToast('Email is already registered!', 'error');
            return false;
        }

        // Save User
        const newUser = {
            username: username,
            email: email.toLowerCase(),
            password: btoa(password), // Simple encoding (Not real encryption)
            provider: 'local',
            joinedAt: new Date().toISOString()
        };
        db.users.push(newUser);
        saveDB(db);

        showAuthToast('Account created successfully! Please log in.');
        switchAuth('login'); // Switch to login view
        // Auto-fill login email (optional)
        document.getElementById('login-username').value = username;
        return true;
    },

    login: function (usernameInput, password) {
        const db = getDB();
        const inputLower = usernameInput.toLowerCase();

        // Allow login by Username OR Email
        const user = db.users.find(u =>
            (u.username === usernameInput || u.email === inputLower) &&
            u.password === btoa(password)
        );

        if (user) {
            // Success
            const sessionData = {
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('kulturaUser', JSON.stringify(sessionData));
            showAuthToast('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1000);
            return true;
        } else {
            showAuthToast('Invalid username or password.', 'error');
            return false;
        }
    },

    socialLogin: function (provider) {
        // Simulate Network Delay
        const btn = document.querySelector(`.social-btn.${provider}`);
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<div class="spinner"></div>'; // You might need CSS for this or just "..."

        setTimeout(() => {
            // Mock Data
            const mockUser = {
                username: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                email: `user@${provider}.com`,
                provider: provider
            };

            // Save Session
            localStorage.setItem('kulturaUser', JSON.stringify(mockUser));

            // Allow DB save too for persistence if needed, but for social we just session
            showAuthToast(`Connected with ${provider}! Redirecting...`);
            window.location.href = 'main.html';
        }, 1500);
    },

    forgotPassword: function (email, newPass) {
        const db = getDB();
        const userIndex = db.users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            showAuthToast('Email not found.', 'error');
            return false;
        }

        // Update Password
        db.users[userIndex].password = btoa(newPass);
        saveDB(db);
        showAuthToast('Password reset successfully! You can now log in.');
        closeForgotModal();
        return true;
    }
};

// 4. EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userIn = document.getElementById('login-username').value;
            const passIn = document.getElementById('login-password').value;
            Auth.login(userIn, passIn);
        });
    }

    // Signup Form Submit (Need to ensure ID is correct in HTML)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const signupBtn = signupForm.querySelector('button'); // Since it was onclick before
        // Change button to type submit or handle click
        if (signupBtn) {
            // Remove old onclick
            signupBtn.removeAttribute('onclick');
            signupBtn.onclick = function (e) {
                e.preventDefault();
                const user = document.getElementById('signup-username').value;
                const email = document.getElementById('signup-email').value;
                const pass = document.getElementById('signup-pass').value;

                if (!user || !email || !pass) {
                    showAuthToast("Please fill all fields", "error");
                    return;
                }
                Auth.signUp(user, email, pass);
            };
        }
    }

    // Social Buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('google')) Auth.socialLogin('google');
            if (btn.classList.contains('facebook')) Auth.socialLogin('facebook');
            if (btn.classList.contains('twitter')) Auth.socialLogin('twitter');
        });
    });

    // Forgot Password Link Logic
    const forgotLink = document.querySelector('.forgot-pass');
    if (forgotLink) {
        forgotLink.removeAttribute('onclick');
        forgotLink.addEventListener('click', openForgotModal);
    }
});

// UI HELPERS
function switchAuth(type) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const socialSection = document.querySelector('.social-login-section');

    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        socialSection.style.display = 'block';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        socialSection.style.display = 'none';
    }
}

// --- FORGOT PASSWORD MODAL LOGIC ---
function openForgotModal() {
    let modal = document.getElementById('forgot-modal');
    if (!modal) {
        // Create if doesn't exist (Lazy Load HTML)
        createForgotModal();
        modal = document.getElementById('forgot-modal');
    }
    modal.style.display = 'flex';
}

function closeForgotModal() {
    const modal = document.getElementById('forgot-modal');
    if (modal) modal.style.display = 'none';
    // Reset steps
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('fp-email').value = '';
    document.getElementById('fp-new-pass').value = '';
}

function createForgotModal() {
    const modalHTML = `
    <div id="forgot-modal" class="auth-modal-overlay">
        <div class="auth-modal-content">
            <span class="close-modal" onclick="closeForgotModal()">&times;</span>
            <h3>Reset Password</h3>
            
            <!-- Step 1: Email -->
            <div id="step-1">
                <p>Enter your email address to receive a reset code.</p>
                <input type="email" id="fp-email" class="auth-input" placeholder="example@email.com">
                <button class="auth-btn" onclick="sendResetCode()">Send Code</button>
            </div>

            <!-- Step 2: Code & New Pass -->
            <div id="step-2" style="display:none;">
                <p>Code sent! (Simulated: Use <b>1234</b>)</p>
                <input type="text" id="fp-code" class="auth-input" placeholder="Enter Code">
                <input type="password" id="fp-new-pass" class="auth-input" placeholder="New Password">
                <button class="auth-btn" onclick="verifyAndReset()">Reset Password</button>
            </div>
        </div>
    </div>
    <style>
        .auth-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 2000;
            display: none; justify-content: center; align-items: center;
        }
        .auth-modal-content {
            background: white; padding: 30px; border-radius: 10px;
            width: 90%; max-width: 400px; position: relative; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .close-modal {
            position: absolute; right: 15px; top: 10px; font-size: 24px; cursor: pointer;
        }
        .auth-input {
            width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd;
            border-radius: 5px; outline: none;
        }
        .auth-btn {
            width: 100%; padding: 10px; background: #111; color: white;
            border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;
        }
        .auth-btn:hover { background: #333; }
    </style>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);
}

function sendResetCode() {
    const email = document.getElementById('fp-email').value;
    if (!email) { showAuthToast('Please enter email', 'error'); return; }

    // Simulate API Call
    showAuthToast('Sending code...');
    setTimeout(() => {
        showAuthToast('Code sent to ' + email);
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
    }, 1500);
}

function verifyAndReset() {
    const code = document.getElementById('fp-code').value;
    const newPass = document.getElementById('fp-new-pass').value;
    const email = document.getElementById('fp-email').value;

    if (code !== '1234') {
        showAuthToast('Invalid code! (Hint: 1234)', 'error');
        return;
    }
    if (!newPass) {
        showAuthToast('Enter new password', 'error');
        return;
    }

    Auth.forgotPassword(email, newPass);
}
