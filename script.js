document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: Replace with your own TMDb API key.
    const API_KEY = 'YOUR_API_KEY_HERE';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

    // API endpoints for different movie categories.
    const apiEndpoints = {
        trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
        topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`,
        action: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
        comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`,
        horror: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`,
    };

    // 2. DOM Element Selection 
    // Select elements from the existing HTML structure.
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-content h1');
    const heroDescription = document.querySelector('.hero-description');
    const heroBackground = document.querySelector('.hero-bg');
    const movieRowsContainer = document.querySelector('.content-rows');


    // 3. Core Functions 

    /**
     * Fetches data from a given URL asynchronously.
     * @param {string} url The API endpoint to fetch data from.
     * @returns {Promise<object|null>} The JSON response from the API, or null on error.
     */
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    /**
     * Updates the hero banner with a random movie from the provided list.
     * @param {Array<object>} movies An array of movie objects.
     */
    function updateHero(movies) {
        if (!movies || movies.length === 0) return;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        // Check for essential data before updating the DOM
        if (randomMovie.backdrop_path && randomMovie.title && randomMovie.overview) {
            heroBackground.style.backgroundImage = `url(${BACKDROP_BASE_URL}${randomMovie.backdrop_path})`;
            heroTitle.textContent = randomMovie.title || randomMovie.name;
            heroDescription.textContent = randomMovie.overview;
        } else {
            // Fallback if the random movie is missing data
            console.warn('Selected random movie is missing required data:', randomMovie);
        }
    }

    /**
     * Creates and appends a new movie row to the container.
     * @param {string} title The title of the movie row (e.g., "Trending Now").
     * @param {Array<object>} movies An array of movie objects to display.
     * @param {boolean} isTopTen A flag to style the row as a "Top 10" list.
     */
    function createMovieRow(title, movies, isTopTen = false) {
        if (!movies || movies.length === 0) return;

        const row = document.createElement('div');
        row.className = 'row';

        const rowTitle = document.createElement('h2');
        rowTitle.textContent = title;
        row.appendChild(rowTitle);

        const postersContainer = document.createElement('div');
        postersContainer.className = 'row-posters';
        if (isTopTen) {
            postersContainer.classList.add('top-10-row');
        }

        const moviesToDisplay = isTopTen ? movies.slice(0, 10) : movies;

        moviesToDisplay.forEach((movie, index) => {
            if (!movie.poster_path) return; // Skip movies without a poster

            const posterWrapper = document.createElement('div');
            if (isTopTen) {
                posterWrapper.className = 'top-10-poster';
                const number = document.createElement('span');
                number.className = 'number';
                number.textContent = index + 1;
                posterWrapper.appendChild(number);
            }

            const poster = document.createElement('img');
            poster.className = 'poster';
            poster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
            poster.alt = movie.title;

            // When a poster is clicked, navigate to a details page with the movie ID.
            poster.addEventListener('click', () => {
                // We'll need to create 'details.html' to make this work.
                window.location.href = `details.html?id=${movie.id}`;
            });

            posterWrapper.appendChild(poster);
            postersContainer.appendChild(posterWrapper);
        });

        row.appendChild(postersContainer);
        movieRowsContainer.appendChild(row);
    }

    /**
     * Initializes the application by fetching all data and rendering the page.
     */
    async function initialize() {
        // Clear any existing hardcoded movie rows
        movieRowsContainer.innerHTML = '';

        const trendingMoviesData = await fetchData(apiEndpoints.trending);
        if (trendingMoviesData && trendingMoviesData.results) {
            updateHero(trendingMoviesData.results);
            createMovieRow('Trending Now', trendingMoviesData.results);
        }

        const topRatedMoviesData = await fetchData(apiEndpoints.topRated);
        if (topRatedMoviesData && topRatedMoviesData.results) {
            createMovieRow('Top 10 in India Today', topRatedMoviesData.results, true);
        }

        const actionMoviesData = await fetchData(apiEndpoints.action);
        if (actionMoviesData && actionMoviesData.results) {
            createMovieRow('Action Movies', actionMoviesData.results);
        }

        const comedyMoviesData = await fetchData(apiEndpoints.comedy);
        if (comedyMoviesData && comedyMoviesData.results) {
            createMovieRow('Comedy Movies', comedyMoviesData.results);
        }

        const horrorMoviesData = await fetchData(apiEndpoints.horror);
        if (horrorMoviesData && horrorMoviesData.results) {
            createMovieRow('Horror Movies', horrorMoviesData.results);
        }
    }

    // 4. Event Listeners & Initialization 

    // Header scroll effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Start the application
    initialize();
});

