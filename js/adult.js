document.addEventListener('DOMContentLoaded', function() {
    // --- Logika untuk Hamburger Menu (Tetap sama) ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMobile = document.getElementById('nav-mobile');

    if (hamburgerMenu && navMobile) {
        hamburgerMenu.addEventListener('click', function() {
            navMobile.classList.toggle('active');
        });
    }

    // --- Logika BARU untuk Membuat Kartu Film Secara Dinamis ---
    const gridContainer = document.getElementById('movie-grid-container');

    // Cek apakah data film ada dan container-nya ditemukan
    if (gridContainer && typeof adultMoviesData !== 'undefined' && adultMoviesData.length > 0) {
        
        // Buat HTML untuk setiap film dalam data
        const movieCardsHTML = adultMoviesData.map(movie => {
            const hdBadge = movie.isHD ? '<span class="badge hd">HD</span>' : '';
            
            // Perhatikan href: mengarah ke halaman player dengan ID film
            return `
                <a href="/adult/watch/${movie.id}" class="movie-card-link">
                    <div class="movie-card">
                        <div class="thumbnail">
                            <img src="${movie.thumbnailUrl}" alt="${movie.title}">
                            ${hdBadge}
                            <span class="badge duration">${movie.duration}</span>
                        </div>
                        <h3 class="title">${movie.title}</h3>
                    </div>
                </a>
            `;
        }).join(''); // Gabungkan semua HTML menjadi satu string

        // Masukkan semua kartu film ke dalam grid container
        gridContainer.innerHTML = movieCardsHTML;
    } else if (gridContainer) {
        gridContainer.innerHTML = "<p>No videos found.</p>";
    }
});
