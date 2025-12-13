// Define initial feedback data
const feedbackData = [
    {
        id: 1,
        name: "Ko Myo",
        rating: 5,
        text: "The new meditation garden is absolutely beautiful. It has become my favorite spot for morning mindfulness sessions. The sound of the water feature is so calming.",
        category: "Accessibility",
        date: "2025-10-15",
        tags: ["Accessibility", "Positive Experience", "Park Revitalization"]
    },
    {
        id: 2,
        name: "Phyu Phyu",
        rating: 4,
        text: "Love the new walking paths! They're much more accessible for strollers and wheelchairs. Would love to see more shaded areas along the paths for hot days.",
        category: "General Experience",
        date: "2025-10-14",
        tags: ["General Experience", "Mixed Experience", "General Experience"]
    },
    {
        id: 3,
        name: "Thida",
        rating: 5,
        text: "The community garden initiative is fantastic. My kids love planting seeds and watching them grow. It's a wonderful way to connect with nature and neighbors.",
        category: "General Experience",
        date: "2025-10-12",
        tags: ["General Experience", "Positive Experience", "Community Feedback"]
    },
    {
        id: 4,
        name: "Tha Zin",
        rating: 3,
        text: "The park is beautiful but needs more trash bins, especially near picnic areas. I noticed some litter that could be prevented with better placement of bins.",
        category: "General Experience",
        date: "2025-10-10",
        tags: ["General Experience", "Positive Experience", "General Experience"]
    },
    {
        id: 5,
        name: "Wai Lynn",
        rating: 4,
        text: "The new fitness stations are great addition. As someone who enjoys outdoor workouts, I appreciate the variety of equipment available.",
        category: "General Experience",
        date: "2025-10-08",
        tags: ["General Experience", "Mixed Experience", "Community Feedback"]
    }
];

// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const emptyState = document.getElementById('emptyState');
const ratingOptions = document.querySelectorAll('.rating-option');
const ratingValueInput = document.getElementById('ratingValue');
const feedbackArea = document.getElementById('feedbackArea');
const charCount = document.getElementById('charCount');
const categorySelect = document.getElementById('categorySelect');
const userNameInput = document.getElementById('userName');
const successMessage = document.getElementById('successMessage');

// Stats elements
const totalFeedbackEl = document.getElementById('totalFeedback');
const avgRatingEl = document.getElementById('avgRating');
const positiveFeedbackEl = document.getElementById('positiveFeedback');
const todayFeedbackEl = document.getElementById('todayFeedback');

document.addEventListener('DOMContentLoaded', function () {
    // Load existing feedback
    renderFeedbackList();
    updateStats();

    // Show/hide name field based on page
    const userNameInputGroup = document.getElementById('userNameInputGroup');
    const signedInName = getSignedInUserName();
    const page = window.location.pathname;

    if (userNameInputGroup) {
        if (
            page.includes("account.html") ||
            page.includes("about_us.html")
        ) {
            // On signed-in pages, hide the name field if signed in
            if (signedInName) {
                userNameInputGroup.style.display = 'none';
            } else {
                userNameInputGroup.style.display = '';
            }
        } else {
            // On index.html and all others, always show the input
            userNameInputGroup.style.display = '';
        }
    }

    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Rating selection
    ratingOptions.forEach(option => {
        option.addEventListener('click', function () {
            const rating = this.getAttribute('data-rating');
            selectRating(rating);
        });
    });

    // Character count for feedback textarea
    feedbackArea.addEventListener('input', function () {
        const length = this.value.length;
        charCount.textContent = length;

        if (length > 450) {
            charCount.classList.add('warning');
        } else {
            charCount.classList.remove('warning');
        }
    });

    // Form submission
    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitFeedback();
    });

    // Initialize with a rating selected
    selectRating(5);
}

// Select rating
function selectRating(rating) {
    ratingOptions.forEach(option => {
        option.classList.remove('active');
    });

    const selectedOption = document.querySelector(`.rating-option[data-rating="${rating}"]`);
    selectedOption.classList.add('active');

    ratingValueInput.value = rating;
}

