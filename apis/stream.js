module.exports = app => {
    with (app) {


app.get("/stream", function (req, res) {
    var c = 0;
    var interval = setInterval(function () {
        res.jsonStream({ i: c });
        c++
        if (c === 10) {
            clearInterval(interval);
            res.end();
        }
    }, 1000)
})
}}