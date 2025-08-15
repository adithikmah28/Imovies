document.addEventListener('DOMContentLoaded', function() {
    const watchButton = document.getElementById('watch-online-btn');
    const playerWrapper = document.getElementById('video-player-wrapper');

    const pathParts = window.location.pathname.split('/');
    const movieIdCode = pathParts[pathParts.length - 1];

    if (!movieIdCode || typeof adultMoviesData === 'undefined') {
        document.getElementById('details-title').textContent = "Error: Invalid URL or Data not found.";
        return;
    }
    
    const movieData = adultMoviesData.find(movie => movie.idCode == movieIdCode);

    if (!movieData) {
        document.getElementById('details-title').textContent = "Movie Not Found";
        return;
    }

    function populateData() {
        document.title = movieData.title + " | iMovies";
        document.getElementById('details-poster').src = movieData.posterUrl;
        document.getElementById('details-title').textContent = movieData.title;
        document.getElementById('details-id-code').textContent = movieData.idCode;
        const categoriesHTML = (movieData.tags || []).map(tag => `<span class="tag-pill">${tag}</span>`).join('');
        document.getElementById('details-categories').innerHTML = categoriesHTML;
        const actorsHTML = (movieData.actors || []).map(act => `<span class="tag-pill">${act}</span>`).join('');
        document.getElementById('details-actors').innerHTML = actorsHTML;
        document.getElementById('details-year').textContent = movieData.year || 'N/A';
        document.getElementById('details-country').textContent = movieData.country || 'N/A';
        document.getElementById('details-director').textContent = movieData.director || 'N/A';
        document.getElementById('details-writer').textContent = movieData.writer || 'N/A';
        document.getElementById('details-duration').textContent = movieData.duration || 'N/A';
        document.getElementById('details-release').textContent = movieData.releaseDate || 'N/A';
    }

    watchButton.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = movieData.iframeSrc;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');
        playerWrapper.innerHTML = '';
        playerWrapper.appendChild(iframe);
        playerWrapper.style.display = 'block';
        watchButton.style.display = 'none';
    });
    populateData();
});
