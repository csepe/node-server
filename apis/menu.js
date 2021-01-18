module.exports = app => {
    with (app) {

    let restaurants = [{
        name: "Pizza King 3 - Szentendrei",
        url: "https://www.netpincer.hu/api/v1/vendors/236/",
        type: "netpincer"
    },
    {
        name: "",
        url: "https://restaurant-api.wolt.com/v3/menus/5c618d3a7e26b8000b94dd8f",
        type: "wolt"
    },
    {
        name: "Home Bistro",
        url: "https://restaurant-api.wolt.com/v3/menus/5cb846df655cc3000def8c63",
        type: "wolt"
    }]


    app.get("/api/menu", (req, res) => {
        let sub = req.params.sub;
        let options = {
            url: restaurants[0].url,
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