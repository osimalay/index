
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const navigationLinks = document.querySelectorAll(".sidebar-link");
    const currentYear = document.getElementById("current-year");

    // Update footer year
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Check that the mobile menu elements exist
    if (!sidebar || !sidebarToggle || !sidebarOverlay) {
        console.error("Dashboard sidebar elements could not be found.");
        return;
    }

    // Open sidebar
    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("visible");
        sidebarToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("visible");
        sidebarToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    // Toggle sidebar
    sidebarToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close when overlay is clicked
    sidebarOverlay.addEventListener("click", closeSidebar);

    // Close after selecting a navigation link
    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeSidebar();
        });
    });

    // Close with Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    // Close sidebar when returning to desktop screen size
    window.addEventListener("resize", function () {
        if (window.innerWidth > 760) {
            closeSidebar();
        }
    });
});
