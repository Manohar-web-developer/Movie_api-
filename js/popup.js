
let movieOverlay = document.getElementById("movie-overlay");
let closeBtn = document.getElementById("popup-close");
closeBtn.addEventListener("click", () => {
  movieOverlay.classList.remove("active");
  document.getElementById("popup-trailer").innerHTML = "";
})
movieOverlay.addEventListener("click", (e) => {

  if (e.target === movieOverlay) {

    movieOverlay.classList.remove("active");
    document.getElementById("popup-trailer").innerHTML = "";


  }

})
let openPopup = async (id) => {
  let detailUrl =
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
  let creditsUrl =
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`;
  let similarUrl =
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`;
  let videosUrl =
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`;
  movieOverlay.classList.add("active");


  // Movie Detail 
  const detailRes = await fetch(detailUrl);
  const detailData = await detailRes.json();
  document.getElementById("popup-poster").src = `${posterPath}${detailData.poster_path}`
  document.getElementById("popup-title").innerText = `${detailData.original_title}`
  document.getElementById("popup-tagline").innerText = `${detailData.tagline}`
  document.getElementById("popup-overview").innerText = `${detailData.overview}`
  let hours = Math.floor(detailData.runtime / 60);
  let mins = detailData.runtime % 60;
  document.getElementById('popup-chips').innerHTML = `
  <span class="p-chip">${detailData.release_date.slice(0, 4)}</span>
  <span class="p-chip">${hours}h ${mins}m</span>
  <span class="p-chip">${detailData.tagline}</span>
  <div class="p-chip-rating">★ ${detailData.vote_average.toFixed(2)}<span>/10</span> (${detailData.vote_count} votes)</div>
`;
  document.getElementById('popup-extra-details').innerHTML = `
  <span class="pd-key">Budget</span>
  <span class="pd-val">$${detailData.budget.toLocaleString()}</span>

  <span class="pd-key">Revenue</span>
  <span class="pd-val">$${detailData.revenue.toLocaleString()}</span>

  <span class="pd-key">Status</span>
  <span class="pd-val">${detailData.status}</span>

  <span class="pd-key">Language</span>
  <span class="pd-val">${detailData.original_language.toUpperCase()}</span>

  <span class="pd-key">Country</span>
  <span class="pd-val">${detailData.origin_country?.[0] || 'N/A'}</span>
`;
  document.getElementById('popup-stats').innerHTML = `
  <div class="stat-item">
    <div class="stat-top">
      <span class="stat-icon">⭐</span>
      <span class="stat-value">${detailData.vote_average.toFixed(1)}<span class="stat-denom">/10</span></span>
    </div>
    <span class="stat-sub">TMDB Rating</span>
  </div>

  <div class="stat-item">
    <div class="stat-top">
      <span class="stat-icon">👥</span>
      <span class="stat-value">${detailData.vote_count.toLocaleString()}</span>
    </div>
    <span class="stat-sub">Votes</span>
  </div>

  <div class="stat-item">
    <div class="stat-top">
      <span class="stat-icon">🔥</span>
      <span class="stat-value">${detailData.popularity.toFixed(1)}</span>
    </div>
    <span class="stat-sub">Popularity</span>
  </div>

  <div class="stat-item">
    <div class="stat-top">
      <span class="stat-icon" style="color:#4caf85;">●</span>
      <span class="stat-value">${detailData.vote_average.toFixed(1)}<span class="stat-denom">/10</span></span>
    </div>
    <span class="stat-sub">User Score</span>
  </div>
`;

  // Credit Data 

  const creditRes = await fetch(creditsUrl);
  const creditsData = await creditRes.json();
  const crew = creditsData.crew;

  const director = crew.find(p => p.job === "Director")?.name || "N/A"
  const writer = crew
    .filter(p => p.job === "Writer" || p.job === "Screenplay")
    .map(p => p.name)
    .join(", ") || "N/A";
  document.getElementById('popup-director-label').innerText = director;
  document.getElementById('popup-details-grid').innerHTML = `
  <span class="pd-key">Director</span>
  <span class="pd-val red">${director}</span>

  <span class="pd-key">Writer</span>
  <span class="pd-val red">${writer}</span>

  <span class="pd-key">Release Date</span>
  <span class="pd-val">
${new Date(detailData.release_date).toLocaleDateString("en-IN")}
</span>

  <span class="pd-key">Runtime</span>
  <span class="pd-val">${hours}h ${mins}m</span>
`;
  const cast = creditsData.cast.slice(0, 5);

  document.getElementById('popup-cast').innerHTML = cast.map(person => `
  <div class="cast-card">
    ${person.profile_path
      ? `<img src="https://image.tmdb.org/t/p/w185${person.profile_path}" class="cast-photo" alt="${person.name}">`
      : `<div class="cast-photo-placeholder">👤</div>`
    }
    <span class="cast-name">${person.name}</span>
    <span class="cast-character">${person.character}</span>
  </div>
`).join('');

  // Smimiler 

  const similarRes = await fetch(similarUrl);
  const similarData = await similarRes.json();
  const finalSimilar = similarData.results.slice(0, 10);

  document.getElementById('popup-similar').innerHTML = finalSimilar.map(v => `
  <div class="similar-card" onclick="openPopup(${v.id})">
    ${v.poster_path
      ? `<img src="${posterPath}${v.poster_path}" class="similar-poster" alt="${v.title}">`
      : `<div class="similar-poster-placeholder">🎬</div>`
    }
    <span class="similar-title">${v.title}</span>
    <span class="similar-year">${v.release_date?.slice(0, 4) || 'N/A'}</span>
  </div>
`).join('');


  // Video trailer

  const videoRes = await fetch(videosUrl);

  const videoData = await videoRes.json();

  let trailer = videoData.results.find(
    v => v.type === "Trailer"
  );
  document.getElementById("popup-trailer").innerHTML =
    `
 <iframe
  width="100%"
  height="300"
  src="https://www.youtube.com/embed/${trailer.key}"
  title="YouTube trailer"
  frameborder="0"
  allowfullscreen>
 </iframe>
 `

  document.getElementById('popup-bottom-bg').src = `${imagePath}${detailData.backdrop_path}`;
  document.getElementById('popup-bottom-content').innerHTML = `
   <p class="bottom-releasing">Releasing On</p>
   <p class="bottom-date">${new Date(detailData.release_date)
      .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
   <p class="bottom-tagline">In Cinemas Worldwide</p>
 `;
}

window.openPopup = openPopup;