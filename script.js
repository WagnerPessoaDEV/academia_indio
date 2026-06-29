// --- DOM ELEMENTS ---
const modal = document.getElementById('adminModal');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginAlert = document.getElementById('loginAlert');
const publicClassList = document.getElementById('class-list');
const adminClassList = document.getElementById('adminClassList');
const toast = document.getElementById('toast');

// --- DATA STORE ---
let classes = []; // Inicializa a lista de aulas como vazia.

// --- INITIALIZATION & ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
    renderPublicSchedule();
    initScrollAnimation();
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

// --- RENDER FUNCTIONS ---
function renderPublicSchedule() {
    publicClassList.innerHTML = '';
    
    const daysOrder = { "Segunda": 1, "Terça": 2, "Quarta": 3, "Quinta": 4, "Sexta": 5, "Sábado": 6 };
    
    const sortedClasses = [...classes].sort((a, b) => {
        const dayDiff = daysOrder[a.day] - daysOrder[b.day];
        if (dayDiff !== 0) return dayDiff;
        return a.time.localeCompare(b.time);
    });

    sortedClasses.forEach((cls, index) => {
        const card = document.createElement('div');
        card.className = 'class-card';
        // Pequeno delay para estilização cascata
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
        card.innerHTML = `
            <span class="class-time">${cls.day} às ${cls.time}</span>
            <span class="class-name">${cls.name}</span>
            <span class="class-instructor">INSTR: ${cls.instructor}</span>
        `;
        publicClassList.appendChild(card);
    });
}

function renderAdminList() {
    adminClassList.innerHTML = '';
    classes.forEach(cls => {
        const li = document.createElement('li');
        li.innerHTML = `<span style="color:#555">[ID: ${cls.id.toString().substr(-4)}]</span> <strong>${cls.day}</strong> // ${cls.name} // ${cls.time} <span style="color:red; font-size:0.7em;">[DELETE]</span>`;
        li.onclick = () => deleteClass(cls.id);
        adminClassList.appendChild(li);
    });
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
        renderAdminList();
        loginAlert.style.display = 'none';
    } else {
        loginAlert.style.display = 'block';
    }
}

function logout() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
}

// --- CRUD LOGIC ---
function addClass(e) {
    e.preventDefault();
    
    const name = document.getElementById('className').value;
    const day = document.getElementById('classDay').value;
    const time = document.getElementById('classTime').value;
    const instructor = document.getElementById('classInstructor').value;

    const newClass = {
        id: Date.now(),
        name, day, time, instructor
    };

    classes.push(newClass);
    renderPublicSchedule();
    renderAdminList();
    e.target.reset();
    showToast("PROTOCOLO ADICIONADO AO SISTEMA");
}

function deleteClass(id) {
    if(confirm("CONFIRMAR EXCLUSÃO DE DADOS?")) {
        classes = classes.filter(c => c.id !== id);
        renderPublicSchedule();
        renderAdminList();
        showToast("DADOS REMOVIDOS");
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAdminModal();
});