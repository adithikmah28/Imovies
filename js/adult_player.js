document.addEventListener('DOMContentLoaded', function() {
    const videoTitleEl = document.getElementById('video-title');
    const videoPlayerEl = document.getElementById('video-player');

    // Ambil ID film dari URL (misal: /adult/watch/123 -> ID-nya adalah 123)
    const pathParts = window.location.pathname.split('/');
    const movieId = pathParts[pathParts.length - 1];

    if (movieId && typeof adultMoviesData !== 'undefined') {
        // Cari data film yang cocok berdasarkan ID
        // Gunakan '==' karena ID dari URL adalah string, dan di data bisa jadi number
        const movieData = adultMoviesData.find(movie => movie.id == movieId);

        if (movieData) {
            // Jika data ditemukan, perbarui halaman
            document.title = movieData.title + " | iMovies";
            videoTitleEl.textContent = movieData.title;
            videoPlayerEl.src = movieData.iframeSrc;
        } else {
            // Jika ID film tidak ada di database
            videoTitleEl.textContent = "Video Not Found";
        }
    } else {
        videoTitleEl.textContent = "Invalid URL or Missing Data";
    }
});
