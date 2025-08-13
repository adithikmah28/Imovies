// === File: js/script.js (Final dengan Modal Pencarian) ===
function toggleVideo() {
  const trailer = document.querySelector('.trailer');
  const video = document.querySelector('video');
  trailer.classList.toggle('active');
  if (!trailer.classList.contains('active')) { video.pause(); video.currentTime = 0; }
}
function changeBg(bg, contentClass) {
  const banner = document.querySelector('.banner');
  const contents = document.querySelectorAll('.content');
  if (bg.startsWith('http')) { banner.style.background = `url("${bg}")`; } 
  else { banner.style.background = `url("/images/movies/${bg}")`; }
  banner.style.backgroundSize = 'cover';
  banner.style.backgroundPosition = 'center';
  contents.forEach(content => {
    content.classList.remove('active');
    if (content.classList.contains(contentClass)) { content.classList.add('active'); }
  });
}
document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    if (!searchInput) return;
    const searchModal = document.getElementById('search-modal');
    const closeModalBtn = document.getElementById('close-search-modal');
    const searchResultsTitle = document.getElementById('search-results-title');
    const searchResultsGrid = document.getElementById('search-results-grid');
    async function performSearch(query) {
        if (!query) return;
        searchResultsTitle.innerText = `Searching for "${query}"...`;
        searchResultsGrid.innerHTML = '';
        searchModal.style.display = 'flex';
        try {
            const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                displaySearchResults(data.results, query);
            } else { searchResultsTitle.innerText = `No movies found for "${query}"`; }
        } catch (error) { console.error('Search error:', error); searchResultsTitle.innerText = `An error occurred.`; }
    }
    function displaySearchResults(movies, query) {
        searchResultsTitle.innerText = `Search Results for "${query}"`;
        movies.forEach(movie => {
            if (!movie.poster_path) return;
            const movieCard = document.createElement('a');
            movieCard.classList.add('search-result-card');
            movieCard.href = `/movies/${movie.id}`;
            movieCard.innerHTML = `<img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}"><p>${movie.title}</p>`;
            searchResultsGrid.appendChild(movieCard);
        });
    }
    searchIcon.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });
    closeModalBtn.onclick = () => { searchModal.style.display = 'none'; };
    window.onclick = (event) => { if (event.target == searchModal) { searchModal.style.display = 'none'; } };
});
