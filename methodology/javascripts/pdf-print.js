// Client-side PDF download: adds button, injects download date, triggers print
(function () {
  function isFrench() {
    return location.pathname.indexOf("/fr/") !== -1;
  }

  function getDateString() {
    var now = new Date();
    var opts = { year: "numeric", month: "long", day: "numeric" };
    return isFrench()
      ? "T\u00e9l\u00e9charg\u00e9 le " + now.toLocaleDateString("fr-FR", opts)
      : "Downloaded on " + now.toLocaleDateString("en-US", opts);
  }

  function downloadPDF() {
    // Remove any leftover date element from a previous attempt
    var old = document.getElementById("pdf-download-date");
    if (old) old.parentNode.removeChild(old);

    // Inject date element
    var dateEl = document.createElement("div");
    dateEl.id = "pdf-download-date";
    dateEl.textContent = getDateString();

    var content = document.querySelector(".md-content__inner");
    if (content) content.insertBefore(dateEl, content.firstChild);

    // Print directly (no setTimeout — keeps user gesture chain intact for Safari)
    window.print();

    // Clean up after print dialog closes
    if (dateEl.parentNode) dateEl.parentNode.removeChild(dateEl);
  }

  function addButton() {
    if (document.querySelector(".pdf-download-btn")) return;

    var content = document.querySelector(".md-content__inner");
    if (!content) return;

    var btn = document.createElement("a");
    btn.className = "pdf-download-btn";
    btn.href = "#";
    btn.title = isFrench() ? "T\u00e9l\u00e9charger en PDF" : "Download as PDF";
    btn.setAttribute("aria-label", btn.title);
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.17v4h5v-4h3.17L12 2z"/>' +
      "</svg>";
    btn.onclick = function (e) {
      e.preventDefault();
      downloadPDF();
    };

    var h1 = content.querySelector("h1");
    if (h1) {
      content.insertBefore(btn, h1);
    } else {
      content.insertBefore(btn, content.firstChild);
    }
  }

  // Add button on initial load
  addButton();

  // Detect instant navigation: Material uses history.pushState for page swaps
  var origPushState = history.pushState;
  history.pushState = function () {
    origPushState.apply(this, arguments);
    setTimeout(addButton, 200);
  };
  window.addEventListener("popstate", function () {
    setTimeout(addButton, 200);
  });
})();
