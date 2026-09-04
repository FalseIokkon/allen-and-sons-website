/* ==========================================================================
   1. Header: transparent over the hero, glass panel once scrolled
   ========================================================================== */
const siteHeader = document.querySelector(".site-header");
const siteTop = document.querySelector(".site-top");

/* The sticky bar is the header plus, when it is showing, the announcement bar.
   Publish its real height so anchor scroll-padding, the mobile menu's top
   padding and the open-menu body offset all track it instead of assuming a
   bare header. */
const syncTopHeight = () => {
  if (!siteTop) return;
  document.documentElement.style.setProperty(
    "--site-top-h",
    `${siteTop.offsetHeight}px`
  );
};

if (siteTop) {
  syncTopHeight();
  if ("ResizeObserver" in window) {
    // fires when the announcement bar appears, is dismissed, or text reflows
    new ResizeObserver(syncTopHeight).observe(siteTop);
  } else {
    window.addEventListener("resize", syncTopHeight, { passive: true });
  }
}

let ticking = false;

const syncHeader = () => {
  ticking = false;
  if (!siteHeader) return;
  // The document can't scroll while the menu is open, so leave the header in
  // its solid state instead of reading a frozen scrollY.
  if (document.documentElement.classList.contains("menu-open")) return;
  siteHeader.classList.toggle("is-stuck", window.scrollY > 20);
};

if (siteHeader) {
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncHeader);
      }
    },
    { passive: true }
  );

  syncHeader();
}

/* ==========================================================================
   2. Mobile navigation
   ========================================================================== */
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navBackdrop = document.querySelector(".nav-backdrop");

if (menuToggle && siteNav) {
  const setMenu = (open) => {
    // The bar switches to position: fixed while open; make sure the recorded
    // height is current so the frozen page behind it doesn't jump.
    if (open) syncTopHeight();

    siteNav.classList.toggle("open", open);
    if (navBackdrop) navBackdrop.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);

    // Keep the header solid behind the panel; on close, fall back to whatever
    // the real scroll position calls for.
    if (open) siteHeader?.classList.add("is-stuck");
    else syncHeader();
  };

  const closeMenu = () => setMenu(false);

  menuToggle.addEventListener("click", () => {
    setMenu(!siteNav.classList.contains("open"));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (navBackdrop) navBackdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Reset state if the viewport grows past the mobile breakpoint.
  const desktop = window.matchMedia("(min-width: 901px)");
  desktop.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

/* ==========================================================================
   3. Scroll reveal
   ========================================================================== */
(() => {
  // Claim this up front so the failsafe in the page <head> never fires on the
  // early-return paths below.
  document.documentElement.setAttribute("data-reveal-ready", "");

  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Stagger siblings inside a group so grids cascade in.
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, index) => {
      if (child.hasAttribute("data-reveal")) {
        child.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 70}ms`);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    // threshold 0 so anything that peeks into the viewport reveals — a large
    // threshold leaves tall elements hidden on tall viewports.
    { rootMargin: "0px 0px -40px 0px", threshold: 0 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ==========================================================================
   4. Footer year
   ========================================================================== */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ==========================================================================
   5. Announcement bar (fed by a Google Sheet via Apps Script)
   ========================================================================== */
window.handleAnnouncementData = function (data) {
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

  let wasDismissed = false;
  try {
    wasDismissed = localStorage.getItem(dismissKey) === "true";
  } catch (error) {
    wasDismissed = false;
  }

  if (wasDismissed) {
    bar.hidden = true;
    return;
  }

  container.textContent = data.message;
  bar.hidden = false;

  if (closeBtn) {
    closeBtn.onclick = () => {
      try {
        localStorage.setItem(dismissKey, "true");
      } catch (error) {
        /* storage unavailable — dismiss for this page view only */
      }
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
