// Create floating leaves animation
function createFloatingLeaves() {
    const container = document.getElementById('leaves-container');
    const leafIcons = ['fas fa-leaf', 'fas fa-seedling', 'fas fa-tree', 'fas fa-spa'];
    
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.innerHTML = `<i class="${leafIcons[Math.floor(Math.random() * leafIcons.length)]}"></i>`;
        
        // Random position
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.fontSize = `${Math.random() * 1 + 1}rem`;
        
        // Random animation delay and duration
        const delay = Math.random() * 5;
        const duration = 10 + Math.random() * 10;
        leaf.style.animationDelay = `${delay}s`;
        leaf.style.animationDuration = `${duration}s`;
        
        container.appendChild(leaf);
    }
}

// Search functionality
document.getElementById('search-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('footer-search').value;
    if (searchTerm.trim()) {
        alert(`Searching for: "${searchTerm}" - This would normally redirect to search results.`);
        document.getElementById('footer-search').value = '';
    }
});

document.getElementById('footer-search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('search-button').click();
    }
});

// Newsletter subscription
document.getElementById('newsletter-submit').addEventListener('click', function() {
    const email = document.getElementById('newsletter-email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && emailRegex.test(email)) {
        alert(`Thank you for subscribing with: ${email}\nYou'll receive park updates and wellness tips soon!`);
        document.getElementById('newsletter-email').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
});

document.getElementById('newsletter-email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('newsletter-submit').click();
    }
});


// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    createFloatingLeaves();
    
    // Add hover effect to footer headings
    const headings = document.querySelectorAll('.footer-heading');
    headings.forEach(heading => {
        heading.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        heading.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add interactive effect to logo
    const logoCircle = document.querySelector('.logo-circle');
    logoCircle.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(15deg) scale(1.1)';
    });
    
    logoCircle.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(0) scale(1)';
    });
});