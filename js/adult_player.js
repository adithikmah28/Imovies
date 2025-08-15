document.addEventListener('DOMContentLoaded', function() {
    // --- Ambil ID film dari URL ---
    const pathParts = window.location.pathname.split('/');
    const movieId = pathParts[pathParts.length - 1];

    // --- Cek apakah data film ada ---
    if (!movieId || typeof adultMoviesData === 'undefined') {
        document.getElementById('details-title').textContent = "Error: Invalid URL or Data not found.";
        return;
    }
    
    // --- Cari data film yang sesuai ---
    const movieData = adultMoviesData.find(movie => movie.id == movieId);

    if (!movieData) {
        document.getElementById('details-title').textContent = "Movie Not Found";
        return;
    }

    // --- Fungsi untuk mengisi data ke elemen HTML ---
    function populateData() {
        // Ganti judul halaman
        document.title = movieData.title + " | iMovies";

        // Isi elemen-elemen
        document.getElementById('details-poster').src = movieData.posterUrl;
        document.getElementById('details-title').textContent = movieData.title;
        document.getElementById('details-id-code').textContent = movieData.idCode;
        
        // Buat tag untuk kategori
        const categoriesHTML = movieData.categories.map(cat => `<span class="tag-pill">${cat}</span>`).join('');
        document.getElementById('details-categories').innerHTML = categoriesHTML;

        // Buat tag untuk aktor
        const actorsHTML = movieData.actors.map(act => `<span class="tag-pill">${act}</span>`).join('');
        document.getElementById('details-actors').innerHTML = actorsHTML;
        
        // Isi metadata lainnya
        document.getElementById('details-year').textContent = movieData.year;
        document.getElementById('details-country').textContent = movieData.country;
        document.getElementById('details-director').textContent = movieData.director;
        document.getElementById('details-writer').textContent = movieData.writer;
        document.getElementById('details-duration').textContent = movieData.duration;
        document.getElementById('details-release').textContent = movieData.releaseDate;
    }

    // --- Logika untuk Tombol "Watch Online" ---
    const watchButton = document.getElementById('watch-online-btn');
    const playerWrapper = document.getElementById('video-player-wrapper');

    watchButton.addEventListener('click', () => {
        // Buat iframe
        const iframe = document.createElement('iframe');
        iframe.src = movieData.iframeSrc;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');

        // Masukkan iframe ke wrapper
        playerWrapper.innerHTML = ''; // Kosongkan dulu untuk jaga-jaga
        playerWrapper.appendChild(iframe);

        // Tampilkan player dan sembunyikan tombol
        playerWrapper.style.display = 'block';
        watchButton.style.display = 'none';
    });

    // Panggil fungsi untuk mengisi data saat halaman dimuat
    populateData();
});
