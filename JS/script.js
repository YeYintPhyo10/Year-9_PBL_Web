// Loading Animation and Page Intro
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingContent = document.querySelector('.loading-content');

    setTimeout(() => {
        // Animate out loading content
        if (loadingContent) {
            gsap.to(loadingContent, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    // Animate out whole loading screen
                    if (loadingScreen) {
                        gsap.to(loadingScreen, {
                            opacity: 0,
                            scale: 0.98,
                            duration: 0.5,
                            ease: 'power3.inOut',
                            onComplete: () => {
                                loadingScreen.style.display = 'none';
                                document.body.style.overflow = 'auto';
                                // ===== Fire custom event now that loading is done =====
                                window.dispatchEvent(new Event('mainContentReady'));
                            }
                        });
                    }
                }
            });
        }

        // Animate in body
        gsap.to('body', {
            overflow: 'auto',
            duration: 0.1
        });

        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.from(heroContent, {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.3,
                clearProps: 'all'
            });

            // Hero text elements
            const heroTexts = heroContent.querySelectorAll('h1, p, .btn');
            gsap.from(heroTexts, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                delay: 0.4,
                ease: 'back.out(1.7)',
                clearProps: 'all'
            });
        }

        // Animate hero orbs
        const orbs = document.querySelectorAll('.hero-orb');
        orbs.forEach((orb, index) => {
            gsap.from(orb, {
                scale: 0,
                opacity: 0,
                duration: 1.2,
                delay: 0.3 + (index * 0.15),
                ease: 'elastic.out(1, 0.5)',
                clearProps: 'all'
            });
        });
    }, 1200); // Delay for better feedback
});


// ---- Stats Counter Animation has been REMOVED! ----

// Hero Interactions
(function() {
    const heroSection = document.querySelector('.hero');
    const heroOrbs = document.querySelectorAll('.hero-orb');
    const heroStats = document.querySelectorAll('.hero-stat');
    const floatingChips = document.querySelectorAll('.floating-chip');

    if (!heroSection) return;

    // Animated intro
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
        .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.6 })
        .from('.hero-content h1', { y: 40, opacity: 0, duration: 0.8 }, '-=0.2')
        .from('.hero-content p', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
        .from('.hero-badge', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.4')
        .from('.hero-cta .btn', { y: 15, opacity: 0, stagger: 0.1, duration: 0.4 }, '-=0.4')
        .from(heroStats, { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.3')
        .from('.visual-card', { y: 60, opacity: 0, duration: 0.8 }, '-=1');

    // Floating chip floating effect
    floatingChips.forEach((chip, index) => {
        gsap.to(chip, {
            y: index % 2 === 0 ? 15 : -15,
            x: index % 2 === 0 ? -10 : 10,
            duration: 4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    });

    // Parallax pointer effect
    heroSection.addEventListener('mousemove', (event) => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        heroOrbs.forEach((orb, index) => {
            const depth = (index + 1) * 15;
            orb.style.transform = `translate(${relX * depth}px, ${relY * depth}px)`;
        });
    });

    // Hero stats hover effect
    heroStats.forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            gsap.to(stat, { y: -5, duration: 0.3, ease: 'power2.out' });
        });
        stat.addEventListener('mouseleave', () => {
            gsap.to(stat, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
})();
/*Active */
