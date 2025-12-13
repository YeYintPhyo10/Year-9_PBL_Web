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
        let tags = row.getAttribute('data-tags');
        let title = row.querySelector('.row-title').innerText.toLowerCase();
        row.style.display = (tags.includes(input) || title.includes(input)) ? 'block' : 'none';
    });
}

const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-US', dateOptions);

function scrollToSection(id) { 
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); 
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
    document.getElementById('calDisplay').innerText = stats.calories;
    document.getElementById('progressText').innerText = `${stats.tasks} / ${stats.goal} Tasks`;

    let pct = (stats.tasks / stats.goal) * 100;
    if(pct > 100) pct = 100;
    document.getElementById('progressBar').style.width = pct + '%';

    const icon = document.getElementById('petIcon');
    const status = document.getElementById('petStatus');

    if(stats.tasks === 0) { icon.className = 'fas fa-egg pet-icon'; status.innerText = "Status: Dormant Egg"; }
    else if (stats.tasks < stats.goal) { icon.className = 'fas fa-seedling pet-icon text-success'; status.innerText = "Status: Sprouting"; }
    else { icon.className = 'fas fa-tree pet-icon text-success'; status.innerText = "Status: Mighty Oak"; }
}

let timerInterval;
let isRunning = false;

function toggleTimer() { 
    document.getElementById('timerWidget').classList.toggle('active'); 
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
    clearInterval(timerInterval); 
    isRunning = false; 
}

function saveTimer(){
    localStorage.setItem("timerSeconds", seconds);
}

function loadTimerDisplay(){
    let m = Math.floor(seconds/60).toString().padStart(2,'0');
    let s = (seconds%60).toString().padStart(2,'0');
    document.getElementById('timerDisplay').innerText = `${m}:${s}`;
}
