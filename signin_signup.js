// Multiple account storage and login logic

function saveAccount(name, email, password) {
    let users = JSON.parse(localStorage.getItem('sbp_users') || '[]');
    // Prevent duplicate emails
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showNotification("An account with this email already exists.", "error");
        return false;
    }
    users.push({ name, email, password });
    localStorage.setItem('sbp_users', JSON.stringify(users));
    return true;
}

function getAccounts() {
    return JSON.parse(localStorage.getItem('sbp_users') || '[]');
}

function validateCredentials(email, password) {
    let users = getAccounts();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password) || null;
}

function setCurrentUser(user) {
    localStorage.setItem('sbp_user', JSON.stringify(user));
}

function getCurrentUser() {
    const data = localStorage.getItem('sbp_user');
    return data ? JSON.parse(data) : null;
}

function showAccountNavOnAccountPage() {
    const acc = getCurrentUser();
    const navAccount = document.getElementById('navbarUsername');
    if (acc && navAccount) {
        navAccount.textContent = acc.name || 'Account';
    }
}

// === Form handling ===
document.addEventListener("DOMContentLoaded", function () {

    // === Sign Up Form ===
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirmPassword').value;

            if (!name || !email || !password || !confirm) {
                showNotification("Please fill all fields", "error");
                return;
            }
            if (password !== confirm) {
                showNotification("Passwords do not match", "error");
                return;
            }
            // --- PASSWORD VALIDATION START ---
            if (password.length < 8) {
                showNotification("Password must be at least 8 characters.", "error");
                return;
            }
            if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(password)) {
                showNotification("Password must include at least one special character.", "error");
                return;
            }
            // --- PASSWORD VALIDATION END ---
            if (saveAccount(name, email, password)) {
                showNotification("Thank you! Your account was created.");
                // Optionally, auto-switch to sign in tab:
                // document.querySelector('.auth-tab[data-tab="login"]').click();
            }
        });
    }

    // === Sign In Form ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const user = validateCredentials(email, password);
            if (user) {
                setCurrentUser(user);
                showNotification("Successfully signed in! Redirecting...");
                setTimeout(() => {
                    window.location.href = "account.html";
                }, 1000);
            } else {
                showNotification("Invalid email or password.", "error");
            }
        });
    }

    // === Change Name Logic on account page ===
    const changeForm = document.getElementById('changeNameForm');
    if (changeForm) {
        changeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newName = document.getElementById('newDisplayName').value.trim();
            let acc = getCurrentUser();
            if (!newName || !acc) {
                showNotification("Name cannot be empty.", "error");
                return;
            }
            // Update user list and current user name
            let users = getAccounts();
            let idx = users.findIndex(u => u.email.toLowerCase() === acc.email.toLowerCase());
            if (idx !== -1) {
                users[idx].name = newName;
                localStorage.setItem('sbp_users', JSON.stringify(users));
                setCurrentUser(users[idx]);
            }
            document.getElementById("displayNameText").textContent = newName;
            showAccountNavOnAccountPage();
            showNotification("Name updated!");
        });
        showAccountNavOnAccountPage(); // auto-update navbar in account page on load
    }
});

