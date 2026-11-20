
document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("adminSidebar");
    const navigationGroups = [
        {
            label: "MAIN",
            items: [
                ["admin-dashboard.html", "▦", "Overview", "dashboard"],
                ["admin-visitors.html", "◉", "Visitors & Analytics", "visitors"],
                ["admin-activity.html", "⌁", "Live Activity Monitor", "activity"]
            ]
        },
        {
            label: "WEBSITE MANAGEMENT",
            items: [
                ["admin-website-editor.html", "✎", "Website Editor", "website-editor"],
                ["admin-pages.html", "▤", "Page Management", "pages"],
                ["admin-media.html", "▧", "Images & Media", "media"],
                ["admin-navigation.html", "☷", "Navigation & Footer", "navigation"],
                ["admin-appearance.html", "◐", "Website Appearance", "appearance"],
                ["admin-seo.html", "⌕", "SEO & Page Settings", "seo"]
            ]
        },
        {
            label: "USER MANAGEMENT",
            items: [
                ["admin-customers.html", "♙", "All Customers", "customers"],
                ["admin-user-access.html", "⛨", "User Access & Bans", "user-access"],
                ["admin-agents.html", "♧", "Agent Management", "agents"]
            ]
        },
        {
            label: "LOAN OPERATIONS",
            items: [
                ["admin-applications.html", "▣", "Loan Applications", "applications"],
                ["admin-loans.html", "▰", "Loan Management", "loans"],
                ["admin-repayments.html", "↻", "Repayments", "repayments"],
                ["admin-transactions.html", "⇄", "Transactions", "transactions"]
            ]
        },
        {
            label: "COMMUNICATION",
            items: [
                ["admin-notifications.html", "♢", "Notifications", "notifications"],
                ["admin-messages.html", "✉", "Messages & Support", "messages"],
                ["admin-faq-management.html", "?", "FAQ & Help Content", "faq-management"]
            ]
        },
        {
            label: "SYSTEM CONTROL",
            items: [
                ["admin-reports.html", "▥", "Reports & Analytics", "reports"],
                ["admin-security.html", "⬡", "Security Centre", "security"],
                ["admin-activity-logs.html", "≡", "Audit Logs", "activity-logs"],
                ["admin-settings.html", "⚙", "System Settings", "settings"],
                ["admin-profile.html", "♙", "My Profile", "profile"]
            ]
        }
    ];

    if (sidebar) {
        const currentFile = window.location.pathname.split("/").pop();
        const activePage = sidebar.dataset.active ||
            currentFile.replace(/^admin-/, "").replace(/\.html$/i, "");
        const navigationMarkup = navigationGroups.map(function (group) {
            const links = group.items.map(function (item) {
                const isActive = item[3] === activePage;
                return '<a href="' + item[0] + '" class="nav-link' +
                    (isActive ? ' active" aria-current="page' : '') +
                    '"><span class="nav-icon">' + item[1] + '</span><span>' +
                    item[2] + '</span></a>';
            }).join("");

            return '<span class="nav-heading">' + group.label + '</span>' + links;
        }).join("");

        sidebar.innerHTML =
            '<a href="admin-dashboard.html" class="sidebar-brand">' +
                '<span class="brand-logo">M</span>' +
                '<span class="brand-text"><strong>METRO LOAN</strong>' +
                '<small>COMMAND DESK</small></span>' +
            '</a>' +
            '<div class="sidebar-admin"><div class="admin-avatar">SA</div>' +
                '<div><strong>Super Admin</strong><span>' +
                '<i class="online-indicator"></i> Administrator</span></div>' +
            '</div>' +
            '<nav class="admin-navigation" aria-label="Admin navigation">' +
                navigationMarkup +
            '</nav>' +
            '<div class="sidebar-bottom"><a href="admin-login.html" ' +
                'class="nav-link logout-link"><span class="nav-icon">⇥</span>' +
                '<span>Logout</span></a></div>';
    }

    const adminTopbar = document.querySelector(".admin-topbar");
    const pageTitle = adminTopbar && adminTopbar.querySelector("h1");

    if (adminTopbar && pageTitle) {
        const topbarLeft = document.createElement("div");
        topbarLeft.className = "topbar-left";

        const menuToggle = document.createElement("button");
        menuToggle.className = "menu-toggle";
        menuToggle.id = "menuToggle";
        menuToggle.type = "button";
        menuToggle.setAttribute("aria-label", "Toggle navigation");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";

        const heading = document.createElement("div");
        const label = document.createElement("span");
        label.className = "topbar-label";
        label.textContent = "COMMAND DESK";

        const title = document.createElement("h1");
        title.textContent = pageTitle.textContent.trim();

        heading.append(label, title);
        topbarLeft.append(menuToggle, heading);

        const topbarRight = document.createElement("div");
        topbarRight.className = "topbar-right";

        const notifications = document.createElement("a");
        notifications.href = "admin-notifications.html";
        notifications.className = "topbar-icon";
        notifications.setAttribute("aria-label", "Notifications");
        notifications.textContent = "♢";

        const profile = document.createElement("a");
        profile.href = "admin-profile.html";
        profile.className = "topbar-profile";

        const avatar = document.createElement("span");
        avatar.className = "topbar-avatar";
        avatar.textContent = "SA";

        const profileText = document.createElement("span");
        profileText.className = "topbar-profile-text";

        const profileName = document.createElement("strong");
        profileName.textContent = "Super Admin";

        const profileRole = document.createElement("small");
        profileRole.textContent = "Administrator";

        profileText.append(profileName, profileRole);
        profile.append(avatar, profileText);
        topbarRight.append(notifications, profile);
        adminTopbar.replaceChildren(topbarLeft, topbarRight);
    }

    // PASSWORD VISIBILITY ON ADMIN LOGIN
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && password) {
        togglePassword.addEventListener("click", function () {
            const isHidden = password.type === "password";

            password.type = isHidden ? "text" : "password";

            togglePassword.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );
        });
    }
    

    // ADMIN LOGIN FORM
    const loginForm = document.getElementById("adminLoginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (loginMessage) {
                loginMessage.textContent =
                    "Administrator authentication has not been connected yet.";
            }
        });
    }

    // PASSWORD RECOVERY MESSAGE
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();

            if (loginMessage) {
                loginMessage.textContent =
                    "Please contact your system administrator for password recovery.";
            }
        });
    }

    // COMMAND DESK MOBILE SIDEBAR
    const menuToggle = document.getElementById("menuToggle");
    const overlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("show");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener("click", function () {
            const isOpen = sidebar.classList.toggle("open");

            overlay.classList.toggle("show", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        overlay.addEventListener("click", closeSidebar);

        sidebar.querySelectorAll(".nav-link, .logout-link").forEach(function (link) {
            link.addEventListener("click", closeSidebar);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeSidebar();
            }
        });
    }

    // COMMAND DESK DATE
    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

});
