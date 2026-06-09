// ============================================
// FICHIER: sync.js
// RÔLE: Synchronisation avancée des données
// ============================================

// Sauvegarder une transaction spécifique
async function saveTransactionToCloud(transaction) {
    const user = firebase.auth().currentUser;
    if (!user) return false;
    
    try {
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        const currentTransactions = doc.exists ? (doc.data().transactions || []) : [];
        
        // Vérifier si la transaction existe déjà
        const index = currentTransactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
            currentTransactions[index] = transaction;
        } else {
            currentTransactions.push(transaction);
        }
        
        await userRef.update({ transactions: currentTransactions });
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde transaction:', error);
        return false;
    }
}

// Sauvegarder un objectif spécifique
async function saveObjectifToCloud(objectif) {
    const user = firebase.auth().currentUser;
    if (!user) return false;
    
    try {
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        const currentObjectifs = doc.exists ? (doc.data().objectifs || []) : [];
        
        const index = currentObjectifs.findIndex(o => o.id === objectif.id);
        if (index !== -1) {
            currentObjectifs[index] = objectif;
        } else {
            currentObjectifs.push(objectif);
        }
        
        await userRef.update({ objectifs: currentObjectifs });
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde objectif:', error);
        return false;
    }
}

// Supprimer une transaction
async function deleteTransactionFromCloud(transactionId) {
    const user = firebase.auth().currentUser;
    if (!user) return false;
    
    try {
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        const currentTransactions = doc.exists ? (doc.data().transactions || []) : [];
        const filtered = currentTransactions.filter(t => t.id !== transactionId);
        
        await userRef.update({ transactions: filtered });
        return true;
    } catch (error) {
        console.error('Erreur suppression:', error);
        return false;
    }
}

// Exporter
window.saveTransactionToCloud = saveTransactionToCloud;
window.saveObjectifToCloud = saveObjectifToCloud;
window.deleteTransactionFromCloud = deleteTransactionFromCloud;
