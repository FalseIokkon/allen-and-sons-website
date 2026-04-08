let galleryImages = [];
let currentIndex = 0;

const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxMeta = document.getElementById("lightboxMeta");
const lightboxClose = document.getElementById("lightboxClose");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

async function loadGalleryImages() {
  try {
    const response = await fetch("/public/data/gallery-images.json");

    if (!response.ok) {
      throw new Error("Could not load gallery-images.json");
    }

    galleryImages = await response.json();
    renderGallery();
  } catch (error) {
    console.error("Gallery failed to load:", error);
    galleryGrid.innerHTML = "<p>Gallery images could not be loaded.</p>";
  }
}

function renderGallery() {
  galleryGrid.innerHTML = "";

  galleryImages.forEach((image, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card";

    card.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <div class="gallery-caption">${image.alt}</div>
    `;

    card.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(card);
  });
}

function updateLightbox() {
  const image = galleryImages[currentIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxMeta.textContent = `${image.alt} (${currentIndex + 1} of ${galleryImages.length})`;
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateLightbox();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightbox();
}

nextButton.addEventListener("click", showNext);
prevButton.addEventListener("click", showPrev);
lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrev();
});

loadGalleryImages();