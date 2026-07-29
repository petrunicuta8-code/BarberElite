// ===== AUTH.JS - Gestionare conturi cu localStorage =====

const USERS_KEY = 'frizerie_users';
const SESSION_KEY = 'frizerie_session';

// --- Utilitar: citire/scriere utilizatori ---
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// --- Înregistrare ---
function register(nume, email, telefon, parola) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Acest email este deja înregistrat.' };
  }
  const user = { id: Date.now(), nume, email, telefon, parola };
  users.push(user);
  saveUsers(users);
  return { success: true, message: 'Cont creat cu succes!' };
}

// --- Login ---
function login(email, parola) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.parola === parola);
  if (!user) {
    return { success: false, message: 'Email sau parolă incorectă.' };
  }
  setSession(user);
  return { success: true, user };
}

// --- Recuperare parolă ---
function recoverPassword(email, telefon) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.telefon === telefon);
  if (!user) {
    return { success: false, message: 'Nu am găsit niciun cont cu aceste date.' };
  }
  return { success: true, parola: user.parola, nume: user.nume };
}

// --- Logout ---
function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// --- Actualizare navbar în funcție de sesiune ---
const ADMIN_EMAILS = [
  'petrunicuta8@gmail.com',  // Lucii
  'barberelitero@gmail.com'  // Denis
];

function updateNavbar() {
  const session = getSession();
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;

  if (session) {
    const isAdmin = ADMIN_EMAILS.includes(session.email);
    navAuth.innerHTML = `
      ${isAdmin ? '<a href="admin.html" class="btn btn-gold" style="font-size:0.82rem;padding:8px 16px;">🛡 Conectare Admin</a>' : ''}
      <span id="nav-user-info">✂ Bun venit, ${session.nume.split(' ')[0]}!</span>
      <button class="btn btn-danger" onclick="logout()" style="padding:8px 18px;font-size:0.85rem;">Deconectare</button>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="login.html" class="btn btn-outline">Conectare</a>
      <a href="register.html" class="btn btn-gold">Înregistrare</a>
    `;
  }
}

// Apelat automat la încărcarea oricărei pagini
document.addEventListener('DOMContentLoaded', function() {
  updateNavbar();
  initMobileMenu();
});

// ===== MENIU HAMBURGER MOBIL =====
function initMobileMenu() {
  // Adaugă hamburger în navbar dacă nu există deja
  const nav = document.querySelector('nav');
  if (!nav || document.querySelector('.hamburger')) return;

  // Buton hamburger
  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';
  hamburger.id = 'hamburger';
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(hamburger);

  // Overlay meniu mobil
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.id = 'mobile-menu';
  document.body.appendChild(mobileMenu);

  hamburger.addEventListener('click', openMobileMenu);
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const session = getSession();

  const ADMIN_EMAILS = [
    'petrunicuta8@gmail.com',
    'barberelitero@gmail.com'
  ];

  let html = `<span class="mobile-menu-close" onclick="closeMobileMenu()">✕</span>`;

  // Linkuri navigație
  html += `<a href="index.html" onclick="closeMobileMenu()">Acasă</a>`;
  html += `<a href="contact.html" onclick="closeMobileMenu()">Contact</a>`;
  html += `<div class="divider"></div>`;

  if (session) {
    html += `<div class="user-greeting">✂ Bun venit, ${session.nume.split(' ')[0]}!</div>`;
    if (ADMIN_EMAILS.includes(session.email)) {
      html += `<a href="admin.html" class="btn-gold" onclick="closeMobileMenu()">🛡 Panou Admin</a>`;
    }
    html += `<a href="cont.html" class="btn-outline" onclick="closeMobileMenu()">Contul meu</a>`;
    html += `<button class="btn-danger" onclick="closeMobileMenu(); logout()">Deconectare</button>`;
  } else {
    html += `<a href="login.html" class="btn-outline" onclick="closeMobileMenu()">Conectare</a>`;
    html += `<a href="register.html" class="btn-gold" onclick="closeMobileMenu()">Înregistrare</a>`;
  }

  menu.innerHTML = html;
  menu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.remove('open');
  document.body.style.overflow = '';
}
