(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var slug = currentScript.getAttribute("data-slug");
  if (!slug) {
    console.error("[Anfragen.Business] widget.js: data-slug fehlt am <script>-Tag.");
    return;
  }

  var origin = new URL(currentScript.src).origin;
  var height = currentScript.getAttribute("data-height") || "780";

  var iframe = document.createElement("iframe");
  iframe.src = origin + "/anfrage/" + encodeURIComponent(slug);
  iframe.style.width = "100%";
  iframe.style.maxWidth = "560px";
  iframe.style.height = height + "px";
  iframe.style.border = "0";
  iframe.title = "Anfrageformular";

  currentScript.parentNode.insertBefore(iframe, currentScript);
})();
