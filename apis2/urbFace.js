module.exports = {
    route: 'urbFace',
    options: {
        type: 'file',
        url: "data/urbface.json",
        middleCallback: data => JSON.parse(data.replace(/(?:\r\n|\r|\n)/g, " ")),
        //callback: data => res.json(data)
    }
}
/*
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
*/