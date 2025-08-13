document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    // GANTI DENGAN LINK DIRECT ADSTERRA KAMU
    const ADSTERRA_DIRECT_LINK = 'https://contoh-link-adsterra.com';

    // --- Elemen DOM ---
    const container = document.getElementById('movie-details-container');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id') || window.location.pathname.split('/').pop();

    let countdownInterval;

    async function displayMovieDetails(movie) {
        // ... (fungsi untuk menampilkan info film, backdrop, logo, dll tidak berubah) ...

        // PERUBAHAN UTAMA: Tombol sekarang adalah <button>
        const officialTrailer = movie.videos.results.find(v => v.type === 'Trailer');
        const trailerButtonHTML = officialTrailer ? `<button class="action-btn trailer-btn" data-type="trailer" data-key="${officialTrailer.key}">Trailer</button>` : '';
        const movieButtonHTML = `<button class="action-btn movie-btn" data-type="movie" data-movie-id="${movie.id}" data-imdb-id="${movie.imdb_id || ''}">Movie</button>`;
        
        // Sisipkan tombol ke dalam container
        container.querySelector('.action-buttons').innerHTML = trailerButtonHTML + movieButtonHTML;
        
        // Tambahkan event listener ke wadah tombol
        container.querySelector('.action-buttons').addEventListener('click', handleActionClick);
    }

    function handleActionClick(event) {
        const button = event.target.closest('.action-btn');
        if (!button) return;

        const type = button.dataset.type;

        if (type === 'trailer') {
            const key = button.dataset.key;
            openTrailerPlayer(key);
        } else if (type === 'movie') {
            const tmdbId = button.dataset.movieId;
            initiateAdSequence(tmdbId);
        }
    }

    function initiateAdSequence(tmdbId) {
        clearInterval(countdownInterval);
        const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
        if (!adTab) {
            alert('Please allow pop-ups for this site.');
            return;
        }
        startCountdown(tmdbId);
    }
    
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

    async function openMoviePlayer(tmdbId) {
        // ... (fungsi ini tidak berubah dari versi sebelumnya, ia mengecek manual DB lalu Vidfast)
    }

    function openTrailerPlayer(youtubeKey) {
        playerBody.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1" allowfullscreen></iframe>`;
        playerModal.classList.add('active');
    }

    // ... (sisa kode fetchMovieDetails, event listener untuk close button, dll, sama seperti sebelumnya)

});
// Tambahkan salinan lengkap dari fungsi fetchMovieDetails, openMoviePlayer, dan event listener close button dari jawaban sebelumnya ke sini.
// Ini untuk memastikan tidak ada yang hilang.
