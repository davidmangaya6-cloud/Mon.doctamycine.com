// ==========================================
// FICHIER EXTERNE : ordonnance-actions.js
// SÉCURISÉ POUR INITIALISATION HORS-LIGNE
// ==========================================

// Détection ultra-sécurisée de l'environnement APK Mobile (Capacitor)
function estSurMobile() {
    return typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Share;
}

// 1. Télécharger ou Générer le PDF proprement (Avec partage natif sur APK)
async function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Erreur : L'élément #ordonnanceDoc n'a pas été trouvé dans le HTML.");
        return;
    }

    const patientNom = document.getElementById('patientNom')?.value || 'Patient';
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
                // Génération propre du PDF en mémoire sous forme de chaîne Base64
                const pdfBase64 = await html2pdf().set(options).from(element).outputPdf('datauristring');
                
                // Déclenchement du panneau de partage système Android Natif (Email, Bluetooth, etc.)
                await window.Capacitor.Plugins.Share.share({
                    title: `Ordonnance ${codeOrd}`,
                    text: `Ordonnance numérique de ${patientNom}.`,
                    url: pdfBase64,
                    dialogTitle: 'Partager ou enregistrer le PDF via :'
                });
            } catch (error) {
                alert("Erreur lors du partage Android : " + error.message);
            }
        } else {
            // Secours classique pour navigateur web de bureau (PC)
            html2pdf().set(options).from(element).save();
        }
    } else {
        // Secours si html2pdf n'est pas chargé localement
        window.print();
    }
}

// 2. Imprimer directement
function imprimerDirectementExterne() {
    window.print();
}

// 3. Forcer l'allumage et la liaison avec vos boutons HTML dès que le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
    // Si vous utilisez des écouteurs d'événements dynamiques, ils s'attachent ici de manière sécurisée
    console.log("DocSecur Pro - Fonctions actions prêtes.");
});
