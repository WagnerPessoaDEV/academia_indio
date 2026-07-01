// --- DOM ELEMENTS ---
const modal = document.getElementById('adminModal');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginAlert = document.getElementById('loginAlert');
const toast = document.getElementById('toast');

// --- INITIALIZATION & ANIMATIONS ---
document.addEventListener('DOMContentLoaded', () => {
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