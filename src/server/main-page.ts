import app from ".";

app.get("/", (req, res) => {
    res.redirect("index.html")
})