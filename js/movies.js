document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    // GANTI DENGAN LINK DIRECT ADSTERRA KAMU
    const ADSTERRA_DIRECT_LINK = 'https://adsterra_direct_link_kamu.com';

    // --- Elemen DOM ---
    const browseContainer = document.querySelector('.browse-container');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    // Variabel untuk proses countdown
    let countdownInterval;
    let secondsLeft;
    let movieToPlayId = null;

    async function displayMovieRow(endpoint, container) {
        // ... (fungsi ini tidak berubah, hanya saja movie-card sekarang adalah div)
        // ... (untuk singkatnya, tidak saya copy ulang, gunakan versi sebelumnya)
    }

    // === LOGIKA INTI ===
    
    // 1. Fungsi untuk memulai countdown
    function startCountdown() {
        secondsLeft = 5; // Set waktu countdown
        countdownTimerEl.textContent = secondsLeft;
        countdownModal.classList.add('active');

        // Hapus interval sebelumnya jika ada
        clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            // Triknya: Countdown hanya berjalan jika user sudah kembali ke tab kita
            if (document.hasFocus()) {
                secondsLeft--;
                countdownTimerEl.textContent = secondsLeft;
                
                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdownModal.classList.remove('active');
                    openMoviePlayer(movieToPlayId); // Putar film setelah selesai
                }
            }
        }, 1000);
    }

    // 2. Fungsi untuk membuka player film
    async function openMoviePlayer(tmdbId) {
        if (!tmdbId) return;

        // Cek dulu di database manual
        if (typeof manualMovieDatabase !== 'undefined' && manualMovieDatabase[tmdbId]) {
            playerBody.innerHTML = `<iframe src="${manualMovieDatabase[tmdbId]}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
            return;
        }

        // Jika tidak ada, ambil dari Vidfast via IMDb ID
        try {
            const res = await fetch(`${API_BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}`);
            const movie = await res.json();
            if (movie.imdb_id) {
                playerBody.innerHTML = `<iframe src="https://vidfast.pro/movie/${movie.imdb_id}" allowfullscreen></iframe>`;
                playerModal.classList.add('active');
            } else {
                alert('Sorry, this movie is not available to watch.');
            }
        } catch (error) {
            console.error('Error fetching IMDb ID:', error);
            alert('Could not load the movie.');
        }
    }
    
    // 3. Event listener utama untuk klik poster
    browseContainer.addEventListener('click', (event) => {
        const movieCard = event.target.closest('.movie-card');
        if (movieCard) {
            // Hentikan proses countdown lama jika ada
            clearInterval(countdownInterval);
            
            // Simpan ID film yang akan diputar
            movieToPlayId = movieCard.dataset.movieId;

            // Buka tab iklan
            const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
            if (!adTab) {
                alert('Please allow pop-ups for this site to watch movies.');
                return;
            }

            // Mulai countdown
            startCountdown();
        }
    });

    // 4. Event listener untuk menutup player
    closePlayerBtn.onclick = () => {
        playerModal.classList.remove('active');
        playerBody.innerHTML = ''; // Hentikan video
    };


    // --- Inisialisasi Halaman (Fetch film, dsb) ---
    // Kode untuk fetchGenres, displayMovieRow, performSearch dari versi sebelumnya tetap di sini.
    // ...
    // ...
    // (Untuk menjaga jawaban tetap ringkas, saya tidak copy paste ulang, tapi pastikan ada di sini)
    // ...
});

// Pastikan kode untuk `fetchGenres`, `displayMovieRow`, `performSearch`, `initializePage`
// dari jawaban sebelumnya ada di dalam script ini.
// Perubahan penting: `movie-card` harus berupa `div`, bukan `<a>`.
// di `displayMovieRow`, buat elemen seperti ini:
// const movieCard = document.createElement('div');
// movieCard.classList.add('movie-card');
// movieCard.dataset.movieId = movie.id; // Tambahkan ini!
// (Lalu innerHTML seperti biasa)
// container.appendChild(movieCard);
