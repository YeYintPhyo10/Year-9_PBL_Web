let steps = 0, mins = 0, exercises = 0, streak = 0;
let joinedChallenges = [], dailyActivities = [];
let uploadedImageUrl = null;
const wellnessGoal = 300;

function switchTab(show, btn) {
    ["pl-personal-board", "pl-community-board"].forEach(id => document.getElementById(id).classList.add("pl-hidden"));
    document.getElementById(show).classList.remove("pl-hidden");

    ["pl-tab-personal", "pl-tab-community"].forEach(id => document.getElementById(id).classList.remove("pl-active"));
    document.getElementById(btn).classList.add("pl-active");
}
function createPost() {
    const currentUserStr = localStorage.getItem('sbp_user');
    if (!currentUserStr) {
        alert("Please sign in to make a community post!");
        // Optionally: Show the sign in modal here instead of alert
        return false; // Don't submit or display anything
    }
    // ...otherwise allow posting
    // (You can redirect to account_parklife.html or just enable posting right here.)
}
function updateSteps() {
    let s = parseInt(document.getElementById("pl-stepInput").value);
    if (s > 0) {
        steps += s;
        document.getElementById("pl-displaySteps").innerText = steps.toLocaleString();
        document.getElementById("pl-userStepsLeaderboard").innerText = steps.toLocaleString() + " steps";
        document.getElementById("pl-stepInput").value = '';
    }
}

function renderActivityList() {
    let list = document.getElementById("pl-dailyActivityList");
    let emptyMessage = document.getElementById("pl-emptyLogMessage");
    list.querySelectorAll('li:not(#pl-emptyLogMessage)').forEach(li => li.remove());

    if (!dailyActivities.length) emptyMessage?.classList.remove('pl-hidden');
    else {
        emptyMessage?.classList.add('pl-hidden');
        dailyActivities.forEach(a => {
            let li = document.createElement('li');
            li.className = 'flex justify-between items-center pl-activity-item';
            li.innerHTML = `<span class="pl-activity-name">${a.name}</span><span class="pl-activity-minutes">${a.minutes} mins</span>`;
            list.appendChild(li);
        });
    }
}

function addActivity() {
    let name = document.getElementById("pl-activityName").value;
    let m = parseInt(document.getElementById("pl-activityMins").value);
    if (!name || m <= 0) return;

    exercises++;
    dailyActivities.push({ name, minutes: m });
    renderActivityList();

    mins += m;
    if (mins >= wellnessGoal) {
        streak++;
        mins %= wellnessGoal;
    }
    let currentMins = (mins === 0 && streak > 0) ? wellnessGoal : mins;

    document.getElementById("pl-displayMins").innerText = currentMins;
    document.getElementById("pl-displayExercises").innerText = exercises;
    document.getElementById("pl-goalCompletionStreak").innerText = streak;

    let pct = (currentMins / wellnessGoal) * 100;
    document.getElementById("pl-wellnessProgress").style.width = pct + "%";
    document.getElementById("pl-progressText").innerText = `${currentMins} / ${wellnessGoal}`;

    document.getElementById("pl-activityName").value = '';
    document.getElementById("pl-activityMins").value = '';
}

function setMood(btn, mood) {
    document.querySelectorAll(".pl-mood-selector button").forEach(b => b.classList.remove("pl-selected"));
    btn.classList.add("pl-selected");
    document.getElementById("pl-moodFeedback").innerText = "Mood selected: " + mood;
}

function toggleChallenge(btn, name) {
    let list = document.getElementById("pl-joinedProgramsList");
    let index = joinedChallenges.indexOf(name);

    if (index !== -1) {
        joinedChallenges.splice(index, 1);
        btn.innerText = "Join";
        btn.classList.replace("pl-btn-primary", "pl-btn-secondary");
        btn.classList.remove("pl-text-white");
    } else {
        joinedChallenges.push(name);
        btn.innerText = "Joined";
        btn.classList.replace("pl-btn-secondary", "pl-btn-primary");
        btn.classList.add("pl-text-white");
    }

    list.innerHTML = joinedChallenges.length 
        ? joinedChallenges.map(c => `<li class="flex items-center"><i class="fas fa-check-circle me-2 text-green-600"></i>${c}</li>`).join("")
        : "<li>No programs joined yet.</li>";
}

