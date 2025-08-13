document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    // GANTI DENGAN LINK DIRECT ADSTERRA KAMU
    const ADSTERRA_DIRECT_LINK = 'https://adsterra_direct_link_kamu.com';

    // --- Elemen DOM ---
    const browseContainer = document.querySelector('.browse-container');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchResultsContainer = document.querySelector('#search-results .movie-list');
    const searchResultsSection = document.getElementById('search-results');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    let genreMap = new Map();
    let countdownInterval;
    let secondsLeft;
    let movieToPlayId = null;

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
                
                // Kartu sekarang adalah DIV dengan data-attribute
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.dataset.movieId = movie.id; // Ini penting!
                
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
                container.appendChild(movieCard);
            });
        } catch (error) { console.error(`Error fetching movies:`, error); container.innerHTML = '<p>Could not load movies.</p>'; }
    }

    function startCountdown() {
        secondsLeft = 5;
        countdownTimerEl.textContent = secondsLeft;
        countdownModal.classList.add('active');
        clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            // Countdown HANYA berjalan jika user kembali ke tab kita
            if (document.hasFocus()) {
                secondsLeft--;
                countdownTimerEl.textContent = secondsLeft;
                
                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdownModal.classList.remove('active');
                    openMoviePlayer(movieToPlayId);
                }
            }
        }, 1000);
    }

    async function openMoviePlayer(tmdbId) {
        if (!tmdbId) return;
        if (typeof manualMovieDatabase !== 'undefined' && manualMovieDatabase[tmdbId]) {
            playerBody.innerHTML = `<iframe src="${manualMovieDatabase[tmdbId]}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}`);
            const movie = await res.json();
            if (movie.imdb_id) {
                playerBody.innerHTML = `<iframe src="https://vidfast.pro/movie/${movie.imdb_id}" allowfullscreen></iframe>`;
                playerModal.classList.add('active');
            } else { alert('Sorry, this movie is not available to watch.'); }
        } catch (error) { console.error('Error fetching IMDb ID:', error); alert('Could not load the movie.'); }
    }

    browseContainer.addEventListener('click', (event) => {
        const movieCard = event.target.closest('.movie-card');
        if (movieCard) {
            clearInterval(countdownInterval);
            movieToPlayId = movieCard.dataset.movieId;
            const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
            if (!adTab) { alert('Please allow pop-ups for this site to watch movies.'); return; }
            startCountdown();
        }
    });

    closePlayerBtn.onclick = () => {
        playerModal.classList.remove('active');
        playerBody.innerHTML = '';
    };

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
        for (const key in categories) { await displayMovieRow(categories[key].endpoint, document.querySelector(categories[key].selector)); }
        searchIcon.addEventListener('click', () => performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });
    }

    initializePage();
});
