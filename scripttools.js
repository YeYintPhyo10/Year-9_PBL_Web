// ==========================================

// VARIABLE DECLARATIONS

// ==========================================

let timerInterval;

let timeRemaining = 0;

let totalTime = 0;

let isRunning = false;

let progress = 0;

const taskGoal = 4;

let tasksCompleted = 0;

// DOM Elements

const timerDisplay = document.getElementById('timerDisplay');

const taskLabel = document.getElementById('currentTaskLabel');

const timerBorder = document.getElementById('timerBorder');

const streakModal = document.getElementById('streakModal');

const progressFill = document.getElementById('progressFill');

const progressText = document.getElementById('progressText');

// NOTE: We no longer need petStem/leaf variables as we are replacing them with icons.

// ==========================================

// NAVIGATION & UI

// ==========================================

function scrollToTools() {

    document.getElementById('tools-section').scrollIntoView({ behavior: 'smooth' });

}

function toggleStreak() {

    streakModal.classList.toggle('active');

}

// ==========================================

// DATA MANAGEMENT (Local Storage)

// ==========================================

function saveData() {

    const allItems = Array.from(document.querySelectorAll('#logList .log-item'));

    const logs = allItems.map(item => item.querySelector('h5').innerText);

    const types = allItems.map(item => item.querySelector('span').innerText);

    const data = {

        tasksCompleted,

        logs,

        types

    };

    localStorage.setItem("focusData", JSON.stringify(data));

}

function loadData() {

    const saved = JSON.parse(localStorage.getItem("focusData"));

    // Hide the original HTML "Pause" button because we are merging it into the Play button

    const controls = document.querySelectorAll('.timer-controls .timer-btn');

    if(controls.length >= 2) {

        controls[1].style.display = 'none'; // This hides the middle button

    }

    if (!saved) return;

    tasksCompleted = saved.tasksCompleted || 0;

    let percentage = (tasksCompleted / taskGoal) * 100;

    // Cap at 100% for visual sanity

    if(percentage > 100) percentage = 100;

    progressFill.style.width = percentage + "%";

    progressText.innerText = Math.round(percentage) + "%";

    growPet(percentage); // Update the new icon system

    const list = document.getElementById('logList');

    list.innerHTML = "";

    saved.logs.forEach((name, i) => {

        const li = document.createElement('li');

        li.className = 'log-item';

        li.innerHTML = `
<div class="log-text">
<h5>${name}</h5>
<span>${saved.types[i]}</span>
</div>
<i class="ph ph-check-circle" style="color:var(--highlight-color); font-size:1.5rem;"></i>

        `;

        list.appendChild(li);

    });

}

// ==========================================

// TIMER FUNCTIONS

// ==========================================

function setActivity(name, minutes) {

    pauseTimer(); 

    isRunning = false;

    timeRemaining = minutes * 60;

    totalTime = timeRemaining;

    taskLabel.innerText = name;

    updateTimerDisplay();

    timerBorder.style.background = `conic-gradient(var(--highlight-color) 100%, #e0e0e0 0deg)`;

    updatePlayButtonIcon('play');

}

function setManualTimer() {

    const name = document.getElementById('manualTask').value || "Custom Task";

    let mins = parseInt(document.getElementById('manualTime').value);

    if(!mins || mins <= 0) mins = 5;

    setActivity(name, mins);

}

function updateTimerDisplay() {

    const m = Math.floor(timeRemaining / 60);

    const s = timeRemaining % 60;

    timerDisplay.innerText = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;

    const percentage = (timeRemaining / totalTime) * 360;

    timerBorder.style.background = `conic-gradient(var(--highlight-color) ${percentage}deg, #e0e0e0 0deg)`;

}

// MODIFIED: This function now handles both PLAY and PAUSE

function startTimer() {

    if (timeRemaining <= 0) return;

    if (isRunning) {

        // If it is running, this click acts as PAUSE

        pauseTimer();

    } else {

        // If it is NOT running, this click acts as START

        isRunning = true;

        updatePlayButtonIcon('pause'); // Switch icon to Pause

        timerInterval = setInterval(() => {

            if (timeRemaining > 0) {

                timeRemaining--;

                updateTimerDisplay();

            } else {

                completeTimer();

            }

        }, 1000);

    }

}

