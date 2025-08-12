// === File: js/script.js (Revisi Final Anti-Rusak) ===

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
    banner.style.background = `url("../images/movies/${bg}")`;
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


// === LOGIKA BARU UNTUK PENCARIAN DI HALAMAN UTAMA ===
document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'MASUKKAN_API_KEY_TMDB_KAMU_DI_SINI';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';

    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    const mainBanner = document.getElementById('main-banner');
    const mainCarousel = document.getElementById('main-carousel');
    const carouselBox = document.getElementById('main-carousel-box');

    if (!searchInput) return;

    // Simpan konten statis asli
    const originalStaticContent = mainBanner.innerHTML;

    async function performHomeSearch(query) {
        if (!query) {
            // Jika input kosong, kembalikan ke konten asli
            mainBanner.innerHTML = originalStaticContent;
            // Inisialisasi ulang carousel untuk konten asli
            $('#main-carousel').carousel();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                updateHomepageWithSearchResults(data.results);
            } else {
                alert('No movies found for "' + query + '"');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred during the search.');
        }
    }

    // Fungsi untuk update UI dengan hasil pencarian (VERSI BARU YANG LEBIH BAIK)
    async function updateHomepageWithSearchResults(movies) {
        // 1. Hapus hanya konten dinamis sebelumnya (jika ada) dan item carousel
        mainBanner.querySelectorAll('.content.dynamic').forEach(el => el.remove());
        mainCarousel.innerHTML = '';

        // 2. Sembunyikan semua konten statis
        mainBanner.querySelectorAll('.content').forEach(el => el.style.display = 'none');
        
        // 3. Buat ulang elemen untuk setiap hasil pencarian
        for (const [index, movie] of movies.entries()) {
            const { id, title, overview, release_date, backdrop_path, poster_path, vote_average } = movie;
            
            // Ambil detail tambahan (runtime, genre, logo) dengan panggilan API kedua
            let detailedMovie = {};
            try {
                const detailRes = await fetch(`${API_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=images`);
                detailedMovie = await detailRes.json();
            } catch (e) { /* Abaikan jika gagal */ }

            const runtime = detailedMovie.runtime ? `${Math.floor(detailedMovie.runtime / 60)}h ${detailedMovie.runtime % 60}min` : 'N/A';
            const genres = detailedMovie.genres ? detailedMovie.genres.map(g => g.name).join('/') : 'Movie';
            const englishLogo = detailedMovie.images?.logos.find(logo => logo.iso_639_1 === 'en');
            const logoToUse = englishLogo || (detailedMovie.images?.logos.length > 0 ? detailedMovie.images.logos[0] : null);

            // Buat konten info baru
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content', 'dynamic', `movie-${id}`); // Tambah class 'dynamic'
            
            const titleElement = logoToUse 
                ? `<img class="movie-title" src="${IMG_PATH + logoToUse.file_path}" alt="${title} Logo">`
                : `<h2 class="movie-title-text">${title}</h2>`;

            contentDiv.innerHTML = `
                ${titleElement}
                <h4>
                  <span>${release_date ? release_date.substring(0, 4) : 'N/A'}</span>
                  <span><i>⭐ ${vote_average.toFixed(1)}</i></span>
                  <span>${runtime}</span>
                  <span>${genres}</span>
                </h4>
                <p>${overview}</p>
                <div class="button">
                  <a href="/movies/${id}"><i class="fa fa-play" aria-hidden="true"></i> View Details</a>
                </div>
            `;
            mainBanner.insertBefore(contentDiv, carouselBox);

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
            if (index === 0) {
                changeBg(BACKDROP_PATH + backdrop_path, `movie-${id}`);
            }
        }
        
        // 4. Inisialisasi ulang carousel Materialize
        $(mainCarousel).carousel();
    }
    
    searchIcon.addEventListener('click', () => performHomeSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performHomeSearch(searchInput.value);
        }
    });
});
