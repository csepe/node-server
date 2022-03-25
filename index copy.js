const deps = {
    express: require("express"),
    app: require("express")(),
    jsonStream: require('express-jsonstream'),
    HTMLParser: require('node-html-parser'),
    kmlToJson: require("./kmlToJson"),
    cacheService: new (require("./CacheService"))(),
    fs: require("fs"),
    cors: require("cors"),
    iconv: require("iconv-lite"),
    multer: require("multer"),
    path: require("path"),
    extract: require("extract-zip"),
    HttpsProxyAgent: require("https-proxy-agent"),
    basename: require('basename'),
    requireDir: require('require-dir'),
    upload: () => {
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
    },
    axios: require("axios").create((new require("https-proxy-agent"))('http://cseszneki.peter:870717Piller2@fwsg.pillerkft.hu:8080'))
}

deps.app.use(deps.express.static("public"))
deps.app.use(deps.express.static("uploads"))
deps.app.use(deps.express.static("angular-app"))
deps.app.use(deps.express.static("angular-app/assets"))
deps.app.use(deps.cors())
//app.use(express.json())
deps.app.use(deps.jsonStream())

//deps.path.resolve(__dirname, 'apis')
deps.requireDir('apis', { extensions: ['.js'], mapValue(fn) { return fn(deps) } })

deps.app.get("/", (req, res) => {
    let htmlOutput = `<h2>Routes</h2><ul>`;
    deps.app._router.stack.forEach(route => {
        if (route.route && route.route.path) {
            htmlOutput =
                htmlOutput +
                `<li><a href="${route.route.path}">${route.route.path}</a></li>`
        }
    })
    htmlOutput = htmlOutput.toString()
    res.set("Content-Type", "text/html")
    res.send(new Buffer.from(htmlOutput))
})

deps.app.route("/*").get((req, res) => {
    //res.sendFile("angular-app/index.html", { root: __dirname })
})

const listener = deps.app.listen(4201, () => {
    let openPage = false
    let url = 'http://localhost:' + listener.address().port
    console.log("Your app is listening on", url)
    if (openPage) {
        let start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open')
        require('child_process').exec(start + ' ' + url)
    }
})

const simpleStringify = object => {
    let simpleObject = {}
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof object[prop] == "object") {
            continue;
        }
        if (typeof object[prop] == "function") {
            continue;
        }
        simpleObject[prop] = object[prop]
    }
    return JSON.stringify(simpleObject)
}