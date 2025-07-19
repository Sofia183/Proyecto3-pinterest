import './style.css';
import { createSearchBar } from './components/SearchBar.js';
import { createGallery } from './components/Gallery.js';
import { createImageCard } from './components/ImageCard.js';

const app = document.querySelector('#app');

const loader = document.querySelector('#loader');


let currentQuery = '';
let currentPage = 1;

const gallery = createGallery();
app.appendChild(gallery);

const searchBar = createSearchBar((query) => {
  currentQuery = query;
  currentPage = 1;
  searchImages(currentQuery, currentPage);
  loadMoreBtn.style.display = 'block';
});
app.insertBefore(searchBar, gallery);

const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'Cargar más';
loadMoreBtn.style.display = 'none';
loadMoreBtn.style.margin = '2rem auto';
app.appendChild(loadMoreBtn);

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  searchImages(currentQuery, currentPage);
});

async function searchImages(query, page = 1) {
  const accessKey = 'HEvt3zzZIYcPZrhjlW10gxS2i85xoexXmgyg1GWRYXM'; 
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=12&client_id=${accessKey}`;

  loader.style.display = 'block';  

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la petición');

    const data = await response.json();

    loader.style.display = 'none'; 
    if (data.results && data.results.length > 0) {
      if (page === 1) {
        gallery.innerHTML = '';
      }
      data.results.forEach(image => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });
      loadMoreBtn.style.display = 'block';
    } else {
      if (page === 1) {
        gallery.innerHTML = '<p>No se encontraron resultados.</p>';
        loadMoreBtn.style.display = 'none';
      }
    }
  } catch (error) {
    loader.style.display = 'none';
    gallery.innerHTML = '<p>Error al cargar imágenes.</p>';
    loadMoreBtn.style.display = 'none';
  }
}