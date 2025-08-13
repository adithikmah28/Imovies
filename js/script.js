// === File: js/script.js (Versi Final Paling Stabil & Aman) ===

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

function changeBg(bg, contentClass) {
  const banner = document.querySelector('.banner');
  const contents = document.querySelectorAll('.content');
  
  if (bg.startsWith('http')) {
    banner.style.background = `url("${bg}")`;
  } else {
    // Path absolut untuk Vercel
    banner.style.background = `url("/images/movies/${bg}")`;
  }

  banner.style.backgroundSize = 'cover';
  banner.style.backgroundPosition = 'center';

  contents.forEach(content => {
    content.classList.remove('active');
    if (content.classList.contains(contentClass)) {
      content.classList.add('active');
    }
  });
}

// === LOGIKA PENCARIAN YANG SUDAH DIPERBAIKI TOTAL ===
document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi API ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

    // --- Elemen DOM ---
    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    if (!searchInput) return;

    const mainCarousel = document.getElementById('main-carousel');
    const staticContents = document.querySelectorAll('.banner .content');

    // --- Simpan keadaan awal carousel ---
    const originalCarouselHTML = mainCarousel.innerHTML;

    async function performSearch(query) {
        // Jika input pencarian kosong, KEMBALIKAN KE SEMULA
        if (!query) {
            // Hancurkan instance carousel yang mungkin ada
            const carouselInstance = M.Carousel.getInstance(mainCarousel);
            if (carouselInstance) carouselInstance.destroy();

            // Kembalikan carousel ke keadaan semula
            mainCarousel.innerHTML = originalCarouselHTML;

            // Kembalikan info di kiri ke keadaan semula
            staticContents.forEach(el => el.classList.remove('active'));
            staticContents[0].classList.add('active');
            changeBg('bg-little-mermaid.jpg', 'the-little-mermaid');

            // Inisialisasi ulang carousel
            $(mainCarousel).carousel();
            return;
        }

        // Jika ada input, lakukan pencarian
        try {
            const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                updateCarouselForSearch(data.results);
            } else {
                alert('No movies found for "' + query + '"');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred during the search.');
        }
    }

    // Fungsi ini HANYA mengupdate carousel, tidak menyentuh yang lain
    function updateCarouselForSearch(movies) {
        // Hancurkan instance carousel yang lama
        const carouselInstance = M.Carousel.getInstance(mainCarousel);
        if (carouselInstance) carouselInstance.destroy();

        // Kosongkan isi carousel
        mainCarousel.innerHTML = '';
        
        // Sembunyikan semua info statis di kiri
        staticContents.forEach(el => el.classList.remove('active'));

        // Isi carousel dengan hasil pencarian
        movies.forEach(movie => {
            if (movie.poster_path) {
                const carouselItem = document.createElement('a');
                carouselItem.classList.add('carousel-item');
                // Link langsung ke halaman detail
                carouselItem.href = `/movies/${movie.id}`;
                // TIDAK ADA onClick di sini
                carouselItem.innerHTML = `<img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">`;
                mainCarousel.appendChild(carouselItem);
            }
        });
        
        // Inisialisasi ulang carousel dengan hasil baru
        $(mainCarousel).carousel();
    }
    
    // Event listeners untuk search
    searchIcon.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        }
    });
});
