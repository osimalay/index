(function () {
    const ACCOUNTS_KEY = "metroLoan.accounts.v1";
    const SESSION_KEY = "metroLoan.session.v1";
    const PASSWORD_ITERATIONS = 310000;
    const encoder = new TextEncoder();
    const message = document.getElementById("auth-message");

    function normalizeEmail(email) {
        return typeof email === "string" ? email.trim().toLowerCase() : "";
    }

    function setMessage(text) {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.hidden = !text;
    }

    function readAccounts() {
        let serialized;

        try {
            serialized = window.localStorage.getItem(ACCOUNTS_KEY);
        } catch (error) {
            console.error("Could not access browser account storage.", error);
            throw new Error("Browser storage is unavailable. Check your browser settings and try again.");
        }

        if (serialized === null) {
            return [];
        }

        let accounts;

        try {
            accounts = JSON.parse(serialized);
        } catch (error) {
            console.error("Saved account data could not be read.", error);
            throw new Error("Saved account data could not be read. Clear this site's browser data and try again.");
        }

        if (!Array.isArray(accounts)) {
            throw new Error("Saved account data is invalid. Clear this site's browser data and try again.");
        }

        return accounts;
    }

    function saveAccounts(accounts) {
        try {
            window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        } catch (error) {
            console.error("Could not save account data in browser storage.", error);
            throw new Error("Could not save your account in this browser. Check available storage and try again.");
        }
    }

    function bytesToHex(bytes) {
        return Array.from(bytes, function (byte) {
            return byte.toString(16).padStart(2, "0");
        }).join("");
    }

    function hexToBytes(hex) {
        if (typeof hex !== "string" || !/^[0-9a-f]{32}$/i.test(hex)) {
            throw new Error("Saved password data is invalid. Please register again.");
        }

        const bytes = new Uint8Array(hex.length / 2);

        for (let index = 0; index < bytes.length; index += 1) {
            bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
        }

        return bytes;
    }

    function createSalt() {
        if (!window.crypto || typeof window.crypto.getRandomValues !== "function") {
            throw new Error("Secure password storage is unavailable in this browser.");
        }

        const salt = new Uint8Array(16);
        window.crypto.getRandomValues(salt);
        return bytesToHex(salt);
    }

    async function hashPassword(password, saltHex) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Secure password handling is unavailable. Use an up-to-date browser over HTTPS.");
        }

        try {
            const key = await window.crypto.subtle.importKey(
                "raw",
                encoder.encode(password),
                "PBKDF2",
                false,
                ["deriveBits"]
            );
            const hash = await window.crypto.subtle.deriveBits(
                {
                    name: "PBKDF2",
                    salt: hexToBytes(saltHex),
                    iterations: PASSWORD_ITERATIONS,
                    hash: "SHA-256"
                },
                key,
                256
            );

            return bytesToHex(new Uint8Array(hash));
        } catch (error) {
            if (error instanceof Error && error.message.startsWith("Saved password data")) {
                throw error;
            }

            console.error("Secure password processing failed.", error);
            throw new Error("Secure password handling failed in this browser. Please try again.");
        }
    }

    function hashesMatch(first, second) {
        if (typeof first !== "string" || typeof second !== "string" || first.length !== second.length) {
            return false;
        }

        let difference = 0;

        for (let index = 0; index < first.length; index += 1) {
            difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
        }

        return difference === 0;
    }

    function readSessionAccount() {
        const accounts = readAccounts();
        const stores = [window.localStorage, window.sessionStorage];

        for (const store of stores) {
            let serialized;

            try {
                serialized = store.getItem(SESSION_KEY);
            } catch (error) {
                console.error("Could not access the current browser session.", error);
                throw new Error("Browser session storage is unavailable. Please log in again.");
            }

            if (serialized === null) {
                continue;
            }

            let session;

            try {
                session = JSON.parse(serialized);
            } catch (error) {
                console.error("Saved login session could not be read.", error);
                throw new Error("Saved login session is invalid. Please log in again.");
            }

            if (!session || typeof session.email !== "string") {
                store.removeItem(SESSION_KEY);
                continue;
            }

            const email = normalizeEmail(session.email);
            const account = accounts.find(function (item) {
                return item && normalizeEmail(item.email || "") === email;
            });

            if (account) {
                return account;
            }

            store.removeItem(SESSION_KEY);
        }

        return null;
    }

    function saveSession(email, rememberMe) {
        const session = JSON.stringify({ email: email });

        try {
            if (rememberMe) {
                window.sessionStorage.removeItem(SESSION_KEY);
                window.localStorage.setItem(SESSION_KEY, session);
            } else {
                window.localStorage.removeItem(SESSION_KEY);
                window.sessionStorage.setItem(SESSION_KEY, session);
            }
        } catch (error) {
            console.error("Could not save the browser login session.", error);
            throw new Error("Could not keep you logged in in this browser. Check your browser storage settings.");
        }
    }

    function clearSession() {
        try {
            window.localStorage.removeItem(SESSION_KEY);
            window.sessionStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error("Could not clear the browser login session.", error);
            throw new Error("Could not clear the saved session from this browser.");
        }
    }

    function goToDashboard() {
        window.location.assign(new URL("user dashboard/overview.html", window.location.href).href);
    }

    function showPageNotice() {
        const reason = new URLSearchParams(window.location.search).get("auth");
        const notices = {
            required: "Please log in to access your dashboard.",
            "logged-out": "You have been logged out.",
            storage: "Browser storage is unavailable. Check your browser settings before continuing."
        };

        if (reason && notices[reason]) {
            setMessage(notices[reason]);
        }
    }

    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        showPageNotice();

        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            setMessage("");

            if (!loginForm.reportValidity()) {
                return;
            }

            const email = normalizeEmail(document.getElementById("login-email").value);
            const password = document.getElementById("login-password").value;
            const rememberMe = document.getElementById("remember-me").checked;
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            try {
                const account = readAccounts().find(function (item) {
                    return item && normalizeEmail(item.email || "") === email;
                });

                if (!account || !account.passwordSalt || !account.passwordHash) {
                    setMessage("Email or password is incorrect.");
                    return;
                }

                const attemptedHash = await hashPassword(password, account.passwordSalt);

                if (!hashesMatch(attemptedHash, account.passwordHash)) {
                    setMessage("Email or password is incorrect.");
                    return;
                }

                saveSession(email, rememberMe);
                goToDashboard();
            } catch (error) {
                console.error("Login could not be completed.", error);
                setMessage(error instanceof Error ? error.message : "Login could not be completed. Please try again.");
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        showPageNotice();

        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            setMessage("");

            if (!registerForm.reportValidity()) {
                return;
            }

            const fullName = document.getElementById("register-name").value.trim();
            const email = normalizeEmail(document.getElementById("register-email").value);
            const phone = document.getElementById("register-phone").value.trim();
            const password = document.getElementById("register-password").value;
            const submitButton = registerForm.querySelector('button[type="submit"]');

            if (fullName.length < 2) {
                setMessage("Enter your full name to create an account.");
                return;
            }

            if (password.length < 8) {
                setMessage("Your password must be at least 8 characters long.");
                return;
            }

            submitButton.disabled = true;

            try {
                const accounts = readAccounts();

                if (accounts.some(function (item) {
                    return item && normalizeEmail(item.email || "") === email;
                })) {
                    setMessage("An account with this email already exists. Please log in instead.");
                    return;
                }

                const salt = createSalt();
                const passwordHash = await hashPassword(password, salt);

                accounts.push({
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    passwordSalt: salt,
                    passwordHash: passwordHash,
                    createdAt: new Date().toISOString()
                });

                saveAccounts(accounts);
                saveSession(email, true);
                goToDashboard();
            } catch (error) {
                console.error("Registration could not be completed.", error);
                setMessage(error instanceof Error ? error.message : "Registration could not be completed. Please try again.");
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    const logoutLinks = document.querySelectorAll(".logout-link");

    if (logoutLinks.length > 0) {
        function verifyDashboardSession() {
            try {
                if (!readSessionAccount()) {
                    window.location.replace("../login.html?auth=required");
                    return false;
                }
            } catch (error) {
                console.error("Dashboard access could not be verified.", error);
                window.location.replace("../login.html?auth=storage");
                return false;
            }

            return true;
        }

        if (!verifyDashboardSession()) {
            return;
        }

        window.addEventListener("pageshow", verifyDashboardSession);

        logoutLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();

                try {
                    clearSession();
                    window.location.assign("../login.html?auth=logged-out");
                } catch (error) {
                    console.error("Logout could not be completed.", error);
                    window.location.assign("../login.html?auth=storage");
                }
            });
        });
    }
})();
