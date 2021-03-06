# Movie_Me!

## Description: ##
Whenever you want to look for a movie, where do you go? Google? IMDb? How can you find out how well the movie did and what is the 'actual' average score? What if IMDb has a really good rating for a movie but Rotten Tomatoes has not? Movie_Me! addresses this issue by using algorithms to show you the most accurate average score taken from all the famous and reliable sources like IMDb, Metacritic, Rotten Tomatoes and TMDB. It is a single page website that also shows basic information about movies, new and old, from all around the world. Movie_Me! uses the data obtained from The Movie DataBase (TMDB) and Open Movie DataBase (OMDB) and displays them in one page like IMDb.

## Features: ##
1. Movie_Me! currently has 4 options to get movie information:
    * Users can view the trending movies of today under the 'Popular Now' section
    * 'Now Playing' section shows the currently playing movies in the popular cinemas
    * Users can view the upcoming movies that are expected to be released soon in the 'Upcoming' section
    * Or users can just search for any movie from any country provided that said movie is available in the database of TMDB
2. The basic information of the chosen movie will be displayed. This information includes:
    * Movie title
    * Release date
    * Age rating
    * Scores from IMDb, Metacritic, Rotten tomatoes and TMDB, when available
    * Posters and other backdrops
    * Top cast and crew
    * Movie plot
    * Genre
    * Social media links
    * Budget 
    * Revenue
    * and much more
3. The search option works according to the algorithms used by TMDB and always the most popular results are shown in order
4. The movie page shows only one trailer that has the most views and the highest possible video quality

## Usage: ##
As this is a single page website with old data getting replaced by new one, the 'Back' button will not take you back on the website. The Movie_Me! logo on the top left takes you to the home page. Also, the contact form does not do anything. It's just there for a show. Please feel free to try it out though.

Please Note: right now, Movie_Me! does not support TV shows or detailed information on people. That feature will be added in the upcoming updates.

## Possible future updates: ##
1. The home and search pages show ratings from TMDB. Next update can add the 'average score' of all the sources, which is called Movie_Me! score, to these pages instead
2. There is no page that shows actor's information. In the future update, this will be added with date of birth and/or death, some background, photos, career hints and much more
3. TV shows will be added which will display the same information as movies' pages do
4. IMDB movies' and TV shows' page links can be generated by using one algorithm which will open doors to displaying much more information like filming locations, sound mix, aspect ratio, soundtrack, trivia, goofs etc. by accessing them through IMDB page
5. One of the said information can also be a more accurate and live IMDB score by using web scraping with NodeJS instead of relying on an API. This will ensure that we always have the most accurate and up to date rating
6. We can also get the reviews from IMDB and display them on Movie_Me! webpage and linking them to IMDB instead of directing the users of Movie_Me! to IMDB


## Other Notes: ##

### Environments used: ###

1. HTML: used as a markup language for the webpage
2. SCSS: advanced CSS for styling the said webpage
3. JS: for creating new and updating the already present information in both HTML and CSS. Also, for obtaining data from external sources
4. NodeJS: for Node Package Managers to make the development environment more friendly
    * webpack: mainly used to compile all the 9 Javascript files into one single file
    * axios: used to fetch the API data from sources like TMDB and OMDB
    * node-sass: this npm converts the SCSS file to CSS and makes it legible to the browser
    * live-server: used to get the 'live view' of the changes made in either the HTML, SCSS or any of the JS files
    * autoprefixer: as the name suggests, this npm adds the profixes to CSS code to make it cross-browser compatible
5. Adobe Illustrator: for designing the Movie_Me! logo
6. Adobe XD: for making a mockup of the webpage before it was to be developed

### Issues faced while developing ###

1. -- Webpack --
    The webpack-dev-server is used to get live view which compiles all the files into a single file and shows the changes live on the browser. 'package.json' file can also be edited so that the webpack config file does not have to contain development mode. Hence, the development mode was added to package.json file. For some reasons, the webpack-dev-server's contentBase was not accepting the path provided and the webpack-dev-server was not opening at all. 

    Workaround: Webpack also offers "webpack --watch" option where a developer can see the changes in the JS files right away. But an error was received which stated that the development mode is required. Thus the development mode option from package.json was removed and wabpack config file was updated with the mode: development option. Also, "webpack --watch" does not offer live view of the changes made but it only watches for changes and compiles them into the output file.
    To fix this, following lines were added to package.json file:

        "devserver": "live-server",
        "watch-webpack": "webpack --watch",
        "watch-js": "npm-run-all --parallel devserver watch-webpack"

        where:
            devserver -> a script that runs the node package manager called live-server for live view
            live-server -> a NPM that gives the developers ability to get 'live view' of their code in their choice of browser
            watch-webpack -> a script to run "webpack --watch"
            watch-js -> the script used in NodeJS to run all of the above commands
            npm-run-all -> another NPM used to run multiple scripts at the same time by using --parallel

    After adding these lines, the development environment was as expected.

2. -- Ratings --
    Movie page does not load even if one data from API is missing. Fallbacks have been arranged for that. Rotten Tomatoes and Metascore was "ASSUMED" to be always available. So new variables were defined to replace the data that is not available with something that is readable and also so that the page loads and shows something instead of just crashing

3. -- Other missing information --
    While developing this webpage, it was assumed that all the information that is required will be readily available from the TMBD API but this was not the case. For not-so-popular movies, some data was missing. Now, which one was missiing, was a challenge. Hence, fallbacks were to be designed for ALL the data this is to be retrieved. If data is not available, just don't show that information at all. Doing this made the webpage to load something, instead of nothing at all.
