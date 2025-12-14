document.addEventListener("DOMContentLoaded", () => {
    const slides = Array.from(document.querySelectorAll(".slide"));
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!slides.length) return;

    let currentIndex = 0;

    const wrapIndex = (n, total) => (n % total + total) % total;

    function showSlides() {
        slides.forEach(slide => slide.classList.remove("big", "left", "right"));

        const current = slides[wrapIndex(currentIndex, slides.length)];
        current.classList.add("big");

        if (slides.length > 1) {
            slides[wrapIndex(currentIndex - 1, slides.length)].classList.add("left");
            slides[wrapIndex(currentIndex + 1, slides.length)].classList.add("right");
        }
    }

    nextBtn.addEventListener("click", e => {
        e.preventDefault();
        currentIndex = wrapIndex(currentIndex + 1, slides.length);
        showSlides();
    });

    prevBtn.addEventListener("click", e => {
        e.preventDefault();
        currentIndex = wrapIndex(currentIndex - 1, slides.length);
        showSlides();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();
    });

    showSlides();
});

// Fade in boxes on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".box").forEach(box => observer.observe(box));

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero') || document.body;
  const LEAF_SRC = 'Img_aboutus/Leaf.png';
  const COUNT = 12; // number of leaves to spawn

  const container = document.createElement('div');
  container.className = 'leaves-container';
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  hero.appendChild(container);

  for (let i = 0; i < COUNT; i++) {
    const img = document.createElement('img');
    img.src = LEAF_SRC;
    img.className = 'leaf';
    img.alt = 'leaf';
    img.style.position = 'absolute';
    // random horizontal position
    img.style.left = (Math.random() * 90) + '%';
    // random initial vertical offset above viewport
    img.style.top = (-10 - Math.random() * 20) + 'vh';
    // random size
    const size = 20 + Math.random() * 40;
    img.style.width = size + 'px';
    img.style.height = 'auto';
    // random rotation
    img.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    // random animation delay and duration
    img.style.animationDelay = (Math.random() * 3) + 's';
    img.style.animationDuration = (8 + Math.random() * 6) + 's';
    img.style.opacity = 0.9;
    img.style.zIndex = 2;

    container.appendChild(img);
  }
});