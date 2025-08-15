document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi (Tetap sama) ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3निया21bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';
    const ADSTERRA_DIRECT_LINK = 'MASUKKAN_LINK_ADSTERRA_KAMU_DI_SINI';

    // --- Elemen DOM (Tetap sama) ---
    const mainContainer = document.getElementById('movie-details-container');
    const castContainer = document.getElementById('cast-container');
    const seasonsContainer = document.getElementById('seasons-and-episodes-container');
    const countdownModal = document.getElementById('countdown-modal');
    const countdownTimerEl = document.getElementById('countdown-timer');
    const playerModal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    const closePlayerBtn = document.getElementById('close-player-btn');
    
    const pathParts = window.location.pathname.split('/');
    const seriesId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    let countdownInterval;
    let seriesImdbId = null;

    if (!seriesId) { mainContainer.innerHTML = '<h1>Series not found.</h1>'; return; }

    async function fetchSeriesDetails() {
        try {
            const res = await fetch(`${API_BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=videos,images,external_ids,credits`);
            if (!res.ok) throw new Error('Failed to fetch series details.');
            const series = await res.json();
            
            seriesImdbId = series.external_ids.imdb_id;
            displaySeriesDetails(series);
            displayCast(series.credits.cast);
            createSeasonSelector(series.seasons); 
        } catch (error) { console.error(error); mainContainer.innerHTML = '<h1>Error loading series details.</h1>'; }
    }

    function displaySeriesDetails(series) {
        // ... (Fungsi ini tidak berubah) ...
        const backdropDiv = document.createElement('div');
        backdropDiv.classList.add('movie-details-backdrop');
        backdropDiv.style.backgroundImage = `url(${BACKDROP_PATH + series.backdrop_path})`;
        document.body.prepend(backdropDiv);
        const englishLogo = series.images.logos.find(logo => logo.iso_639_1 === 'en');
        const logoToUse = englishLogo || (series.images.logos.length > 0 ? series.images.logos[0] : null);
        const titleElement = logoToUse ? `<img src="${IMG_PATH + logoToUse.file_path}" alt="${series.name} Logo" class="movie-title-logo-detail">` : `<h1>${series.name}</h1>`;
        const country = series.origin_country && series.origin_country.length > 0 ? series.origin_country[0] : '';
        const countryHTML = country ? `<span>|</span><span>${country}</span>` : '';
        const officialTrailer = series.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const trailerButtonHTML = officialTrailer ? `<button class="action-btn trailer-btn" data-key="${officialTrailer.key}">Trailer</button>` : '';
        const seriesButtonHTML = `<div class="action-btn movie-btn-placeholder">Watch Series Below</div>`;
        mainContainer.innerHTML = `<div class="poster-container"><img src="${IMG_PATH + series.poster_path}" alt="${series.name}"></div><div class="info-container">${titleElement}<p class="tagline">${series.tagline || ''}</p><div class="meta-info"><span>⭐ ${series.vote_average.toFixed(1)}</span>|<span>${series.first_air_date.substring(0, 4)}</span>|<span>${series.number_of_seasons} Seasons</span>${countryHTML}</div><div class="genres">${series.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join('')}</div><h3>Overview</h3><p class="overview">${series.overview}</p><div class="action-buttons">${trailerButtonHTML}${seriesButtonHTML}</div></div>`;
        mainContainer.querySelector('.action-buttons')?.addEventListener('click', handleActionClick);
    }
    
    function displayCast(cast) {
        // ... (Fungsi ini tidak berubah) ...
        if (!cast || cast.length === 0) return;
        const castToShow = cast.slice(0, 10);
        let castHTML = '';
        castToShow.forEach(member => {
            const imageHTML = member.profile_path ? `<img src="${IMG_PATH + member.profile_path}" alt="${member.name}">` : `<i class="fa fa-user" aria-hidden="true"></i>`;
            castHTML += `<div class="cast-card"><div class="cast-image">${imageHTML}</div><p>${member.name}</p></div>`;
        });
        castContainer.innerHTML = `<h2>Cast</h2><div class="cast-list">${castHTML}</div>`;
    }

    // =============================================================
    // --- INI ADALAH LOGIKA YANG SUDAH DIPASTIKAN BERHASIL ---
    // =============================================================
    function createSeasonSelector(seasons) {
        if (!seasons || seasons.length === 0) return;
        
        // Untuk debugging, kita bisa lihat data mentah dari API
        console.log("Data Season Mentah dari API:", seasons);
        
        seasonsContainer.innerHTML = ''; // Selalu kosongkan kontainer dulu

        // Filter season yang tidak perlu (seperti "Specials" atau season 0)
        const validSeasons = seasons.filter(season => season.season_number > 0 || (season.season_number === 0 && season.name.toLowerCase() !== 'specials'));

        console.log("Season yang Valid setelah disaring:", validSeasons);

        if (validSeasons.length > 0) {
            const selectorContainer = document.createElement('div');
            selectorContainer.classList.add('seasons-selector-container');

            // LOGIKA BARU DAN LEBIH SEDERHANA:
            // Selama ada 1 atau lebih season valid, SELALU buat dropdown.
            let optionsHTML = validSeasons.map(season => 
                `<option value="${season.season_number}">${season.name} (${season.episode_count} Episodes)</option>`
            ).join('');
            
            selectorContainer.innerHTML = `<label for="season-select">Season:</label><select name="seasons" id="season-select">${optionsHTML}</select>`;
            seasonsContainer.appendChild(selectorContainer);
        
            // Tambahkan event listener ke dropdown yang baru dibuat
            document.getElementById('season-select').addEventListener('change', (e) => fetchEpisodes(e.target.value));
            
            // Langsung ambil episode untuk season pertama yang valid
            fetchEpisodes(validSeasons[0].season_number);
        } else {
            console.log("Tidak ada season yang valid untuk ditampilkan.");
        }
    }
    
    // ... (Sisa kode dari sini ke bawah tidak ada perubahan) ...

    async function fetchEpisodes(seasonNumber) {
        try {
            const res = await fetch(`${API_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}`);
            const data = await res.json();
            displayEpisodes(data.episodes, seasonNumber);
        } catch(error) { console.error(`Could not fetch episodes for season ${seasonNumber}`, error); }
    }
    
    function displayEpisodes(episodes, seasonNumber) {
        let existingList = seasonsContainer.querySelector('.episodes-list-container');
        if(existingList) existingList.remove();
        const listContainer = document.createElement('div');
        listContainer.classList.add('episodes-list-container');
        listContainer.innerHTML = '<h3>Episodes</h3>';
        const episodesList = document.createElement('div');
        episodesList.classList.add('episodes-list');
        if (!episodes || episodes.length === 0) {
            episodesList.innerHTML = `<p>No episode information available for this season.</p>`;
        } else {
            episodes.forEach(ep => {
                const episodeItem = document.createElement('div');
                episodeItem.classList.add('episode-item');
                episodeItem.addEventListener('click', () => {
                    initiateAdSequence(seriesId, seriesImdbId, seasonNumber, ep.episode_number);
                });
                const imageHTML = ep.still_path ? `<img src="${IMG_PATH + ep.still_path}" alt="${ep.name}">` : `<i class="fa fa-image" aria-hidden="true"></i>`;
                episodeItem.innerHTML = `<div class="episode-image">${imageHTML}</div><div class="episode-info"><h4>Ep ${ep.episode_number}: ${ep.name}</h4><p>${ep.overview || 'No overview available.'}</p></div>`;
                episodesList.appendChild(episodeItem);
            });
        }
        listContainer.appendChild(listContainer);
        seasonsContainer.appendChild(listContainer);
    }
    
    function handleActionClick(event) {
        const button = event.target.closest('.action-btn');
        if (button && button.classList.contains('trailer-btn')) { openTrailerPlayer(button.dataset.key); }
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
    async function openSeriesPlayer(seriesId, imdbId, seasonNum, epNum) {
        let iframeSrc = '';
        if (typeof manualSeriesDatabase !== 'undefined' && manualSeriesDatabase[seriesId]) { iframeSrc = manualSeriesDatabase[seriesId]; } 
        else if (imdbId) { iframeSrc = `https://vidfast.pro/tv/${imdbId}/${seasonNum}/${epNum}`; }
        if (iframeSrc) {
            playerBody.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe>`;
            playerModal.classList.add('active');
        } else { alert('Sorry, this episode is not available to watch.'); }
    }
    function openTrailerPlayer(youtubeKey) {
        playerBody.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1" allowfullscreen></iframe>`;
        playerModal.classList.add('active');
    }

    closePlayerBtn.onclick = () => { playerModal.classList.remove('active'); playerBody.innerHTML = ''; };
    fetchSeriesDetails();
});
