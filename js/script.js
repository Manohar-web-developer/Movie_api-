const API_KEY = "8b6e9b0f80c1340d69cab7c761dadf27";
const BASE_URL = "https://api.themoviedb.org/3";
const imagePath = "https://image.tmdb.org/t/p/original";
const posterPath = "https://image.tmdb.org/t/p/w500";


// Banner Code Start
let res = [];
let trendingMovieUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
let currentIndex = 0

const heroBg = document.getElementById("hero-bg");
let dotContainer = document.getElementById('hero-dots');

heroBg.style.opacity = "0";
const showHeroMovie = () => {

    const movie = res[currentIndex];

    heroBg.style.opacity = "0";


    setTimeout(() => {

        heroBg.style.backgroundImage = `url(${imagePath}${movie.backdrop_path})`;

        heroBg.style.opacity = "1";

        document.getElementById("hero-title").innerText = movie.title;

        document.getElementById("hero-meta").innerText =
            `${movie.release_date.slice(0, 4)} | ${movie.original_language.toUpperCase()} | ⭐ ${movie.vote_average.toFixed(1)}`;

        document.getElementById("hero-desc").innerText = movie.overview;

    }, 300);
    dotContainer.querySelectorAll(".hero-dot").forEach((v, i) => {
        if (i === currentIndex) {
            v.classList.add("active")
        } else {
            v.classList.remove("active")
        }

    })

}

document.getElementById("hero-prev").addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = res.length - 1
    }


    showHeroMovie();


})
document.getElementById("hero-next").addEventListener("click", () => {
    currentIndex++;

    if (currentIndex > res.length - 1) {
        currentIndex = 0
    }


    showHeroMovie();


})

setInterval(() => {
    currentIndex++
    if (currentIndex > res.length - 1) {
        currentIndex = 0
    }
    showHeroMovie();

}, 5000)

const fetchTrending = async () => {
    const response = await fetch(trendingMovieUrl);
    let data = await response.json();
    res = data.results.slice(6, 15);
    res.forEach((v, i) => {

        let dotBtn = document.createElement('button');
        dotBtn.className = 'hero-dot';
        if (i === currentIndex) {
            dotBtn.classList.add("active")
        }

        dotContainer.appendChild(dotBtn)
        dotBtn.addEventListener("click", () => {
            currentIndex = i;
            showHeroMovie();
        })
    })
    showHeroMovie();

}

fetchTrending();

document
    .querySelector(".btn-watch")
    .addEventListener("click", async () => {

        let id = res[currentIndex].id;

        let videosUrl =
            `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`;

        let videoRes = await fetch(videosUrl);

        let videoData = await videoRes.json();

        let trailer = videoData.results.find(
            v => v.type === "Trailer"
        );

        if (trailer) {

            window.open(
                `https://www.youtube.com/watch?v=${trailer.key}`
            );

        }

    })
document
    .querySelector(".btn-info")
    .addEventListener("click", () => {

        openPopup(res[currentIndex].id);

    })

// Banner Code End


// Popular Movies Start

let popularMovieUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}`

let movie = []
let popularMovies = document.getElementById("popular-movies")

const fetchPopular = async () => {
    const popularRes = await fetch(popularMovieUrl);
    let data = await popularRes.json();
    movie = data.results.slice(0, 7);

    movie.forEach((v, i) => {
        popularMovies.innerHTML += `
        <div class="movie-card"onclick="openPopup(${v.id})">
    
        <div class="movie-poster-wrap">
    
            <img 
                src="${posterPath}${v.poster_path}" 
                alt="${v.title}" 
                class="movie-poster"
            >
    
            <span class="movie-badge movie-badge--rating">
                ⭐ ${v.vote_average.toFixed(1)}
            </span>
    
        </div>
    
        <h3 class="movie-card-title">
            ${v.title}
        </h3>
    
        <p class="movie-card-year">
            ${v.release_date.slice(0, 4)}
        </p>
    
    </div>`
    })

}
fetchPopular();

// Popular Movies End

// New Releases Movies Start

let newReleaseUrl = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`

let NewReleases = []
let newReleases = document.getElementById("new-releases")

const fetchRelease = async () => {
    const popularRess = await fetch(newReleaseUrl);
    let data = await popularRess.json();
    NewReleases = data.results.slice(7, 14);

    NewReleases.forEach((v, i) => {
        newReleases.innerHTML += `
        <div class="movie-card" onclick="openPopup(${v.id})">
    
        <div class="movie-poster-wrap">
    
            <img 
                src="${posterPath}${v.poster_path}" 
                alt="${v.title}" 
                class="movie-poster"
            >
    
            <span class="movie-badge movie-badge--rating">
                ⭐ ${v.vote_average.toFixed(1)}
            </span>
    
        </div>
    
        <h3 class="movie-card-title">
            ${v.title}
        </h3>
    
        <p class="movie-card-year">
            ${v.release_date.slice(0, 4)}
        </p>
    
    </div>`


    })

}
fetchRelease();

// New Releases Movies End


// Top Rated Start
let topRatedUrl = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`

let newtopRated = []
let newTopRated = document.getElementById("top-rated")

const fetchtopRated = async () => {
    const Top = await fetch(topRatedUrl);
    let data = await Top.json();
    newtopRated = data.results.slice(0, 7);

    newtopRated.forEach((v, i) => {
        newTopRated.innerHTML += `
        <div class="movie-card" onclick="openPopup(${v.id})">
    
        <div class="movie-poster-wrap">
    
            <img 
                src="${posterPath}${v.poster_path}" 
                alt="${v.title}" 
                class="movie-poster"
            >
    
            <span class="movie-badge movie-badge--rating">
                ⭐ ${v.vote_average.toFixed(1)}
            </span>
    
        </div>
    
        <h3 class="movie-card-title">
            ${v.title}
        </h3>
    
        <p class="movie-card-year">
            ${v.release_date.slice(0, 4)}
        </p>
    
    </div>`



    })

}
fetchtopRated()
// Top Rated End

// Genres Start
let genreUrl = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
let finalGenres = []
let genreTags = document.getElementById("genre-tags");
const fetchGenres = async () => {
    let Genres = await fetch(genreUrl);
    let GenresData = await Genres.json();
    finalGenres = GenresData.genres
    finalGenres.forEach(val => {
        genreTags.innerHTML += `
         <button class="genre-tag"I I >
          ${val.name}
         </button>`
        document.getElementById('popup-genres').innerText =
            detailData.genres.map(g => g.name).join(' • ');

    })

}
fetchGenres();
// Genres End






// Hamburger open close

const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.classList.toggle('hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});