function previewImage(event) {
    let file = event.target.files[0];
    let preview = document.getElementById('pl-imagePreview');
    if (file) {
        let reader = new FileReader();
        reader.onload = e => {
            uploadedImageUrl = e.target.result;
            preview.src = uploadedImageUrl;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImageUrl = null;
        preview.src = '';
        preview.style.display = 'none';
    }
}

function createPost() {
    let text = document.getElementById("pl-postInput").value;
    if (!text && !uploadedImageUrl) return;

    let feed = document.getElementById("pl-feedContainer");
    let now = new Date();
    let timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}`;
    let imageHtml = uploadedImageUrl ? `<img src="${uploadedImageUrl}" class="pl-feed-image" alt="User image">` : '';

    feed.innerHTML = `<div class="pl-feed-post pb-4">
        <p class="pl-feed-author">You</p>
        <p class="pl-feed-text">${text}</p>
        ${imageHtml}
        <span class="pl-feed-timestamp">Posted at ${timestamp}</span>
    </div>` + feed.innerHTML;

    document.getElementById("pl-postInput").value = '';
    document.getElementById("pl-imageUpload").value = '';
    document.getElementById("pl-imagePreview").style.display = 'none';
    uploadedImageUrl = null;
}
function createPost() {
    // Get the signed-in user's info (from navbarBtn/login)
    const userStr = localStorage.getItem('sbp_user');
    let username = "Anonymous";
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            username = user.name || "Anonymous";
        } catch (e) {}
    }

    // Get post content from textarea
    const postContent = document.getElementById('pl-postInput').value.trim();
    if (!postContent) {
        alert('Please enter something for your post!');
        return;
    }

    // Optionally handle image/post time here
    const feed = document.getElementById('pl-feedContainer');
    const postItem = document.createElement('div');
    postItem.className = 'pl-feed-post';
    postItem.innerHTML = `
        <p class="pl-feed-author">${username} <i class="fas fa-user"></i></p>
        <p class="pl-feed-text">${postContent}</p>
        <span class="pl-feed-timestamp">${(new Date()).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
    `;
    // Add new post on top
    feed.prepend(postItem);

    // Clear the input
    document.getElementById('pl-postInput').value = '';
    // Hide image preview if you have any
    const imagePreview = document.getElementById('pl-imagePreview');
    if(imagePreview) imagePreview.style.display = 'none';
}
function saveReflectionAndGoal() {
    let reflection = document.getElementById("pl-dailyReflection").value;
    let goal = document.getElementById("pl-nextDayGoal").value;
    let feedback = document.getElementById("pl-goalFeedback");

    if (!reflection && !goal) {
        feedback.innerText = "Please enter either a reflection or a focus goal to save.";
        feedback.style.color = 'red';
        return;
    }

    feedback.innerText = goal 
        ? `Reflection and Goal saved! Tomorrow's focus is: "${goal.substring(0,30)}..."`
        : "Reflection saved! Great insights on your day!";
    feedback.style.color = 'var(--primary-color)';

    document.getElementById("pl-dailyReflection").value = '';
    document.getElementById("pl-nextDayGoal").value = '';

    setTimeout(() => feedback.innerText = '', 5000);
}

document.addEventListener('DOMContentLoaded', renderActivityList);


/*Unsign in */
function createPostfornotsignin() {
        alert('Please sign in to post to the community feed!');
}

// Only one previewImage function, keep as-is

// Only one createPost function, with this implementation:
function createPost() {
    const userStr = localStorage.getItem('sbp_user');
    let username = "Anonymous";
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            username = user.name || "Anonymous";
        } catch (e) {}
    }
    const postContent = document.getElementById('pl-postInput').value.trim();
    if (!postContent && !uploadedImageUrl) {
        alert('Please enter something for your post or upload an image!');
        return;
    }
    const feed = document.getElementById('pl-feedContainer');
    const postItem = document.createElement('div');
    postItem.className = 'pl-feed-post';
    let imageHTML = '';
    if (uploadedImageUrl) {
        imageHTML = `<img src="${uploadedImageUrl}" class="pl-feed-image mb-2" alt="User image">`;
    }
    postItem.innerHTML = `
        <p class="pl-feed-author">${username} <i class="fas fa-user"></i></p>
        <p class="pl-feed-text">${postContent}</p>
        ${imageHTML}
        <span class="pl-feed-timestamp">${(new Date()).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
    `;
    feed.prepend(postItem);

    document.getElementById('pl-postInput').value = '';
    document.getElementById('pl-imageUpload').value = '';
    document.getElementById('pl-imagePreview').style.display = 'none';
    uploadedImageUrl = null;
}


function createPost() {
    const userStr = localStorage.getItem('sbp_user');
    let username = "Anonymous";
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            username = user.name || "Anonymous";
        } catch (e) {}
    }
    const postContent = document.getElementById('pl-postInput').value.trim();
    // Check for content or image
    if (!postContent && !uploadedImageUrl) {
        alert('Please enter something for your post or upload an image!');
        return;
    }
    const feed = document.getElementById('pl-feedContainer');
    const postItem = document.createElement('div');
    postItem.className = 'pl-feed-post';
    let imageHTML = '';
    if (uploadedImageUrl) {
        imageHTML = `<img src="${uploadedImageUrl}" class="pl-feed-image mb-2" alt="User image">`;
    }
    postItem.innerHTML = `
        <p class="pl-feed-author">${username} <i class="fas fa-user"></i></p>
        <p class="pl-feed-text">${postContent}</p>
        ${imageHTML}
        <span class="pl-feed-timestamp">${(new Date()).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
    `;
    feed.prepend(postItem);

    document.getElementById('pl-postInput').value = '';
    document.getElementById('pl-imageUpload').value = '';
    document.getElementById('pl-imagePreview').style.display = 'none';
    uploadedImageUrl = null;
}
