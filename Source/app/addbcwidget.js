//Version - 0.1
/*
 Notes:
 --
 1. Loading addbcwidget.js asynchronously inorder for the main page to load gracefully even if for some reason bcwidget is down;
 2. Cannot do document.write while loading async, will erase page contents;
 3. "bc-root" div required to know where to load the script, since we cannot determine the parentNode for an async script;
 4. "bc-root" occupies its parent container width/height; Hence setting bc-root width to be same as iframe width;
 5. Fit iframe into container fixed height, full width
 6. Fit iframe to certain user provided width
 7. using settimeout to avoid iframe from blocking onload
 */

//Default settings
var bcwidget = window.bcwidget || {};
bcwidget.width = bcwidget.width || "310px";
bcwidget.height = bcwidget.height || "300px";
bcwidget.fitContainer={fitContainer:true, containerId: ''};
bcwidget.theme="basic";


//Create iframe and append to div bc-root
var i = document.createElement("iframe");
var bcroot = document.getElementById("bc-root")
i.scrolling = "no";
i.frameBorder = "0";
i.width = bcroot.style.width = bcwidget.width;
i.height = bcroot.style.height = bcwidget.height;
bcroot.appendChild(i);

//http://stackoverflow.com/questions/403967/how-may-i-reference-the-script-tag-that-loaded-the-currently-executing-script
var thisBCScript = document.CurrentScript || document.getElementById("bcwidgetId");
var bcQueryString = thisBCScript.src.replace(/^[^\?]+\??/,'');

function setIframeSrc() {
    i.src = "index.html?"+bcQueryString;
}

setTimeout(setIframeSrc, 2);
