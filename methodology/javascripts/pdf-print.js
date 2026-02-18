// Client-side PDF download: injects download date and triggers browser print
(function () {
  'use strict';

  function isFrench() {
    return window.location.pathname.indexOf('/fr/') !== -1;
  }

  function getDateString() {
    var now = new Date();
    var opts = { year: 'numeric', month: 'long', day: 'numeric' };
    if (isFrench()) {
      return 'T\u00e9l\u00e9charg\u00e9 le ' + now.toLocaleDateString('fr-FR', opts);
    }
    return 'Downloaded on ' + now.toLocaleDateString('en-US', opts);
  }

  function downloadPDF() {
    // Inject date element (visible only in print via CSS)
    var dateEl = document.createElement('div');
    dateEl.id = 'pdf-download-date';
    dateEl.textContent = getDateString();

    var content = document.querySelector('.md-content__inner');
    if (content) {
      content.insertBefore(dateEl, content.firstChild);
    }

    // Small delay so the DOM updates before print dialog
    setTimeout(function () {
      window.print();
      // Clean up after print dialog closes
      if (dateEl.parentNode) {
        dateEl.parentNode.removeChild(dateEl);
      }
    }, 100);
  }

  function addButton() {
    // Find the content area where Material puts edit/source buttons
    var content = document.querySelector('.md-content__inner');
    if (!content) return;

    var btn = document.createElement('button');
    btn.className = 'md-content__button pdf-download-btn';
    btn.title = isFrench() ? 'T\u00e9l\u00e9charger en PDF' : 'Download as PDF';
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">' +
      '<path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.17v4h5v-4h3.17L12 2z" fill="currentColor"/>' +
      '</svg>';
    btn.addEventListener('click', downloadPDF);

    // Insert before the first heading
    var firstChild = content.querySelector('h1, h2');
    if (firstChild) {
      content.insertBefore(btn, firstChild);
    } else {
      content.insertBefore(btn, content.firstChild);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton);
  } else {
    addButton();
  }

  // Re-add button on navigation (Material instant loading)
  if (typeof document$ !== 'undefined') {
    document$.subscribe(addButton);
  }
})();
