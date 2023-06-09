const express = require("express");
const app = require("express")();
const cacheService = new (require("./CacheService"))();
const cors = require("cors");
const path = require('path');
const requireDir = require('require-dir');
const fs = require('fs');
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

app.get('/api/jsonStore/:id', (req, res) => {
    let id = req.params.id;
    console.log('jsonStore: ' + id);
    fs.readFile(`data/${id}.json`, "utf8", (err, data) => {
        if (err) {
            //console.trace(err);
            res.json([]);
        } else {
            res.json(JSON.parse(data));
        }
    })
})

app.post('/api/jsonStore/:id', (req, res) => {
    let id = req.params.id
    fs.writeFile(`data/${id}.json`, JSON.stringify(req.body), "utf8", err => {
        if (err) {
            console.log("err:" + err);
            res.json(err);
        }
        res.json({ ok: "ok" });
    });
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



//Mongodb
//mongodb-starter
//QLulb9wVAMHR0nal
/* 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mongodb-starter:QLulb9wVAMHR0nal@cluster0.yxffe9g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    console.log(err)
    const collection = client.db("map").collection("map_users");
    console.log(collection)
    // perform actions on the collection object
    client.close();
});


async function main() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("map");
    const collection = db.collection("map_users");
    console.log(collection)
    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close()); */