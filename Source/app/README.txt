/*
 Notes on iframe implementation:
 --
 1. Loading addbcwidget.js asynchronously inorder for the main page to load gracefully even if for some reason bcwidget is down;
 2. Cannot do document.write while loading async, will erase page contents;
 3. "bc-root" div required to know where to load the script, since we cannot determine the parentNode for an async script;
 4. "bc-root" occupies its parent container width/height; Hence setting bc-root width to be same as iframe width;
 5. Fit iframe into container fixed height, full width
 6. Fit iframe to certain user provided width
 7. using settimeout to avoid iframe from blocking onload
 8. http://stackoverflow.com/questions/403967/how-may-i-reference-the-script-tag-that-loaded-the-currently-executing-script
 */



bcwidget.fitContainer={fitContainer:true, containerId: ''};

