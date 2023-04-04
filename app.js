
// BIOLERPLATE CODE 

const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connection, SCHEMA, MODEL SETUP 

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

// 'articles' ROUTE

app.route("/articles")
    .get(async function(req, res){

        const articles = await Article.find();
        res.send(articles);

    })
    .post(async function(req, res){

        const sentArticle = req.body;
        const newArticle = new Article({
            title: sentArticle.title,
            content: sentArticle.content
        });
        newArticle.save();
        res.send("Article saved successfully");

    })
    .delete(async function(req, res){

        await Article.deleteMany();
        res.send("All Articles Deleted!");

    });

// 'articles/:params' ROUTE

app.route("/articles/:articleTitle")
    .get(async function(req, res){

        const article = await Article.findOne({title: req.params.articleTitle});
        res.send(article);

    })
    .put(async function(req, res){

        await Article.replaceOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content});
        res.send("Article Updated Successfully.");

    })
    .patch(async function(req, res){

        await Article.updateOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content});
        res.send("Article Updated Successfully.");

    })
    .delete(async function(req, res){

        await Article.deleteOne({title: req.params.articleTitle});
        res.send("Article Deleted!");

    });

// PORT SETUP 

app.listen(3000, function(){
    console.log("Server running on port 3000");
})