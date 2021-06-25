const express = require("express");
const bodyParser = require("body-parser");
const daymodule= require(__dirname + "/day.js");

app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const day="";
const items=["Buy Food","Cook Food","Eat Food"];
const workItems=["Buy Food","Cook Food","Eat Food"];

//date thing
//date things end here
  app.get("/", function(req, res) {
    day=daymodule.getDate();
  res.render("list", {titleSent:day,items: items});
});

app.get("/work",function(req,res){
  res.render("list",{titleSent:"workDirectory",items:workItems});
});

app.get("/about",function(req,res){
  res.render("about");
});

app.post("/",function(req,res){
  console.log(req.body);
  if(req.body.button==day)
  {
    items.push(req.body.enteredValue);
    res.redirect("/");
  }
  else{
    workItems.push(req.body.enteredValue);
    res.redirect("/work");
  }
});

app.listen(3000, function() {console.log("server started at port 3000");});
