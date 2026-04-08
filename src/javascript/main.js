const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const backdrop = document.querySelector(".nav-backdrop");

if (menuToggle && siteNav) {
  const openMenu = () => {
    siteNav.classList.add("open");
    backdrop?.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "✕";

    // Prevent background scrolling
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    siteNav.classList.remove("open");
    backdrop?.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";

    // Restore background scrolling
    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
  };

  // Toggle button click logic
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu when clicking the backdrop
  backdrop?.addEventListener("click", closeMenu);

  // Accessibility: Close menu with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Optional: Close menu if clicking outside of the nav (safety net)
  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && siteNav.classList.contains("open")) {
      closeMenu();
    }
  });
}