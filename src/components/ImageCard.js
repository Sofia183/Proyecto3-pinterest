export function createImageCard(image) {
  const card = document.createElement('div');
  card.className = 'image-card';

  const borderColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

  // Algunos campos (como "views") pueden no venir en /search/photos.
  // Si no vienen, mostramos "—". Si quieres datos reales de vistas,
  // habría que hacer una petición extra a /photos/:id/statistics (cuidado con el rate limit).
  const likes = typeof image.likes === 'number' ? image.likes : '—';
  const views = (typeof image.views === 'number' && image.views >= 0) ? image.views : '—';

  card.innerHTML = `
    <div class="image-container">
      <img src="${image.urls.small}" alt="${image.alt_description || ''}" loading="lazy">
      <img 
        class="creator-avatar" 
        src="${image.user.profile_image.medium}" 
        alt="${image.user.name}"
        style="border: 3px solid ${borderColor};"
      >
    </div>
    <div class="creator-profile">
      <h2 class="creator-name">${image.user.name}</h2>
      <div class="creator-meta">
        <span class="creator-likes">❤️ ${likes}</span>
        <span class="creator-views">👁️ ${views}</span>
        <a href="${image.links.html}" class="creator-link" target="_blank" rel="noopener noreferrer">
          Ver en Unsplash
        </a>
      </div>
    </div>
  `;

  return card;
}
