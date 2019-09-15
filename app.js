//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const share = require('social-share');
const urlt = share('twitter', {
    title:'share it'
});
const urlf = share('facebook', {
  title:'share it'
});

const homeStartingContent = "Welcome to the New Age Blog! ";
const aboutContent = "Pen down your heart out or you might miss down something! Nostalgic? Walk down the memory lane! Try this blog creator!";
const contactContent = "Contact @ Codebuster10X! Hola amigos!!!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//let posts = [];

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  Post.find({}, function(err,posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //posts.push(post);
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
  //res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  //const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;


  Post.findOne({_id: requestedPostId},function(err,posts){
    res.render("post", {
      title: posts.title,
      content: posts.content,
      postIndex: requestedPostId
    });
  });

  /*posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }*/
  });

  app.get("/redirect", function(req, res) {
    
    let url = share(req.query.service, req.query);
    res.redirect(url);
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
