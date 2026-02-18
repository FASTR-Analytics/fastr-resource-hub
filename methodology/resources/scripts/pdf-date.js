// PDF preprocessing: runs before Paged.js renders the document
(function() {
  // Remove all iframes to prevent network timeouts during PDF rendering
  // (embedded Scribe walkthroughs poll third-party services endlessly)
  var iframes = document.querySelectorAll('iframe');
  for (var i = 0; i < iframes.length; i++) {
    iframes[i].parentNode.removeChild(iframes[i]);
  }

  // Inject the PDF generation date as a running element for Paged.js
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
