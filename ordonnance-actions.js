// ==========================================
// ORDONNANCE ACTIONS - GESTION PDF, IMPRESSION & WHATSAPP
// ==========================================

// 1. TÉLÉCHARGER LE PDF (Format A4 propre)
function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Erreur : Document introuvable.");
        return;
    }

    // Récupérer le nom du patient pour nommer le fichier PDF
    const nomPatient = document.getElementById('patientNom').value.trim() || "patient";
    const nomFichierDir = `Ordonnance_${nomPatient.replace(/\s+/g, '_')}.pdf`;

    const options = {
        margin:       0,
        filename:     nomFichierDir,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Afficher un message de chargement discret
    console.log("Génération du PDF en cours...");

    // Génération et téléchargement via html2pdf
    html2pdf().from(element).set(options).save().then(() => {
        console.log("PDF téléchargé avec succès.");
    }).catch(err => {
        console.error("Erreur lors de la génération du PDF :", err);
        alert("Une erreur est survenue lors de la génération du PDF.");
    });
}

// 2. IMPRESSION DIRECTE
function imprimerDirectementExterne() {
    // Sur mobile ou application compilée, window.print() s'appuie sur la règle @media print du CSS
    window.print();
}

// 3. PARTAGE WHATSAPP (Avec résumé du texte de l'ordonnance)
function envoyerWhatsAppExterne() {
    const nomPatient = document.getElementById('patientNom').value.trim() || "Patient";
    const codeOrd = document.getElementById('ordonnanceCode').value.trim() || "ORD";
    const dateOrd = document.getElementById('ordonnanceDate').value.trim() || "";
    
    // Récupérer la liste des médicaments pour les inclure dans le message texte si besoin
    let texteMedicaments = "";
    if (typeof medicamentsList !== 'undefined' && medicamentsList.length > 0) {
        texteMedicaments = medicamentsList.map((m, i) => `\n${i + 1}. [${m.forme}] ${m.nom} - ${m.posologie} (${m.duree})`).join('');
    } else {
        texteMedicaments = "\nConsultez votre document PDF ou votre application.";
    }

    const message = `Bonjour *${nomPatient}*,\nVoici votre ordonnance médicale (${codeOrd}) du ${dateOrd} :${texteMedicaments}\n\n_Veuillez conserver ce message._`;
    
    const texteEncode = encodeURIComponent(message);
    
    // Ouvre l'application WhatsApp (ou WhatsApp Web) avec le message pré-rempli
    const urlWhatsApp = `https://wa.me/?text=${texteEncode}`;
    window.open(urlWhatsApp, '_blank');
}
