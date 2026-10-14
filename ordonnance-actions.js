// ==========================================
// ORDONNANCE ACTIONS - PDF & IMPRESSION ROBUSTE
// ==========================================

// 1. TÉLÉCHARGER LE PDF (Version optimisée et robuste)
function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Erreur : Document introuvable.");
        return;
    }

    const nomPatient = document.getElementById('patientNom').value.trim() || "patient";
    const nomFichierDir = `Ordonnance_${nomPatient.replace(/\s+/g, '_')}.pdf`;

    // Options de configuration pour html2pdf
    const options = {
        margin:       0,
        filename:     nomFichierDir,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            scrollY: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Vérification de la présence de la bibliothèque
    if (typeof html2pdf === 'undefined') {
        alert("La bibliothèque de génération PDF n'est pas chargée. Vérifiez votre connexion ou les scripts.");
        return;
    }

    // Génération du PDF
    html2pdf().from(element).set(options).save().then(() => {
        console.log("PDF téléchargé avec succès.");
    }).catch(err => {
        console.error("Erreur PDF :", err);
        // Solution de secours : si le PDF bloque, on bascule sur l'impression/aperçu natif
        window.print();
    });
}

// 2. IMPRESSION DIRECTE
function imprimerDirectementExterne() {
    // Déclenche l'impression ou l'ouverture du gestionnaire d'impression du téléphone/navigateur
    window.print();
}

// 3. WHATSAPP (Optionnel ou désactivé si vous préférez vous concentrer sur le PDF)
function envoyerWhatsAppExterne() {
    const nomPatient = document.getElementById('patientNom').value.trim() || "Patient";
    const codeOrd = document.getElementById('ordonnanceCode').value.trim() || "ORD";
    
    const message = `Bonjour ${nomPatient}, voici la référence de votre ordonnance sécurisée (${codeOrd}). Veuillez récupérer votre fichier PDF auprès du cabinet.`;
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(urlWhatsApp, '_blank');
}
