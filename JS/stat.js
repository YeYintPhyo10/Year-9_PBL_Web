window.addEventListener('load', function() {
    const statsSection = document.querySelector('.stats-strip');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStat(el) {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) {
            el.textContent = '0';
            return;
        }
        const duration = 1800;
        const start = performance.now();

        el.textContent = '0'; // always start from zero

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    function runAnimationIfVisible() {
        if (statsAnimated) return;
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statNumbers.forEach(animateStat);
            statsAnimated = true;
        }
    }

    // Always reset stats immediately
    statNumbers.forEach(el => { el.textContent = '0'; });

    // Run animation on page load if section is in viewport
    runAnimationIfVisible();

    // Also animate on scroll into view
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statNumbers.forEach(animateStat);
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.4 });
        observer.observe(statsSection);
    }

    // If user resizes window to reveal section, try again
    window.addEventListener('resize', runAnimationIfVisible);

    // If user navigates away and comes back, reset
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            statsAnimated = false;
            statNumbers.forEach(el => { el.textContent = '0'; });
            runAnimationIfVisible();
        }
    });
});