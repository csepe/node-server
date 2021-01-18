module.exports = app => {
    with (app) {

        app.get("/api/urbface", (req, res) => {
            let url = "data/urbface.json",
                obj;
            fs.readFile(url, "utf8", function (err, data) {
                if (err) throw err;
                obj = data.replace(/(?:\r\n|\r|\n)/g, " ");
                obj = JSON.parse(obj);
                res.json(obj);
            });
        });
        
        app.get("/api/urbface/:ID", (req, res) => {
            let options = {
                url: "http://urbface.com/info.html?id=" + req.params.ID,
                //file: "data/urbface_" + req.params.ID + ".json",
                res: res,
                id: req.params.ID,
                method: "post",
                postData: { id: req.params.ID },
                middleCallback: null,
                callback: data => res.json(data)
            };
        
            cacheService.cacheAndServeFile(options);
        });
        
    }}