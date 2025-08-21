export function createGallery() {
  const gallery = document.createElement('div');
  gallery.id = 'gallery';
  gallery.className = 'gallery';
  return gallery;
}

export function renderImages(gallery, images, createImageCard, append = false) {
  if (!append) {
    gallery.innerHTML = '';
  }
  images.forEach(image => {
    const card = createImageCard(image);
    gallery.appendChild(card);
  });
}