// Notification helper
function showNotification(msg, type = "success") {
    const notif = document.getElementById("notification");
    const notifMsg = document.getElementById("notificationMessage");
    if (notif && notifMsg) {
        notifMsg.textContent = msg || "";
        const icon = notif.querySelector(".notification-icon");
        if (type === "error") {
            icon.className = "fas fa-exclamation-circle notification-icon";
            icon.style.color = "#dc3545";
            notif.style.borderLeftColor = "#dc3545";
        } else {
            icon.className = "fas fa-check-circle notification-icon";
            icon.style.color = "#7ec850";
            notif.style.borderLeftColor = "#7ec850";
        }
        notif.classList.add("show");
        setTimeout(() => { notif.classList.remove("show"); }, 2200);
    } else {
        alert(msg);
    }
}
function openSignupModal() {
    var modal = document.getElementById('authModal');
    if (modal && typeof bootstrap !== "undefined") {
        let signupTab = document.querySelector('.auth-tab[data-tab="signup"]');
        if (signupTab) signupTab.click();
        var authModal = bootstrap.Modal.getOrCreateInstance(modal);
        authModal.show();
    }
}
/*Fix for the JavaScript modal logic in Sign In/Sign Up (place inside <script> where modal code is)*/ 
/*Modal*/ 
   document.addEventListener("DOMContentLoaded", function() {
                // MODAL tab switch logic
                const authTabs = document.querySelectorAll(".auth-tab");
                const tabIndicator = document.getElementById("tabIndicator");
                const authForms = document.querySelectorAll(".auth-form");
                function activateTab(tabBtn) {
                    authTabs.forEach(t => t.classList.remove("active"));
                    tabBtn.classList.add("active");
                    authForms.forEach(form => form.classList.remove("active"));
                    const targetTab = tabBtn.dataset.tab + "Form";
                    document.getElementById(targetTab).classList.add("active");
                    updateTabIndicator();
                }
                authTabs.forEach(tab => {
                    tab.addEventListener("click", function() {
                        activateTab(this);
                    });
                });
                function updateTabIndicator() {
                    const activeTab = document.querySelector(".auth-tab.active");
                    if (activeTab && tabIndicator) {
                        tabIndicator.style.width = activeTab.offsetWidth + "px";
                        tabIndicator.style.left = activeTab.offsetLeft + "px";
                    }
                }
                window.addEventListener("resize", updateTabIndicator);

                // Password toggle logic
                document.querySelectorAll('.password-toggle').forEach(toggle => {
                    toggle.addEventListener('click', function() {
                        const target = document.getElementById(this.getAttribute('data-target'));
                        if (!target) return;
                        if (target.type === "password") {
                            target.type = "text";
                            this.querySelector('i').classList.remove("fa-eye");
                            this.querySelector('i').classList.add("fa-eye-slash");
                        } else {
                            target.type = "password";
                            this.querySelector('i').classList.add("fa-eye");
                            this.querySelector('i').classList.remove("fa-eye-slash");
                        }
                    });
                });

                // Custom checkbox logic
                document.querySelectorAll('.custom-checkbox').forEach(box => {
                    box.addEventListener('click', function() {
                        box.classList.toggle("checked");
                    });
                });

                // Switch links for footer
                document.querySelectorAll('.switch-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const target = this.getAttribute('data-switch');
                        const btn = document.querySelector('.auth-tab[data-tab="'+target+'"]');
                        if (btn) btn.click();
                    });
                });

                // Social button notification
                document.querySelectorAll('.social-btn').forEach(btn => {
                    btn.addEventListener("click", function() {
                        let platform = "";
                        if (btn.classList.contains('google')) platform = "Google";
                        else if (btn.classList.contains('facebook')) platform = "Facebook";
                        else if (btn.classList.contains('twitter')) platform = "Twitter";
                        showNotification("Continue with " + platform);
                    });
                });

                // No form submission logic here for loginForm or signupForm

                // Notification popup fix
                function showNotification(msg, type="success") {
                    const notif = document.getElementById("notification");
                    const notifMsg = document.getElementById("notificationMessage");
                    notifMsg.textContent = msg;
                    const icon = notif.querySelector(".notification-icon");
                    if (type === "error") {
                        icon.className = "fas fa-exclamation-circle notification-icon";
                        icon.style.color = "#dc3545";
                        notif.style.borderLeftColor = "#dc3545";
                    } else {
                        icon.className = "fas fa-check-circle notification-icon";
                        icon.style.color = "#7ec850";
                        notif.style.borderLeftColor = "#7ec850";
                    }
                    notif.classList.add("show");
                    setTimeout(() => { notif.classList.remove("show");}, 2600);
                }

                // Initial
                updateTabIndicator();
                // By default activate login tab
                activateTab(document.querySelector('.auth-tab[data-tab="login"]'));
        });



         document.addEventListener('DOMContentLoaded', function() {
            if(localStorage.getItem('sbp_switch') === '1') {
                localStorage.removeItem('sbp_switch');
                setTimeout(function(){
                    if(typeof bootstrap !== 'undefined') {
                        var authModal = new bootstrap.Modal(document.getElementById('authModal'));
                        authModal.show();
                    }
                }, 350);
            }
        });
        /* End of Modal */