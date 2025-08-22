import '../style.css';
import { createSearchBar } from './components/SearchBar.js';
import { createGallery, renderImages } from './components/Gallery.js';
import { createImageCard } from './components/ImageCard.js';

// ---------------------
// API KEY (rúbrica .env)
// ---------------------
// Crea un archivo .env en la raíz con: VITE_UNSPLASH_ACCESS_KEY=TU_CLAVE
const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Control si falta la clave (para no confundir al usuario)
function ensureAccessKey() {
  if (!accessKey) {
    const msg = document.createElement('p');
    msg.style.textAlign = 'center';
    msg.style.color = 'crimson';
    msg.textContent = '⚠️ Falta configurar VITE_UNSPLASH_ACCESS_KEY en tu .env';
    document.body.prepend(msg);
    throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY');
  }
}
ensureAccessKey();

// ---------------------
// Inyección del layout
// ---------------------
function createNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';

  // Logo
  const logoWrap = document.createElement('div');
  logoWrap.className = 'navbar-logo';
  const logo = document.createElement('img');
  // Usa tus rutas actuales de assets. Si los mueves a /public, cambia a '/Pinterest-logo.png'
  logo.src = '/src/assets/Pinterest-logo.png';
  logo.alt = 'Logo';
  logo.title = 'Volver al inicio';
  logoWrap.appendChild(logo);

  // Toggle
  const toggle = document.createElement('button');
  toggle.className = 'navbar-toggle';
  toggle.setAttribute('aria-label', 'Abrir menú');
  toggle.innerHTML = '&#9776;';

  // Menu
  const menu = document.createElement('ul');
  menu.className = 'navbar-menu';
  menu.innerHTML = `
    <li><a href="#" class="active">Inicio</a></li>
    <li><a href="#">Explorar</a></li>
    <li><a href="#">Crear</a></li>
  `;

  // Iconos
  const icons = document.createElement('div');
  icons.className = 'navbar-icons';
  const userIcon = document.createElement('img');
  userIcon.src = '/src/assets/user icon.webp';
  userIcon.alt = 'Usuario';
  userIcon.title = 'Usuario';
  userIcon.className = 'navbar-icon-img';
  const msgIcon = document.createElement('img');
  msgIcon.src = '/src/assets/message_icon.webp';
  msgIcon.alt = 'Chat';
  msgIcon.title = 'Chat';
  msgIcon.className = 'navbar-icon-img';
  const notifIcon = document.createElement('img');
  notifIcon.src = '/src/assets/notif_icon.png';
  notifIcon.alt = 'Notificaciones';
  notifIcon.title = 'Notificaciones';
  notifIcon.className = 'navbar-icon-img';
  icons.append(userIcon, msgIcon, notifIcon);

  nav.append(logoWrap, toggle, menu, icons);

  // Toggle menú (móvil)
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  return { nav, logo };
}

function createMain() {
  const main = document.createElement('main');
  main.id = 'app';
  return main;
}

function createLoader() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.className = 'hidden';
  loader.textContent = 'Cargando imágenes...';
  return loader;
}

// Montar layout
const { nav, logo } = createNavbar();
const main = createMain();
const loader = createLoader();
document.body.prepend(nav);
document.body.appendChild(main);
document.body.appendChild(loader);

// ---------------------
// Estado y componentes
// ---------------------
const INITIAL_QUERY = 'popular';
let currentQuery = INITIAL_QUERY;
let currentPage = 1;
const PER_PAGE = 12;

// Galería dentro de <main>
const gallery = createGallery();
main.appendChild(gallery);

// Buscador: se agrega a la navbar
const searchBar = createSearchBar((query) => {
  currentQuery = query;
  currentPage = 1;
  searchImages(currentQuery, currentPage);
  loadMoreBtn.classList.remove('hidden');
});
nav.appendChild(searchBar);

// Cargar más
const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'Cargar más';
loadMoreBtn.className = 'load-more-btn hidden';
main.appendChild(loadMoreBtn);

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  searchImages(currentQuery, currentPage);
});

// Reset al estado inicial con el logo
logo.addEventListener('click', () => {
  currentQuery = INITIAL_QUERY;
  currentPage = 1;
  searchImages(currentQuery, currentPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------------------
// Fetch a Unsplash
// ---------------------
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Enriquecer cada imagen con sus estadísticas (views)
// Nota: endpoint: /photos/:id/statistics → views.total
async function enrichWithStats(images) {
  const enriched = await Promise.all(images.map(async (img) => {
    try {
      const statsUrl = `https://api.unsplash.com/photos/${img.id}/statistics?client_id=${accessKey}`;
      const stats = await fetchJSON(statsUrl);
      return { ...img, _stats: { views: stats.views?.total ?? null } };
    } catch {
      return { ...img, _stats: { views: null } };
    }
  }));
  return enriched;
}

async function searchImages(query, page = 1) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${PER_PAGE}&client_id=${accessKey}`;

  // Mostrar loader
  loader.classList.remove('hidden');

  try {
    const data = await fetchJSON(url);

    // Enriquecer con vistas reales
    const results = data.results ?? [];
    const enriched = await enrichWithStats(results);

    loader.classList.add('hidden');

    if (enriched.length > 0) {
      // append si page>1
      renderImages(gallery, enriched, createImageCard, page > 1);

      // Mostrar/ocultar "Cargar más"
      if (enriched.length < PER_PAGE) {
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }
    } else {
      if (page === 1) {
        gallery.innerHTML = '<p>No se encontraron resultados.</p>';
      }
      loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    loader.classList.add('hidden');
    gallery.innerHTML = '<p>Error al cargar imágenes.</p>';
    loadMoreBtn.classList.add('hidden');
    // console.error(error);
  }
}

// Carga inicial
searchImages(INITIAL_QUERY, 1);
