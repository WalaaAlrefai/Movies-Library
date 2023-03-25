'use strict';
const express = require('express')
const cors=require("cors")
const movieData=require('./data.json');
const axios = require('axios');
const app = express()
app.use(cors());
require('dotenv').config();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
const { Client }=require('pg')
let url=`postgres://student:0000@localhost:5432/movies`
const client=new Client(url)

const port =process.env.port;
const apiKey = process.env.apiKey;

// app.METHOD(PATH, HANDLER)



app.get('/',homePageHandeler);
app.get('/favourite',favPageHandeler);
app.get('/trending',trendingPageHandler);
app.get('/search',searchQueryHandeler);
app.get('/top_rated',getTopRated);
app.get('/popular',popularHandeler);
app.post('/addMovie',addMovieHandler)
app.get('/getMovies',getMoviesHandeler);
app.get('*',handleNotFoundError);
app.use(handleServerError);


client.connect().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)})
}).catch()



function homePageHandeler(req,res){
    let result= new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.json(result);

}



function addMovieHandler(req,res){
    // console.log(req.body);
let{title,release_date,poster_path,overview}=req.body;
// console.log(title,release_date,poster_path,overview)
let sql=`INSERT INTO movie(title,release_date,poster_path,overview)
 VALUES ($1,$2,$3,$4);`
let values=[title,release_date,poster_path,overview]
client.query(sql,values).then(
    res.status(201).send("data successfully saved in db to server")
).catch()

    // res.send('data recieved to server');
}

function getMoviesHandeler(req,res){
    let sql=`SELECT * FROM movie;`
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows)
    })
}


function favPageHandeler(req,res){

    res.send('Welcome to Favorite Page');

}

function trendingPageHandler(req,res){
    let url=`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
    axios.get(url)
    .then((result)=>{
        console.log(result.data.results);
        let dataMovies=result.data.results.map((movie)=>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        }
        )
        res.json(dataMovies);
    })
    .catch((error)=>{
        handleServerError(error,req, res)
    })
}
function searchQueryHandeler(req,res){
    let movieName=req.query.name
    console.log(movieName);

     let url=`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`
     axios.get(url)
     .then((result)=>{
          let response=result.data.results;
          console.log(response)
          let searchMovies=response.map((movie)=>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        })
          res.send(searchMovies)
     })
     .catch((error)=>{
        handleServerError(error,req, res)
     })
}

function getTopRated(req,res){

    let url=`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
    axios.get(url)
    .then((result)=>{
        console.log(result.data.results);
        let topMovies=result.data.results.map((movie)=>{
            return new Top(movie.title,movie.overview);
        }
        )
        res.json(topMovies);
    })
    .catch((error)=>{
        handleServerError(error,req, res)
    })

}

function popularHandeler(req,res){
    let url=`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US`
    axios.get(url)
        .then((result)=>{
            let moviePopular=result.data.results;
            console.log(moviePopular);
            let popMovies=moviePopular.map((movie)=>{
                return new Popularity(movie.title,movie.original_language,movie.popularity);
            })
            console.log(popMovies);
            res.send(popMovies);
        })
        .catch((error)=>{
            handleServerError(error,req, res);
        })
    }


function handleNotFoundError(req,res){
    res.status(404).send("page not found error")
}

 function handleServerError(err,req, res) {
    res.status(500).send({status:500,responseText:"Sorry, something went wrong"});
  }



function Movie(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview
}

function Popularity(title,original_language,popularity){
    this.title=title;
    this.original_language=original_language;
    this.popularity=popularity;
}

function Top(title,overview){
    this.title=title;
    this.overview=overview
}


