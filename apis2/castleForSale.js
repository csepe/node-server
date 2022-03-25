
const HTMLParser = require('node-html-parser')

module.exports = {
    route: 'castleForSale',
    options: {
        url: "http://www.castleforsale.hu/",
        file: "data/castleforsale.json",
        middleCallback: data => parseData(data),
        //callback: data => res.json(data)
    }
}

let parseData = data => {
    let url = "http://www.castleforsale.hu/"
    let root = HTMLParser.parse(data),
        elems = root.querySelectorAll(".blokk"),
        json = []

    elems.forEach(elem => {
        let jsonEl = {
            title: elem
                .querySelector("h2")
                .text.replace("»»", "")
                .trim(),
            img:
                url +
                elem
                    .querySelector("img")
                    .getAttribute("src")
                    .trim(),
            desc: elem.querySelector("p").text.trim(),
            url:
               url +
                elem
                    .querySelector("a")
                    .getAttribute("href")
                    .trim()
        }
        json.push(jsonEl)
    })
    return json
};