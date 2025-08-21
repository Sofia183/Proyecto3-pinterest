export function createImageCard(image) {
  const card = document.createElement('div');
  card.className = 'image-card';

  const borderColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

  card.innerHTML = `
    <div class="image-container">
      <img src="${image.urls.small}" alt="${image.alt_description || ''}">
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
        <span class="creator-likes">${image.likes} likes</span>
        <a href="${image.user.links.html}" class="creator-link" target="_blank" rel="noopener noreferrer">Ver perfil</a>
      </div>
    </div>
  `;

  return card;
}
