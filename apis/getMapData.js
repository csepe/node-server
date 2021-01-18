module.exports = app => {
    with (app) {

        app.get("/api/getMapData/:mapId", (req, res) => {
            let options = {
                mapId: req.params.mapId,
                url:
                    "https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=" +
                    req.params.mapId,
                file: "data/" + req.params.mapId + ".json",
                middleCallback: data => kmlToJson.kmlToJson(data, options.mapId),
                callback: data => res.json(data)
            };

            cacheService.cacheAndServeFile(options)

            if (typeof options.mapId == "undefined") {
                res.json({ error: "No map ID" })
            }
        })

    }
}