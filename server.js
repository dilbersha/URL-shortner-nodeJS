const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrls = require("./models/shortUrls");
const PORT = process.env.PORT || 3005;
mongoose
    .connect(
        "mongodb+srv://root:devmodeon@cluster0.1xruv.mongodb.net/test",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server Running on Port: http://localhost:${PORT}`)
        )
        app.set("view engine", "ejs");
        app.use(express.urlencoded({ extended: false }));
        app.get("/", async (req, res) => {
            const shortUrl = await shortUrls.find();
            res.render('index', { shortUrls: shortUrl });
        });
        app.post("/shortUrls", async (req, res) => {
            await shortUrls.create({ full: req.body.fullURL });
            res.redirect("/");
        });
        app.get('/:shortUrl', async (req, res) => {
            const ShortUrls = await shortUrls.findOne({ short: req.params.shortUrl })
            if (ShortUrls == null) return res.sendStatus(404)

            ShortUrls.clicks++
            ShortUrls.save()
            res.redirect(ShortUrls.full)
        })
    }
    ).catch((error) => console.log(`${error} did not connect`));
