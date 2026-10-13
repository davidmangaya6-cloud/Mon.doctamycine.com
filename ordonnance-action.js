// ==========================================
// FICHIER EXTERNE : ordonnance-actions.js
// CONFIGURÉ POUR APK CAPACITOR (PDF & PRINT)
// ==========================================

// Détection automatique de l'environnement APK Mobile
function estSurMobile() {
    return typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.Share;
}

// 1. Télécharger ou Générer le PDF proprement (Avec partage natif sur APK)
async function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    const patientNom = document.getElementById('patientNom').value || 'Patient';
    const codeOrd = document.getElementById('prevCode') ? document.getElementById('prevCode').innerText : 'ORD';
    const nomFichier = `Ordonnance_${patientNom.replace(/\s+/g, '_')}_${codeOrd}.pdf`;

    if (typeof html2pdf !== 'undefined') {
        const options = {
            margin:       0,
            filename:     nomFichier,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        if (estSurMobile()) {
            try {
                // Génération du PDF en arrière-plan sous forme de chaîne Base64
                const pdfBase64 = await html2pdf().set(options).from(element).outputPdf('datauristring');
                
                // Ouverture du panneau de partage natif Android (Email, Bluetooth, Impression...)
                await Capacitor.Plugins.Share.share({
                    title: `Ordonnance ${codeOrd}`,
                    text: `Ordonnance numérique de ${patientNom}.`,
                    url: pdfBase64,
                    dialogTitle: 'Partager ou enregistrer le PDF via :'
                });
            } catch (error) {
                alert("Erreur lors du partage : " + error.message);
            }
        } else {
            // Secours classique et inchangé pour navigateur web de bureau
            html2pdf().set(options).from(element).save();
        }
    } else {
        // Secours natif si html2pdf n'est pas chargé
        window.print();
    }
}

// 2. Imprimer directement
function imprimerDirectementExterne() {
    window.print();
}
