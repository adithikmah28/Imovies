document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

    async function displaySeriesRow(endpoint, container) {
        if (!container) return;
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);
            const data = await res.json();
            container.innerHTML = '';
            if (!data.results || data.results.length === 0) { container.innerHTML = '<p style="color: #888;">No series found.</p>'; return; }
            data.results.forEach(series => {
                if (!series.poster_path) return;
                const seriesLink = document.createElement('a');
                seriesLink.href = `/series/${series.id}`;
                seriesLink.classList.add('movie-card-link');
                seriesLink.innerHTML = `<div class="movie-card"><img src="${IMG_PATH + series.poster_path}" alt="${series.name}"></div>`;
                container.appendChild(seriesLink);
            });
        } catch (error) { console.error(`Error fetching series:`, error); container.innerHTML = '<p>Could not load series.</p>'; }
    }
    
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchResultsContainer = document.querySelector('#search-results-series .movie-list');
    const searchResultsSection = document.getElementById('search-results-series');
    
    async function performSearch(query) {
        if (!query) { searchResultsSection.style.display = 'none'; return; }
        searchResultsContainer.innerHTML = '<p style="color: #888;">Searching...</p>';
        searchResultsSection.style.display = 'block';
        const endpoint = `/search/tv?query=${encodeURIComponent(query)}`;
        await displaySeriesRow(endpoint, searchResultsContainer);
    }
    
    async function initializePage() {
        const categories = {
            popular: { endpoint: '/tv/popular?language=en-US&page=1', selector: '#popular-series .movie-list' },
            top_rated: { endpoint: '/tv/top_rated?language=en-US&page=1', selector: '#top-rated-series .movie-list' },
            on_the_air: { endpoint: '/tv/on_the_air?language=en-US&page=1', selector: '#on-the-air-series .movie-list' },
            anime: { endpoint: '/discover/tv?with_genres=16&with_keywords=210024|287501', selector: '#anime-series .movie-list' }
        };
        for (const key in categories) { await displaySeriesRow(categories[key].endpoint, document.querySelector(categories[key].selector)); }
        searchIcon.addEventListener('click', () => performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });
    }
    initializePage();
});
