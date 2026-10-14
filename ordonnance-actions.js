// ==========================================
// ORDONNANCE ACTIONS - VERSION MOBILE OPTIMISÉE
// ==========================================

// 1. TÉLÉCHARGER / IMPRIMER LE PDF (Méthode Native Sûre)
function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Erreur : Document introuvable.");
        return;
    }

    // Si la bibliothèque html2pdf est bien chargée, on l'utilise
    if (typeof html2pdf !== 'undefined') {
        const nomPatient = document.getElementById('patientNom').value.trim() || "patient";
        const options = {
            margin:       0,
            filename:     `Ordonnance_${nomPatient.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    } else {
        // Solution de secours infaillible sur mobile : Ouvre le module d'impression/export du téléphone
        imprimerDirectementExterne();
    }
}

// 2. IMPRESSION DIRECTE (Ouvre la boîte de dialogue d'impression ou d'enregistrement PDF du téléphone)
function imprimerDirectementExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) return;

    // Crée une fenêtre temporaire propre pour l'impression mobile
    const fenetreImpression = window.open('', '_blank');
    if (!fenetreImpression) {
        alert("Veuillez autoriser les fenêtres pop-up pour imprimer ou enregistrer en PDF.");
        return;
    }

    fenetreImpression.document.write(`
        <html>
            <head>
                <title>Ordonnance Médicale</title>
                <style>
                    body { font-family: system-ui, sans-serif; margin: 0; padding: 10px; background: #fff; }
                    #ordonnanceDoc { width: 100% !important; max-width: 210mm; margin: 0 auto; box-shadow: none !important; }
                    ${document.querySelector('style') ? document.querySelector('style').innerHTML : ''}
                </style>
            </head>
            <body>
                ${element.outerHTML}
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
            </body>
        </html>
    `);
    fenetreImpression.document.close();
}

// 3. WHATSAPP
function envoyerWhatsAppExterne() {
    const nomPatient = document.getElementById('patientNom').value.trim() || "Patient";
    const codeOrd = document.getElementById('ordonnanceCode').value.trim() || "ORD";
    const message = `Bonjour ${nomPatient}, voici la référence de votre ordonnance médicale sécurisée (${codeOrd}).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}
