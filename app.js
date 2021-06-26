const express = require("express");
const bodyParser = require("body-parser");
const daymodule = require(__dirname + "/day.js");
const mongoose = require("mongoose");
const _=require("lodash");

app = express();
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/toDoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const arraySchema = mongoose.Schema({
  items: String
})
const arrayModel = mongoose.model("toDoList", arraySchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let day = "";

const obj1 = new arrayModel({
  items: "Buy Food"
})

const obj2 = new arrayModel({
  items: "Cook Food"
});

const obj3 = new arrayModel({
  items: "Eat Food"
});

const items = [obj1, obj2, obj3];

const workSchema = mongoose.Schema({
  name: String,
  items: [arraySchema]
})
const workModel = mongoose.model("customList", workSchema);

app.get("/", function(req, res) {
  day = daymodule.getDate();
  arrayModel.find(function(err, object) {
    if (err) {
      console.log("couldn't read database");
    } else {
      if (object.length === 0) {
        arrayModel.insertMany(items, function(error) {
          if (error) {
            console.log("couldnt insert to DB")
          } else {
            console.log("Inserted to list");
          }
        })
        res.redirect("/");
      } else {
        res.render("list", {
          titleSent: day,
          items: object
        });
      }
    }
  })
});

app.get("/:siteName", function(req, res) {
  const site = _.capitalize(req.params.siteName);
  workModel.findOne({
    name: site
  }, function(error, foundItem) {
    if (!error) {
      if (!foundItem) {
        const obj = workModel({
          name: site,
          items: [obj1, obj2, obj3]
        })
        obj.save();
        res.redirect("/" + site);
      }
      else {
        res.render("list", {
          titleSent: foundItem.name,
          items: foundItem.items
        });
      }
    }
  })
})

app.post("/delete", function(req, res) {

  const row=req.body.checkbox;
  const site=req.body.object;

  if (site === daymodule.getDay() + ",")
  {
    arrayModel.findByIdAndRemove(req.body.checkbox, function(err) {
      if (err) {
        console.log("error in deleting");
      } else {
        console.log("successfully deleted")
      }
        res.redirect("/");
      })
  }
  else
  {
    workModel.findOneAndUpdate({name:site},{$pull:{items:{_id:row}}},function(err,databaseCollectionObject){
      if(!err){
        console.log("Updated successfully");
        res.redirect("/"+site);
      }
    })
  }

})

app.post("/", function(req, res) {
  const value = req.body.enteredValue;
  const site =req.body.button;

  const obj = new arrayModel({
    items: value
  })

  if (site == daymodule.getDay() + ",") {
    obj.save();
    res.redirect("/");
  } else {
    workModel.findOne({name:site},function(err,collection){
      if(!err)
      {
        collection.items.push(obj);
        collection.save();
        res.redirect("/"+site);
      } else
      {console.log("cant save");}})
  }
});

app.listen(3000, function() {
  console.log("server started at port 3000");
});
