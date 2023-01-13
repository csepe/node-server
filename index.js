const express = require("express");
const app = require("express")();
const cacheService = new (require("./CacheService"))();
const cors = require("cors");
const path = require('path');
const requireDir = require('require-dir');
//const axios = require('axios').default;

app.use(
    cors(),
    express.static("public"),
    express.static("uploads"),
    express.static("angular-app"),
    express.static("angular-app/assets"),
    express.json()
)

const APIS = requireDir(path.resolve(__dirname, 'apis2'), { extensions: ['.js'] });
const PORT = 4201;

app.get("/", (req, res) => {
    let htmlOutput = `<h2>Routes</h2><ul>`;
    Object.entries(APIS).forEach(([key, api]) => {
        if (api.route) {
            htmlOutput +=
                `<li><p><a href="/api/${api.route}">${api.route}</a></p>
                <p><a href="/api/${api.description}">${api.description}</a></p></li>`;
        }
    })
    res.set("Content-Type", "text/html");
    res.send(Buffer.from(htmlOutput.toString()));
})

app.get('/api/:id', (req, res) => {
    let api = APIS[req.params.id]
    cacheService.cacheAndServeFile(api.options, req, res)
})

const listener = app.listen(PORT, () => {
    let openPage = false
    let url = 'http://localhost:' + listener.address().port
    console.log("Your app is listening on", url)
    if (openPage) {
        let start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open')
        require('child_process').exec(start + ' ' + url)
    }
})
/*
const HttpsProxyAgent = require('https-proxy-agent');
const proxy = 'http://cseszneki.peter:870717Piller2@fwsg.pillerkft.hu:8080'
const axios = require('axios').create(HttpsProxyAgent(proxy));
let u = 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=154PMzE5zZ847CD4JXJvcrcjQAiY'
axios.get(u).then(r=>console.log(r)).catch(e=>console.log(e))
*/