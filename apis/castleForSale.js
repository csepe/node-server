module.exports = deps => {
    with (deps) {

        app.get("/api/castleForSale", (req, res) => {
            let options = {
                url: "http://www.castleforsale.hu/",
                file: "data/castleforsale.json",
                middleCallback: data => parseData(data),
                callback: data => res.json(data)
            };

            cacheService.cacheAndServeFile(options)

            let parseData = data => {
                let root = parse(data),
                    elems = root.querySelectorAll(".blokk"),
                    json = []

                elems.forEach(elem => {
                    let jsonEl = {
                        title: elem
                            .querySelector("h2")
                            .text.replace("»»", "")
                            .trim(),
                        img:
                            options.url +
                            elem
                                .querySelector("img")
                                .getAttribute("src")
                                .trim(),
                        desc: elem.querySelector("p").text.trim(),
                        url:
                            options.url +
                            elem
                                .querySelector("a")
                                .getAttribute("href")
                                .trim()
                    }
                    json.push(jsonEl)
                })
                return json
            };
        })
    }
}
