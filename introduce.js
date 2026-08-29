/* =========================================================
   FADE-IN HALUS SAAT HALAMAN DIBUKA
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  if (content) {
    content.style.opacity = "0";
    content.style.transform = "translateY(10px)";
    content.style.transition = "opacity 500ms ease, transform 500ms ease";
    requestAnimationFrame(() => {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
    });
  }

  // foto "diambil" jadi lurus pas disentuh/hover
  const photo = document.querySelector(".photo");
  if (photo) {
    photo.addEventListener("mouseenter", () => {
      photo.style.transition = "transform 300ms ease";
      photo.style.transform = "rotate(0deg)";
    });
    photo.addEventListener("mouseleave", () => {
      photo.style.transform = "rotate(-1.1deg)";
    });
  }
});
