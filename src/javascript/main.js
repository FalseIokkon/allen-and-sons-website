const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

if (menuToggle && siteNav) {
  const openMenu = () => {
    siteNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "✕";

    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";

    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && siteNav.classList.contains("open")) {
      closeMenu();
    }
  });
}

window.handleAnnouncementData = function (data) {
  console.log("handleAnnouncementData fired:", data);

  const bar = document.getElementById("announcement");
  const container = document.getElementById("announcement-container");
  const closeBtn = document.querySelector(".announcement-close");

  if (!bar || !container) return;

  if (!data?.message) {
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

  const dismissKey = `announcement-dismissed:${data.message}|${data.startDate || ""}`;
  const wasDismissed = localStorage.getItem(dismissKey) === "true";

  if (wasDismissed) {
    bar.hidden = true;
    return;
  }

  container.textContent = data.message;
  bar.hidden = false;

  if (closeBtn) {
    closeBtn.onclick = () => {
      localStorage.setItem(dismissKey, "true");
      bar.hidden = true;
    };
  }
};

function loadAnnouncement() {
  const oldScript = document.getElementById("announcement-script");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.id = "announcement-script";
  script.src =
    "https://script.google.com/macros/s/AKfycbyz8mHsYlHYFFqxEvORnFY4yLpwW6irON3p3U-wUy78GnxJoHd2PiWLKYM4CAH3R3KA/exec?prefix=handleAnnouncementData";
  script.async = true;

  script.onerror = () => {
    console.error("Failed to load announcement script.");
  };

  document.body.appendChild(script);
}

loadAnnouncement();