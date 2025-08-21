import './style.css';
import { createSearchBar } from './components/SearchBar.js';
import { createGallery, renderImages } from './components/Gallery.js';
import { createImageCard } from './components/ImageCard.js';

const app = document.querySelector('#app');
const loader = document.querySelector('#loader');

// Navbar
const toggleBtn = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-menu');
toggleBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// paginación
const INITIAL_QUERY = 'popular'; 
let currentQuery = INITIAL_QUERY;
let currentPage = 1;
const PER_PAGE = 12;


const gallery = createGallery();
app.appendChild(gallery);

const searchBar = createSearchBar((query) => {
  currentQuery = query;
  currentPage = 1;
  searchImages(currentQuery, currentPage);
  loadMoreBtn.classList.remove('hidden');
});


const navbar = document.querySelector('.navbar');
navbar.appendChild(searchBar);

// Botón "Cargar más"
const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'Cargar más';
loadMoreBtn.className = 'load-more-btn hidden';
app.appendChild(loadMoreBtn);

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  searchImages(currentQuery, currentPage);
});


const logo = document.querySelector('.navbar-logo img');
logo.addEventListener('click', () => {
  currentQuery = INITIAL_QUERY;
  currentPage = 1;
  searchImages(currentQuery, currentPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


async function searchImages(query, page = 1) {
  const accessKey = 'HEvt3zzZIYcPZrhjlW10gxS2i85xoexXmgyg1GWRYXM'; // usa variables de entorno en producción
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${PER_PAGE}&client_id=${accessKey}`;


  loader.classList.remove('hidden');

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la petición');

    const data = await response.json();


    loader.classList.add('hidden');

    if (data.results && data.results.length > 0) {
      const append = page > 1;
      renderImages(gallery, data.results, createImageCard, append);

      if (data.results.length < PER_PAGE) {
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
  }
}

searchImages(INITIAL_QUERY, 1);
