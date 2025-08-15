document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('movie-grid-container');
    const paginationContainer = document.getElementById('pagination-container');
    const categoryNavs = document.querySelectorAll('.adult-nav, .nav-mobile ul');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMobile = document.getElementById('nav-mobile');

    const MOVIES_PER_PAGE = 16;
    let currentPage = 1;
    let currentCategory = 'all';
    let filteredMovies = adultMoviesData;

    if (hamburgerMenu && navMobile) {
        hamburgerMenu.addEventListener('click', () => navMobile.classList.toggle('active'));
    }

    function displayPage() {
        gridContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
        const endIndex = startIndex + MOVIES_PER_PAGE;
        const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

        if (paginatedMovies.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No videos found.</p>`;
        } else {
            const movieCardsHTML = paginatedMovies.map(movie => `
                <a href="/adult/${movie.idCode}" class="movie-card-link">
                    <div class="movie-card">
                        <div class="thumbnail">
                            <img src="${movie.posterUrl}" alt="${movie.title}">
                            <span class="badge duration">${movie.duration}</span>
                        </div>
                        <h3 class="title">${movie.title}</h3>
                    </div>
                </a>
            `).join('');
            gridContainer.innerHTML = movieCardsHTML;
        }
        setupPagination();
    }
    
    function setupPagination() {
        const pageCount = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement('button');
            btn.classList.add('pagination-btn');
            if (i === currentPage) {
                btn.classList.add('active');
            }
            btn.innerText = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                displayPage();
                window.scrollTo(0, 0);
            });
            paginationContainer.appendChild(btn);
        }
    }

    function handleCategoryClick(event) {
        if (event.target.tagName === 'A' && event.target.dataset.category) {
            event.preventDefault();
            
            currentCategory = event.target.dataset.category;
            currentPage = 1;

            categoryNavs.forEach(nav => {
                nav.querySelectorAll('a[data-category]').forEach(link => link.classList.remove('active'));
                nav.querySelectorAll(`a[data-category="${currentCategory}"]`).forEach(link => link.classList.add('active'));
            });

            if (currentCategory === 'all') {
                filteredMovies = adultMoviesData;
            } else {
                filteredMovies = adultMoviesData.filter(movie => movie.tags.includes(currentCategory));
            }

            displayPage();

            if (navMobile.classList.contains('active')) {
                navMobile.classList.remove('active');
            }
        }
    }

    if (gridContainer && typeof adultMoviesData !== 'undefined') {
        displayPage();
        categoryNavs.forEach(nav => nav.addEventListener('click', handleCategoryClick));
    }
});
