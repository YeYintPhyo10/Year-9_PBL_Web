const reviews = [
    {
        avatar: "img/ko myo.jpeg",
        name: "Ko Myo",
        review: "Beautiful, modern and easy to explore! The park section is full of information and the navigation is smooth. Truly impressive!",
        stars: 5
    },
    {
        avatar: "img/aung moe win.jpeg",
        name: "Coach Stan",
        review: "Amazing site, very easy to navigate and the content is fresh! Highly recommend for locals and tourists.",
        stars: 4
    },
    {
        avatar: "img/coach stan.jpeg",
        name: "Coach Stan",
        review: "A lovely resource with great visuals and lots of info. New events every week keeps me coming back.",
        stars: 5
    }
];

let currentReview = 0;

function setReview({ avatar, name, review, stars } = {}) {
    document.getElementById("reviewer-avatar").src = avatar;
    document.getElementById("reviewer-name").textContent = name;
    document.getElementById("review-text").textContent = review;
    // Stars
    const starContainer = document.getElementById("star-rating");
    starContainer.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("i");
        star.className = `fa-star fa-lg ${i <= stars ? "fas" : "far"}`;
        star.style.color = "#ffc800";
        starContainer.appendChild(star);
    }
    // Disable buttons if at start/end
    document.getElementById("review-prev").disabled = currentReview === 0;
    document.getElementById("review-next").disabled = currentReview === reviews.length - 1;
}

function showReview(index) {
    if (index >= 0 && index < reviews.length) {
        currentReview = index;
        setReview(reviews[currentReview]);
    }
}

document.getElementById("review-prev").addEventListener("click", function () {
    showReview(currentReview - 1);
});
document.getElementById("review-next").addEventListener("click", function () {
    showReview(currentReview + 1);
});

// Initial display
setReview(reviews[0]);