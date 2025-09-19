const API_KEY = 'YOUR_API_KEY_HERE'; // Remember to put your key here
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// API endpoints
const apiEndpoints = {
    trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
    topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    action: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
    comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`,
    horror: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`,
};

// DOM Elements
const banner = document.querySelector('.banner');
const bannerTitle = document.querySelector('.banner-title');
const bannerDescription = document.querySelector('.banner-description');
const movieRowsContainer = document.getElementById('movie-rows');

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateBanner(movies) {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    banner.style.backgroundImage = `url(${BACKDROP_BASE_URL}${randomMovie.backdrop_path})`;
    bannerTitle.textContent = randomMovie.title || randomMovie.name;
    bannerDescription.textContent = randomMovie.overview;
}

function createMovieRow(title, movies) {
    const row = document.createElement('div');
    row.className = 'movie-row';
    const rowTitle = document.createElement('h2');
    rowTitle.textContent = title;
    row.appendChild(rowTitle);
    
    const postersContainer = document.createElement('div');
    postersContainer.className = 'posters-container';
    
    movies.forEach(movie => {
        const poster = document.createElement('img');
        poster.className = 'poster';
        poster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
        poster.alt = movie.title;

        // *** THIS IS THE IMPORTANT CHANGE ***
        // When a poster is clicked, go to the details page
        poster.addEventListener('click', () => {
            window.location.href = `details.html?id=${movie.id}`;
        });
        
        postersContainer.appendChild(poster);
    });
    
    row.appendChild(postersContainer);
    movieRowsContainer.appendChild(row);
}

async function initialize() {
    const trendingMovies = await fetchData(apiEndpoints.trending);
    if (trendingMovies && trendingMovies.results) updateBanner(trendingMovies.results);

    const topRatedMovies = await fetchData(apiEndpoints.topRated);
    if (topRatedMovies && topRatedMovies.results) createMovieRow('Top Rated', topRatedMovies.results);

    const actionMovies = await fetchData(apiEndpoints.action);
    if (actionMovies && actionMovies.results) createMovieRow('Action Movies', actionMovies.results);
    
    const comedyMovies = await fetchData(apiEndpoints.comedy);
    if (comedyMovies && comedyMovies.results) createMovieRow('Comedy Movies', comedyMovies.results);

    const horrorMovies = await fetchData(apiEndpoints.horror);
    if (horrorMovies && horrorMovies.results) createMovieRow('Horror Movies', horrorMovies.results);
}

initialize();
