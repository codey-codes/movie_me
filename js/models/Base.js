// this file is used to define all the elements used and to show and hide the loader

export const elements = {
    headerLogo: document.querySelector('.header__logo'),
    headerLogoMobile: document.querySelector('.header__logo-mobile'),
    navPopular: document.querySelector('.nav__popular'),
    navPlaying: document.querySelector('.nav__playing'),
    navUpcoming: document.querySelector('.nav__upcoming'),
    navContact: document.querySelector('.nav__contact'),

    headerNavIcon: document.querySelector('.header__nav--mobile-icon'),
    containerNavMobile: document.querySelector('.container__nav--mobile'),

    contentContainer: document.querySelector('.content'),
    loaderContainer: document.querySelector('.loader-container'),
    errorMessage: document.querySelector('.error-message'),

    homePage: document.querySelector('.home-page'),
    homePoster: document.querySelector('.home-page__movie-poster-image'),
    homeMovieTitle: document.querySelector('.home-page__movie-info-main-title'),
    homeMovieRating: document.querySelector('.home-page__movie-info-main-rating'),
    homeMovieDate: document.querySelector('.home-page__movie-info-date'),
    homeMovieOverview: document.querySelector('.home-page__movie-info-overview'),
    homeMovieLink: document.querySelector('.home-page__movie-info-overview-link'),

    searchPage: document.querySelector('.search-page'),
    searchPageLink: document.querySelector('.search-page__movie-info-overview-link'),
    searchInput: document.querySelector('.header__search--bar'),
    searchInputMobile: document.querySelector('.header__search--btn-bar'),
    searchButton: document.querySelector('.header__search--btn'),
    searchButtonMobile: document.querySelector('.header__search--icon-mobile'),

    contactPage: document.querySelector('.contact-page'),

    moviePage: document.querySelector('.movie-page'),
    moviePageTop: document.querySelector('.content__top'),
    moviePageMetaRating: document.querySelector('.content__top--secondary-metacritic'),
    moviePageImages: document.querySelector('.content__bottom--images'),
    moviePageBackdrops: document.querySelector('.content__bottom--images-img'),
    moviePageTooltip: document.querySelector('.content__middle--left-rb-ratio-tooltip'),
    moviePageReviews: document.querySelector('.content__bottom--images-img')
    
};

export const dollarFormat = num => {    // as the name suggests, this function returns the passed number in dollar format with commas and no decimals (movie budget and revenue are not passed in decimals so no need to display decimals)

    if (num === 0 || !num) return 'N/A';

    num = Math.abs(num);
    let billion = '';
    let million = Math.floor(num / 1000000);
    let thousand = Math.floor(num / 1000);
    let hundred = Math.floor((num / 100) % 10);
    let ten = Math.floor((num / 10) % 10);
    let unit = Math.floor(num % 10);

    if (num >= 1000) {
        if (million >= 1000) {
            billion = Math.floor(num / 1000000000);
            billion /= 1000;
            billion = ((Math.floor(billion * 10) % 10) === 0 ? "" : (Math.floor(billion * 10) % 10))
            + "" + 
            ((Math.floor(billion * 100) % 10 === 0 && Math.floor(billion * 10) % 10 === 0) ? "" : Math.floor(billion * 100) % 10)
            + "" +
            (Math.floor(billion * 1000) % 10) + ",";
        }

        if (thousand >= 1000) {
            million /= 1000;
			if (million >= 1) million = (Math.floor(million * 10) % 10) + "" + (Math.floor(million * 100) % 10) + "" + (Math.floor(million * 1000) % 10) + ",";
            else million = 
                ((Math.floor(million * 10) % 10) === 0 ? "" : (Math.floor(million * 10) % 10))
                + "" +
                ((Math.floor(million * 100) % 10 === 0 && Math.floor(million * 10) % 10 === 0) ? "" : Math.floor(million * 100) % 10)
                + "" +
                (Math.floor(million * 1000) % 10) + ",";
        } else million = '';

        thousand /= 1000;
        if (thousand >= 1) thousand = (Math.floor(thousand * 10) % 10) + "" + (Math.floor(thousand * 100) % 10) + "" + (Math.floor(thousand * 1000) % 10) + ",";
        else thousand = 
            ((Math.floor(thousand * 10) % 10) === 0 ? "" : (Math.floor(thousand * 10) % 10))
            + "" +
            ((Math.floor(thousand * 100) % 10 === 0 && Math.floor(thousand * 10) % 10 === 0) ? "" : Math.floor(thousand * 100) % 10)
            + "" +
            (Math.floor(thousand * 1000) % 10) + ",";

        return `$${billion}${million}${thousand}${hundred}${ten}${unit}`;
    } else return "$" + num;
};

export const contentLimiter = (content, limit) => {     // content is the text data that is received. limit is the number of characters, of this whole text, to be returned
    const newContent = [];

    if (content.length >= limit) {
        content.split(' ').reduce((acc, cur) => {  
            if (acc + cur.length <= limit) {
                newContent.push(cur);
            }
            return acc + cur.length;
        }, 0);
    } else { 
        newContent.push(content);
        return newContent.join(' ');
    }

    return newContent.join(' ') + '...';
};

export const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
};

export const movieScoreCalculator = (imdb, rotten, meta, tmdb) => {
    let num = 4;    // number of scores available. assuming we get all of them
    if (!imdb) {
        imdb = 0;
        num--;  // if one of the ratings is not available, the total num reduces by 1
    }
    if (!rotten) {
        rotten = 0;
        num--;
    } 
    if (!meta) {
        meta = 0;
        num--;
    }
    if (!tmdb) {
        tmdb = 0;
        num--;
    }

    if (num === 0) {
        return 'N/A';    // if no score is avaialable, num = 0, then instead of dividing by 0, we can just return N/A
    } else return (( (parseFloat(imdb) * 10) + (parseFloat(rotten)) + (parseFloat(meta)) + (parseFloat(tmdb) * 10) ) / (num * 10)).toFixed(1);
};

export const renderLoader = () => {
    elements.loaderContainer.style.display = 'block';
};

export const clearLoader = () => {
    elements.loaderContainer.style.display = 'none';
};