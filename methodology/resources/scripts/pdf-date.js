// Inject the PDF generation date as a running element for Paged.js
(function() {
  var now = new Date();
  var options = { year: 'numeric', month: 'long', day: 'numeric' };

  // Detect French from URL path (more reliable than lang attribute)
  var isFrench = window.location.pathname.indexOf('/fr/') !== -1 ||
                 window.location.href.indexOf('/fr/') !== -1;

  var dateStr;
  if (isFrench) {
    dateStr = 'Téléchargé le ' + now.toLocaleDateString('fr-FR', options);
  } else {
    dateStr = 'Downloaded on ' + now.toLocaleDateString('en-US', options);
  }

  var el = document.createElement('div');
  el.id = 'pdf-download-date';
  el.style.display = 'none';
  el.textContent = dateStr;
  document.body.insertBefore(el, document.body.firstChild);
})();
