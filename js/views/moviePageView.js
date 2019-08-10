// this file is for the final movie page view with ALL the movie information available

import { movieScoreCalculator, elements, dollarFormat, contentLimiter } from '../models/Base';

export const renderPage = (dataTMDB, dataOMDB, credits, socialMedia, trailer, images, reviews) => {
    
    ///////////
    //  Missing IMDB ID
    ///////////
    let omdbRatingsAvailable = 0;
    if (dataOMDB.Response === "False") {     // if IMDB ID is not available from TMDB, the required dataOMDB data is set so that the page does not return any error
        dataOMDB.imdbRating = null;
        dataOMDB.Metascore = null;
    } else omdbRatingsAvailable = dataOMDB.Ratings.length;


    ///////////
    //  Ratings (fix for the movie page that does not load if a single rating is missing). Also, do not show any rating source info at all if the rating is not available
    ///////////
    let rottenScore = '', rottenScoreTP = false, imdbScore = '', imdbScoreTP = false, tmdbScore = '', tmdbScoreTP = false, movieMeScore = '', metascore = '', metascoreTP = false; // variables ending in TP are to be passed to scoreCalculator()
    for (let i = 0; i < omdbRatingsAvailable; i++) {
        if (dataOMDB.Ratings[i].Source === "Rotten Tomatoes") {
            rottenScore = `<p>Rotten Tomatoes: <span class="content__top--secondary-rotten">${dataOMDB.Ratings[i].Value}</span></p>`; 
            rottenScoreTP = dataOMDB.Ratings[i].Value.split('%')[0];
        }
        if (dataOMDB.Ratings[i].Source === "Internet Movie Database") {
            imdbScore = `<div class="content__top--secondary-imdb">
                            IMDB Score: <span class="content__top--secondary-imdb-rating">${dataOMDB.Ratings[i].Value}</span>
                            <span class="content__top--secondary-imdb-icon"><i class="fas fa-star"></i></span>
                        </div>`;
            imdbScoreTP = dataOMDB.Ratings[i].Value;
        }
        if (dataOMDB.Ratings[i].Source === "Metacritic") {
            metascore = `<div class="content__middle--ratings-metacritic"><p>Metascore: <span class="content__top--secondary-metacritic">${dataOMDB.Ratings[i].Value.split('/')[0]}</span></p></div>`;     // dataOMDB.Ratings[i].Value returns a string with max score included e.g. "65/100" so we convert it to just "65"
            metascoreTP = dataOMDB.Ratings[i].Value.split('/')[0];
        }
    }

    if (dataOMDB.imdbRating && dataOMDB.imdbRating !== "N/A") {  // just in case if IMDB rating is not available under 'Source: Internet Movie Database'
        imdbScore = `<div class="content__top--secondary-imdb">
                        IMDB Score: <span class="content__top--secondary-imdb-rating">${dataOMDB.imdbRating}</span>
                        <span class="content__top--secondary-imdb-icon"><i class="fas fa-star"></i></span>
                    </div>`;
        imdbScoreTP = dataOMDB.imdbRating;
    }

    if (dataOMDB.Metascore && dataOMDB.Metascore !== "N/A")  {  // just in case if Metascore is not available under 'Source: Metacritic'
        metascore = `<div class="content__middle--ratings-metacritic"><p>Metascore: <span class="content__top--secondary-metacritic">${dataOMDB.Metascore}</span></p></div>`; // dataOMDB.Metascore returns a single value e.g. "65"
        metascoreTP = dataOMDB.Metascore;
    }

    if (dataTMDB.vote_average && dataTMDB.vote_average !== 0) {
        tmdbScore = 
            `<div class="content__top--secondary-tmdb">TMDB Rating: 
                <span class="content__top--secondary-tmdb-rating">${dataTMDB.vote_average.toFixed(1)}</span>
                <span class="content__top--secondary-tmdb-votes">&nbsp;${dataTMDB.vote_count ? '(' + dataTMDB.vote_count + ' vote' + (dataTMDB.vote_count > 1 ? 's)' : ')') : ''}</span>
            </div>`;    // second condition in the last span is used here to show either 'vote' or 'votes'
        tmdbScoreTP = dataTMDB.vote_average;
    }

    movieMeScore = `<p>Movie_Me! Score: <span class="content__top--secondary-movieme">${movieScoreCalculator(imdbScoreTP, rottenScoreTP, metascoreTP, tmdbScoreTP)}</span></p>`;


    ///////////
    //  Missing poster
    ///////////
    let moviePagePoster = '<img src="img/image-na.jpg" alt="movie-poster-not-available" class="search-page__movie-poster-image">';
    if (dataTMDB.poster_path) moviePagePoster = `<a class="content__top--poster-link" href="https://image.tmdb.org/t/p/original${dataTMDB.poster_path}" target="_blank"><img src="https://image.tmdb.org/t/p/w500${dataTMDB.poster_path}" alt="movie-poster-${dataTMDB.title}" class="content__top--poster"></a>`;


    ///////////
    //  To only show the directors, producers and writers under 'TOP CREW'
    ///////////
    const crew = {};
    for (let i = 0; i < credits.crew.length; i++) {
        if (credits.crew[i].job === "Director" || credits.crew[i].job === "director") {
            if (crew.director) crew.director += credits.crew[i].name + "<br><b>(Director)</b><br>";
            else crew.director = credits.crew[i].name + "<br><b>(Director)</b><br>";
        }
        if (credits.crew[i].job === "Producer" || credits.crew[i].job === "producer") {
            if (crew.producer) crew.producer += credits.crew[i].name + "<br><b>(Producer)</b><br>";
            else crew.producer = credits.crew[i].name + "<br><b>(Producer)</b><br>";
        }
        if (credits.crew[i].job === "Writer" || credits.crew[i].job === "writer") {
            if (crew.writer) crew.writer += credits.crew[i].name + "<br><b>(Writer)</b></br>";
            else crew.writer = credits.crew[i].name + "<br><b>(Writer)</b><br>";
        }
    };
    // just in case if there is none available
    if (!crew.director) crew.director = '';
    if (!crew.producer) crew.producer = '';
    if (!crew.writer) crew.writer = '';
    
    let crewMarkup = ``;    // if none of the director or producer or writer is available (very odd), then dont show 'Top Crew' heading at all
    if (crew.director || crew.producer || crew.writer) {    // if either one exists, show the following
        crewMarkup = `<p><b>Top Crew:</b></p>
                        <p>${crew.director}</p>
                        <p>${crew.producer}</p>
                        <p>${crew.writer}</p>`;
    };


    ///////////
    //  To show all genres in one line
    ///////////
    let modGenres = 'N/A';
    if (dataTMDB.genres.length !== 0) {
        modGenres = dataTMDB.genres[0].name;
        for (let i = 1; i < dataTMDB.genres.length; i++) modGenres += ", " + dataTMDB.genres[i].name;
    };


    ///////////
    //  To show all languages in one line
    ///////////
    let modLanguages = 'N/A';
    if (dataTMDB.spoken_languages.length !== 0) {
        modLanguages = dataTMDB.spoken_languages[0].name;
        for (let i = 1; i < dataTMDB.spoken_languages.length; i++) modLanguages += ", " + dataTMDB.spoken_languages[i].name;
    };


    ///////////
    //  R/B ratio
    ///////////
    let rbRatio = (dataTMDB.revenue/dataTMDB.budget).toFixed(2);
    if (dataTMDB.revenue === 0 || !dataTMDB.revenue || dataTMDB.budget === 0 || !dataTMDB.budget) rbRatio = 'N/A';


    /////////// 
    //  To handle social media links
    ///////////
    let fb = '', twi = '', insta = '', web = '', socialHeading = '';    // if the links are not available, the icons will not be shown at all
    if (socialMedia.facebook_id) fb = `<a target="_blank" href="https://www.facebook.com/${socialMedia.facebook_id}"><i class="content__middle--left-social-media-icon fab fa-facebook-f"></i></a>`;

    if (socialMedia.twitter_id) twi = `<a target="_blank" href="https://twitter.com/${socialMedia.twitter_id}"><i class="content__middle--left-social-media-icon fab fa-twitter"></i></a>`;

    if (socialMedia.instagram_id) insta = `<a target="_blank" href="https://www.instagram.com/${socialMedia.instagram_id}"><i class="content__middle--left-social-media-icon fab fa-instagram"></i></a>`;

    if (dataTMDB.homepage) {
        web = `<a target="_blank" href="${dataTMDB.homepage}"><i class="content__middle--left-social-media-icon fas fa-globe"></i></a>`;
    } else if (dataOMDB.Website && dataOMDB.Website !== "N/A") web = `<a target="_blank" href="${dataOMDB.Website}"><i class="content__middle--left-social-media-icon fas fa-globe"></i></a>`;

    if (fb || twi || insta || web) socialHeading = `<p style="font-weight: 700; margin-bottom: 1rem;">Social Media:</p>`;


    ///////////
    //  Cast's profile information
    ///////////
    let castProfileMarkup = '';
    let profilePicture;
    if (credits.cast.length !== 0) {
        for (let i = 0; i < credits.cast.length; i++) {  
            if (i <= 9) { // to only show 10 cast members
                if (credits.cast[i].profile_path) { 
                    profilePicture = `<a href="https://image.tmdb.org/t/p/original${credits.cast[i].profile_path}" target="_blank"><img src="https://image.tmdb.org/t/p/w185${credits.cast[i].profile_path}" alt="profile-photo-${credits.cast[i].name}" class="content__middle--other-cast-pic"></a>`;
                } else profilePicture = `<img src="img/image-na-2.jpg" alt="profile-photo-not-available" class="content__middle--other-cast-pic">`;  // if profile picture is not available

                castProfileMarkup += `
                    <div class="content__middle--other-cast-[${i}]">
                        ${profilePicture}
                        <p class="content__middle--other-cast-character">${credits.cast[i].character}</p>
                        <p class="content__middle--other-cast-name">${credits.cast[i].name}</p>
                    </div>
                `;
            }
        };
    } else castProfileMarkup = '<div style="font-size: 1.8rem; margin: 0 auto;">No Cast information available..</div>'


    ///////////
    //  To show only Trailers (no other videos)
    ///////////
    let trailerFrame = '';    // if there is no trailer available
    for (let i = trailer.length - 1; i >= 0; i--) {     // running the loop backwards so that the topmost trailer (highest rated/most recent) is selected
        if (trailer[i].type === 'Trailer' || trailer[i].type === 'trailer') {
            if (trailer[i].site === 'YouTube' || trailer[i].site === 'Youtube' || trailer[i].site === 'youtube') {      // fallbacks just in case different formats are used
                trailerFrame = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer[i].key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
        }
    };

    
    ///////////
    //  To handle images
    ///////////
    let subMarkupBackdrops = '', subMarkupMainBackdrop = '';
    if (images.length !== 0) {
        for (let i = 0; i < images.length; i++) subMarkupBackdrops += `<a href="https://image.tmdb.org/t/p/original${images[i].file_path}" target="_blank"><img src="https://image.tmdb.org/t/p/w780${images[i].file_path}" alt="movie-photo"></a>`;
    } else subMarkupBackdrops = '<p style="font-size: 1.8rem; margin: 0 auto;">No Images Available..</p>'
    if (dataTMDB.backdrop_path) subMarkupMainBackdrop = `, url('https://image.tmdb.org/t/p/w1280${dataTMDB.backdrop_path}')`;


    ///////////
    //  To handle reviews data
    ///////////
    let subMarkupReviews = '';  // if there are no reviews, 'Read on IMDB' is shown instead
    let readMoreIMDB = '';  // the 'Read More on IMDB' should not show up when there is 'Read on IMDB' in case when there are not reviews available on TMDB                
    if (reviews.length === 0) {     // no reviews available 
        subMarkupReviews = `<p class="content__bottom--reviews-read-more"><a class="external_link" target="_blank" href="https://www.imdb.com/title/${socialMedia.imdb_id}/reviews?ref_=tt_urv">Read on IMDB <i class="content__bottom--reviews-read-more-icon fas fa-long-arrow-alt-right"></i></a></p>`;    
    } else {
        readMoreIMDB = `<p class="content__bottom--reviews-read-more"><a class="external_link" target="_blank" href="https://www.imdb.com/title/${socialMedia.imdb_id}/reviews?ref_=tt_urv">Read More on IMDB <i class="content__bottom--reviews-read-more-icon fas fa-long-arrow-alt-right"></i></a></p> `;

        for (let i = 0; i < reviews.length; i++) if (i <= 2) subMarkupReviews += `<div><p>${contentLimiter(reviews[i].content, 230)}<br></p><p><a class="content__bottom--reviews-section-author" href="${reviews[i].url}" target="_blank"><b>- ${reviews[i].author}</b></a></p></div>`;  // making sure that the loop only runs 3 times (also, only when there are more than 3 reviews) so that max 3 reviews are shown
    };


    const markup = `
            <div class="content__top" style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6))${subMarkupMainBackdrop}">
                ${moviePagePoster}
                <div class="content__top--main">
                    <p class="content__top--main-title"><span class="movie-title">${dataTMDB.title}</span><span class="movie-release-year">&nbsp;(${dataTMDB.release_date ? dataTMDB.release_date.split('-')[0] : 'N/A'})</span></p>
                    <p class="content__top--main-age-rating"><b>Rated:</b> "${dataOMDB.Rated ? dataOMDB.Rated : 'N/A'}"</p>
                    <ul class="content__top--main-list">
                        <li><b>Release Date: </b><span class="movie-release-date">${dataTMDB.release_date ? dataTMDB.release_date : 'N/A'}</span></li>
                        <li><b>Runtime: </b><span class="movie-runtime">${dataTMDB.runtime ? dataTMDB.runtime + ' minutes' : 'N/A'}</span></li>
                    </ul>
                    <p class="content__top--main-overview"><b>Overview:</b> ${dataTMDB.overview ? dataTMDB.overview : `<a target="_blank" href="https://www.imdb.com/title/${socialMedia.imdb_id}/?ref_=tt_urv"> -> Read on IMDB <- </a>`}</p>
                </div>
                <p class="content__top--main-overview-mobile"><b>Overview:</b> ${dataTMDB.overview ? dataTMDB.overview : `<a target="_blank" href="https://www.imdb.com/title/${socialMedia.imdb_id}/?ref_=tt_urv"> -> Read on IMDB <- </a>`}</p>
                <div class="content__top--secondary">
                    ${movieMeScore}
                    ${imdbScore}
                    ${rottenScore}
                    ${metascore}
                    ${tmdbScore}
                </div>
            </div>

            <div class="content__middle">
                <div class="content__middle--ratings">
                    ${movieMeScore}
                    ${imdbScore}
                    ${rottenScore}
                    ${metascore}
                    ${tmdbScore}
                </div>
                <div class="content__middle--facts">
                    <p><b>Other Facts</b></p>
                    <div class="content__middle--facts-crew">
                        ${crewMarkup}
                    </div>
                    <div class="content__middle--facts-other">
                        <p><b>Tagline: </b><span class="content__middle--facts-tagline">${dataTMDB.tagline ? dataTMDB.tagline : 'N/A'}</span></p>
                        <p><b>Status: </b><span class="content__middle--facts-status">${dataTMDB.status}</span></p>
                        <p><b>Genre: </b><span class="content__middle--facts-genre">${modGenres}</span></p>
                        <p><b>Spoken Languages: </b><span class="content__middle--facts-language">${modLanguages}</span></p>
                        <p><b>Budget:</b> <span class="content__middle--facts-budget">${dollarFormat(dataTMDB.budget)}</span></p>
                        <p><b>Revenue:</b> <span class="content__middle--facts-revenue">${dollarFormat(dataTMDB.revenue)}</span></p>
                        <p><b>R/B Ratio: </b><span class="content__middle--facts-rb-ratio">${rbRatio}</span><span class="content__middle--facts-rb-ratio-tooltip" data-tooltip="R/B Ratio tells how well the movie did, financially. Higher the number, higher the profit made. If less than 1, the movie was at loss.">?</span></p>
                    </div>
                    <div class="content__middle--facts-social-media">${socialHeading}
                        ${fb} ${twi} ${insta} ${web}
                    </div>
                </div>        
                <div class="content__middle--other">
                    <p class="heading">Top Cast</p>
                    <div class="content__middle--other-cast">
                        ${castProfileMarkup}
                    </div>
                    <div class="content__middle--other-trailer">
                        ${trailerFrame}
                    </div>
                </div> 
            </div>

            <div class="content__bottom">
                <p class="heading">Photos</p>
                <div class="content__bottom--images">
                    ${subMarkupBackdrops}
                </div>
                <p class="heading">Reviews</p>
                <div class="content__bottom--reviews">
                    <div class="content__bottom--reviews-section">
                        ${subMarkupReviews}
                    </div>
                    ${readMoreIMDB}
                </div>
            </div>
        `;

    elements.moviePage.insertAdjacentHTML('afterbegin', markup);

    
    ///////////
    //  Metascore rating's background color, as chosen by metacritic
    ///////////
    if (metascoreTP !== 'N/A') { 
        metascoreTP = parseInt(metascoreTP);
        if (metascoreTP >= 70) { 
            document.querySelector('.content__top--secondary-metacritic').style.backgroundColor = '#66CC33';
            document.querySelector('.content__middle--ratings-metacritic p span').style.backgroundColor = '#66CC33';
        }
        if (metascoreTP >= 40 && metascoreTP < 70) {
            document.querySelector('.content__top--secondary-metacritic').style.backgroundColor = '#FFCC33';
            document.querySelector('.content__middle--ratings-metacritic p span').style.backgroundColor = '#FFCC33';
        }
        if (metascoreTP < 40) {
            document.querySelector('.content__top--secondary-metacritic').style.backgroundColor = '#FF0000';
            document.querySelector('.content__middle--ratings-metacritic p span').style.backgroundColor = '#FF0000';
        }
    }


    ///////////
    //  To get trailer's frame width to be less than the device width (if responsive design doesn't work)
    ///////////
    if (elements.moviePage.clientWidth <= 450) document.querySelector('.content__middle--other-trailer iframe').style.width = (elements.moviePage.clientWidth - 10) + 'px';
};

export const clearPage = () => {
    elements.moviePage.innerHTML = '';
};


