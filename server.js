'use strict';
const express = require('express')
const cors=require("cors")
const movieData=require('./data.json');
const axios = require('axios');

const app = express()


app.use(cors());
require('dotenv').config();
const port =5000;

// app.METHOD(PATH, HANDLER)



app.get('/',homePageHandeler);
app.get('/favourite',favPageHandeler);


app.get('/trending',trendingPageHandler);
app.get('/search',searchQueryHandeler);
app.get('/details',getDetails);
app.get('/language',languageQueryHandeler)

app.get('*',handleNotFoundError);
// app.post('*',handleServerError);


function homePageHandeler(req,res){
    let result= new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.json(result);

}

function favPageHandeler(req,res){

    res.send('Welcome to Favorite Page');

}

function trendingPageHandler(req,res){
    let url='https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US'
    axios.get(url)
    .then((result)=>{
        console.log(result.data.results);
        let dataMovies=result.data.results.map((movie)=>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        }
        )
        res.json(dataMovies);
    })
    .catch((err)=>{
        console.log(err);
    })
}
function searchQueryHandeler(req,res){
    let movieName=req.query.name
    console.log(movieName);

     let url=`https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=${movieName}&page=2`
     axios.get(url)
     .then((result)=>{
          let response=result.data.results;
          console.log(response)
          res.send(response)
     })
     .catch((err)=>{
        console.log(err);
     })
}

function getDetails(req,res){

    let movieDetails=req.query.id;
    console.log(movieDetails);
    let url=`https://api.themoviedb.org/3/movie/343611?api_key=480a4f9c69e936f6485bd275ec3e6327&append_to_response=videos`
    axios.get(url)
    .then((result)=>{
        let response=result.data.videos;
        console.log(result.data.videos);
        res.send(response);
    })
    .catch((err)=>{
        console.log(err);
    })

}

function languageQueryHandeler(req,res){
    let movieLanguage=req.query.language;
    console.log(movieLanguage);
    let url=`https://api.themoviedb.org/3/movie/76341?api_key=480a4f9c69e936f6485bd275ec3e6327&language=de`
    axios.get(url)
        .then((result)=>{
            let response=result.data.spoken_languages;
            console.log(result.data.spoken_languages);
            res.send(response);
        })
        .catch((err)=>{
            console.log(err);
        })
    }


function handleNotFoundError(req,res){
    res.status(404).send("page not found error")
}

//  function handleServerError(req, res) {
//     res.status(500).send(new Error())
//   }



function Movie(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview
}



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)})