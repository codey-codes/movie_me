// this file is for the homepage model

import axios from 'axios';
import { proxy, keyTMDB } from '../config';
import { clearLoader, elements } from './Base'

export default class HomePage {

    async displayTrending() {
        try {
            const trending = await axios(`${proxy}https://api.themoviedb.org/3/trending/movie/day?api_key=${keyTMDB}`);
            this.data = trending.data.results;
        }
        catch(error) {
            console.log(error + ' is the error in HomePage.displayTrending()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async displayPopular() {
        try {
            const popular = await axios(`${proxy}https://api.themoviedb.org/3/movie/popular?api_key=${keyTMDB}&language=en-US&page=1`);
            this.data = popular.data.results;
        }
        catch(error) {
            console.log(error + ' is the error in HomePage.displayPopular()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async displayUpcoming() {
        try {
            const upcoming = await axios(`${proxy}https://api.themoviedb.org/3/movie/upcoming?api_key=${keyTMDB}&language=en-US&page=1`);
            this.data = upcoming.data.results;
        }
        catch(error) {
            console.log(error + ' is the error in HomePage.displayUpcoming()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async displayPlaying() {
        try {
            const playing = await axios(`${proxy}https://api.themoviedb.org/3/movie/now_playing?api_key=${keyTMDB}&language=en-US&page=1`);
            this.data = playing.data.results;
        }
        catch(error) {
            console.log(error + ' is the error in HomePage.displayPlaying()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }
};
