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