

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://admin-amit:amitpatle10@cluster0.rssbx.mongodb.net/todolist', {useNewUrlParser: true, useUnifiedTopology: true});
const ItemSchema = new mongoose.Schema({
  name : String
})
const Item = mongoose.model('Item',ItemSchema);

const item1 = new Item({
  name : "Welcome To Todolist"
})




var defaultitems = [item1];


app.get("/",function(req,res){
  var today = new Date();
  var current = today.getDate();

  var options = {
    weekday : "long",
    day : "numeric",
    month : "long"
  };
  var day = today.toLocaleDateString("en-US",options);

  Item.find(function(err,founditems){
    if (err){
      console.log(err);
    }
    else{
      if ((founditems.length === 0)){
        Item.insertMany(defaultitems,function(err){
          if (err){
            console.log(err);
          }
          else {
            console.log("Successfully added the data to the database");
          }
        });

        res.redirect('/');
      }
      res.render('list',{kindofday:day,worktodo:founditems});
    }
  });


})
app.post ("/",function(req,res){
  var myitem = req.body.work;
  const newitem = new Item({
    name : myitem
  })
  newitem.save(function(err){
    if (err){
      console.log(err);
    }
    else {
      console.log("Successfully Added Newitem to database");
    }
  })
  res.redirect('/');
})
app.post("/delete",function(req,res){
  const itemid = req.body.checkbox;
  Item.deleteOne({_id:itemid},function(err){
    if (err){
      console.log(err);
    }
    else {
      console.log("Successfully Deleted");
    }
  });
  res.redirect('/');
})

app.listen(process.env.PORT || 4200,function(){
  console.log("Server started at Port:4200");
})
