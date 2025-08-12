document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

    let genreMap = new Map();

    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchResultsContainer = document.querySelector('#search-results .movie-list');
    const searchResultsSection = document.getElementById('search-results');
    
    async function fetchGenres() {
        try {
            const res = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
            const data = await res.json();
            data.genres.forEach(genre => genreMap.set(genre.id, genre.name));
        } catch (error) { console.error('Error fetching genres:', error); }
    }

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
                // Path link diubah ke format clean URL
                movieLink.href = `/movies/${movie.id}`;
                movieLink.classList.add('movie-card-link');
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                const genres = movie.genre_ids.map(id => genreMap.get(id)).filter(Boolean).join(', ');
                movieCard.innerHTML = `
                    <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
                    <div class="info-overlay">
                        <h3>${movie.title}</h3>
                        <div class="details">
                            <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                            <span>⭐ ${movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div class="genres">${genres || 'N/A'}</div>
                    </div>
                `;
                movieLink.appendChild(movieCard);
                container.appendChild(movieLink);
            });
        } catch (error) { console.error(`Error fetching movies:`, error); container.innerHTML = '<p>Could not load movies.</p>'; }
    }

    async function performSearch(query) {
        if (!query) { searchResultsSection.style.display = 'none'; return; }
        searchResultsContainer.innerHTML = '<p style="color: #888;">Searching...</p>';
        searchResultsSection.style.display = 'block';
        const endpoint = `/search/movie?query=${encodeURIComponent(query)}`;
        await displayMovieRow(endpoint, searchResultsContainer);
    }

    async function initializePage() {
        await fetchGenres();
        const categories = {
            popular: { endpoint: '/movie/popular?language=en-US&page=1', selector: '#popular-movies .movie-list' },
            indonesianHorror: { endpoint: '/discover/movie?with_genres=27&with_origin_country=ID&sort_by=popularity.desc', selector: '#indonesian-horror-movies .movie-list' },
            worldDestruction: { endpoint: '/discover/movie?with_keywords=4458|10719&sort_by=popularity.desc', selector: '#world-destruction-movies .movie-list' },
            monster: { endpoint: '/discover/movie?with_keywords=9715&sort_by=popularity.desc', selector: '#monster-movies .movie-list' }
        };
        for (const key in categories) {
            await displayMovieRow(categories[key].endpoint, document.querySelector(categories[key].selector));
        }
        searchIcon.addEventListener('click', () => performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(searchInput.value); });
    }
    initializePage();
});
