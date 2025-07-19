export function createSearchBar(onSearch) {
  const form = document.createElement('form');
  form.innerHTML = `
    <input type="text" id="search-input" placeholder="Buscar imágenes..." />
    <button type="submit">Buscar</button>
  `;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = form.querySelector('#search-input').value;
    if (query) {
      onSearch(query);
    }
  });

  return form;
}
