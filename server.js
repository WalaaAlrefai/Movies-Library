'use strict';
const express = require('express')
const movieData=require('./data.json')
const app = express()

const port = 3003

// app.METHOD(PATH, HANDLER)

app.get('/',homePageHandeler);

function homePageHandeler(req,res){
    let result={title:movieData.title,poster_path:movieData.poster_path,overview:movieData.overview};
    // for(let i=0;i<movieData.length;i++){
    //     result.title=movieData.title;
    //     result.poster_path=movieData.poster_path;
    //     result.overview=movieData.overview;
    // };
    //  console.log(result);
    res.json(result);

}

function Movie(title,poster_path,overview){
        this.title=title;
        this.poster_path=poster_path;
        this.overview=overview
}





app.get('/favourite',favPageHandeler);

function favPageHandeler(req,res){

    res.send('Welcome to Favorite Page');

}





// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)})