function pauseTimer() {

    clearInterval(timerInterval);

    isRunning = false;

    updatePlayButtonIcon('play'); // Switch icon back to Play

}

function resetTimer() {

    pauseTimer();

    timeRemaining = 0;

    taskLabel.innerText = "Select Task";

    timerDisplay.innerText = "00:00";

    timerBorder.style.background = `conic-gradient(var(--highlight-color) 0deg, #e0e0e0 0deg)`;

}

function completeTimer() {

    pauseTimer();

    alert("Time's up! Activity logged.");

    addToLog(taskLabel.innerText, true);

    resetTimer();

}

// NEW HELPER: Changes the Play Button icon

function updatePlayButtonIcon(state) {

    // Selects the first button in the controls group (The Play Button)

    const btn = document.querySelector('.timer-controls .timer-btn:first-child');

    if (!btn) return;

    if (state === 'pause') {

        btn.innerHTML = '<i class="ph ph-pause"></i>';

        btn.style.backgroundColor = 'var(--sand-color)'; // Optional: visual cue

        btn.style.color = 'var(--primary-color)';

    } else {

        btn.innerHTML = '<i class="ph ph-play"></i>';

        btn.style.backgroundColor = ''; // Reverts to default CSS

        btn.style.color = '';

    }

}


function addCustomTask() {

    const input = document.getElementById('customInput');

    if(input.value.trim() !== "") {

        addToLog(input.value, false);

        input.value = "";

    }

}

function addToLog(taskName, isTimed) {

    const list = document.getElementById('logList');

    const now = new Date();

    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const li = document.createElement('li');

    li.className = 'log-item';

    li.innerHTML = `<div class="log-text"><h5>${taskName}</h5><span>${isTimed ? 'Timer Completed' : 'Manual Entry'} • ${timeString}</span></div><i class="ph ph-check-circle" style="color:var(--highlight-color); font-size:1.5rem;"></i>`;

    list.insertBefore(li, list.firstChild);

    updateProgress();

    saveData();

}

function updateProgress() {

    tasksCompleted++;

    let percentage = (tasksCompleted / taskGoal) * 100;

    if (percentage > 100) percentage = 100;

    progressFill.style.width = percentage + "%";

    progressText.innerText = Math.round(percentage) + "%";

    growPet(percentage);

    if(tasksCompleted === 1) {

        if(!streakModal.classList.contains('active')) toggleStreak();

    }

    if (percentage === 100 && tasksCompleted === taskGoal) {

        if(!streakModal.classList.contains('active')) toggleStreak();

    }

    saveData();

}



function growPet(percent) {

    const stageContainer = document.querySelector('.pet-stage');


    let iconDisplay = document.getElementById('streakIcon');

    if (!iconDisplay) {

        stageContainer.innerHTML = '';

        stageContainer.style.display = 'flex';

        stageContainer.style.justifyContent = 'center';

        stageContainer.style.alignItems = 'center';

        iconDisplay = document.createElement('i');
iconDisplay.id = 'streakIcon';

        iconDisplay.style.fontSize = '5rem'; 

        iconDisplay.style.color = 'var(--highlight-color)';

        iconDisplay.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        stageContainer.appendChild(iconDisplay);

    }


    let iconClass = 'fas fa-leaf'; 

    if (percent > 0 && percent < 30) {

        iconClass = 'fas fa-seedling';

    } else if (percent >= 30 && percent < 60) {

        iconClass = 'fas fa-plant-wilt';
    } else if (percent >= 60 && percent < 100) {

        iconClass = 'fas fa-tree';

    } else if (percent >= 100) {

        iconClass = 'fas fa-tree';

    }


    iconDisplay.className = `ph ${iconClass}`;


    iconDisplay.style.transform = "scale(1.3)";

    setTimeout(() => {

        iconDisplay.style.transform = "scale(1)";

    }, 300);

}


document.getElementById('customInput').addEventListener('keypress', function (e) {

    if (e.key === 'Enter') addCustomTask();

});

window.addEventListener("load", loadData);