// This MkDocs site is being retired — methodology content now lives at
// https://fastr-analytics.org/. This script redirects anyone who lands here,
// preserving language (EN ↔ FR).
//
// Material's `navigation.instant` swaps page content without a full reload,
// so we subscribe to the `document$` observable Material exposes — it fires
// on the initial load AND on every instant navigation, ensuring the redirect
// runs no matter how the user got here.
//
// The <meta http-equiv="refresh"> in overrides/main.html is the no-JS fallback.
(function () {
  var redirect = function () {
    var NEW = 'https://fastr-analytics.org';
    var isFr = /\/fr(\/|$)/.test(window.location.pathname);
    // replace() so the retired URL doesn't pollute back-history.
    window.location.replace(NEW + (isFr ? '/fr/' : '/'));
  };
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(redirect);
  } else {
    redirect();
  }
})();
