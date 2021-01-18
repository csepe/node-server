module.exports = app => {
    with (app) {

        app.get("/api/getMapDataFromFile/:mapFile", (req, res) => {
            let url = req.params.mapFile,
                obj;

            fs.readFile(url, "utf8", function (err, data) {
                if (err) throw err;
                obj = kmlToJson.kmlToJson(data, null);
                res.json(obj);
            });
        });

    }
}