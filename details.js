// This is the new JavaScript file for details.html

const API_KEY = 'YOUR_API_KEY_HERE'; // Remember to put your key here
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// DOM Elements for the details page
const detailsContainer = document.getElementById('details-container');
const movieTitle = document.getElementById('movie-title');
const releaseDate = document.getElementById('release-date');
const rating = document.getElementById('rating');
const movieOverview = document.getElementById('movie-overview');
const genresContainer = document.getElementById('genres');
const playTrailerBtn = document.getElementById('play-trailer-btn');
const trailerContainer = document.getElementById('trailer-container');
const trailerPlayer = document.getElementById('trailer-player');
const closeTrailerBtn = document.getElementById('close-trailer-btn');

// Get movie ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Fetch detailed movie data
async function fetchMovieDetails() {
    // We use "append_to_response=videos" to get trailer info in the same request
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch movie details.');
        const data = await response.json();
        displayMovieDetails(data);
    } catch (error) {
        console.error(error);
        detailsContainer.innerHTML = `<p style="color: red; text-align: center;">Could not load movie details.</p>`;
    }
}

// Display the movie details on the page
function displayMovieDetails(movie) {
    // Set background
    detailsContainer.style.backgroundImage = `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`;
    
    // Set text content
    movieTitle.textContent = movie.title;
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    rating.textContent = `Rating: ${movie.vote_average.toFixed(1)} / 10`;
    movieOverview.textContent = movie.overview;
    
    // Display genres
    genresContainer.innerHTML = ''; // Clear previous genres
    movie.genres.forEach(genre => {
        const genreSpan = document.createElement('span');
        genreSpan.textContent = genre.name;
        genresContainer.appendChild(genreSpan);
    });

    // Setup trailer button
    const officialTrailer = movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (officialTrailer) {
        playTrailerBtn.addEventListener('click', () => {
            trailerPlayer.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${officialTrailer.key}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            trailerContainer.classList.remove('hidden');
        });
    } else {
        playTrailerBtn.style.display = 'none'; // Hide button if no trailer
    }
}

// Close the trailer player
closeTrailerBtn.addEventListener('click', () => {
    trailerContainer.classList.add('hidden');
    trailerPlayer.innerHTML = ''; // Stop the video
});

// Initial fetch
if (movieId) {
    fetchMovieDetails();
}
