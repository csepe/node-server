
const HTMLParser = require('node-html-parser')

module.exports = {
    route: 'indexfuji',
    options: {
        url:
            "https://forum.index.hu/Search/showArticleResult?topic_id=9219213&aq_ext=1&aq_text=16mm%20f1.4",
        file: "data/indexfuji.json",
        responseType: "stream",
        cacheTime: 3600000 * 4,
        middleCallback: data => parseData(data),
        //callback: data => res.json(data)
    }
}

let parseData = data =>
    new Promise(resolve => {
        data.pipe(iconv.decodeStream("win1250")).collect(function (err, html) {
            let root = HTMLParser.parse(html),
                elems = root.querySelectorAll(".art"),
                json = [];

            elems.forEach(elem => {
                let jsonEl = {
                    title: elem.querySelector(".art_t").text.trim(),
                    html: elem.querySelector(".art_t").outerHTML.trim(),
                    date: elem.querySelectorAll(".art_h_l a")[3].text.trim()
                };
                json.push(jsonEl);
            });
            resolve(json);
        });
    });