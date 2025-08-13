document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';
    const ADSTERRA_DIRECT_LINK = 'MASUKKAN_LINK_ADSTERRA_KAMU_DI_SINI';

    const container = document.getElementById('movie-details-container');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    const pathParts = window.location.pathname.split('/');
    const seriesId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    let countdownInterval;

    if (!seriesId) { container.innerHTML = '<h1>Series not found.</h1>'; return; }

    function updateMetaTags(series) {
        const newTitle = `${series.name} | iMovies`;
        const newDescription = series.overview ? series.overview.substring(0, 155) + '...' : `Watch ${series.name} on iMovies.`;
        const newImageUrl = series.backdrop_path ? BACKDROP_PATH + series.backdrop_path : '/images/social-preview.png';
        document.title = newTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', newDescription);
        document.querySelector('meta[property="og:title"]').setAttribute('content', newTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', newDescription);
        document.querySelector('meta[property="og:image"]').setAttribute('content', newImageUrl);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        document.querySelector('meta[property="twitter:title"]').setAttribute('content', newTitle);
        document.querySelector('meta[property="twitter:description"]').setAttribute('content', newDescription);
        document.querySelector('meta[property="twitter:image"]').setAttribute('content', newImageUrl);
        document.querySelector('meta[property="twitter:url"]').setAttribute('content', window.location.href);
    }

    async function fetchSeriesDetails() {
        try {
            const res = await fetch(`${API_BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=videos,images,external_ids`);
            if (!res.ok) throw new Error('Failed to fetch series details.');
            const series = await res.json();
            updateMetaTags(series); 
            displaySeriesDetails(series);
        } catch (error) { console.error(error); container.innerHTML = '<h1>Error loading series details.</h1>'; }
    }

    function displaySeriesDetails(series) {
        const backdropDiv = document.createElement('div');
        backdropDiv.classList.add('movie-details-backdrop');
        backdropDiv.style.backgroundImage = `url(${BACKDROP_PATH + series.backdrop_path})`;
        document.body.prepend(backdropDiv);
        const englishLogo = series.images.logos.find(logo => logo.iso_639_1 === 'en');
        const logoToUse = englishLogo || (series.images.logos.length > 0 ? series.images.logos[0] : null);
        const titleElement = logoToUse ? `<img src="${IMG_PATH + logoToUse.file_path}" alt="${series.name} Logo" class="movie-title-logo-detail">` : `<h1>${series.name}</h1>`;
        const officialTrailer = series.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const trailerButtonHTML = officialTrailer ? `<button class="action-btn trailer-btn" data-key="${officialTrailer.key}">Trailer</button>` : '';
        const imdbId = series.external_ids.imdb_id;
        const seriesButtonHTML = `<button class="action-btn movie-btn" data-series-id="${series.id}" data-imdb-id="${imdbId || ''}">Watch Series</button>`;
        container.innerHTML = `<div class="poster-container"><img src="${IMG_PATH + series.poster_path}" alt="${series.name}"></div><div class="info-container">${titleElement}<p class="tagline">${series.tagline || ''}</p><div class="meta-info"><span>⭐ ${series.vote_average.toFixed(1)}</span>|<span>${series.first_air_date.substring(0, 4)}</span>|<span>${series.number_of_seasons} Seasons</span></div><div class="genres">${series.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join('')}</div><h3>Overview</h3><p class="overview">${series.overview}</p><div class="action-buttons">${trailerButtonHTML}${seriesButtonHTML}</div></div>`;
        container.querySelector('.action-buttons')?.addEventListener('click', handleActionClick);
    }

    function handleActionClick(event) {
        const button = event.target.closest('.action-btn');
        if (!button) return;
        if (button.classList.contains('trailer-btn')) {
            openTrailerPlayer(button.dataset.key);
        } else if (button.classList.contains('movie-btn')) {
            initiateAdSequence(button.dataset.seriesId, button.dataset.imdbId);
        }
    }

    function initiateAdSequence(seriesId, imdbId) {
        clearInterval(countdownInterval);
        const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
        if (!adTab) { alert('Please allow pop-ups for this site.'); return; }
        startCountdown(seriesId, imdbId);
    }
    
    function startCountdown(seriesId, imdbId) {
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
                    openSeriesPlayer(seriesId, imdbId);
                }
            }
        }, 1000);
    }

    async function openSeriesPlayer(seriesId, imdbId) {
        let iframeSrc = '';
        if (typeof manualSeriesDatabase !== 'undefined' && manualSeriesDatabase[seriesId]) {
            iframeSrc = manualSeriesDatabase[seriesId];
        } else if (imdbId) {
            iframeSrc = `https://vidfast.pro/tv/${imdbId}`;
        }
        if (iframeSrc) {
            playerBody.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
        } else { alert('Sorry, this series is not available to watch.'); }
    }

    function openTrailerPlayer(youtubeKey) {
        playerBody.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1" allowfullscreen></iframe>`;
        playerModal.classList.add('active');
    }
    
    closePlayerBtn.onclick = () => { playerModal.classList.remove('active'); playerBody.innerHTML = ''; };

    fetchSeriesDetails();
});
