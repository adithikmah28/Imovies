// =======================================================
//   DATABASE FILM UNTUK HALAMAN ADULT (VERSI LENGKAP)
// =======================================================

const adultMoviesData = [
    {
        id: 1,
        title: "[SUB-INDO] Galactic Odyssey: The Final Frontier",
        posterUrl: "https://image.tmdb.org/t/p/w500/A4jG0t0F3n4kQd3gldAlOa0d8os.jpg", // Mengganti thumbnailUrl menjadi posterUrl
        iframeSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Link video embed
        
        // --- INFORMASI DETAIL BARU ---
        idCode: "GAL-001-sub-indo",
        categories: ["Sci-Fi", "Action", "Adventure", "Space Opera"],
        actors: ["Chris Pratt", "Zoe Saldaña", "Dave Bautista"],
        year: "2023",
        country: "USA",
        director: "James Gunn",
        writer: "James Gunn",
        duration: "02:15:30",
        releaseDate: "2023-05-05"
    },
    {
        id: 2,
        title: "[SUB-INDO] Cyber City Chronicles: Neon Shadow",
        posterUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
        iframeSrc: "https://vidsrc.to/embed/movie/tt0133093",
        
        idCode: "CYBER-002-sub-indo",
        categories: ["Cyberpunk", "Action", "Thriller"],
        actors: ["Keanu Reeves", "Carrie-Anne Moss"],
        year: "1999",
        country: "USA",
        director: "Wachowskis",
        writer: "Wachowskis",
        duration: "01:55:12",
        releaseDate: "1999-03-31"
    },
    {
        id: 3,
        title: "[SUB-INDO] The Last Sorcerer's Heir",
        posterUrl: "https://image.tmdb.org/t/p/w500/9O7gL8sri36c035n62OXLv5p2v2.jpg",
        iframeSrc: "https://vidsrc.to/embed/movie/tt0120737",
        
        idCode: "SORC-003-sub-indo",
        categories: ["Fantasy", "Adventure", "Magic"],
        actors: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
        year: "2001",
        country: "New Zealand",
        director: "Peter Jackson",
        writer: "J.R.R. Tolkien",
        duration: "02:05:45",
        releaseDate: "2001-12-19"
    },
    // --- CONTOH TAMBAH FILM BARU ---
    // {
    //     id: 4,
    //     title: "[SUB-INDO] Judul Film Baru",
    //     posterUrl: "https://link-gambar-poster.com/poster.jpg",
    //     iframeSrc: "https://link-embed-video.com/video",
    //
    //     idCode: "KODE-FILM-004",
    //     categories: ["Genre 1", "Genre 2"],
    //     actors: ["Aktor 1", "Aktris 1"],
    //     year: "2024",
    //     country: "Indonesia",
    //     director: "Sutradara",
    //     writer: "Penulis",
    //     duration: "01:30:00",
    //     releaseDate: "2024-10-26"
    // },
];
