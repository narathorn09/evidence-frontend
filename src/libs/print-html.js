// Usage example http://jsfiddle.net/Windstalker/u0mrptga/

export const PrintPlugin = (function (win, doc) {
  function getPrintableHTMLContent(str) {
    var htmlEl = doc.implementation.createHTMLDocument("Printable Document");
    htmlEl.body.innerHTML = str;
    return htmlEl.documentElement.outerHTML;
  }
  
  function printHTML(str) {
    var contentType = "text/html;charset=utf-8";
    var fullHTMLStr = getPrintableHTMLContent(str);
    var contentBlob = new Blob([str], { type: contentType });

    var frameEl = doc.createElement("iframe"),
      removeFrame = function () {
        if (frameEl) {
          doc.body.removeChild(frameEl);
          frameEl = null;
        }
      };
    frameEl.style.display = "none";
    frameEl.onload = function () {
      try {
        this.contentWindow.print();
        setTimeout(function () {
          // Timeout is used due to Firefox bug, when <iframe> is being removed before print occurs
          removeFrame();
        }, 0);
      } catch (e) {
        console.log(e);
        this.alert(e.message);
      }
    };

    frameEl.src = URL.createObjectURL(contentBlob);
    doc.body.appendChild(frameEl);

    return frameEl.contentWindow;
  }

  return {
    print: printHTML,
  };
})(window, document);
