// ==========================================
// ORDONNANCE ACTIONS - GESTION PROPRE SUR MOBILE
// ==========================================

// 1. TÉLÉCHARGER LE PDF (Génération directe sans quitter l'app)
function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Erreur : Document introuvable.");
        return;
    }

    const nomPatient = document.getElementById('patientNom').value.trim() || "patient";
    const nomFichier = `Ordonnance_${nomPatient.replace(/\s+/g, '_')}.pdf`;

    // Si la bibliothèque html2pdf est présente, on l'utilise pour un rendu A4 parfait
    if (typeof html2pdf !== 'undefined') {
        const options = {
            margin:       5,
            filename:     nomFichier,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                scrollY: 0 
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Notification visuelle discrète
        console.log("Génération du PDF en cours...");

        html2pdf().from(element).set(options).save().then(() => {
            console.log("PDF téléchargé avec succès !");
        }).catch(err => {
            console.error("Erreur de génération PDF :", err);
            alert("Impossible de générer le PDF. Vérifiez les données.");
        });
    } else {
        // Fallback de sécurité si la librairie ne répond pas
        alert("La bibliothèque PDF n'est pas encore prête. Patientez une seconde et réessayez.");
    }
}

// 2. IMPRESSION DIRECTE (Redirigée vers le téléchargement PDF pour éviter d'être éjecté de l'app)
function imprimerDirectementExterne() {
    // Sur mobile, le téléchargement direct du PDF fait office d'impression sécurisée
    genererEtTelechargerPDFExterne();
}

// 3. WHATSAPP
function envoyerWhatsAppExterne() {
    const nomPatient = document.getElementById('patientNom').value.trim() / "Patient";
    const codeOrd = document.getElementById('ordonnanceCode').value.trim() || "ORD";
    const message = `Bonjour ${nomPatient}, voici la référence de votre ordonnance médicale sécurisée (${codeOrd}).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}
