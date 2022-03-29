const express = require("express"),
    app = require("express")(),
    jsonStream = require('express-jsonstream'),
    HTMLParser = require('node-html-parser'),
    kmlToJson = require("./kmlToJson"),
    cacheService = new (require("./CacheService"))(),
    http = require('http'),
    https = require('https'),
    fs = require("fs"),
    cors = require("cors"),
    iconv = require("iconv-lite"),
    multer = require("multer"),
    path = require("path"),
    extract = require("extract-zip"),
    HttpsProxyAgent = require("https-proxy-agent"),
    basename = require('basename'),
    requireDir = require('require-dir'),
    upload = () => {
        let multer = require("multer")
        let storage = multer.diskStorage({
            destination: (req, res, cb) => {
                cb(null, path.join(__dirname, "uploads"))
            },
            filename: (req, res, cb) => {
                cb(null, res.originalname);
            }
        })
        return multer({ storage: storage }).single("data")
    }
const proxy = 'http://cseszneki.peter:870717Piller2@fwsg.pillerkft.hu:8080'
const axios = require('axios').create(HttpsProxyAgent(proxy));

app.use(express.static("public"))
app.use(express.static("uploads"))
app.use(express.static("angular-app"))
app.use(express.static("angular-app/assets"))
app.use(cors())
app.use(express.json())
//app.use(jsonStream())
//path.resolve(__dirname, 'apis')
const apis = requireDir('./apis2', { extensions: ['.js'] })

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

const listener = app.listen(4201, () => {
    let openPage = false
    let url = 'http://localhost:' + listener.address().port
    console.log("Your app is listening on", url)
    if (openPage) {
        let start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open')
        require('child_process').exec(start + ' ' + url)
    }
})