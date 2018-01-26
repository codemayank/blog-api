let express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  app = express();

mongoose.connect("mongodb://localhost/blog_app");
app.use(bodyParser.urlencoded({
  extended: true
}));

//Mongoose/Model Config.
let blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

let Blog = mongoose.model("Blog", blogSchema);

//CRUD Routes
//Default Route -- redirects to /blogs
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

//Index Route -- API to Get All Blogs
app.get("/blogs", function(req, res) {
  Blog.find({}, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.send(blog);
    }
  });
});

//New Route - API to Create a new Blog
app.post("/blogs", function(req, res) {
  let title = req.body.title;
  let author = req.body.author;
  let body = req.body.body;
  let newBlog = {
    title: title,
    author: author,
    body: body
  };
  Blog.create(newBlog, (err, newlyCreated) => {
    if (err) {
      res.send("there has been an error");
    } else {
      res.redirect("/blogs");
    }
  });
});

//Show Blog Route -- API to get a particular Blog
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, (err, blog) => {
    if (err || !blog) {
      res.send("there has been an error");
    } else {
      res.send(blog);
    }
  });
});

//Edit update Route -- API to edit a particular Blog
app.put("/blogs/:id", function(req, res) {
  let title = req.body.title;
  let author = req.body.author;
  let body = req.body.body;
  let updatedBlog = {
    title: title,
    author: author,
    body: body
  };
  Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
    new: true
  }, (err, updatedBlog) => {
    if (err || !updatedBlog) {
      res.send("There has been an error");
    } else {
      res.send(updatedBlog);
    }
  })
});

//Delete Route -- API to delete a particular blog
app.delete("/blogs/:id", function(req, res) {
  //destroy Blogs
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.send("There has been an error");
    } else {
      res.send("The Blog has been deleted Successfully");
    }
  });
});

app.listen(3000, function() {
  console.log("The Server is now running");
});
