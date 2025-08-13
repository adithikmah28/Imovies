document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'bda883e3019106157c9a9c5cfe3921bb';
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_PATH = 'https://image.tmdb.org/t/p/original';
    const ADSTERRA_DIRECT_LINK = 'MASUKKAN_LINK_ADSTERRA_KAMU_DI_SINI';

    // ... (Elemen DOM dan variabel lain tidak berubah)
    
    // === FUNGSI BARU UNTUK UPDATE META TAG ===
    function updateMetaTags(series) {
        const newTitle = `${series.name} | iMovies`;
        const newDescription = series.overview.substring(0, 155) + '...'; // Potong overview agar pas
        const newImageUrl = BACKDROP_PATH + series.backdrop_path;

        // Update Title
        document.title = newTitle;
        
        // Update Meta Description
        document.querySelector('meta[name="description"]').setAttribute('content', newDescription);
        
        // Update Open Graph (Facebook, WhatsApp, dll)
        document.querySelector('meta[property="og:title"]').setAttribute('content', newTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', newDescription);
        document.querySelector('meta[property="og:image"]').setAttribute('content', newImageUrl);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);

        // Update Twitter Card
        document.querySelector('meta[property="twitter:title"]').setAttribute('content', newTitle);
        document.querySelector('meta[property="twitter:description"]').setAttribute('content', newDescription);
        document.querySelector('meta[property="twitter:image"]').setAttribute('content', newImageUrl);
        document.querySelector('meta[property="twitter:url"]').setAttribute('content', window.location.href);
    }


    async function fetchSeriesDetails() {
        // ... (fungsi ini tidak berubah)
        const res = await fetch(`${API_BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=videos,images,external_ids`);
        const series = await res.json();
        
        // Panggil fungsi update meta tag
        updateMetaTags(series); 
        
        displaySeriesDetails(series);
    }

    function displaySeriesDetails(series) {
        // ... (Seluruh isi fungsi ini tidak berubah dari sebelumnya)
    }

    // ... (Semua fungsi lain seperti handleActionClick, initiateAdSequence, dll. tetap sama)
});

// PENTING: Untuk menjaga jawaban tetap ringkas, gue hanya menunjukkan perubahan.
// Pastikan lo copy paste SELURUH file series_details.js dari jawaban sebelumnya,
// lalu TAMBAHKAN fungsi `updateMetaTags` dan panggilannya seperti contoh di atas.
