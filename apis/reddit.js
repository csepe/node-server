module.exports = app => {
    with (app) {

app.get("/api/reddit/:sub", (req, res) => {
    let sub = req.params.sub;
    let options = {
        url:
            "https://www.reddit.com/r/" + sub + "/top.json?sort=top&t=all&limit=50",
        file: "data/reddit_" + sub + ".json",
        middleCallback: data => parseData(data),
        callback: data => res.json(data)
    };

    cacheService.cacheAndServeFile(options);

    let parseData = data => {
        let json = [];
        data.data.children.forEach(elem => {
            let jsonEl = {
                title: elem.data.title,
                img: elem.data.url,
                url: elem.data.permalink,
                //img2: createImage(elem.data.url)
            };
            /*createImage(elem.data.url).then(img64 => {
                jsonEl.img2 = img64
            })*/
            json.push(jsonEl);
        });
        return json;
    };
});


}}