// =======================================================
//   DATABASE FILM (IDCODE SEKARANG JADI KUNCI UTAMA)
//   Pastikan setiap 'idCode' unik.
// =======================================================

const adultMoviesData = [
    {
        idCode: "GAL-001", // <-- KUNCI BARU. HARUS UNIK.
        title: "[SUB-INDO] Galactic Odyssey: The Final Frontier",
        posterUrl: "https://image.tmdb.org/t/p/w500/A4jG0t0F3n4kQd3gldAlOa0d8os.jpg",
        iframeSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tags: ["Censored", "English Subtitle", "Indonesia Subtitle"],
        actors: ["Chris Pratt", "Zoe Saldaña"],
        year: "2023",
        country: "USA",
        director: "James Gunn",
        writer: "James Gunn",
        duration: "02:15:30",
        releaseDate: "2023-05-05"
    },
    {
        idCode: "CYBER-002",
        title: "[SUB-INDO] Cyber City Chronicles: Neon Shadow",
        posterUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
        iframeSrc: "https://vidsrc.to/embed/movie/tt0133093",
        tags: ["Uncensored", "English Subtitle", "Chinese AV"],
        actors: ["Keanu Reeves", "Carrie-Anne Moss"],
        year: "1999",
        country: "USA",
        director: "Wachowskis",
        writer: "Wachowskis",
        duration: "01:55:12",
        releaseDate: "1999-03-31"
    },
    // --- CONTOH DATA LAIN UNTUK TES PAGINATION ---
    { idCode: "SORC-003", title: "The Last Sorcerer's Heir", posterUrl: "https://image.tmdb.org/t/p/w500/9O7gL8sri36c035n62OXLv5p2v2.jpg", iframeSrc: "https://vidsrc.to/embed/movie/tt0120737", tags: ["Amateur", "Indonesia Subtitle"], duration: "02:05:45", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "LEAK-004", title: "Uncensored Leaked Footage", posterUrl: "https://image.tmdb.org/t/p/w500/s3TBr3jTJB4IuEJVD2G2s2i7T3D.jpg", iframeSrc: "https://vidsrc.to/embed/movie/tt0417435", tags: ["Uncensored Leaked", "Amateur"], duration: "00:45:10", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-005", title: "Contoh Film 5", posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", iframeSrc: "#", tags: ["Censored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-006", title: "Contoh Film 6", posterUrl: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclZvC.jpg", iframeSrc: "#", tags: ["Uncensored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-007", title: "Contoh Film 7", posterUrl: "https://image.tmdb.org/t/p/w500/xV2KzK0pVKsY22eamvWpp1zs4I8.jpg", iframeSrc: "#", tags: ["Amateur"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-008", title: "Contoh Film 8", posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", iframeSrc: "#", tags: ["Chinese AV"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-009", title: "Contoh Film 9", posterUrl: "https://image.tmdb.org/t/p/w500/A4jG0t0F3n4kQd3gldAlOa0d8os.jpg", iframeSrc: "#", tags: ["Censored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-010", title: "Contoh Film 10", posterUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg", iframeSrc: "#", tags: ["Uncensored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-011", title: "Contoh Film 11", posterUrl: "https://image.tmdb.org/t/p/w500/9O7gL8sri36c035n62OXLv5p2v2.jpg", iframeSrc: "#", tags: ["Amateur"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-012", title: "Contoh Film 12", posterUrl: "https://image.tmdb.org/t/p/w500/s3TBr3jTJB4IuEJVD2G2s2i7T3D.jpg", iframeSrc: "#", tags: ["Uncensored Leaked"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-013", title: "Contoh Film 13", posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", iframeSrc: "#", tags: ["Censored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-014", title: "Contoh Film 14", posterUrl: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclZvC.jpg", iframeSrc: "#", tags: ["Uncensored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-015", title: "Contoh Film 15", posterUrl: "https://image.tmdb.org/t/p/w500/xV2KzK0pVKsY22eamvWpp1zs4I8.jpg", iframeSrc: "#", tags: ["Amateur"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-016", title: "Contoh Film 16", posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", iframeSrc: "#", tags: ["Chinese AV"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
    { idCode: "DUMMY-017", title: "Contoh Film 17 (Halaman 2)", posterUrl: "https://image.tmdb.org/t/p/w500/A4jG0t0F3n4kQd3gldAlOa0d8os.jpg", iframeSrc: "#", tags: ["Censored"], duration: "01:30:00", actors: [], year: "", country: "", director: "", writer: "", releaseDate: "" },
];
