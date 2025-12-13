document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll to sections
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };
    window.scrollToSection = scrollToSection; // Make global if called inline in HTML

    // Reveal-on-scroll animation (for class "reveal")
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Card tilt effect for program cards (optional, works if you add transforms)
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Breathe animation logic
    const breathBtn = document.getElementById('breathBtn');
    const breathText = document.getElementById('breathText');
    let isBreathing = false;
    if (breathBtn) {
        breathBtn.addEventListener('click', () => {
            if (isBreathing) return;
            isBreathing = true;
            breathBtn.classList.add('breathing-active');
            breathBtn.innerText = "";
            const totalTime = 12000;
            const breatheTime = 4800;
            const holdTime = 2400;
            const cyclesToRun = 3;
            let cyclesCount = 0;
            function breatheAnimation() {
                breathText.innerText = "Breathe In...";
                setTimeout(() => {
                    if (!isBreathing) return;
                    breathText.innerText = "Hold...";
                    setTimeout(() => {
                        if (!isBreathing) return;
                        breathText.innerText = "Breathe Out...";
                    }, holdTime);
                }, breatheTime);

                cyclesCount++;
                if (cyclesCount >= cyclesToRun) {
                    clearInterval(interval);
                    setTimeout(() => {
                        breathText.innerText = "Done!";
                        breathBtn.innerText = "Start Again";
                        breathBtn.classList.remove('breathing-active');
                        isBreathing = false;
                    }, totalTime);
                }
            }
            breatheAnimation();
            var interval = setInterval(breatheAnimation, totalTime);
        });
    }

    // Fancy animated background particles (if canvas exists)
    const heroCanvas = document.getElementById('fitness-hero-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let width, height;
        let particles = [];
        function resize() {
            width = heroCanvas.width = window.innerWidth;
            height = heroCanvas.height = window.innerHeight;
        }
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.size = Math.random() * 3;
                this.color = 'rgba(18,130,84,0.22)';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        function initParticles() {
            particles = [];
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle());
            }
        }
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
        resize();
        initParticles();
        animateParticles();
    }

    // Bio-sync pulse-points interaction for health sections
    const points = document.querySelectorAll('.pulse-point');
    const bioCards = document.querySelectorAll('.bio-card');
    points.forEach(point => {
        point.addEventListener('mouseenter', () => {
            const target = point.getAttribute('data-target');
            bioCards.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('active');
            });
            const targetCard = document.getElementById(target);
            if (targetCard) {
                targetCard.style.display = 'block';
                setTimeout(() => targetCard.classList.add('active'), 10);
            }
        });
    });

    // Mood Button Section -- FIXED: Now always works!
    const moodBtns = document.querySelectorAll('.mood-btn');
    const moodContent = document.getElementById('mood-content');
    const moodData = {
        'stressed': {
            icon: '<i class="bi bi-tree"></i>',
            title: 'Forest Bathing (Shinrin-Yoku)',
            desc: 'Head to the densest part of the park. The goal is not exercise, but sensory immersion. Walk slowly, touch the bark, and breathe the phytoncides.'
        },
        'sluggish': {
            icon: '<i class="bi bi-bicycle"></i>',
            title: 'Interval Cycling / Sprints',
            desc: 'You need a dopamine spike. Head to the paved trails and do 30-second sprints followed by 1 minute of rest. Wake up your central nervous system.'
        },
        'anxious': {
            icon: '<i class="bi bi-water"></i>',
            title: 'Lakeside Grounding',
            desc: 'Find a body of water. The sound of water acts as "pink noise," soothing the amygdala. Take your shoes off and stand in the grass nearby.'
        },
        'creative': {
            icon: '<i class="bi bi-clouds"></i>',
            title: 'Sky Gazing & Wandering',
            desc: 'Find an open field. Lie down and watch the clouds. "Soft fascination" allows your default mode network to reset, sparking creativity.'
        }
    };

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (moodContent) {
                moodContent.classList.remove('show');
                setTimeout(() => {
                    const mood = btn.getAttribute('data-mood');
                    const data = moodData[mood];
                    if (data) {
                        moodContent.innerHTML =
                            `<div class="mood-icon-large">${data.icon}</div>
                             <div><h3 style="color: var(--primary); margin-bottom: 10px;">${data.title}</h3><p>${data.desc}</p></div>`;
                        moodContent.classList.add('show');
                    }
                }, 300);
            }
        });
    });

});
