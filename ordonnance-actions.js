/* ordonnance-actions.js
 * PDF / Imprimer / WhatsApp : fonctionne dans le navigateur ET dans l'APK Capacitor.
 * Remplace entièrement l'ancien fichier (garde une copie de l'ancien au cas où).
 * Nécessite : js/html2pdf.bundle.min.js + plugins @capacitor/filesystem et @capacitor/share.
 */
(function () {
  'use strict';

  var cap = window.Capacitor;
  var estNatif = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());

  function plugin(nom) {
    return cap && cap.Plugins ? cap.Plugins[nom] : undefined;
  }

  function val(id) {
    var el = document.getElementById(id);
    return el && el.value ? String(el.value).trim() : '';
  }

  function nomFichier() {
    var code = val('ordonnanceCode') || 'ORD';
    var patient = val('patientNom').replace(/[^\w\-]+/g, '_');
    return 'Ordonnance_' + code + (patient ? '_' + patient : '') + '.pdf';
  }

  function optionsPdf(nom) {
    return {
      margin: 0,
      filename: nom,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  }

  function zoneOrdonnance() {
    var el = document.getElementById('ordonnanceDoc');
    if (!el) throw new Error("Zone #ordonnanceDoc introuvable");
    if (typeof html2pdf !== 'function') throw new Error("html2pdf non chargé (vérifie js/html2pdf.bundle.min.js dans l'APK)");
    return el;
  }

  /* Génère le PDF et le renvoie en base64 (sans passer par blob: ni <a download>) */
  async function pdfEnBase64() {
    var el = zoneOrdonnance();
    var nom = nomFichier();
    var uri = await html2pdf().set(optionsPdf(nom)).from(el).outputPdf('datauristring');
    return { nom: nom, base64: String(uri).split(',')[1] };
  }

  /* Écrit le PDF dans le cache du téléphone puis ouvre le menu de partage natif */
  async function partagerNatif(titre, texte) {
    var Filesystem = plugin('Filesystem');
    var Share = plugin('Share');
    if (!Filesystem) throw new Error("Plugin Filesystem absent de l'APK (npx cap sync n'a pas pris @capacitor/filesystem)");
    if (!Share) throw new Error("Plugin Share absent de l'APK (npx cap sync n'a pas pris @capacitor/share)");

    var pdf = await pdfEnBase64();
    var fichier = await Filesystem.writeFile({
      path: pdf.nom,
      data: pdf.base64,
      directory: 'CACHE'
    });
    await Share.share({
      title: titre,
      text: texte,
      url: fichier.uri,
      dialogTitle: titre
    });
  }

  function erreur(e) {
    var msg = (e && (e.message || e.errorMessage)) || JSON.stringify(e);
    // Annulation du menu de partage par l'utilisateur : pas une vraie erreur
    if (/cancel|dismiss/i.test(msg)) return;
    alert('ERREUR : ' + msg);
    console.error(e);
  }

  function texteMessage() {
    var patient = val('patientNom');
    var code = val('ordonnanceCode');
    return 'Ordonnance ' + code + (patient ? ' - ' + patient : '');
  }

  /* ---------- Boutons ---------- */

  window.genererEtTelechargerPDFExterne = async function () {
    try {
      if (estNatif) {
        // Dans l'APK : le menu de partage permet "Enregistrer", Drive, Fichiers, etc.
        await partagerNatif('Ordonnance PDF', texteMessage());
      } else {
        await html2pdf().set(optionsPdf(nomFichier())).from(zoneOrdonnance()).save();
      }
    } catch (e) { erreur(e); }
  };

  window.imprimerDirectementExterne = async function () {
    try {
      if (estNatif) {
        // window.print() ne fait rien dans une WebView : on passe par le menu natif
        // (choisir "Imprimer" s'il est proposé, ou ouvrir le PDF puis imprimer depuis le lecteur)
        await partagerNatif('Imprimer l\'ordonnance', texteMessage());
      } else {
        window.print();
      }
    } catch (e) { erreur(e); }
  };

  window.envoyerWhatsAppExterne = async function () {
    try {
      if (estNatif) {
        // Choisir WhatsApp dans le menu : le PDF est joint
        await partagerNatif('Envoyer l\'ordonnance', texteMessage());
      } else {
        // Dans un navigateur on ne peut pas joindre de fichier : message texte seulement
        window.open('https://wa.me/?text=' + encodeURIComponent(texteMessage()), '_blank');
      }
    } catch (e) { erreur(e); }
  };
})();
