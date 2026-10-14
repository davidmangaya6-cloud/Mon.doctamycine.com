// ==========================================
// ORDONNANCE ACTIONS - 100% INTÉGRÉ & HORS LIGNE
// ==========================================

function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Erreur : Document introuvable.");
        return;
    }

    // Déclenche l'impression / export PDF natif du téléphone de manière instantanée
    window.print();
}

function imprimerDirectementExterne() {
    window.print();
}

function envoyerWhatsAppExterne() {
    const nomPatient = document.getElementById('patientNom').value.trim() || "Patient";
    const codeOrd = document.getElementById('ordonnanceCode').value.trim() || "ORD";
    const message = `Bonjour ${nomPatient}, voici la référence de votre ordonnance médicale sécurisée (${codeOrd}).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}
