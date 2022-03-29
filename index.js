const express = require("express");
const app = require("express")();
const cacheService = new (require("./CacheService"))();
const cors = require("cors");
const path = require('path');
const requireDir = require('require-dir');

app.use(
    cors(),
    express.static("public"),
    express.static("uploads"),
    express.static("angular-app"),
    express.static("angular-app/assets"),
    express.json()
)

const apis = requireDir(path.resolve(__dirname, 'apis2'), { extensions: ['.js'] });
const PORT = 4201;

app.get("/", (req, res) => {
    let htmlOutput = `<h2>Routes</h2><ul>`;
    Object.entries(apis).forEach(([key, api]) => {
        if (api.route) {
            htmlOutput =
                htmlOutput +
                `<li><a href="/api/${api.route}">${api.route}</a>
                <a href="/api/${api.description}">${api.description}</a></li>`
        }
    })
    htmlOutput = htmlOutput.toString()
    res.set("Content-Type", "text/html")
    res.send(new Buffer.from(htmlOutput))
})

app.get('/api/:id', (req, res) => {
    let api = apis[req.params.id]
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