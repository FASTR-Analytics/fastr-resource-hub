// Client-side PDF download: adds button, injects download date, triggers print
function pdfPrintInit() {
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
    var dateEl = document.createElement("div");
    dateEl.id = "pdf-download-date";
    dateEl.textContent = getDateString();

    var content = document.querySelector(".md-content__inner");
    if (content) {
      content.insertBefore(dateEl, content.firstChild);
    }

    setTimeout(function () {
      window.print();
      if (dateEl.parentNode) dateEl.parentNode.removeChild(dateEl);
    }, 100);
  }

  // Remove any existing button (from previous navigation)
  var old = document.querySelector(".pdf-download-btn");
  if (old) old.parentNode.removeChild(old);

  var content = document.querySelector(".md-content__inner");
  if (!content) return;

  // Create button
  var btn = document.createElement("a");
  btn.className = "md-content__button pdf-download-btn";
  btn.href = "#";
  btn.title = isFrench() ? "T\u00e9l\u00e9charger en PDF" : "Download as PDF";
  btn.setAttribute("aria-label", btn.title);
  btn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.17v4h5v-4h3.17L12 2z"/>' +
    '</svg>';
  btn.onclick = function (e) {
    e.preventDefault();
    downloadPDF();
  };

  // Insert at top of content, before any heading
  var h1 = content.querySelector("h1");
  if (h1) {
    content.insertBefore(btn, h1);
  } else {
    content.insertBefore(btn, content.firstChild);
  }
}

// Hook into Material's instant navigation lifecycle
// document$ emits on every page load and navigation event
var _pdfInterval = setInterval(function () {
  if (typeof document$ !== "undefined") {
    clearInterval(_pdfInterval);
    document$.subscribe(function () { pdfPrintInit(); });
  }
}, 50);
