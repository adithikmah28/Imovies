// === File: js/script.js (Versi Final Paling Stabil) ===

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
    banner.style.background = `url("./images/movies/${bg}")`;
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

// === LOGIKA PENCARIAN BARU DAN LEBIH BAIK ===
document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'MASUKKAN_API_KEY_TMDB_KAMU_DI_SINI';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';

    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    
    // Periksa apakah elemen ada di halaman ini
    if (!searchInput) return;

    const mainCarousel = document.getElementById('main-carousel');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');
    const staticContents = document.querySelectorAll('.banner .content');

    async function performHomeSearch(query) {
        if (!query) {
            window.location.reload(); // Kembali ke awal jika pencarian kosong
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                updateCarouselWithSearchResults(data.results);
            } else {
                alert('No movies found for "' + query + '"');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred during the search.');
        }
    }

    // Fungsi untuk update UI (HANYA MENGUBAH CAROUSEL & WADAH TERSEMBUNYI)
    function updateCarouselWithSearchResults(movies) {
        // 1. Bersihkan isi carousel dan wadah dinamis
        mainCarousel.innerHTML = '';
        dynamicContentContainer.innerHTML = '';
        
        // 2. Sembunyikan semua konten statis
        staticContents.forEach(el => el.classList.remove('active'));

        // 3. Buat ulang elemen untuk setiap hasil pencarian
        movies.forEach((movie, index) => {
            const { id, title, overview, release_date, backdrop_path, poster_path, vote_average } = movie;

            // Buat konten info dan simpan di wadah tersembunyi
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content', `movie-${id}`);
            contentDiv.innerHTML = `
                <h2 class="movie-title-text">${title}</h2>
                <h4>
                  <span>${release_date ? release_date.substring(0, 4) : 'N/A'}</span>
                  <span><i>⭐ ${vote_average.toFixed(1)}</i></span>
                  <span>Movie</span>
                </h4>
                <p>${overview || 'No overview available.'}</p>
                <div class="button">
                  <a href="/movies/${id}"><i class="fa fa-play" aria-hidden="true"></i> View Details</a>
                </div>
            `;
            dynamicContentContainer.appendChild(contentDiv);

            // Buat item carousel baru
            if (poster_path) {
                const carouselItem = document.createElement('a');
                carouselItem.classList.add('carousel-item');
                carouselItem.href = `/movies/${id}`;
                carouselItem.setAttribute('onClick', `changeBg('${BACKDROP_PATH + backdrop_path}', 'movie-${id}');`);
                carouselItem.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${title}">`;
                mainCarousel.appendChild(carouselItem);
            }

            // Aktifkan film pertama sebagai default
            if (index === 0 && backdrop_path) {
                changeBg(BACKDROP_PATH + backdrop_path, `movie-${id}`);
            }
        });
        
        // 4. Inisialisasi ulang carousel Materialize
        $(mainCarousel).carousel();
    }
    
    // Tambahkan event listener untuk pencarian
    searchIcon.addEventListener('click', () => performHomeSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performHomeSearch(searchInput.value);
        }
    });
});
