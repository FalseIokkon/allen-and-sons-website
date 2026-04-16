const galleryGrid = document.getElementById("galleryGrid");

const images = [
  {
    src: "/images/gallery/gallery-1.avif",
    alt: "Cho, Song, Kyaw, and James"
  },
  {
    src: "/images/gallery/gallery-2.avif",
    alt: "2023 Summer Camp (Week 6)"
  },
  {
    src: "/images/gallery/gallery-3.avif",
    alt: "Birthday Party November 2024"
  },
  {
    src: "/images/gallery/club-play.avif",
    alt: "Weekly Round Robin"
  }
];

galleryGrid.innerHTML = "";

images.forEach((image) => {
  const link = document.createElement("a");
  link.className = "gallery-card";
  link.href = image.src;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.innerHTML = `
    <img src="${image.src}" alt="${image.alt}">
    <div class="gallery-caption">${image.alt}</div>
  `;

  galleryGrid.appendChild(link);
});