const express = require('express');
const bodyParser = require('body-parser');
let ejs = require('ejs');
const mongoose = require('mongoose');
let date = require(__dirname + "/views/date.js");

const app = new express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);
const Work = mongoose.model("Work", itemsSchema);

app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems){
        let items = foundItems;
        res.render('list', {listTitle: "Today", itemArray: items});
    })
});
app.get("/Work", function(req,res) {
    Work.find({}, function(err, foundItems){
        let Work = foundItems;
        res.render('list', {listTitle: 'Work', itemArray: Work});
    })
});
app.get("/About", function(req,res) {
    res.render('about');
})

app.post("/", function(req, res){
    if (req.body.list == 'Work') {
        var item = new Work ({
            name: req.body.newItem
        });
        Work.create(item, function(err){
            if(err) console.log(err);
            else console.log(`${item} wurde erfolgreich gespeichert.`)
        });
        res.redirect("/Work");
    } else {
        var item = new Item ({
        name: req.body.newItem
        });
        Item.create(item, function(err){
            if(err) console.log(err);
            else console.log(`${item} wurde erfolgreich gespeichert.`)
        });
        res.redirect("/");
    }
});

app.post("/erase", function(req, res){
    let shouldDelete = req.body.eraseAction;
    Item.find({name: shouldDelete}).remove(function(err){
        if (err) console.log(err);
        else console.log("erased Data sucessfully");
    })
    res.redirect("/")

});







app.listen(3000, function(){
    console.log("Server started on port 3000");
});