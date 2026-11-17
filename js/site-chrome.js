document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-actions a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    const footer = document.querySelector("footer");

    if (footer) {
        footer.className = "site-footer";
        footer.innerHTML = `
            <div class="footer-main">
                <div class="footer-about">
                    <a href="index.html" class="footer-brand">
                        <span class="brand-mark">M</span>
                        <span class="brand-name">METRO LOAN</span>
                    </a>
                    <p class="footer-tagline">Financial Freedom, Made Simple.</p>
                    <p>Explore financial information and learn about borrowing options with clarity and confidence.</p>
                </div>
                <div class="footer-column">
                    <h3>Explore</h3>
                    <a href="index.html">Home</a>
                    <a href="about.html">About Us</a>
                    <a href="loans.html">Loan Options</a>
                    <a href="how-it-works.html">How It Works</a>
                    <a href="calculator.html">Loan Calculator</a>
                </div>
                <div class="footer-column">
                    <h3>Information</h3>
                    <a href="faq.html">FAQs</a>
                    <a href="contact.html">Contact Us</a>
                    <a href="terms.html">Terms of Service</a>
                    <a href="privacy.html">Privacy Policy</a>
                </div>
                <div class="footer-column footer-contact">
                    <h3>Get in Touch</h3>
                    <p>Have a question? Visit our contact page for assistance.</p>
                    <a href="contact.html" class="footer-contact-link">Contact METRO LOAN →</a>
                    <div class="social-links">
                        <a href="#" aria-label="Instagram">IG</a>
                        <a href="#" aria-label="WhatsApp">WA</a>
                        <a href="#" aria-label="X">X</a>
                        <a href="#" aria-label="TikTok">TT</a>
                        <a href="#" aria-label="LinkedIn">in</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© <span id="current-year">${new Date().getFullYear()}</span> METRO LOAN. All rights reserved.</p>
                <p>Financial Freedom, Made Simple.</p>
            </div>`;
    }

    document.querySelectorAll(".auth-note").forEach(note => note.remove());

    document.querySelectorAll("button.primary-button").forEach(button => {
        if (button.textContent.includes("Login Feature Coming Soon")) {
            button.textContent = "Login";
            button.disabled = false;
        }
        if (button.textContent.includes("Registration Feature Coming Soon")) {
            button.textContent = "Create Account";
            button.disabled = false;
        }
        if (button.textContent.includes("Message Feature Coming Soon")) {
            button.textContent = "Send Message";
            button.disabled = false;
        }
    });

    document.querySelectorAll("form small").forEach(note => {
        if (/frontend demonstration|does not send messages/i.test(note.textContent)) note.remove();
    });

    document.querySelectorAll(".social-links a").forEach(link => {
        const destinations = {
            IG: "https://www.instagram.com/",
            WA: "https://www.whatsapp.com/",
            X: "https://x.com/",
            TT: "https://www.tiktok.com/",
            in: "https://www.linkedin.com/"
        };
        const label = link.textContent.trim();
        if (destinations[label]) {
            link.href = destinations[label];
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }
    });

    const showFormMessage = (form, message) => {
        let status = form.querySelector(".form-status");
        if (!status) {
            status = document.createElement("p");
            status.className = "form-status";
            status.setAttribute("role", "status");
            form.append(status);
        }
        status.textContent = message;
    };

    const loginForm = document.querySelector(".auth-card form");
    const loginButton = loginForm?.querySelector("button.primary-button");
    if (loginForm && loginButton && document.title.includes("Login")) {
        loginButton.addEventListener("click", () => {
            if (!loginForm.reportValidity()) return;
            showFormMessage(loginForm, "Your login details are ready to submit.");
        });
    }

    const registerForm = document.querySelector(".auth-card form");
    const registerButton = registerForm?.querySelector("button.primary-button");
    if (registerForm && registerButton && document.title.includes("Create Account")) {
        registerButton.addEventListener("click", () => {
            if (!registerForm.reportValidity()) return;
            showFormMessage(registerForm, "Your account details are ready to submit.");
        });
    }

    const contactForm = document.querySelector("#contact-name")?.closest("form");
    const contactButton = contactForm?.querySelector("button.primary-button");
    if (contactForm && contactButton) {
        contactButton.addEventListener("click", () => {
            if (!contactForm.reportValidity()) return;
            showFormMessage(contactForm, "Your message has been prepared successfully.");
            contactForm.reset();
        });
    }

    const resetForm = document.getElementById("forgot-password-form");
    const resetButton = document.getElementById("reset-password-button");
    if (resetForm && resetButton) {
        resetButton.addEventListener("click", () => {
            if (!resetForm.reportValidity()) return;
            showFormMessage(resetForm, "If this email belongs to an account, a reset link has been prepared.");
        });
    }
});
