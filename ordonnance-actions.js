function genererEtTelechargerPDFExterne() {
    // Ouvre l'outil d'impression natif du téléphone (qui permet d'enregistrer en PDF)
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
