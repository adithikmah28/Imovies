// === File: js/script.js (Final Sesuai Permintaan Asli) ===

// --- FUNGSI ASLI LO (TIDAK DIOPREK) ---
function toggleVideo() {
  const trailer = document.querySelector('.trailer');
  const video = document.querySelector('video');
  trailer.classList.toggle('active');
  
  if (!trailer.classList.contains('active')) {
    video.pause();
    video.currentTime = 0;
  }
}

// Fungsi ini sedikit diubah agar bisa menerima URL lengkap
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

// --- LOGIKA PENCARIAN BARU YANG DITAMBAHKAN ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi API ---
    const API_KEY = 'MASUKKAN_API_KEY_TMDB_KAMU_DI_SINI';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';

    // --- Elemen DOM ---
    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    if (!searchInput) return; // Keluar jika bukan di halaman utama

    const mainCarousel = document.getElementById('main-carousel');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');
    const staticContents = document.querySelectorAll('.banner .content');

    // --- Simpan isi carousel asli ---
    const originalCarouselHTML = mainCarousel.innerHTML;

    async function performSearch(query) {
        // Jika input pencarian kosong, kembalikan ke semula
        if (!query) {
            // Hancurkan instance carousel dinamis jika ada
            const carouselInstance = M.Carousel.getInstance(mainCarousel);
            if (carouselInstance) carouselInstance.destroy();
            
            // Kembalikan isi carousel dan konten statis
            mainCarousel.innerHTML = originalCarouselHTML;
            dynamicContentContainer.innerHTML = ''; // Kosongkan wadah dinamis
            
            // Tampilkan kembali konten statis pertama
            staticContents.forEach(el => el.classList.remove('active'));
            staticContents[0].classList.add('active');
            
            // Ganti background ke gambar statis pertama
            changeBg('bg-little-mermaid.jpg', 'the-little-mermaid');

            // Inisialisasi ulang carousel untuk konten asli
            $(mainCarousel).carousel();
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

    function updateCarouselWithSearchResults(movies) {
        const carouselInstance = M.Carousel.getInstance(mainCarousel);
        if (carouselInstance) carouselInstance.destroy();

        mainCarousel.innerHTML = '';
        dynamicContentContainer.innerHTML = '';
        staticContents.forEach(el => el.classList.remove('active'));

        movies.forEach((movie, index) => {
            const { id, title, overview, release_date, backdrop_path, poster_path, vote_average } = movie;

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

            if (poster_path) {
                const carouselItem = document.createElement('a');
                carouselItem.classList.add('carousel-item');
                carouselItem.href = `/movies/${id}`;
                carouselItem.setAttribute('onClick', `event.preventDefault(); changeBg('${BACKDROP_PATH + backdrop_path}', 'movie-${id}');`);
                carouselItem.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${title}">`;
                mainCarousel.appendChild(carouselItem);
            }

            if (index === 0 && backdrop_path) {
                changeBg(BACKDROP_PATH + backdrop_path, `movie-${id}`);
            }
        });
        
        $(mainCarousel).carousel();
    }
    
    searchIcon.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        }
    });
});
