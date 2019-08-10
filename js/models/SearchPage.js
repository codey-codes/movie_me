// this file is for searching the input entered by user

import axios from 'axios';
import { proxy, keyTMDB } from '../config';
import { clearLoader, elements } from './Base'

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const dataTMDB = await axios(`${proxy}https://api.themoviedb.org/3/search/movie?api_key=${keyTMDB}&language=en-US&query=${this.query}&page=1&include_adult=false`);
            this.data = dataTMDB.data.results;
        }

        catch(error) {
            console.log(error + ' is the error in searchPage');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }
};