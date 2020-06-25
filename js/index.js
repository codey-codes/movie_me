import Search from './models/SearchPage';
import HomePage from './models/HomePage';
import MoviePage from './models/MoviePage';
import {elements, getRndInteger, renderLoader, clearLoader} from './models/Base'

import * as HomePageView from './views/homePageView'
import * as SearchPageView from './views/searchPageView'
import * as MoviePageView from './views/moviePageView'

const state = {};
window.state = state;

const clearAll = () => {
    elements.searchInput.value = ''; 
    elements.searchInputMobile.value = ''; 

    window.scrollTo(0, 0);

    clearLoader();

    SearchPageView.clearPage();
    MoviePageView.clearPage();
    HomePageView.clearPage();

    elements.errorMessage.style.display = 'none';
    elements.headerNavIcon.checked = false;
    elements.homePage.style.display = 'none';
    elements.contactPage.style.display = 'none';
    elements.moviePage.style.display = 'none';
    elements.searchPage.style.display = 'none';
    elements.searchInputMobile.style.display = 'none';
};

const controlHomePage = async (type) => {

    clearAll();

    state.home = new HomePage();

    renderLoader();

    if (type === 'trending') await state.home.displayTrending();
    if (type === 'popular') await state.home.displayPopular();
    if (type === 'upcoming') await state.home.displayUpcoming();
    if (type === 'playing') await state.home.displayPlaying();

    clearLoader();

    elements.homePage.style.display = 'flex';
    HomePageView.renderPage(state.home.data, type);
};

window.controlHomePage = controlHomePage;   // to access this function using HTML

const controlContactPage = async () => {
    let rand = getRndInteger(0, 19);

    clearAll();

    state.contact = new HomePage();

    renderLoader();

    await state.contact.displayTrending();

    clearLoader();

    elements.contactPage.style.display = 'block';
    elements.contactPage.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0.4)), url('https://image.tmdb.org/t/p/w1280${state.contact.data[rand].backdrop_path}')`;  // random background image from 'trending' movies
};

window.controlContactPage = controlContactPage;   // to access this function using HTML

const controlSearchPage = async (query) => {

    clearAll();

    state.search = new Search(query);

    renderLoader();

    await state.search.getResults();

    clearLoader();
    
    elements.searchPage.style.display = 'flex';
    elements.searchPage.style.justifyContent = 'space-between';
    elements.searchPage.style.alignItems = 'center';
    elements.searchPage.style.flexWrap = 'wrap';

    SearchPageView.renderPage(state.search.data);
};

const controlMoviePage = async (id, imdbID) => {

    clearAll();
    
    state.movie = new MoviePage(id, imdbID);

    renderLoader();

    await state.movie.getDataTMDB();
    await state.movie.getSocialMediaDetails();
    await state.movie.getDataOMDB();
    await state.movie.getCredits();
    await state.movie.getTrailerInfo();
    await state.movie.getImages();
    await state.movie.getReviews();

    clearLoader();

    elements.moviePage.style.display = 'block';

    MoviePageView.renderPage(state.movie.mainData, state.movie.secData, state.movie.credits, state.movie.socialMedia, state.movie.trailer, state.movie.images.backdrops, state.movie.reviews);  
};

window.controlMoviePage = controlMoviePage; // to access this function using HTML


elements.searchButtonMobile.addEventListener('click', () => {
    if (elements.searchInputMobile.style.display === 'inline-block') {
        elements.searchInputMobile.style.display = 'none';
    } else elements.searchInputMobile.style.display = 'inline-block';
});

elements.searchInputMobile.onkeydown = e => {    // if enter key is pressed
    if (e.keyCode == 13) { 
        if (elements.searchInputMobile.value === '') {    // if the search field is empty -> do nothing
                       
        } else {
            window.scrollTo(0, 0);
            controlSearchPage(elements.searchInputMobile.value);
        }
    }
};

elements.searchInput.onkeydown = e => {    // if enter key is pressed
    if (e.keyCode == 13) { 
        if (elements.searchInput.value === '') {    // if the search field is empty -> do nothing
            window.scrollTo(0, 0);            
        } else {
            window.scrollTo(0, 0);
            controlSearchPage(elements.searchInput.value);
        }
    }
};

var docWidth = document.documentElement.offsetWidth;
[].forEach.call(
  document.querySelectorAll('*'),
  function(el) {
    if (el.offsetWidth > docWidth) {
      console.log(el + ' is off');
    }
  }
);

elements.searchButton.addEventListener('click', () => {     // if the search button is clicked
    if (elements.searchInput.value === '') {    // if the search field is empty -> do nothing
        window.scrollTo(0, 0);            
    } else {
        window.scrollTo(0, 0);
        controlSearchPage(elements.searchInput.value);
    }
});

elements.headerLogo.addEventListener('click', () => {
    window.scrollTo(0, 0);
    clearAll();
    controlHomePage('trending');
});

elements.navContact.addEventListener('click', () => {
    window.scrollTo(0, 0);
    clearAll();
    controlContactPage();
});

elements.navPopular.addEventListener('click', () => {
    window.scrollTo(0, 0);
    clearAll();
    controlHomePage('popular');
});

elements.navUpcoming.addEventListener('click', () => {
    window.scrollTo(0, 0);
    clearAll();
    controlHomePage('upcoming');
});

elements.navPlaying.addEventListener('click', () => {
    window.scrollTo(0, 0);
    clearAll();
    controlHomePage('playing');
});

window.addEventListener('load', () => {
    clearAll();
    controlHomePage('trending');
});