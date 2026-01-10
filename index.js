const express = require("express");
const app = express();
const port = 3000 ;

const methodOverride = require('method-override');
const path = require("path");
// const { v4 : uuidv4 } = require("uuid");
// import { v4 as uuidv4 } from 'uuid';
const crypto = require("crypto");

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});

// To set ejs engine to use ejs templates
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// To parse data sent by user for express to understand it
app.use(express.urlencoded({extended : true}));

//For PUT , PATCH , DELETE requests
app.use(methodOverride('_method'));

// To serve static files like JS and CSS files 
app.use(express.static(path.join(__dirname , "/public/JS")));
app.use(express.static(path.join(__dirname,"/public/CSS")));

let posts = [
    {
        id : crypto.randomUUID(),
        username : "Priti",
        content : "I love coding!"
    },
    {
        id : crypto.randomUUID(),
        username : "Rahul ",
        content : "I got selected in my first internship"
    },
    {
        id : crypto.randomUUID(),
        username : "Shradha",
        content : "Hardwork brings success"
    }
];

//Index Route
app.get("/posts",(req,res)=>{
    // res.send("Server is running ...");
    res.render("index.ejs",{ posts });
});

//Create Route
app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});

//new post route
app.post("/posts",(req,res)=>{
    console.log(req.body);
    let { username , content } = req.body ;
    let id = crypto.randomUUID();
    posts.push({id,username,content});
    res.redirect("/posts");
});

//View Post Route
app.get("/posts/:id", ( req,res )=>{
    let { id } = req.params ;
    const post = posts.find((p)=> p.id === id);
    if(post)
        res.render("show.ejs" , {post});
    else
        res.render("error.ejs");
});

//Edit route / render edit form
app.get("/posts/:id/edit",(req,res)=>{
    console.log(req.params);
    let {id} = req.params ;
    const post = posts.find((p)=> p.id === id);
    if(post)
        res.render("edit.ejs" , {post});
    else
        res.render("error.ejs");
});

//Edit content
app.patch("/posts/:id" , (req,res) =>{
    let { id } = req.params ;
    let newContent = req.body.content ;
    const post = posts.find((p)=> p.id === id);
    if(post)
    {
        post.content = newContent ;
        console.log(post);
        res.redirect("/posts");
    }
    else
        res.render("error.ejs");
});

//Render delete form
app.delete("/posts/:id", (req,res)=>{
    let { id } = req.params ;
    const post = posts.find((p)=> p.id === id);
    posts = posts.filter((p)=> p.id !== id);
    res.redirect("/posts");
});

