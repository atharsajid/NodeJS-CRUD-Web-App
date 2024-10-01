const express = require("express");
const app = express();
const path = require("path")
const user = require("./models/user")

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/read", async (req, res) => {

    let allUsers = await user.find();
    res.render("read", { users: allUsers })
})

app.post("/create", async (req, res) => {
    //Method 1
    // let _user = await user.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     imageUrl: req.body.imageUrl
    // })

    //Method 2
    // let { name, email, imageUrl } = req.body
    // let _user = await user.create({
    //     name: name,
    //     email: email,
    //     imageUrl: imageUrl
    // })

    //Method 3 
    let { name, email, imageUrl } = req.body;
    let _user = await user.create({
        name,
        email,
        imageUrl,
    })
    res.redirect("/read");
})

app.get("/edit/:id", async (req, res) => {
    let _user = await user.findOne({ _id: req.params.id });
    res.render("edit", { user: _user });
})

app.post("/editUser/:id", async (req, res) => {
    let { name, email, imageUrl } = req.body;
    await user.findOneAndUpdate({ _id: req.params.id }, {
        name,
        email,
        imageUrl
    }), {
        new: true
    }

    res.redirect("/read")
})

app.get("/delete/:id", async (req, res) => {
    await user.findOneAndDelete({
        _id: req.params.id,
    })
    res.redirect("/read")

})


app.get("/getUser", async (req, res) => {

    let allUsers = await user.find();
    res.send(allUsers);
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send("Something went wrong")
})



app.listen(3000)