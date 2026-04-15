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


// Announcements:
window.handleAnnouncementData = function (data) {
  console.log("handleAnnouncementData fired:", data);

  const bar = document.getElementById("announcement");
  const container = document.getElementById("announcement-container");

  if (!bar || !container) return;

  if (!data.active || !data.message) {
    bar.hidden = true;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = data.startDate ? new Date(data.startDate) : null;
  const endDate = data.endDate ? new Date(data.endDate) : null;

  if (startDate && !Number.isNaN(startDate.getTime())) {
    startDate.setHours(0, 0, 0, 0);
    if (today < startDate) {
      bar.hidden = true;
      return;
    }
  }

  if (endDate && !Number.isNaN(endDate.getTime())) {
    endDate.setHours(0, 0, 0, 0);
    if (today > endDate) {
      bar.hidden = true;
      return;
    }
  }

  container.textContent = `${data.message}`;
  bar.hidden = false;
};

function loadAnnouncement() {
  const script = document.createElement("script");
  script.src =
  "https://script.google.com/macros/s/AKfycbyz8mHsYlHYFFqxEvORnFY4yLpwW6irON3p3U-wUy78GnxJoHd2PiWLKYM4CAH3R3KA/exec?prefix=handleAnnouncementData";
  script.async = true;
  document.body.appendChild(script);
}

const closeBtn = document.querySelector(".announcement-close");
const bar = document.getElementById("announcement");

if (closeBtn && bar) {
  closeBtn.addEventListener("click", () => {
    bar.hidden = true;
  });
}

loadAnnouncement();