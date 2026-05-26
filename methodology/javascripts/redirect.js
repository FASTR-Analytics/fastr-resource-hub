// This MkDocs site is being retired — methodology content now lives on the new
// FASTR site at https://fastr-analytics.org/. This script redirects anyone who
// still lands here, preserving language (EN ↔ FR).
//
// The HTML <meta refresh> in overrides/main.html is the no-JS fallback.
(function () {
  var NEW = 'https://fastr-analytics.org';
  var isFr = /\/fr(\/|$)/.test(window.location.pathname);
  var target = NEW + (isFr ? '/fr/methodology/' : '/methodology/');
  // replace() so the retired URL doesn't pollute back-history.
  window.location.replace(target);
})();
