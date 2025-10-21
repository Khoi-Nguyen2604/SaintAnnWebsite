// Simple SPA router using hash navigation
const routes = {
  "home": { file: "pages/home.html", sidebar: false },
  "news": { file: "pages/mass-times.html", sidebar: true },
  "calendar": { file: "pages/ministries.html", sidebar: true },
  "get involved": { file: "pages/events.html", sidebar: true },
  "How do I become a catholic?": { file: "pages/how.html", sidebar: true },
  "How do I baptize my kid?": { file: "pages/how.html", sidebar: true },
  "How do I donate?": { file: "pages/how.html", sidebar: true },
  "kids": { file: "pages/kids.html", sidebar: true },
  "about": { file: "pages/about.html", sidebar: true },
};

const appEl = document.getElementById("app");
const headerLinks = document.querySelectorAll('.site-nav a, .brand');

function setActiveHeader(route){
  headerLinks.forEach(a => {
    const r = a.dataset.route;
    a.classList.toggle('active', r === route);
  });
}

function sidebarTemplate(route){
  return `
  <aside class="sidebar">
    <h2>On this page</h2>
    <ul class="side-nav">
      <li><a href="#${route}-section-1" class="active">Overview</a></li>
      <li><a href="#${route}-section-2">Details</a></li>
      <li><a href="#${route}-section-3">More</a></li>
    </ul>
  </aside>`;
}

async function loadRoute(route){
  const info = routes[route] || routes["home"];
  setActiveHeader(route);
  try {
    const res = await fetch(info.file);
    const html = await res.text();
    if (info.sidebar) {
      appEl.innerHTML = `
        <div class="inner-layout">
          ${sidebarTemplate(route)}
          <section class="container">${html}</section>
        </div>`;
    } else {
      appEl.innerHTML = `<section class="container">${html}</section>`;
    }
    document.getElementById('nav-toggle').checked = false;
  } catch {
    appEl.innerHTML = "<div class='content-card'><h2>404 Not Found</h2></div>";
  }
}

function getRoute() {
  return (location.hash.replace(/^#/, '') || 'home');
}
window.addEventListener("hashchange", () => loadRoute(getRoute()));
window.addEventListener("DOMContentLoaded", () => loadRoute(getRoute()));
