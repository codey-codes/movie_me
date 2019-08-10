// this file is for the final movie page with ALL the movie information available

import { proxy, keyTMDB, keyOMDB } from '../config';
import axios from 'axios';
import { clearLoader, elements } from './Base'

export default class MoviePage {
    constructor(id, imdbID) {
        this.id = id;
        this.imdbID = imdbID;
    }

    async getDataTMDB() {
        try {
            const result = await axios(`${proxy}https://api.themoviedb.org/3/movie/${this.id}?api_key=${keyTMDB}`);
            this.mainData = result.data;
        }
        catch (error) {
            console.log(error + ' is the error in getDataTMDB()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }
        
    async getCredits() {
        try {
            const result = await axios(`${proxy}https://api.themoviedb.org/3/movie/${this.id}/credits?api_key=${keyTMDB}`);
            this.credits = result.data;
        }
        catch (error) {
            console.log(error + ' is the error in getCredits()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }


    async getSocialMediaDetails() {
        try {
            const result = await axios(`${proxy}https://api.themoviedb.org/3/movie/${this.id}/external_ids?api_key=${keyTMDB}`);
            this.socialMedia = result.data;
        }
        catch (error) {
            console.log(error + ' is the error in getSocialMediaDetails()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async getDataOMDB() {
        try {
            const result = await axios(`${proxy}http://www.omdbapi.com/?i=${this.socialMedia.imdb_id}&apikey=${keyOMDB}`);
            this.secData = result.data;
        }
        catch (error) {
            console.log(error + ' is the error in getDataOMDB()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async getTrailerInfo() {
        try {
            const result = await axios(`${proxy}https://api.themoviedb.org/3/movie/${this.id}/videos?api_key=${keyTMDB}&language=en-US`);
            this.trailer = result.data.results;
        }
        catch (error) {
            console.log(error + ' is the error in getTrailerInfo()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async getImages() {
        try {
            const result = await axios(`${proxy}https://api.themoviedb.org/3/movie/${this.id}/images?api_key=${keyTMDB}`);
            this.images = result.data;
        }
        catch (error) {
            console.log(error + ' is the error in getImages()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }

    async getReviews() {
        try {
            const result = await axios(`${proxy}https://api.themoviedb.org/3/movie/${this.id}/reviews?api_key=${keyTMDB}`);
            this.reviews = result.data.results;
        }
        catch (error) {
            console.log(error + ' is the error in getReviews()');
            clearLoader();
            elements.errorMessage.style.display = 'block';
        }
    }
};