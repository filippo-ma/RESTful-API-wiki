const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = 3000;


// mongoDB set up
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article", articleSchema);



// RESTful API requests (GET POST PUT PATCH DELETE)

// All articles

app.route("/articles")
.get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const newArticle = new Article ({
        title: articleTitle,
        content: articleContent
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req,res) {
    Article.deleteMany({}, function(err) {
        if (!err) {
            res.send("All articles deleted.");
        } else {
            res.send(err);
        }
    });
});




// Requests targeting a specific article 

app.route("/articles/:articleTitle")

.get(function(req,res) {

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found.");
        }
    });

})

// PUT
.put(function(req,res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        // {overwrite: true},
        function(err) {
            if(!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    )
})

// PATCH (flexible updating)
.patch(function(req,res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    )
})

.delete(function(req,res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if (!err) {
                res.send("Successfully deleted article");
            } else {
                res.send(err);
            }
        }
    )
});








app.listen(port, function() {
    console.log("Server started on port "+port);
});





// GET request
// read all articles (port/articles)
// app.get("/articles", function(req, res) {
//     Article.find({}, function(err, foundArticles) {
//         if (!err) {
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });
// });


// POST request (use postman or insomnia to test)
// create one new article and save into mongoDB
// app.post("/articles" , function(req, res) {
//     const articleTitle = req.body.title;
//     const articleContent = req.body.content;

//     const newArticle = new Article ({
//         title: articleTitle,
//         content: articleContent
//     });

//     newArticle.save(function(err) {
//         if (!err) {
//             res.send("Successfully added a new article.");
//         } else {
//             res.send(err);
//         }
//     });
// });


// DELETE request
// delete all articles
// app.delete("/articles", function(req,res) {
//     Article.deleteMany({}, function(err) {
//         if (!err) {
//             res.send("All articles deleted.");
//         } else {
//             res.send(err);
//         }
//     });
// });


