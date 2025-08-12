// === File: js/script.js (Final dengan Path Absolut yang Benar) ===

// --- Fungsi Asli Lo ---
function toggleVideo() {
  const trailer = document.querySelector('.trailer');
  const video = document.querySelector('video');
  trailer.classList.toggle('active');
  
  if (!trailer.classList.contains('active')) {
    video.pause();
    video.currentTime = 0;
  }
}

function changeBg(bg, title) {
  const banner = document.querySelector('.banner');
  const contents = document.querySelectorAll('.content');
  
  if (bg.startsWith('http')) {
    banner.style.background = `url("${bg}")`;
  } else {
    // === PERBAIKAN UTAMA DI SINI: Path diubah menjadi absolut ===
    banner.style.background = `url("/images/movies/${bg}")`;
  }

  banner.style.backgroundSize = 'cover';
  banner.style.backgroundPosition = 'center';

  contents.forEach(content => {
    content.classList.remove('active');
    if (content.classList.contains(title)) {
      content.classList.add('active');
    }
  });
}

// === LOGIKA PENCARIAN ===
document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';

    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    if (!searchInput) return;

    const mainCarousel = document.getElementById('main-carousel');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');
    const staticContents = document.querySelectorAll('.banner .content');
    const originalCarouselHTML = mainCarousel.innerHTML;

    async function performSearch(query) {
        if (!query) {
            const carouselInstance = M.Carousel.getInstance(mainCarousel);
            if (carouselInstance) carouselInstance.destroy();
            mainCarousel.innerHTML = originalCarouselHTML;
            dynamicContentContainer.innerHTML = '';
            staticContents.forEach(el => {
                el.classList.remove('active');
                el.style.display = 'block';
            });
            staticContents[0].classList.add('active');
            changeBg('bg-little-mermaid.jpg', 'the-little-mermaid');
            $(mainCarousel).carousel();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                updateCarouselWithRichResults(data.results);
            } else {
                alert('No movies found for "' + query + '"');
            }
        } catch (error) { console.error('Search error:', error); alert('An error occurred during the search.'); }
    }

    async function updateCarouselWithRichResults(movies) {
        const carouselInstance = M.Carousel.getInstance(mainCarousel);
        if (carouselInstance) carouselInstance.destroy();

        mainCarousel.innerHTML = '';
        dynamicContentContainer.innerHTML = '';
        staticContents.forEach(el => el.style.display = 'none');
        mainCarousel.innerHTML = '<p style="color:white; text-align:center; width:100%;">Loading search results...</p>';

        for (const [index, movie] of movies.entries()) {
            let detailedMovie = {};
            try {
                const detailRes = await fetch(`${API_BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=images`);
                detailedMovie = await detailRes.json();
            } catch (e) { continue; }

            const { id, title, overview, release_date, backdrop_path, poster_path } = movie;
            const runtime = detailedMovie.runtime ? `${Math.floor(detailedMovie.runtime / 60)}h ${detailedMovie.runtime % 60}min` : 'N/A';
            const genres = detailedMovie.genres && detailedMovie.genres.length > 0 ? detailedMovie.genres[0].name : 'Movie';
            const englishLogo = detailedMovie.images?.logos.find(logo => logo.iso_639_1 === 'en');
            const logoToUse = englishLogo || (detailedMovie.images?.logos.length > 0 ? detailedMovie.images.logos[0] : null);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content', `movie-${id}`);
            const titleElement = logoToUse ? `<img class="movie-title" src="${IMG_PATH + logoToUse.file_path}" alt="${title} Logo">` : `<h2 class="movie-title-text">${title}</h2>`;
            contentDiv.innerHTML = `
                ${titleElement}
                <h4>
                  <span>${release_date ? release_date.substring(0, 4) : 'N/A'}</span>
                  <span><i>NR</i></span>
                  <span>${runtime}</span>
                  <span>${genres}</span>
                </h4>
                <p>${overview || 'No overview available.'}</p>
                <div class="button"><a href="/movies/${id}"><i class="fa fa-play" aria-hidden="true"></i> View Details</a></div>
            `;
            dynamicContentContainer.appendChild(contentDiv);

            if (poster_path) {
                const carouselItem = document.createElement('a');
                carouselItem.classList.add('carousel-item');
                carouselItem.href = `/movies/${id}`;
                carouselItem.setAttribute('onClick', `event.preventDefault(); changeBg('${BACKDROP_PATH + backdrop_path}', 'movie-${id}');`);
                carouselItem.innerHTML = `
                    <img src="${IMG_PATH + poster_path}" alt="${title}">
                    <div class="carousel-item-title">${title}</div>
                `;
                
                if (index === 0) mainCarousel.innerHTML = '';
                mainCarousel.appendChild(carouselItem);
            }

            if (index === 0 && backdrop_path) {
                changeBg(BACKDROP_PATH + backdrop_path, `movie-${id}`);
            }
        }
        $(mainCarousel).carousel();
    }
    
    searchIcon.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); }
    });
});
