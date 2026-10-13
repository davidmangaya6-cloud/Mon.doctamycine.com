// ==========================================
// FICHIER EXTERNE : ordonnance-actions.js
// ==========================================

// 1. Télécharger ou Générer le PDF proprement
function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    const patientNom = document.getElementById('patientNom').value || 'Patient';
    const codeOrd = document.getElementById('prevCode') ? document.getElementById('prevCode').innerText : 'ORD';

    if (typeof html2pdf !== 'undefined') {
        const options = {
            margin:       0,
            filename:     `Ordonnance_${patientNom.replace(/\s+/g, '_')}_${codeOrd}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    } else {
        // Secours natif si html2pdf n'est pas chargé : ouvre le module d'impression (Enregistrer en PDF)
        window.print();
    }
}

// 2. Imprimer directement
function imprimerDirectementExterne() {
    window.print();
}

// 3. Envoyer l'ordonnance sur WhatsApp (avec détails des médicaments)
function envoyerWhatsAppExterne() {
    const patientNom = document.getElementById('patientNom').value || 'Patient';
    const codeOrd = document.getElementById('prevCode') ? document.getElementById('prevCode').innerText : 'ORD';
    
    // Récupérer la liste des médicaments pour les inclure dans le message WhatsApp
    let resumeMeds = "";
    if (typeof medicamentsList !== 'undefined' && medicamentsList.length > 0) {
        resumeMeds = "\n\nPrescription :\n" + medicamentsList.map((m, i) => `${i+1}. [${m.forme}] ${m.nom} - ${m.posologie} (${m.duree})`).join("\n");
    }

    const texteMessage = `Bonjour ${patientNom},\n\nVoici les détails de votre ordonnance médicale (${codeOrd}).${resumeMeds}\n\nVeuillez vous présenter avec ce code au besoin.`;
    const textEncoded = encodeURIComponent(texteMessage);
    
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, '_blank');
}
