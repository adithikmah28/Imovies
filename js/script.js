// === File: js/script.js (Final dengan Modal Pencarian) ===

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
    // Gunakan path absolut untuk konsistensi
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

// === LOGIKA BARU UNTUK MODAL PENCARIAN (TIDAK MERUSAK FUNGSI ASLI) ===
document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi API ---
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

    // --- Elemen DOM ---
    const searchInput = document.getElementById('home-search-input');
    const searchIcon = document.getElementById('home-search-icon');
    if (!searchInput) return; // Hanya berjalan di halaman yang memiliki elemen ini

    // Elemen Modal
    const searchModal = document.getElementById('search-modal');
    const closeModalBtn = document.getElementById('close-search-modal');
    const searchResultsTitle = document.getElementById('search-results-title');
    const searchResultsGrid = document.getElementById('search-results-grid');

    async function performSearch(query) {
        if (!query) return;

        // Tampilkan modal dengan status "Mencari..."
        searchResultsTitle.innerText = `Searching for "${query}"...`;
        searchResultsGrid.innerHTML = ''; // Kosongkan hasil sebelumnya
        searchModal.style.display = 'flex';

        try {
            const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                displaySearchResults(data.results, query);
            } else {
                searchResultsTitle.innerText = `No movies found for "${query}"`;
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResultsTitle.innerText = `An error occurred during the search.`;
        }
    }

    function displaySearchResults(movies, query) {
        searchResultsTitle.innerText = `Search Results for "${query}"`;
        
        movies.forEach(movie => {
            if (!movie.poster_path) return; // Lewati film tanpa poster

            const movieCard = document.createElement('a');
            movieCard.classList.add('search-result-card');
            movieCard.href = `/movies/${movie.id}`; // Link ke halaman detail
            
            movieCard.innerHTML = `
                <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;
            searchResultsGrid.appendChild(movieCard);
        });
    }
    
    // Event Listeners untuk Pencarian
    searchIcon.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        }
    });

    // Event Listeners untuk Menutup Modal
    closeModalBtn.onclick = () => {
        searchModal.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target == searchModal) {
            searchModal.style.display = 'none';
        }
    };
});
