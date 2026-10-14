function genererEtTelechargerPDFExterne() {
    const element = document.getElementById('ordonnanceDoc');
    if (!element) {
        alert("Document introuvable.");
        return;
    }

    const nomPatient = document.getElementById('patientNom').value.trim() || "patient";
    const options = {
        margin: 5,
        filename: `Ordonnance_${nomPatient.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
        html2pdf().from(element).set(options).save().catch(err => {
            console.error(err);
            alert("Erreur lors de la génération du PDF.");
        });
    } else {
        alert("La bibliothèque PDF locale n'est pas chargée. Vérifiez les chemins dans index.html.");
    }
}

function imprimerDirectementExterne() {
    // Sur mobile, l'export PDF fait office d'impression sécurisée
    genererEtTelechargerPDFExterne();
}

function envoyerWhatsAppExterne() {
    const nomPatient = document.getElementById('patientNom').value.trim() || "Patient";
    const codeOrd = document.getElementById('ordonnanceCode').value.trim() || "ORD";
    const message = `Bonjour ${nomPatient}, voici la référence de votre ordonnance médicale sécurisée (${codeOrd}).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}
