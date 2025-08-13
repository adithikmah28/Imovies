document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';
    const ADSTERRA_DIRECT_LINK = 'https://www.profitableratecpm.com/xdz7cfckrz?key=4da66776844b84dbeb38d4fbfc6fadb9';

    const container = document.getElementById('movie-details-container');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    const pathParts = window.location.pathname.split('/');
    const movieId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

    let countdownInterval;

    if (!movieId) { container.innerHTML = '<h1>Movie not found.</h1>'; return; }

    async function fetchMovieDetails() {
        try {
            const res = await fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,images`);
            if (!res.ok) throw new Error('Failed to fetch movie details.');
            const movie = await res.json();
            displayMovieDetails(movie);
        } catch (error) { console.error(error); container.innerHTML = '<h1>Error loading movie details.</h1>'; }
    }

    function displayMovieDetails(movie) {
        const backdropDiv = document.createElement('div');
        backdropDiv.classList.add('movie-details-backdrop');
        backdropDiv.style.backgroundImage = `url(${BACKDROP_PATH + movie.backdrop_path})`;
        document.body.prepend(backdropDiv);
        const englishLogo = movie.images.logos.find(logo => logo.iso_639_1 === 'en');
        const logoToUse = englishLogo || (movie.images.logos.length > 0 ? movie.images.logos[0] : null);
        const titleElement = logoToUse ? `<img src="${IMG_PATH + logoToUse.file_path}" alt="${movie.title} Logo" class="movie-title-logo-detail">` : `<h1>${movie.title}</h1>`;
        const officialTrailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const trailerButtonHTML = officialTrailer ? `<button class="action-btn trailer-btn" data-key="${officialTrailer.key}">Trailer</button>` : '';
        const movieButtonHTML = `<button class="action-btn movie-btn" data-movie-id="${movie.id}" data-imdb-id="${movie.imdb_id || ''}">Movie</button>`;
        container.innerHTML = `<div class="poster-container"><img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}"></div><div class="info-container">${titleElement}<p class="tagline">${movie.tagline || ''}</p><div class="meta-info"><span>⭐ ${movie.vote_average.toFixed(1)}</span>|<span>${movie.release_date.substring(0, 4)}</span>|<span>${movie.runtime} min</span></div><div class="genres">${movie.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join('')}</div><h3>Overview</h3><p class="overview">${movie.overview}</p><div class="action-buttons">${trailerButtonHTML}${movieButtonHTML}</div></div>`;
        container.querySelector('.action-buttons')?.addEventListener('click', handleActionClick);
    }

    function handleActionClick(event) {
        const button = event.target.closest('.action-btn');
        if (!button) return;
        if (button.classList.contains('trailer-btn')) {
            openTrailerPlayer(button.dataset.key);
        } else if (button.classList.contains('movie-btn')) {
            initiateAdSequence(button.dataset.movieId, button.dataset.imdbId);
        }
    }

    function initiateAdSequence(tmdbId, imdbId) {
        clearInterval(countdownInterval);
        const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
        if (!adTab) { alert('Please allow pop-ups for this site.'); return; }
        startCountdown(tmdbId, imdbId);
    }
    
    function startCountdown(tmdbId, imdbId) {
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
                    openMoviePlayer(tmdbId, imdbId);
                }
            }
        }, 1000);
    }

    async function openMoviePlayer(tmdbId, imdbId) {
        let iframeSrc = '';
        if (typeof manualMovieDatabase !== 'undefined' && manualMovieDatabase[tmdbId]) {
            iframeSrc = manualMovieDatabase[tmdbId];
        } else if (imdbId) {
            iframeSrc = `https://vidfast.pro/movie/${imdbId}`;
        }
        if (iframeSrc) {
            playerBody.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
        } else { alert('Sorry, this movie is not available to watch.'); }
    }

    function openTrailerPlayer(youtubeKey) {
        playerBody.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1" allowfullscreen></iframe>`;
        playerModal.classList.add('active');
    }

    closePlayerBtn.onclick = () => { playerModal.classList.remove('active'); playerBody.innerHTML = ''; };
    
    fetchMovieDetails();
});

