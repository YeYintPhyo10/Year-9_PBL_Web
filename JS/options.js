// Smooth scroll to an element by section id
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Scroll first to Mission, then after delay to Vision
function scrollMissionThenVision() {
    scrollToSection('mission-card');
    setTimeout(function() {
        scrollToSection('vision-card');
    }, 2000);
}

// Make the scrollMissionThenVision function accessible from the global scope
window.scrollMissionThenVision = scrollMissionThenVision;

/* Option Cards Interaction */
const optionCards = document.querySelectorAll('.option-card');
optionCards.forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('active')) {
            card.classList.remove('active');
        } else {
            optionCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        }
    });
});

// Split titles into individual letters for vertical effect
document.querySelectorAll('.option-card .title').forEach(title => {
    const letters = title.textContent.trim().split('');
    title.innerHTML = letters.map(letter => `<span>${letter}</span>`).join('');
});

// FAQ toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        question.classList.toggle('active');
        question.nextElementSibling.classList.toggle('open');
    });
});

// Contact form submission
const contactForm = document.querySelector(".creative-form");
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("Message sent!");
    });
}