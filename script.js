// Configuration de l'authentification
const AUTH_CONFIG = {
    username: 'enock',
    password: 'enock2000*',
    sessionDuration: 10 * 60 * 1000, // 10 minutes en millisecondes
    inactivityTimeout: 10 * 60 * 1000 // 10 minutes d'inactivité
};

// Variables globales
let sessionTimer;
let inactivityTimer;

// Système de login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Vérification avec tes nouveaux identifiants
    if(username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
        // Cache le login, montre le portfolio
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('portfolio-content').classList.remove('hidden');
        
        // Sauvegarde la session avec timestamp
        const sessionData = {
            loginTime: new Date().getTime(),
            isLoggedIn: true
        };
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        
        // Démarrer les timers de session
        startSessionTimer();
        startInactivityTimer();
        
    } else {
        alert('Login ou mot de passe incorrect');
    }
});

// Vérifier si déjà connecté au chargement
window.addEventListener('load', function() {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    
    if (sessionData && sessionData.isLoggedIn) {
        const currentTime = new Date().getTime();
        const sessionAge = currentTime - sessionData.loginTime;
        
        // Vérifier si la session est encore valide (moins de 10 minutes)
        if (sessionAge < AUTH_CONFIG.sessionDuration) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('portfolio-content').classList.remove('hidden');
            
            // Reprendre les timers
            startSessionTimer();
            startInactivityTimer();
        } else {
            // Session expirée
            logoutUser();
        }
    }
});

// Timer de session de 10 minutes
function startSessionTimer() {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (!sessionData) return;
    
    const elapsedTime = new Date().getTime() - sessionData.loginTime;
    const remainingTime = AUTH_CONFIG.sessionDuration - elapsedTime;
    
    if (remainingTime <= 0) {
        logoutUser();
        return;
    }
    
    // Mettre à jour l'affichage du timer
    updateSessionTimerDisplay(remainingTime);
    
    // Démarrer le compte à rebours
    sessionTimer = setInterval(() => {
        const currentTime = new Date().getTime();
        const newRemainingTime = AUTH_CONFIG.sessionDuration - (currentTime - sessionData.loginTime);
        
        if (newRemainingTime <= 0) {
            logoutUser();
        } else {
            updateSessionTimerDisplay(newRemainingTime);
        }
    }, 1000);
}

function updateSessionTimerDisplay(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const timerDisplay = document.getElementById('session-timer');
    
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Changer la couleur si moins de 2 minutes
        if (minutes < 2) {
            timerDisplay.style.color = '#ff6b6b';
            timerDisplay.style.fontWeight = 'bold';
        }
    }
}

// Timer d'inactivité
function startInactivityTimer() {
    resetInactivityTimer();
    
    // Événements qui resetent le timer d'inactivité
    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
}

function resetInactivityTimer() {
    // Clear existing timer
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    // Start new timer
    inactivityTimer = setTimeout(() => {
        alert('Session expirée due à l\'inactivité. Veuillez vous reconnecter.');
        logoutUser();
    }, AUTH_CONFIG.inactivityTimeout);
}

// Fonction de déconnexion
function logoutUser() {
    // Clear timers
    clearInterval(sessionTimer);
    clearTimeout(inactivityTimer);
    
    // Clear session data
    localStorage.removeItem('sessionData');
    
    // Afficher le formulaire de login
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('portfolio-content').classList.add('hidden');
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Gestionnaire de déconnexion manuelle
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                logoutUser();
            }
        });
    }
});

// FONCTION POUR AFFICHER/MASQUER LE CONTENU
function showContent(sectionId) {
    console.log('Bouton cliqué, section:', sectionId);
    
    // Masquer toutes les sections de contenu
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId + '-content');
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Scroll vers la section
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Reset inactivity timer on user action
        resetInactivityTimer();
    } else {
        console.error('Section non trouvée:', sectionId + '-content');
    }
}

// FONCTIONS POUR LA MODAL IMAGE
function openModal(img) {
    console.log('Image cliquée');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('caption');
    
    if (modal && modalImg && caption) {
        modal.style.display = 'block';
        modalImg.src = img.src;
        caption.innerHTML = img.alt;
        
        // Reset inactivity timer on user action
        resetInactivityTimer();
    } else {
        console.error('Éléments modal non trouvés');
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fermer modal en cliquant dehors
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Navigation simple
function showSection(sectionId) {
    // Cache toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Affiche la section demandée
    document.getElementById(sectionId).classList.add('active');
    
    // Reset inactivity timer on user action
    resetInactivityTimer();
}

// Fonction pour vérifier l'authentification sur les autres pages
function checkAuthentication() {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    
    if (!sessionData || !sessionData.isLoggedIn) {
        window.location.href = 'index.html';
        return false;
    }
    
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - sessionData.loginTime;
    
    if (sessionAge >= AUTH_CONFIG.sessionDuration) {
        alert('Session expirée. Veuillez vous reconnecter.');
        logoutUser();
        return false;
    }
    
    return true;
}