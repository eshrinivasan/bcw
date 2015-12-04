//Version - 0.1

//Default settings
var bcwidget = window.bcwidget || {};
bcwidget.minwidth = "250px";
bcwidget.minheight = "320px";
bcwidget.maxwidth = "480px";
bcwidget.maxheight = "480px";
bcwidget.theme="basic";

//Create iframe and append to div bc-root
var i = document.createElement("iframe");
var bcroot = document.getElementById("bc-root")
i.scrolling = "no";
i.frameBorder = "0";
bcroot.style.minWidth  = bcwidget.minwidth;
bcroot.style.minHeight  = bcwidget.minheight;
bcroot.style.height = bcwidget.minheight;	
bcroot.style.maxWidth  = bcwidget.maxwidth;
bcroot.style.maxHeight  = bcwidget.maxheight;
i.width="100%";
i.height="100%";
bcroot.appendChild(i);

var thisBCScript = document.CurrentScript || document.getElementById("bcwidgetId");
var bcQueryString = thisBCScript.src.replace(/^[^\?]+\??/,'');

function setIframeSrc() {
    i.src = "//cdn.qa.finra.org/brokercheck2210-widget/index.html?"+bcQueryString;//cdn.qa.finra.org
}

setTimeout(setIframeSrc, 2);
