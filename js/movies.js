document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    // GANTI DENGAN LINK DIRECT ADSTERRA KAMU
    const ADSTERRA_DIRECT_LINK = 'https://contoh-link-adsterra.com';

    // --- Elemen DOM ---
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    let countdownInterval;

    // --- Fungsi Logika Inti ---
    
    // Fungsi ini dipanggil saat poster diklik
    function handleMovieClick(event) {
        const movieCard = event.currentTarget; // 'currentTarget' lebih aman
        const tmdbId = movieCard.dataset.movieId;

        // Hentikan countdown lama jika ada
        clearInterval(countdownInterval);

        // Buka tab iklan
        const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
        if (!adTab) {
            alert('Please allow pop-ups for this site to watch movies.');
            return;
        }

        // Mulai countdown
        startCountdown(tmdbId);
    }

    // Fungsi untuk memulai countdown
    function startCountdown(tmdbId) {
        let secondsLeft = 5;
        countdownTimerEl.textContent = secondsLeft;
        countdownModal.classList.add('active');

        countdownInterval = setInterval(() => {
            if (document.hasFocus()) {
                secondsLeft--;
                countdownTimerEl.textContent = secondsLeft;
                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdownModal.classList.remove('active');
                    openMoviePlayer(tmdbId);
                }
            }
        }, 1000);
    }

    // Fungsi untuk membuka player film
    async function openMoviePlayer(tmdbId) {
        if (!tmdbId) return;

        let iframeSrc = '';
        // Cek dulu di database manual
        if (typeof manualMovieDatabase !== 'undefined' && manualMovieDatabase[tmdbId]) {
            iframeSrc = manualMovieDatabase[tmdbId];
        } else {
            // Jika tidak ada, ambil dari Vidfast via IMDb ID
            try {
                const res = await fetch(`${API_BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}`);
                const movie = await res.json();
                if (movie.imdb_id) {
                    iframeSrc = `https://vidfast.pro/movie/${movie.imdb_id}`;
                }
            } catch (error) { console.error('Error fetching IMDb ID:', error); }
        }

        if (iframeSrc) {
            playerBody.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
        } else {
            alert('Sorry, this movie is not available to watch.');
        }
    }

    // --- Fungsi untuk Membangun Halaman ---
    
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
                
                movieCard.innerHTML = `
                    <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
                    <div class="info-overlay">
                        <h3>${movie.title}</h3>
                    </div>
                `;
                // LANGSUNG PASANG EVENT LISTENER DI SINI
                movieCard.addEventListener('click', handleMovieClick);
                container.appendChild(movieCard);
            });
        } catch (error) { console.error(`Error fetching movies:`, error); container.innerHTML = '<p>Could not load movies.</p>'; }
    }
    
    async function performSearch(query) {
        // ... (fungsi ini tidak perlu diubah)
    }

    async function initializePage() {
        // ... (fungsi ini tidak perlu diubah)
    }
    
    // -- Salin fungsi performSearch dan initializePage dari jawaban sebelumnya --
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

    // --- Event Listeners Tambahan ---
    closePlayerBtn.onclick = () => {
        playerModal.classList.remove('active');
        playerBody.innerHTML = '';
    };

    initializePage();
});