// Render feedback list
function renderFeedbackList() {
    if (feedbackData.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    feedbackList.innerHTML = '';

    // Sort by date (newest first)
    const sortedFeedback = [...feedbackData].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display up to 5 most recent feedback
    const displayCount = Math.min(sortedFeedback.length, 5);

    for (let i = 0; i < displayCount; i++) {
        const feedback = sortedFeedback[i];
        const feedbackItem = createFeedbackElement(feedback);
        feedbackList.appendChild(feedbackItem);
    }
}

// Create feedback element
function createFeedbackElement(feedback) {
    const item = document.createElement('div');
    item.className = 'feedback-item';
    item.setAttribute('data-id', feedback.id);

    // Generate stars based on rating
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= feedback.rating) {
            starsHtml += '<i class="fas fa-star rating-star"></i>';
        } else {
            starsHtml += '<i class="far fa-star rating-star"></i>';
        }
    }

    // Format date
    const dateObj = new Date(feedback.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Get user initials for avatar
    const initials = feedback.name.split(' ').map(n => n[0]).join('').toUpperCase();

    // Create tags HTML
    let tagsHtml = '';
    feedback.tags.forEach(tag => {
        tagsHtml += `<span class="tag">${tag}</span>`;
    });

    item.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-user">
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <h4>${feedback.name}</h4>
                    <p>${formattedDate} • ${formatCategory(feedback.category)}</p>
                </div>
            </div>
            <div class="feedback-rating">
                ${starsHtml}
            </div>
        </div>
        <p class="feedback-text">"${feedback.text}"</p>
        <div class="feedback-tags">
            ${tagsHtml}
        </div>
    `;

    return item;
}

// Format category for display
function formatCategory(category) {
    const categoryMap = {
        'general': 'General Experience',
        'greenery': 'Greenery & Nature',
        'accessibility': 'Accessibility',
        'activities': 'Activities & Events',
        'facilities': 'Park Facilities',
        'safety': 'Safety & Security',
        'cleanliness': 'Cleanliness'
    };

    return categoryMap[category] || category;
}

// Submit feedback
function submitFeedback() {
    const rating = parseInt(ratingValueInput.value);
    const text = feedbackArea.value.trim();
    const category = categorySelect.value;
    const signedInName = getSignedInUserName();
    let name;
    const page = window.location.pathname;

    // Logic for feedback name:
    if (
        (page.includes("account.html") || page.includes("about_us.html")) &&
        signedInName
    ) {
        name = signedInName;
    } else {
        name = userNameInput.value.trim() || 'Anonymous';
    }

    // Validate
    if (rating === 0) {
        alert('Please select a rating');
        return;
    }

    if (text.length < 10) {
        alert('Please provide more detailed feedback (at least 10 characters)');
        return;
    }

    // Create new feedback object
    const newFeedback = {
        id: feedbackData.length + 1,
        name: name,
        rating: rating,
        text: text,
        category: category,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        tags: generateTags(category, rating)
    };

    // Add to data array
    feedbackData.unshift(newFeedback);

    // Update UI
    renderFeedbackList();
    updateStats();

    // Show success message
    showSuccessMessage();

    // Reset form
    feedbackForm.reset();
    selectRating(5);
    charCount.textContent = '0';
    charCount.classList.remove('warning');
}

// Generate tags based on category and rating
function generateTags(category, rating) {
    const tags = [];

    // Add category tag
    tags.push(formatCategory(category));

    // Add rating-based tag
    if (rating >= 4) {
        tags.push('Positive Experience');
    } else if (rating <= 2) {
        tags.push('Needs Improvement');
    } else {
        tags.push('Mixed Experience');
    }

    // Add random tag for variety
    const randomTags = [
        'Park Revitalization',
        'Community Feedback',
        'Wellbeing Focus',
        'Green Space',
    ];

    const randomTag = randomTags[Math.floor(Math.random() * randomTags.length)];
    if (!tags.includes(randomTag)) {
        tags.push(randomTag);
    }

    return tags;
}

// Update statistics
function updateStats() {
    // Total feedback
    totalFeedbackEl.textContent = feedbackData.length;

    // Average rating
    const totalRating = feedbackData.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = feedbackData.length > 0 ? (totalRating / feedbackData.length).toFixed(1) : '0.0';
    avgRatingEl.textContent = avgRating;

    // Positive feedback percentage (rating >= 4)
    const positiveCount = feedbackData.filter(item => item.rating >= 4).length;
    const positivePercentage = feedbackData.length > 0 ? Math.round((positiveCount / feedbackData.length) * 100) : 0;
    positiveFeedbackEl.textContent = `${positivePercentage}%`;

    // Today's feedback
    const today = new Date().toISOString().split('T')[0];
    const todayCount = feedbackData.filter(item => item.date === today).length;
    todayFeedbackEl.textContent = todayCount;
}

// Show success message
function showSuccessMessage() {
    // Reset animation
    successMessage.style.animation = 'none';
    successMessage.offsetHeight; // Trigger reflow
    successMessage.style.animation = 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1), fadeOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) 2.5s forwards';

    // Show message
    successMessage.style.display = 'flex';

    // Hide after animation completes
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Add some sample feedback on load for demo purposes
setTimeout(() => {
    if (feedbackData.length === 5) {
        // Add a new feedback to demonstrate the functionality
        const sampleFeedback = {
            id: feedbackData.length + 1,
            name: "Kyaw Swar",
            rating: 5,
            text: "The new native plant garden is stunning! It's wonderful to see local flora thriving and attracting pollinators. This revitalization project truly enhances community wellbeing.",
            category: "Health Education",
            date: new Date().toISOString().split('T')[0],
            tags: ["General Experience", "Positive Experience", "Health Education"]
        };

        feedbackData.unshift(sampleFeedback);
        renderFeedbackList();
        updateStats();
    }
}, 1000);

/*Gets the signed-in user name if available in localStorage*/
function getSignedInUserName() {
    let userJson = localStorage.getItem('sbp_user');
    if (!userJson) return null;
    try {
        let user = JSON.parse(userJson);
        if (user && user.name) return user.name;
    } catch {}
    return null;
}
