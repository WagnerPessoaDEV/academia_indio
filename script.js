// --- DOM ELEMENTS ---
const modal = document.getElementById('adminModal');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginAlert = document.getElementById('loginAlert');
const toast = document.getElementById('toast');

// --- CLASSES DATA ---
const CLASSES_STORAGE_KEY = 'bioplexClasses';
const DAY_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const DEFAULT_CLASSES = [
    { id: 'seed-1', day: 'Segunda', time: '06:10', name: 'FULL BODY', instructor: 'LYANDRA' },
    { id: 'seed-2', day: 'Segunda', time: '07:10', name: 'FIT DANCE', instructor: 'YAGO' },
    { id: 'seed-3', day: 'Segunda', time: '18:10', name: 'MOBILIDADE E GAP', instructor: 'ANNY' },
    { id: 'seed-4', day: 'Segunda', time: '19:10', name: 'FUNCIONAL', instructor: 'EDUARDO' },
    { id: 'seed-5', day: 'Segunda', time: '20:00', name: 'FIT DANCE', instructor: 'YAGO' },

    { id: 'seed-6', day: 'Terça', time: '06:10', name: 'FUNCIONAL', instructor: 'MAYARA' },
    { id: 'seed-7', day: 'Terça', time: '07:10', name: 'JUMP', instructor: 'POLYANA' },
    { id: 'seed-8', day: 'Terça', time: '18:10', name: 'STEP', instructor: 'POLYANA' },
    { id: 'seed-9', day: 'Terça', time: '19:10', name: 'JUMP', instructor: 'POLYANA' },
    { id: 'seed-10', day: 'Terça', time: '20:00', name: 'STEP', instructor: 'POLYANA' },

    { id: 'seed-11', day: 'Quarta', time: '06:10', name: 'FULL BODY', instructor: 'LYANDRA' },
    { id: 'seed-12', day: 'Quarta', time: '07:10', name: 'FIT DANCE', instructor: 'YAGO' },
    { id: 'seed-13', day: 'Quarta', time: '18:10', name: 'MOBILIDADE E GAP', instructor: 'ANNY' },
    { id: 'seed-14', day: 'Quarta', time: '19:10', name: 'FUNCIONAL', instructor: 'EDUARDO' },
    { id: 'seed-15', day: 'Quarta', time: '20:00', name: 'FIT DANCE', instructor: 'YAGO' },

    { id: 'seed-16', day: 'Quinta', time: '06:10', name: 'FUNCIONAL', instructor: 'MAYARA' },
    { id: 'seed-17', day: 'Quinta', time: '07:10', name: 'JUMP', instructor: 'POLYANA' },
    { id: 'seed-18', day: 'Quinta', time: '18:10', name: 'STEP', instructor: 'POLYANA' },
    { id: 'seed-19', day: 'Quinta', time: '19:10', name: 'JUMP', instructor: 'POLYANA' },
    { id: 'seed-20', day: 'Quinta', time: '20:00', name: 'STEP', instructor: 'POLYANA' },

    { id: 'seed-21', day: 'Sexta', time: '06:10', name: 'FULL BODY', instructor: 'LYANDRA' },
    { id: 'seed-22', day: 'Sexta', time: '07:10', name: 'FIT DANCE', instructor: 'YAGO' },
    { id: 'seed-23', day: 'Sexta', time: '18:10', name: 'MOBILIDADE E GAP', instructor: 'ANNY' },
    { id: 'seed-24', day: 'Sexta', time: '19:10', name: 'FUNCIONAL', instructor: 'EDUARDO' },
    { id: 'seed-25', day: 'Sexta', time: '20:00', name: 'FIT DANCE', instructor: 'YAGO' }
];

function loadClasses() {
    const raw = localStorage.getItem(CLASSES_STORAGE_KEY);
    if (!raw) {
        saveClasses(DEFAULT_CLASSES);
        return DEFAULT_CLASSES.slice();
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_CLASSES.slice();
    }
}

function saveClasses(classes) {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
}

let classes = [];

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderSchedule() {
    const grid = document.getElementById('scheduleGrid');
    if (!grid) return;

    const daysWithClasses = DAY_ORDER.filter(day => classes.some(c => c.day === day));

    if (daysWithClasses.length === 0) {
        grid.innerHTML = '<p class="section-subtitle">Nenhuma aula cadastrada no momento.</p>';
        return;
    }

    grid.innerHTML = daysWithClasses.map(day => {
        const dayClasses = classes
            .filter(c => c.day === day)
            .sort((a, b) => a.time.localeCompare(b.time));

        const items = dayClasses.map(c =>
            `<li>${escapeHtml(c.time)} - ${escapeHtml(c.name.toUpperCase())} - ${escapeHtml(c.instructor.toUpperCase())}</li>`
        ).join('');

        return `
                <div class="plan-card glass-panel fade-in-section">
                    <h3 class="plan-name">${day.toUpperCase()} - FEIRA</h3>
                    <ul class="plan-features">${items}</ul>
                    <button class="btn btn-outline-neon">AGENDE A SUA AULA PELO APLICATIVO OU DIRETO NA RECEPÇÃO</button>
                </div>`;
    }).join('');
}

