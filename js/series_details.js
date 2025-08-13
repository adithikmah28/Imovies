document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';
    const ADSTERRA_DIRECT_LINK = 'MASUKKAN_LINK_ADSTERRA_KAMU_DI_SINI';

    // --- Elemen DOM ---
    const mainContainer = document.getElementById('movie-details-container');
    const seasonsContainer = document.getElementById('seasons-and-episodes-container');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    const pathParts = window.location.pathname.split('/');
    const seriesId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    let countdownInterval;
    let seriesImdbId = null; // Simpan IMDb ID di sini

    if (!seriesId) { mainContainer.innerHTML = '<h1>Series not found.</h1>'; return; }

    // --- Fungsi Utama ---
    
    async function fetchSeriesDetails() {
        try {
            const res = await fetch(`${API_BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=videos,images,external_ids`);
            const series = await res.json();
            seriesImdbId = series.external_ids.imdb_id; // Simpan IMDb ID
            updateMetaTags(series); 
            displaySeriesDetails(series);
            createSeasonSelector(series.seasons);
        } catch (error) { console.error(error); mainContainer.innerHTML = '<h1>Error loading series details.</h1>'; }
    }

    function displaySeriesDetails(series) {
        // ... (fungsi ini sama seperti sebelumnya, TAPI kita hapus tombol "Watch Series")
        const backdropDiv = document.createElement('div');
        backdropDiv.classList.add('movie-details-backdrop');
        backdropDiv.style.backgroundImage = `url(${BACKDROP_PATH + series.backdrop_path})`;
        document.body.prepend(backdropDiv);
        const englishLogo = series.images.logos.find(logo => logo.iso_639_1 === 'en');
        const logoToUse = englishLogo || (series.images.logos.length > 0 ? series.images.logos[0] : null);
        const titleElement = logoToUse ? `<img src="${IMG_PATH + logoToUse.file_path}" alt="${series.name} Logo" class="movie-title-logo-detail">` : `<h1>${series.name}</h1>`;
        const officialTrailer = series.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const trailerButtonHTML = officialTrailer ? `<button class="action-btn trailer-btn" data-key="${officialTrailer.key}">Trailer</button>` : '';
        mainContainer.innerHTML = `<div class="poster-container"><img src="${IMG_PATH + series.poster_path}" alt="${series.name}"></div><div class="info-container">${titleElement}<p class="tagline">${series.tagline || ''}</p><div class="meta-info"><span>⭐ ${series.vote_average.toFixed(1)}</span>|<span>${series.first_air_date.substring(0, 4)}</span>|<span>${series.number_of_seasons} Seasons</span></div><div class="genres">${series.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join('')}</div><h3>Overview</h3><p class="overview">${series.overview}</p><div class="action-buttons">${trailerButtonHTML}</div></div>`;
        mainContainer.querySelector('.action-buttons')?.addEventListener('click', handleActionClick);
    }
    
    function createSeasonSelector(seasons) {
        const selectorContainer = document.createElement('div');
        selectorContainer.classList.add('seasons-selector-container');
        let optionsHTML = '';
        seasons.forEach(season => {
            if (season.season_number === 0) return; // Lewati "Specials"
            optionsHTML += `<option value="${season.season_number}">${season.name}</option>`;
        });
        selectorContainer.innerHTML = `
            <label for="season-select">Season:</label>
            <select name="seasons" id="season-select">${optionsHTML}</select>
        `;
        seasonsContainer.appendChild(selectorContainer);

        const seasonSelect = document.getElementById('season-select');
        seasonSelect.addEventListener('change', () => {
            fetchEpisodes(seasonSelect.value);
        });
        fetchEpisodes(seasonSelect.value); // Muat episode untuk season pertama
    }

    async function fetchEpisodes(seasonNumber) {
        const res = await fetch(`${API_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}`);
        const data = await res.json();
        displayEpisodes(data.episodes, seasonNumber);
    }

    function displayEpisodes(episodes, seasonNumber) {
        let existingList = seasonsContainer.querySelector('.episodes-list-container');
        if(existingList) existingList.remove();

        const listContainer = document.createElement('div');
        listContainer.classList.add('episodes-list-container');
        listContainer.innerHTML = '<h3>Episodes</h3>';

        const episodesList = document.createElement('div');
        episodesList.classList.add('episodes-list');

        episodes.forEach(ep => {
            const episodeItem = document.createElement('div');
            episodeItem.classList.add('episode-item');
            episodeItem.dataset.seasonNumber = seasonNumber;
            episodeItem.dataset.episodeNumber = ep.episode_number;
            
            episodeItem.innerHTML = `
                <h4>Ep ${ep.episode_number}: ${ep.name}</h4>
                <p>${ep.overview || 'No overview available.'}</p>
            `;
            episodeItem.addEventListener('click', () => {
                initiateAdSequence(seriesId, seriesImdbId, seasonNumber, ep.episode_number);
            });
            episodesList.appendChild(episodeItem);
        });

        listContainer.appendChild(episodesList);
        seasonsContainer.appendChild(listContainer);
    }

    function initiateAdSequence(seriesId, imdbId, seasonNum, epNum) {
        clearInterval(countdownInterval);
        const adTab = window.open(ADSTERRA_DIRECT_LINK, '_blank');
        if (!adTab) { alert('Please allow pop-ups for this site.'); return; }
        startCountdown(seriesId, imdbId, seasonNum, epNum);
    }
    
    function startCountdown(seriesId, imdbId, seasonNum, epNum) {
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
                    openSeriesPlayer(seriesId, imdbId, seasonNum, epNum);
                }
            }
        }, 1000);
    }

    function openSeriesPlayer(seriesId, imdbId, seasonNum, epNum) {
        let iframeSrc = '';
        // Cek manual DB (format untuk manual bisa dibuat /S{season}E{episode})
        if (typeof manualSeriesDatabase !== 'undefined' && manualSeriesDatabase[seriesId]) {
            iframeSrc = manualSeriesDatabase[seriesId];
        } else if (imdbId) {
            iframeSrc = `https://vidfast.pro/tv/${imdbId}/${seasonNum}/${epNum}`;
        }
        if (iframeSrc) {
            playerBody.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
        } else { alert('Sorry, this episode is not available to watch.'); }
    }
    
    // ... (sisa kode seperti updateMetaTags, openTrailerPlayer, close button, dll tetap sama)
    // Salin dari jawaban sebelumnya...

    fetchSeriesDetails();
});
