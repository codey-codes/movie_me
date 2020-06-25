// this file is used to show the homepage data (trending movies)

import { elements, contentLimiter } from '../models/Base';

export const renderPage = (data, type) => {
    let heading = 'Trending Today';
    if (elements.errorMessage.style.display !== 'block') {
        if (type === 'popular') heading = 'Popular Right Now';
        if (type === 'upcoming') heading = 'Up & Coming Movies';
        if (type === 'playing') heading = 'Now Playing';
        
        elements.homePage.insertAdjacentHTML('afterbegin', `<h2 class="home-page__heading">${heading}</h2>`);
    }

    // elements.errorMessage.style.display is the error block. Show the h2 only when this error message is not being displayed
    
    for (let i = 0; i < data.length; i++) {
        let overviewMarkup;

        if (elements.homePage.clientWidth < 580 && elements.homePage.clientWidth >= 375) { // to limit the 'Overview' text even further on lower-width devices. This width size is obtained from experimenting
            if (data[i].overview.length < 95) {    // limiting the character count to 95 characters if width < 580px
                overviewMarkup = data[i].overview;
            } else {
                overviewMarkup = contentLimiter(data[i].overview, 95) + `<a class="home-page__movie-info-overview-link" onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"> Read More</a>`
            }
        } else if (elements.homePage.clientWidth < 375) { 
            if (data[i].overview.length < 75) { 
                overviewMarkup = data[i].overview;
            } else {
                overviewMarkup = contentLimiter(data[i].overview, 75) + `<a class="home-page__movie-info-overview-link" onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"> Read More</a>`
            }
        } else { 
            if (data[i].overview.length < 120) { 
                overviewMarkup = data[i].overview;
            } else {
                overviewMarkup = contentLimiter(data[i].overview, 120) + `<a class="home-page__movie-info-overview-link" onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"> Read More</a>`
            }
        }
        
        let markup = `
            <div class="home-page__movie">
                <div class="home-page__movie-poster">
                    <a onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')"><img src="https://image.tmdb.org/t/p/w185${data[i].poster_path}" alt="movie-poster" class="home-page__movie-poster-image"></a>
                </div>
                <div class="home-page__movie-info">
                    <p class="home-page__movie-info-main-title"><a onclick="controlMoviePage(${data[i].id}, '${data[i].imdb_id}')">${data[i].title}</a></p>
                    <div class="home-page__movie-info-main">
                        <p class="home-page__movie-info-date">Released: ${data[i].release_date}</p>
                        <p class="home-page__movie-info-main-rating">${data[i].vote_average === 0 ? 'NR' : (data[i].vote_average.toFixed(1) + ' <img src="img/icons/star.svg" alt="Star Icon" width="14px" height="14px">')}</p>
                    </div> 
                    <p class="home-page__movie-info-overview">${overviewMarkup}</p>
                </div>
            </div>
        `;

        elements.homePage.insertAdjacentHTML('beforeend', markup);
    }
};

export const clearPage = () => {
    elements.homePage.innerHTML = '';
};