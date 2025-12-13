document.addEventListener('DOMContentLoaded', function () {
    // Remove .active from all nav links to start clean
    document.querySelectorAll('a.nav-link').forEach(link => link.classList.remove('active'));

    // Get the file part of the current URL (e.g. 'about_us.html', or '' for root)
    let current = window.location.pathname.split('/').pop();
    if (!current || current === '' || current === '/') current = 'index.html';

    // Also compare without ".html", for servers that remove it
    let currentBase = current.replace(/\.html$/, '');

    document.querySelectorAll('a.nav-link').forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;
        // Only filename part (remove path)
        let hrefFile = href.split('/').pop();
        let hrefBase = hrefFile.replace(/\.html$/, '');
        // If filename matches (with or without .html), make active
        if (
            current === hrefFile ||
            currentBase === hrefBase
        ) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
  // ...current code...
  let current = window.location.pathname.split('/').pop();
  if (!current || current === '' || current === '/') current = 'index.html';
  let currentBase = current.replace(/\.html$/, '');
  console.log('DEBUG current page:', current, currentBase);
  document.querySelectorAll('a.nav-link').forEach(link => {
      let href = link.getAttribute('href');
      if (!href) return;
      let hrefFile = href.split('/').pop();
      let hrefBase = hrefFile.replace(/\.html$/, '');
      console.log('Comparing', current, 'to', hrefFile, 'and', currentBase, 'to', hrefBase);
      if (current === hrefFile || currentBase === hrefBase) {
          link.classList.add('active');
          console.log('Added active to', link);
      }
  });
});