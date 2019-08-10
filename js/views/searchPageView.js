// this file is for showing the search results

import {elements, contentLimiter} from '../models/Base';

export const renderPage = data => {

    if (data.length === 0) noResult();

    for (let i = 0; i < data.length; i++) {
        let newData = {};
        let overviewMarkup;

        ///////////////////////
        // if-else statements used for error handling
        //////////////////////

        if (!data[i].poster_path) {     
            newData.poster_path = '<img src="img/image-na.jpg" alt="movie-poster-not-available" class="search-page__movie-poster-image">';
        } else newData.poster_path = `<a onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"><img src="https://image.tmdb.org/t/p/w185${data[i].poster_path}" alt="movie-poster" class="search-page__movie-poster-image"></a>`;

        if (data[i].release_date === "") {
            newData.release_date = 'N/A';
        } else newData.release_date = data[i].release_date;

        if (data[i].vote_average === 0) {
            newData.vote_average = 'NR';
        } else newData.vote_average = `${data[i].vote_average.toFixed(1)} <span> <i class="far fa-star"></i></span>`;
        
        if (elements.searchPage.clientWidth < 580 && elements.searchPage.clientWidth >= 375) { // to limit the 'Overview' text even further on lower-width devices. This width size is obtained from experimenting
            if (data[i].overview.length < 95) {    // limiting the character count to 95 characters if width < 580px
                overviewMarkup = data[i].overview;
            } else {
                overviewMarkup = contentLimiter(data[i].overview, 95) + `<a class="home-page__movie-info-overview-link" onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"> Read More</a>`;
            }
        } else if (elements.searchPage.clientWidth < 375) {
            if (data[i].overview.length < 75) { 
                overviewMarkup = data[i].overview;
            } else {
                overviewMarkup = contentLimiter(data[i].overview, 75) + `<a class="home-page__movie-info-overview-link" onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"> Read More</a>`;
            }
        } else { 
            if (data[i].overview.length < 120) { 
                overviewMarkup = data[i].overview;
            } else {
                overviewMarkup = contentLimiter(data[i].overview, 120) + `<a class="home-page__movie-info-overview-link" onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"> Read More</a>`;
            }
        }

        let markup =  `
            <div class="search-page__movie">
                <div class="search-page__movie-poster">
                    ${newData.poster_path}
                </div>
                <div class="search-page__movie-info">
                    <p class="search-page__movie-info-main-title"><a onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')">${data[i].title}</a></p>
                    <div class="search-page__movie-info-main">
                        <p class="search-page__movie-info-date">Released: ${newData.release_date}</p>
                        <p class="search-page__movie-info-main-rating">${newData.vote_average}</p>
                    </div>
                    <p class="search-page__movie-info-overview">${overviewMarkup}</p>
                </div>
            </div>
        `;
        
        elements.searchPage.insertAdjacentHTML('beforeend', markup);
    }
};


export const clearPage = () => {
    elements.searchPage.innerHTML = '';
};

const noResult = () => {
    let markup = '<h2 class="search-page__no-results">\'No results found. Please try another search..\'</h2>';
    elements.searchPage.insertAdjacentHTML('beforeend', markup);
};