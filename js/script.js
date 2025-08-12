// === File: js/script.js (Revisi Final) ===

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

// --- Fungsi Asli Lo yang Dimodifikasi ---
// Sekarang bisa menerima path gambar lengkap atau hanya nama file
function changeBg(bg, title) {
  const banner = document.querySelector('.banner');
  const contents = document.querySelectorAll('.content');
  
  // Cek apakah 'bg' adalah URL lengkap atau nama file lokal
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

    if (!searchInput) return; // Hanya jalankan jika di halaman utama

    // Fungsi untuk melakukan pencarian
    async function performHomeSearch(query) {
        if (!query) return;

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

    // Fungsi untuk update UI dengan hasil pencarian
    function updateHomepageWithSearchResults(movies) {
        // 1. Hapus semua konten info film yang ada (statis & dinamis)
        mainBanner.querySelectorAll('.content').forEach(el => el.remove());

        // 2. Hapus semua item carousel yang ada
        mainCarousel.innerHTML = '';
        
        // 3. Buat ulang elemen untuk setiap hasil pencarian
        movies.forEach((movie, index) => {
            const { id, title, overview, release_date, backdrop_path, poster_path, vote_average } = movie;

            // Buat konten info baru (disembunyikan secara default)
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content', `movie-${id}`);
            // Kita pakai teks, bukan logo, agar lebih cepat dan konsisten
            contentDiv.innerHTML = `
                <h2 class="movie-title-text">${title}</h2>
                <h4>
                  <span>${release_date ? release_date.substring(0, 4) : 'N/A'}</span>
                  <span><i>⭐ ${vote_average.toFixed(1)}</i></span>
                  <span>Movie</span>
                </h4>
                <p>${overview}</p>
                <div class="button">
                  <a href="/movies/${id}"><i class="fa fa-play" aria-hidden="true"></i> View Details</a>
                </div>
            `;
            // Sisipkan konten sebelum carousel box
            mainBanner.insertBefore(contentDiv, document.getElementById('main-carousel-box'));

            // Buat item carousel baru
            if (poster_path) {
                const carouselItem = document.createElement('a');
                carouselItem.classList.add('carousel-item');
                carouselItem.href = `/movies/${id}`;
                
                // Modifikasi onClick untuk menangani data API
                carouselItem.setAttribute('onClick', `changeBg('${BACKDROP_PATH + backdrop_path}', 'movie-${id}');`);
                
                carouselItem.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${title}">`;
                mainCarousel.appendChild(carouselItem);
            }

            // Aktifkan film pertama sebagai default
            if (index === 0) {
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
