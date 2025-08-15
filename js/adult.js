document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMobile = document.getElementById('nav-mobile');

    if (hamburgerMenu && navMobile) {
        hamburgerMenu.addEventListener('click', function() {
            navMobile.classList.toggle('active');
        });
    }

    const gridContainer = document.getElementById('movie-grid-container');

    if (gridContainer && typeof adultMoviesData !== 'undefined' && adultMoviesData.length > 0) {
        const movieCardsHTML = adultMoviesData.map(movie => {
            // Kita tidak punya data HD lagi, jadi badge HD dihapus.
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
    } else if (gridContainer) {
        gridContainer.innerHTML = "<p>No videos found.</p>";
    }
});
