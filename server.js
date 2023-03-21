'use strict';
const express = require('express')
const movieData=require('./data.json')
const app = express()

const port = 3003

// app.METHOD(PATH, HANDLER)

app.get('/',homePageHandeler);
app.get('/favourite',favPageHandeler);
app.get('*',handleNotFoundError);
app.post('*',handleServerError);

function homePageHandeler(req,res){
    let result= new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.json(result);

}

function favPageHandeler(req,res){

    res.send('Welcome to Favorite Page');

}

function handleNotFoundError(req,res){
    res.status(404).send("page not found error")
}

 function handleServerError(req, res) {
    res.status(500).send(new Error())
  }

function Movie(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview
}



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)})