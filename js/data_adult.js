// =======================================================
//   DATABASE FILM UNTUK HALAMAN ADULT
//   Untuk menambah film baru, cukup salin satu blok object
//   (dari { sampai }), tempel di bawahnya, dan ganti isinya.
//   Pastikan setiap 'id' unik (tidak boleh ada yang sama).
// =======================================================

const adultMoviesData = [
    {
        id: 1, // ID unik untuk setiap film
        title: "Galactic Odyssey: The Final Frontier",
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/A4jG0t0F3n4kQd3gldAlOa0d8os.jpg",
        duration: "02:15:30",
        isHD: true,
        iframeSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ" // GANTI DENGAN LINK IFRAME VIDEO ANDA
    },
    {
        id: 2,
        title: "Cyber City Chronicles: Neon Shadow",
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
        duration: "01:55:12",
        isHD: true,
        iframeSrc: "https://vidsrc.to/embed/movie/tt0133093" // Contoh link embed lain
    },
    {
        id: 3,
        title: "The Last Sorcerer's Heir",
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/9O7gL8sri36c035n62OXLv5p2v2.jpg",
        duration: "02:05:45",
        isHD: false, // Contoh film yang tidak HD
        iframeSrc: "https://vidsrc.to/embed/movie/tt0120737"
    },
    {
        id: 4,
        title: "Echoes of the Deep",
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/s3TBr3jTJB4IuEJVD2G2s2i7T3D.jpg",
        duration: "01:48:22",
        isHD: true,
        iframeSrc: "https://vidsrc.to/embed/movie/tt0417435"
    },
    // --- CONTOH CARA MENAMBAHKAN FILM BARU ---
    // {
    //     id: 5, // ID harus unik, jadi ganti ke angka selanjutnya
    //     title: "Judul Film Baru Anda",
    //     thumbnailUrl: "https://link-ke-gambar-poster.com/image.jpg",
    //     duration: "01:30:00",
    //     isHD: true,
    //     iframeSrc: "https://link-embed-video-anda.com/video"
    // },
];
