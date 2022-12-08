

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://Admin-Harish:Harish-2211@cluster0.doki0xu.mongodb.net/todoDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String,
}

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to ToDo List"
});
const item2 = new Item({
  name: "Click ( + ) To Add Wish TO List"
});
const item3 = new Item({
  name: "<--  Hit Box To Remove List"
});



const day = date.getDate();
const defaultItems = [item1, item2, item3];




app.get("/", function(req, res) {

  Item.find({}, function(err ,foundItems){
    if (foundItems.length === 0 ) {
      Item.insertMany(defaultItems,function(err){
        if (err) {
          console.log(err);
        }else {
          console.log("sucessfully saved default items to DB");
        }
      });
      res.redirect("/");
    }else {
      res.render("list", {ListTittle: day, newListItems: foundItems});
    }

  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("sucessfully deleted checked item");
      res.redirect("/")
    }
  });

});





app.listen(process.env.PORT || 3000, function() {
  console.log("server litening port 3000");
});
