AOS.init({ duration: 800, once: true });
let stats = JSON.parse(localStorage.getItem("stats")) || { 
    tasks: 0, 
    calories: 0, 
    streak: 0, 
    goal: 3 
};

let seconds = Number(localStorage.getItem("timerSeconds")) || 0;
let activeTab = localStorage.getItem("activeTab") || "strength";

document.addEventListener("DOMContentLoaded",()=>{
    updateVisualStats();
    loadTimerDisplay();

    setTimeout(()=>switchTab(activeTab),100);
});


function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if(type === 'strength') document.getElementById('tabStrength').classList.add('active');
    else document.getElementById('tabMind').classList.add('active');

    document.querySelectorAll('.challenge-list').forEach(l => l.classList.remove('active'));

    if(type === 'strength') document.getElementById('listStrength').classList.add('active');
    else document.getElementById('listMind').classList.add('active');

    // SAVE TAB
    localStorage.setItem("activeTab", type);
}


function toggleRow(row) {
    const isOpen = row.classList.contains('open');
    document.querySelectorAll('.smart-row').forEach(r => r.classList.remove('open'));
    if(!isOpen) row.classList.add('open');
}

function toggleDropdown(show) {
    const dd = document.getElementById('searchDropdown');
    if(show) dd.classList.add('active');
    else setTimeout(() => dd.classList.remove('active'), 200);
}

function quickFilter(tag) {
    document.getElementById('searchInput').value = tag;
    filterRows();
    toggleDropdown(false);
}

function filterRows() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let rows = document.querySelectorAll('.smart-row');

    rows.forEach(row => {
        let tags = row.getAttribute('data-tags') || '';
        let title = (row.querySelector('.row-title') && row.querySelector('.row-title').innerText) || '';
        row.style.display = (tags.toLowerCase().includes(input) || title.toLowerCase().includes(input)) ? 'block' : 'none';
    });
}

const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
const currentDateEl = document.getElementById('currentDate');
if (currentDateEl) currentDateEl.innerText = new Date().toLocaleDateString('en-US', dateOptions);

function scrollToSection(id) { 
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' }); 
}

function updateStats(checkbox, count, cals) {
    if(checkbox.checked) {
        stats.tasks += count;
        stats.calories += cals;
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } else {
        stats.tasks -= count;
        stats.calories -= cals;
    }

    saveStats(); 
    updateVisualStats();
}


function saveStats(){
    localStorage.setItem("stats", JSON.stringify(stats));
}


function updateVisualStats(){
    const calEl = document.getElementById('calDisplay');
    const progressTextEl = document.getElementById('progressText');
    const progressBarEl = document.getElementById('progressBar');
    const icon = document.getElementById('petIcon');
    const status = document.getElementById('petStatus');

    if (calEl) calEl.innerText = stats.calories;
    if (progressTextEl) progressTextEl.innerText = `${stats.tasks} / ${stats.goal} Tasks`;

    let pct = (stats.tasks / stats.goal) * 100;
    if(pct > 100) pct = 100;
    if (progressBarEl) progressBarEl.style.width = pct + '%';

    if(icon && status) {
        if(stats.tasks === 0) {
            icon.className = 'fas fa-egg pet-icon';
            status.innerText = "Status: Dormant Egg";
        }
        else if (stats.tasks < stats.goal) {
            icon.className = 'fas fa-seedling pet-icon text-success';
            status.innerText = "Status: Sprouting";
        }
        else {
            icon.className = 'fas fa-tree pet-icon text-success';
            status.innerText = "Status: Mighty Oak";
        }
    }
}

let timerInterval;
let isRunning = false;

function toggleTimer() { 
    const widget = document.getElementById('timerWidget');
    if (widget) widget.classList.toggle('active');
}


function startTimer() {
    if(!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            seconds++; 
            saveTimer();
            loadTimerDisplay();
        }, 1000); 
    }
}

function pauseTimer(){ 
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isRunning = false; 
}

/* RESET TIMER - updated: reset numbers only, do not close/hide the timer widget */
function resetTimer(){
    // Stop the running interval (if any)
    pauseTimer();

    // Reset seconds
    seconds = 0;

    // Persist and update UI
    saveTimer();
    loadTimerDisplay();

    // Do NOT remove 'active' class — leave the widget open per request
}

function saveTimer(){
    localStorage.setItem("timerSeconds", seconds);
}

function loadTimerDisplay(){
    const display = document.getElementById('timerDisplay');
    let m = Math.floor(seconds/60).toString().padStart(2,'0');
    let s = (seconds%60).toString().padStart(2,'0');
    if (display) display.innerText = `${m}:${s}`;
}