function renderAdminClassList() {
    const list = document.getElementById('adminClassList');
    if (!list) return;

    if (classes.length === 0) {
        list.innerHTML = '<li style="cursor: default;">Nenhuma aula cadastrada.</li>';
        return;
    }

    const sorted = classes.slice().sort((a, b) => {
        const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
        return dayDiff !== 0 ? dayDiff : a.time.localeCompare(b.time);
    });

    list.innerHTML = sorted.map(c => `
        <li onclick="editClass('${c.id}')">
            <span>${c.day} ${escapeHtml(c.time)} - ${escapeHtml(c.name)} - ${escapeHtml(c.instructor)}</span>
            <button type="button" class="btn-text-only" style="float:right; color: var(--neon-green);" onclick="event.stopPropagation(); removeClass('${c.id}')">REMOVER</button>
        </li>`).join('');
}

function addClass(event) {
    event.preventDefault();

    const editingId = document.getElementById('editingClassId').value;
    const name = document.getElementById('className').value.trim();
    const day = document.getElementById('classDay').value;
    const time = document.getElementById('classTime').value;
    const instructor = document.getElementById('classInstructor').value.trim();

    if (!name || !day || !time || !instructor) return;

    if (editingId) {
        const target = classes.find(c => c.id === editingId);
        if (target) {
            target.name = name;
            target.day = day;
            target.time = time;
            target.instructor = instructor;
        }
        showToast('Aula atualizada com sucesso.');
    } else {
        classes.push({
            id: 'class-' + Date.now(),
            name,
            day,
            time,
            instructor
        });
        showToast('Aula adicionada com sucesso.');
    }

    saveClasses(classes);
    renderSchedule();
    renderAdminClassList();
    resetClassForm();
}

function editClass(id) {
    const target = classes.find(c => c.id === id);
    if (!target) return;

    document.getElementById('editingClassId').value = target.id;
    document.getElementById('className').value = target.name;
    document.getElementById('classDay').value = target.day;
    document.getElementById('classTime').value = target.time;
    document.getElementById('classInstructor').value = target.instructor;

    document.getElementById('classFormSubmit').textContent = 'ATUALIZAR AULA';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

function cancelEditClass() {
    resetClassForm();
}

function resetClassForm() {
    document.getElementById('editingClassId').value = '';
    document.getElementById('className').value = '';
    document.getElementById('classDay').selectedIndex = 0;
    document.getElementById('classTime').value = '';
    document.getElementById('classInstructor').value = '';
    document.getElementById('classFormSubmit').textContent = 'CARREGAR DADOS';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function removeClass(id) {
    classes = classes.filter(c => c.id !== id);
    saveClasses(classes);
    renderSchedule();
    renderAdminClassList();
    showToast('Aula removida com sucesso.');
}

// --- INITIALIZATION & ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
    classes = loadClasses();
    renderSchedule();
    renderAdminClassList();
    initScrollAnimation();
    initBackgroundVideo();
});

// Função para animação de Fade-In ao rolar (Intersection Observer)
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
}

// --- Lógica do Menu Responsivo (Hambúrguer) ---
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// --- AUTH LOGIC ---
function openAdminModal() {
    modal.classList.add('active');
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    loginAlert.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Forçar fechamento no carregamento se necessário
function closeAdminModal() {
    modal.classList.remove('active');
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin') {
        loginView.style.display = 'none';
        dashboardView.style.display = 'block';
        loginAlert.style.display = 'none';
    } else {
        loginAlert.style.display = 'block';
    }
}

function logout() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    resetClassForm();
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

if(modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAdminModal();
    });
}

// --- BACKGROUND VIDEO CONTROLS ---
function initBackgroundVideo() {
    const savedVideo = localStorage.getItem('heroVideoPath') || 'src/assets/bioplexacademia_20260704_213426_273.mp4';
    const video = document.getElementById('heroVideo');
    const source = document.getElementById('heroVideoSource');
    const select = document.getElementById('bgVideoSelect');
    
    if (video && source) {
        source.src = savedVideo;
        video.load();
        video.play().catch(e => console.log("Auto-play prevented by browser policy:", e));
    }
    
    if (select) {
        select.value = savedVideo;
    }
}

window.changeBackgroundVideo = function(path) {
    const video = document.getElementById('heroVideo');
    const source = document.getElementById('heroVideoSource');
    
    if (video && source) {
        localStorage.setItem('heroVideoPath', path);
        source.src = path;
        video.load();
        video.play().catch(e => console.log("Video play failed:", e));
        showToast("Vídeo de fundo atualizado!");
    }
};