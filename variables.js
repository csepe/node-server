module.exports = () => {

    let express = require("express"),
        app = express(),
        jsonStream = require('express-jsonstream'),
        parse = require("node-html-parser"),
        kmlToJson = require("./kmlToJson"),
        CacheService = require("./CacheService"),
        cacheService = new CacheService(),
        fs = require("fs"),
        cors = require("cors"),
        iconv = require("iconv-lite"),
        multer = require("multer"),
        path = require("path"),
        extract = require("extract-zip"),
        HttpsProxyAgent = require("https-proxy-agent"),
        basename = require('basename'),
        requireDir = require('require-dir'),
        storage = multer.diskStorage({
            destination: (req, res, cb) => {
                cb(null, path.join(__dirname, "uploads"));
            },
            filename: (req, res, cb) => {
                cb(null, res.originalname);
            }
        }),
        upload = multer({ storage: storage }).single("data"),
        httpsAgent = new HttpsProxyAgent('http://cseszneki.peter:870717Piller7@fwsg.pillerkft.hu:8080'),
        axios = require("axios").create({ httpsAgent })

}