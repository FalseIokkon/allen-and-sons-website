const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

if (menuToggle && siteNav) {
  const openMenu = () => {
    siteNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "✕";

    // Prevent background scrolling
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";

    // Restore background scrolling
    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
  };

  // Toggle button click
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && siteNav.classList.contains("open")) {
      closeMenu();
    }
  });
}