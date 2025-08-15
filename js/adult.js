document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMobile = document.getElementById('nav-mobile');

    if (hamburgerMenu && navMobile) {
        hamburgerMenu.addEventListener('click', function() {
            navMobile.classList.toggle('active');
        });
    }
});
