document.addEventListener('DOMContentLoaded', () => {
    // === Konfigurasi API ===
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';

    // === Elemen DOM ===
    const container = document.getElementById('movie-details-container');
    const modal = document.getElementById('media-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-btn');

    // === Ambil ID Film dari URL (Metode baru) ===
    const pathParts = window.location.pathname.split('/');
    const movieId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

    if (!movieId) {
        container.innerHTML = '<h1>Movie not found.</h1>';
        return;
    }

    async function fetchMovieDetails() {
        try {
            const res = await fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,images`);
            if (!res.ok) throw new Error('Failed to fetch movie details.');
            const movie = await res.json();
            displayMovieDetails(movie);
        } catch (error) {
            console.error(error);
            container.innerHTML = '<h1>Error loading movie details.</h1>';
        }
    }

    function displayMovieDetails(movie) {
        const backdropDiv = document.createElement('div');
        backdropDiv.classList.add('movie-details-backdrop');
        backdropDiv.style.backgroundImage = `url(${BACKDROP_PATH + movie.backdrop_path})`;
        document.body.prepend(backdropDiv);
        
        const englishLogo = movie.images.logos.find(logo => logo.iso_639_1 === 'en');
        const logoToUse = englishLogo || (movie.images.logos.length > 0 ? movie.images.logos[0] : null);
        const titleElement = logoToUse 
            ? `<img src="${IMG_PATH + logoToUse.file_path}" alt="${movie.title} Logo" class="movie-title-logo-detail">` 
            : `<h1>${movie.title}</h1>`;
        
        const officialTrailer = movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        const trailerButtonHTML = officialTrailer ? `<button class="action-btn trailer-btn" data-type="trailer" data-key="${officialTrailer.key}">Trailer</button>` : '';
        
        const movieButtonHTML = movie.imdb_id 
            ? `<button class="action-btn movie-btn" data-type="movie" data-key="${movie.imdb_id}">Movie</button>` 
            : '';

        container.innerHTML = `
            <div class="poster-container"><img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}"></div>
            <div class="info-container">
                ${titleElement}
                <p class="tagline">${movie.tagline || ''}</p>
                <div class="meta-info"><span>⭐ ${movie.vote_average.toFixed(1)}</span>|<span>${movie.release_date.substring(0, 4)}</span>|<span>${movie.runtime} min</span></div>
                <div class="genres">${movie.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join('')}</div>
                <h3>Overview</h3>
                <p class="overview">${movie.overview}</p>
                <div class="action-buttons">${trailerButtonHTML}${movieButtonHTML}</div>
            </div>`;
        
        const actionButtonsContainer = container.querySelector('.action-buttons');
        if (actionButtonsContainer) {
            actionButtonsContainer.addEventListener('click', handleActionClick);
        }
    }
    
    function handleActionClick(event) {
        const button = event.target.closest('.action-btn');
        if (!button) return;

        const type = button.dataset.type;
        const key = button.dataset.key;
        let iframeSrc = '';

        if (type === 'trailer') {
            iframeSrc = `https://www.youtube.com/embed/${key}?autoplay=1`;
        } else if (type === 'movie') {
            const tmdbId = movieId; // movieId sudah tersedia secara global di script ini
            const imdbId = key;
            
            if (manualMovieDatabase && manualMovieDatabase[tmdbId]) {
                iframeSrc = manualMovieDatabase[tmdbId];
            } else if (imdbId) {
                iframeSrc = `https://vidfast.pro/movie/${imdbId}`;
            }
        }

        if (iframeSrc) {
            modalBody.innerHTML = `<iframe src="${iframeSrc}" allowfullscreen></iframe>`;
            modal.style.display = 'block';
        } else {
            alert('Sorry, this movie is not available to watch.');
        }
    }

    closeModalBtn.onclick = () => {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            modalBody.innerHTML = '';
        }
    }
    
    fetchMovieDetails();
});
