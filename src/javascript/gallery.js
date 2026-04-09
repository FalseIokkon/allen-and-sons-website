const galleryGrid = document.getElementById("galleryGrid");

const images = [
  {
    src: new URL("../../images/gallery/gallery-1.jpg", import.meta.url).href,
    alt: "Cho, Song, Kyaw, and James"
  },
  {
    src: new URL("../../images/gallery/gallery-2.jpg", import.meta.url).href,
    alt: "2023 Summer Camp (Week 6)"
  },
  {
    src: new URL("../../images/gallery/gallery-3.jpg", import.meta.url).href,
    alt: "Birthday Party November 2024"
  },
  {
    src: new URL("../../images/gallery/club-play.jpg", import.meta.url).href,
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