// Client-side PDF download: per-page and full-guide printing
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

  // --- Single page PDF ---
  function downloadPDF() {
    var old = document.getElementById("pdf-download-date");
    if (old) old.parentNode.removeChild(old);

    var dateEl = document.createElement("div");
    dateEl.id = "pdf-download-date";
    dateEl.textContent = getDateString();

    var content = document.querySelector(".md-content__inner");
    if (content) content.insertBefore(dateEl, content.firstChild);

    window.print();

    if (dateEl.parentNode) dateEl.parentNode.removeChild(dateEl);
  }

  // --- Full guide PDF ---
  function getAllPageUrls() {
    var links = document.querySelectorAll(".md-nav--primary .md-nav__link[href]");
    var urls = [];
    var seen = {};
    for (var i = 0; i < links.length; i++) {
      var href = links[i].href;
      if (!href || href.indexOf("#") !== -1 && href.split("#")[0] === location.href.split("#")[0]) continue;
      var url = href.split("#")[0];
      if (!seen[url]) {
        seen[url] = true;
        urls.push(url);
      }
    }
    return urls;
  }

  function downloadFullPDF() {
    var btn = document.querySelector(".pdf-download-full-btn");
    var originalLabel = btn ? btn.textContent : "";
    if (btn) {
      btn.textContent = isFrench() ? "Chargement..." : "Loading...";
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.6";
    }

    var urls = getAllPageUrls();
    if (urls.length === 0) {
      if (btn) { btn.textContent = originalLabel; btn.style.pointerEvents = ""; btn.style.opacity = ""; }
      return;
    }

    var fetches = urls.map(function (url) {
      return fetch(url)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");
          var inner = doc.querySelector(".md-content__inner");
          if (!inner) return "";
          // Remove per-page PDF buttons and headerlinks from fetched content
          var remove = inner.querySelectorAll(".pdf-download-btn, .pdf-download-full-btn, .headerlink");
          for (var j = 0; j < remove.length; j++) remove[j].parentNode.removeChild(remove[j]);
          return inner.innerHTML;
        })
        .catch(function () { return ""; });
    });

    Promise.all(fetches).then(function (pages) {
      // Build a print-only window with all content
      var printWin = window.open("", "_blank");
      if (!printWin) {
        alert(isFrench() ? "Veuillez autoriser les pop-ups pour t\u00e9l\u00e9charger le guide complet." : "Please allow pop-ups to download the full guide.");
        if (btn) { btn.textContent = originalLabel; btn.style.pointerEvents = ""; btn.style.opacity = ""; }
        return;
      }

      // Copy stylesheets from current page
      var styles = "";
      var styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
      for (var i = 0; i < styleSheets.length; i++) {
        styles += styleSheets[i].outerHTML;
      }

      var dateStr = getDateString();
      var title = isFrench() ? "FASTR - Guide complet" : "FASTR - Full Guide";

      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + title + "</title>" +
        styles +
        "<style>" +
        "body { font-family: Roboto, sans-serif; color: #000; max-width: 900px; margin: 0 auto; padding: 2rem; }" +
        "@media print { @page { size: A4; margin: 20mm 15mm 25mm 15mm; } }" +
        ".page-section { page-break-before: always; }" +
        ".page-section:first-child { page-break-before: auto; }" +
        "#pdf-full-date { font-size: 9pt; color: #666; margin-bottom: 1.5em; padding-bottom: 0.5em; border-bottom: 1px solid #ddd; }" +
        "h1 { color: #09544F; border-bottom: 2px solid #D0CB17; padding-bottom: 0.3em; }" +
        "h2 { color: #21568C; border-bottom: 1px solid #1A90C0; padding-bottom: 0.2em; }" +
        "h3 { color: #7A1F6E; border-left: 4px solid #BD5091; padding-left: 0.5em; }" +
        "img { max-width: 100%; height: auto; }" +
        "table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 0.4em 0.6em; }" +
        "th { background: #f0f0f0; }" +
        ".admonition { border: 1px solid #ccc; border-radius: 4px; padding: 0.8em; margin: 1em 0; break-inside: avoid; }" +
        "a[href^='http']:not([href*='fastr'])::after { content: ' (' attr(href) ')'; font-size: 0.8em; color: #666; word-break: break-all; }" +
        "</style></head><body>" +
        "<div id='pdf-full-date'>" + dateStr + "</div>";

      for (var p = 0; p < pages.length; p++) {
        if (pages[p]) {
          html += "<div class='page-section'>" + pages[p] + "</div>";
        }
      }

      html += "</body></html>";

      printWin.document.write(html);
      printWin.document.close();

      // Fix relative image URLs
      var imgs = printWin.document.querySelectorAll("img[src]");
      for (var k = 0; k < imgs.length; k++) {
        var src = imgs[k].getAttribute("src");
        if (src && src.indexOf("http") !== 0) {
          imgs[k].src = new URL(src, urls[Math.min(k, urls.length - 1)] || location.href).href;
        }
      }

      // Wait for images to load, then print
      printWin.onload = function () {
        setTimeout(function () {
          printWin.print();
          if (btn) { btn.textContent = originalLabel; btn.style.pointerEvents = ""; btn.style.opacity = ""; }
        }, 500);
      };
      // Fallback if onload doesn't fire (already loaded)
      setTimeout(function () {
        printWin.print();
        if (btn) { btn.textContent = originalLabel; btn.style.pointerEvents = ""; btn.style.opacity = ""; }
      }, 3000);
    });
  }

  // --- Add buttons ---
  function addButtons() {
    var content = document.querySelector(".md-content__inner");
    if (!content) return;

    // Per-page button
    if (!document.querySelector(".pdf-download-btn")) {
      var btn = document.createElement("a");
      btn.className = "pdf-download-btn";
      btn.href = "#";
      var label = isFrench() ? "T\u00e9l\u00e9charger cette page" : "Download this page";
      btn.title = label;
      btn.setAttribute("aria-label", label);
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>' +
        "</svg> " + label;
      btn.onclick = function (e) {
        e.preventDefault();
        downloadPDF();
      };

      var h1 = content.querySelector("h1");
      if (h1 && h1.nextSibling) {
        content.insertBefore(btn, h1.nextSibling);
      } else if (h1) {
        content.appendChild(btn);
      } else {
        content.insertBefore(btn, content.firstChild);
      }
    }

    // Full guide button
    if (!document.querySelector(".pdf-download-full-btn")) {
      var fullBtn = document.createElement("a");
      fullBtn.className = "pdf-download-full-btn";
      fullBtn.href = "#";
      var fullLabel = isFrench() ? "T\u00e9l\u00e9charger le guide complet" : "Download full guide";
      fullBtn.title = fullLabel;
      fullBtn.setAttribute("aria-label", fullLabel);
      fullBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z"/>' +
        "</svg> " + fullLabel;
      fullBtn.onclick = function (e) {
        e.preventDefault();
        downloadFullPDF();
      };

      // Insert after the per-page button
      var pageBtn = content.querySelector(".pdf-download-btn");
      if (pageBtn && pageBtn.nextSibling) {
        content.insertBefore(fullBtn, pageBtn.nextSibling);
      } else if (pageBtn) {
        pageBtn.parentNode.appendChild(fullBtn);
      }
    }
  }

  // Add buttons on initial load
  addButtons();

  // Detect instant navigation
  var origPushState = history.pushState;
  history.pushState = function () {
    origPushState.apply(this, arguments);
    setTimeout(addButtons, 200);
  };
  window.addEventListener("popstate", function () {
    setTimeout(addButtons, 200);
  });
})();
