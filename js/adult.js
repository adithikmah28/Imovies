document.addEventListener('DOMContentLoaded', function() {
    // --- Elemen DOM ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMobile = document.getElementById('nav-mobile');
    const gridContainer = document.getElementById('movie-grid-container');
    const categoryNavs = document.querySelectorAll('.adult-nav, .nav-mobile ul');

    // --- Logika Hamburger Menu ---
    if (hamburgerMenu && navMobile) {
        hamburgerMenu.addEventListener('click', () => navMobile.classList.toggle('active'));
    }

    // --- Fungsi untuk Merender Film ke Grid ---
    function renderMovies(moviesToRender) {
        // Kosongkan grid sebelum mengisi
        gridContainer.innerHTML = ''; 

        if (!moviesToRender || moviesToRender.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No videos found for this category.</p>`;
            return;
        }

        const movieCardsHTML = moviesToRender.map(movie => {
            // Gunakan movie.posterUrl dan movie.duration
            return `
                <a href="/adult/watch/${movie.id}" class="movie-card-link">
                    <div class="movie-card">
                        <div class="thumbnail">
                            <img src="${movie.posterUrl}" alt="${movie.title}">
                            <span class="badge duration">${movie.duration}</span>
                        </div>
                        <h3 class="title">${movie.title}</h3>
                    </div>
                </a>
            `;
        }).join('');

        gridContainer.innerHTML = movieCardsHTML;
    }

    // --- Fungsi untuk Meng-handle Klik Kategori ---
    function handleCategoryClick(event) {
        // Hanya proses jika yang diklik adalah link dengan atribut data-category
        if (event.target.tagName === 'A' && event.target.dataset.category) {
            event.preventDefault(); // Mencegah link berpindah halaman
            
            const selectedCategory = event.target.dataset.category;

            // Update tampilan tombol aktif
            categoryNavs.forEach(nav => {
                nav.querySelectorAll('a[data-category]').forEach(link => link.classList.remove('active'));
                nav.querySelectorAll(`a[data-category="${selectedCategory}"]`).forEach(link => link.classList.add('active'));
            });

            // Filter data film
            let filteredMovies;
            if (selectedCategory === 'all') {
                filteredMovies = adultMoviesData; // Tampilkan semua jika kategori "all"
            } else {
                // Saring film yang array 'tags'-nya mengandung kategori yang dipilih
                filteredMovies = adultMoviesData.filter(movie => movie.tags.includes(selectedCategory));
            }

            // Render ulang grid dengan data yang sudah difilter
            renderMovies(filteredMovies);

            // Jika di mobile, tutup menu setelah memilih kategori
            if (navMobile.classList.contains('active')) {
                navMobile.classList.remove('active');
            }
        }
    }

    // --- Inisialisasi Halaman ---
    if (gridContainer && typeof adultMoviesData !== 'undefined') {
        // 1. Tampilkan semua film saat halaman pertama kali dimuat
        renderMovies(adultMoviesData); 

        // 2. Tambahkan event listener ke kedua navigasi (desktop dan mobile)
        categoryNavs.forEach(nav => nav.addEventListener('click', handleCategoryClick));
    }
});
