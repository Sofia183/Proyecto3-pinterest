export function createSearchBar(onSearch) {
  const form = document.createElement('form');

  form.innerHTML = `
    <input type="text" id="search-input" placeholder="Buscar imágenes..." />
    <button type="submit">Buscar</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('#search-input');
    const query = input.value.trim();
    if (query) {
      onSearch(query);
      // Requisito: limpiar el input tras la búsqueda
      input.value = '';
    }
  });

  return form;
}
