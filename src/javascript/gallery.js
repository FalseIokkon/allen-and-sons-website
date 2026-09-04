const galleryGrid = document.getElementById("galleryGrid");

const images = [
  {
    src: "/images/gallery/gallery-1.avif",
    alt: "Cho, Song, Kyaw, and James",
  },
  {
    src: "/images/gallery/gallery-2.avif",
    alt: "2023 Summer Camp (Week 6)",
  },
  {
    src: "/images/gallery/gallery-3.avif",
    alt: "Birthday Party November 2024",
  },
  {
    src: "/images/gallery/club-play.avif",
    alt: "Weekly Round Robin",
  },
  {
    src: "/images/shop/shop-display-2.avif",
    alt: "Butterfly equipment in the club shop",
  },
  {
    src: "/images/hero/storefront.avif",
    alt: "The club storefront on Sherman Way",
  },
];

if (galleryGrid) {
  galleryGrid.replaceChildren();

  images.forEach((image, index) => {
    const link = document.createElement("a");
    link.className = "gallery-card";
    link.href = image.src;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("data-reveal", "");
    link.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 70}ms`);

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = index < 3 ? "eager" : "lazy";
    img.decoding = "async";

    const caption = document.createElement("div");
    caption.className = "gallery-caption";
    caption.textContent = image.alt;

    link.append(img, caption);
    galleryGrid.appendChild(link);
  });
}
