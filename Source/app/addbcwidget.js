//Version - 0.1

//Default settings
var bcwidget = window.bcwidget || {};
bcwidget.width = bcwidget.width || "310px";
bcwidget.height = bcwidget.height || "300px";
bcwidget.theme="basic";

//Create iframe and append to div bc-root
var i = document.createElement("iframe");
var bcroot = document.getElementById("bc-root")
i.scrolling = "no";
i.frameBorder = "0";
i.width = bcroot.style.width = bcwidget.width;
i.height = bcroot.style.height = bcwidget.height;
bcroot.appendChild(i);

var thisBCScript = document.CurrentScript || document.getElementById("bcwidgetId");
var bcQueryString = thisBCScript.src.replace(/^[^\?]+\??/,'');

function setIframeSrc() {
    i.src = "//cdn.qa.finra.org/brokercheck2210-widget/index.html?"+decodeURICompoment(bcQueryString);
}

setTimeout(setIframeSrc, 2);
