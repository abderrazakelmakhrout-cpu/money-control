// ==================== AUTHENTIFICATION ====================
let loginContainer, appContainer;

document.addEventListener('DOMContentLoaded', () => {
    loginContainer = document.getElementById('loginContainer');
    appContainer = document.getElementById('appContainer');
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('✅ Connecté:', user.email);
            showApp();
            loadUserData(user.uid);
        } else {
            console.log('❌ Déconnecté');
            showLogin();
        }
    });
});

function showApp() {
    if (loginContainer) loginContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderTransactions === 'function') renderTransactions();
}

function showLogin() {
    if (loginContainer) loginContainer.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
}

// Connexion Email
async function loginWithEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showNotification('Connexion réussie !', 'success');
    } catch (error) {
        showNotification(error.message, 'danger');
    }
}

// Inscription
async function registerWithEmail() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirm) {
        showNotification('Les mots de passe ne correspondent pas', 'danger');
        return;
    }
    
    try {
        const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({ displayName: name });
        await createUserDocument(result.user.uid, { name, email });
        showNotification('Compte créé !', 'success');
    } catch (error) {
        showNotification(error.message, 'danger');
    }
}

// Connexion Google
async function loginWithGoogle() {
    try {
        await firebase.auth().signInWithPopup(googleProvider);
        showNotification('Connexion Google réussie !', 'success');
    } catch (error) {
        showNotification('Erreur Google', 'danger');
    }
}

// Réinitialisation mot de passe
async function resetPassword() {
    const email = document.getElementById('resetEmail').value;
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        showNotification('Email envoyé !', 'success');
        showLoginForm();
    } catch (error) {
        showNotification('Email non trouvé', 'danger');
    }
}

// Déconnexion
async function logout() {
    await firebase.auth().signOut();
    showNotification('Déconnecté', 'success');
    localStorage.clear();
    setTimeout(() => location.reload(), 500);
}

// Créer document utilisateur
async function createUserDocument(uid, userData) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
        await userRef.set({
            ...userData,
            createdAt: new Date().toISOString(),
            transactions: [],
            objectifs: []
        });
    }
}

// Charger données utilisateur
async function loadUserData(uid) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (doc.exists) {
        const data = doc.data();
        if (data.transactions?.length) localStorage.setItem('transactions', JSON.stringify(data.transactions));
        if (data.objectifs?.length) localStorage.setItem('objectifs', JSON.stringify(data.objectifs));
    }
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderTransactions === 'function') renderTransactions();
}

// Synchroniser dans le cloud
async function syncToCloud() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const objectifs = JSON.parse(localStorage.getItem('objectifs') || '[]');
    await db.collection('users').doc(user.uid).set({
        transactions, objectifs, lastSync: new Date().toISOString()
    }, { merge: true });
}

// Sauvegarde automatique
setInterval(() => { if (firebase.auth().currentUser) syncToCloud(); }, 30000);

// Notifications
function showNotification(msg, type) {
    const panel = document.getElementById('notifPanel');
    if (!panel) { alert(msg); return; }
    const el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>${msg}`;
    panel.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

// UI Functions
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'none';
}
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('resetForm').style.display = 'none';
}
function showResetForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'block';
}

// Exporter
window.loginWithEmail = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.resetPassword = resetPassword;
window.logout = logout;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.showResetForm = showResetForm;
window.syncToCloud = syncToCloud;
