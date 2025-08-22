export function createImageCard(image) {
  const card = document.createElement('div');
  card.className = 'image-card';

  const borderColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

  const likes = typeof image.likes === 'number' ? image.likes : '—';
  // Vistas reales traídas por /statistics en main.js → image._stats?.views
  const views = (image._stats && typeof image._stats.views === 'number')
    ? image._stats.views
    : '—';

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
        <span class="badge">❤️ ${likes}</span>
        <span class="badge">👁️ ${views}</span>
        <a href="${image.links.html}" class="creator-link" target="_blank" rel="noopener noreferrer">
          Ver en Unsplash
        </a>
      </div>
    </div>
  `;

  return card;
}
