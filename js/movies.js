const API_KEY = "8b6e9b0f80c1340d69cab7c761dadf27";
const BASE_URL = "https://api.themoviedb.org/3";
const imagePath = "https://image.tmdb.org/t/p/original";
const posterPath = "https://image.tmdb.org/t/p/w500";

let currentPage = 1;
let totalPages = 0;
let originalMovies = []; // keeps the last non-search movie list, used to restore when search is cleared




const renderPagination = () => {

    let pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    // PREV BUTTON
    pagination.innerHTML += `
    
    <button
    class="page-btn"
    onclick="changePage(${currentPage - 1})">
        &#8249;
    </button>
    
    `;

    // PAGE BUTTONS
    for (
        let i = currentPage;
        i < currentPage + 5;
        i++
    ) {

        if (i > totalPages) break;

        pagination.innerHTML += `
        
        <button
        class="page-btn ${i === currentPage ? 'active' : ''}"
        onclick="changePage(${i})">

            ${i}

        </button>
        
        `;
    }
    pagination.innerHTML += `
    
    <span>...</span>

    <button
    class="page-btn"
    onclick="changePage(${totalPages})">

        ${totalPages}

    </button>
    
    `;

    // NEXT BUTTON
    pagination.innerHTML += `
    
    <button
    class="page-btn"
    onclick="changePage(${currentPage + 1})">

        &#8250;

    </button>
    
    `;
}

const renderMovies = (movies) => {
    document.getElementById('movies-grid').innerHTML = movies.map(v => `
        <div class="movie-card" 
             onclick="openPopup(${v.id})" data-id="${v.id}">
          <div class="movie-poster-wrap">
            <img src="${posterPath}${v.poster_path}" class="movie-poster" alt="${v.title}">
          </div>
          <h3 class="movie-card-title">${v.title}</h3>
          <div class="movie-card-meta">
            <span class="movie-card-year">${v.release_date?.slice(0, 4)}</span>
            <span class="movie-card-rating">★ ${v.vote_average.toFixed(1)}</span>
          </div>
        </div>
    `).join('');
}
const pagination = async () => {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}`;
    const allMovieData = await fetch(url);
    const allMovieres = await allMovieData.json();
    console.log(allMovieres.results);


    totalPages = Math.min(allMovieres.total_pages, 500);

    let startMovie = (currentPage - 1) * 20 + 1;
    let endMovie = Math.min(currentPage * 20, allMovieres.total_results);
    document.getElementById("movies-count").innerText =
        `Showing ${startMovie}–${endMovie} of ${allMovieres.total_results} movies`;

    originalMovies = allMovieres.results;
    renderMovies(allMovieres.results)
    renderPagination();

}

const changePage = async (page) => {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    await pagination();
}
pagination()

// NOTE: "filter-search" element does not exist in Movies.html, so
// document.getElementById("filter-search") was returning null, and
// calling .addEventListener on null crashed the whole script here —
// which is why the hamburger menu and the header search box below
// never worked (their event listeners never got attached).

let topSearchInput =
    document.querySelector(".search-input");

// The search input sits inside a <form>. Without this, clicking the
// search button (type="submit") or pressing Enter reloads the page.
document.querySelector(".search-form")
    .addEventListener("submit", (e) => e.preventDefault());

topSearchInput.addEventListener("input",
    async () => {

        let query = topSearchInput.value.trim();

        if (query === '') {
            // restore the normal movie list instead of an undefined "data"
            renderMovies(originalMovies);
            return;
        }

        let url =
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

        let res = await fetch(url);

        let data = await res.json();

        renderMovies(data.results || []);

    })


const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.classList.toggle('hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});