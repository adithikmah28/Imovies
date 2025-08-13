document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

    async function displayMovieRow(endpoint, container) {
        if (!container) return;
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);
            const data = await res.json();
            container.innerHTML = '';
            if (data.results.length === 0) { container.innerHTML = '<p style="color: #888;">No movies found.</p>'; return; }

            data.results.forEach(movie => {
                if (!movie.poster_path) return;
                const movieLink = document.createElement('a');
                movieLink.href = `/movies/${movie.id}`;
                movieLink.classList.add('movie-card-link'); // Ganti class untuk styling
                
                movieLink.innerHTML = `
                    <div class="movie-card">
                        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
                    </div>
                `;
                container.appendChild(movieLink);
            });
        } catch (error) { console.error(`Error fetching movies:`, error); container.innerHTML = '<p>Could not load movies.</p>'; }
    }
    
    // ... (Fungsi search dan initializePage lainnya tidak berubah dari versi stabil)
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchResultsContainer = document.querySelector('#search-results .movie-list');
    const searchResultsSection = document.getElementById('search-results');
    
    async function performSearch(query) {
        if (!query) { searchResultsSection.style.display = 'none'; return; }
        searchResultsContainer.innerHTML = '<p style="color: #888;">Searching...</p>';
        searchResultsSection.style.display = 'block';
        const endpoint = `/search/movie?query=${encodeURIComponent(query)}`;
        await displayMovieRow(endpoint, searchResultsContainer);
    }
    
    async function initializePage() {
        const categories = {
            popular: { endpoint: '/movie/popular?language=en-US&page=1', selector: '#popular-movies .movie-list' },
            indonesianHorror: { endpoint: '/discover/movie?with_genres=27&with_origin_country=ID&sort_by=popularity.desc', selector: '#indonesian-horror-movies .movie-list' },
            worldDestruction: { endpoint: '/discover/movie?with_keywords=4458|10719&sort_by=popularity.desc', selector: '#world-destruction-movies .movie-list' },
            monster: { endpoint: '/discover/movie?with_keywords=9715&sort_by=popularity.desc', selector: '#monster-movies .movie-list' }
        };
        for (const key in categories) { await displayMovieRow(categories[key].endpoint, document.querySelector(categories[key].selector)); }
        searchIcon.addEventListener('click', () => performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });
    }

    initializePage();
});
