const fs = require('fs'),
  mkdirp = require('mkdirp'),
  getDirName = require('path').dirname,
  HttpsProxyAgent = require('https-proxy-agent'),
  http = require('http'),
  https = require('https')
//axios = require('axios')

const proxy = 'http://cseszneki.peter:870717Piller2@fwsg.pillerkft.hu:8080'
const axios = require('axios').create(HttpsProxyAgent(proxy));

class CacheService {
  constructor() {
    this.cacheTime = 3600000;
  }

  cacheAndServeFile(options, req, res) {
    this.options = options;
    if (options.cacheTime) this.cacheTime = options.cacheTime;
    this.res = res;
    this.req = req;
    options.caching ? this.cache() : this.getData()
  }

  getData() {
    if (this.options.type == 'file') {
      fs.readFile(this.options.url, 'utf8', (err, data) => {
        if (err) {
          console.trace(err);
        } else {
          this.processResponse(data)
        }
      });
    } else if (this.options.type == 'externalApi') {
      console.log(this.req.query[this.options.urlKey])
      this.options.middleCallback(this.req.query[this.options.urlKey]).then(d => {
        this.res.json(d);
      })
    } else {
      let url = this.options.urlKey ? this.options.url.replace(this.options.urlKey, this.req.query[this.options.urlKey]) : this.options.url
      axios({
        url: url,
        method: this.options.method ?? 'get',
        headers: this.options.headers ?? {},
        responseType: this.options.responseType ?? 'json',
        data: this.options.postData
      })
        .then(response => {
          this.processResponse(response)
        })
        .catch(err => {
          console.log(err.response.config.url)
          console.trace(err.response.status, err.response.statusText)
          this.res.end()
          //this.options.callback({ error: err });
        });
    }
  }

  readFile() {
    fs.readFile(this.options.file, "utf8", (err, data) => {
      if (err) {
        console.trace(err);
      } else {
        this.options.callback(JSON.parse(data));
      }
    });
  }

  writeFile(data) {
    // __dirname + "/" + file
    //path.join(__dirname, this.options.file)
    let path = this.options.file;
    fs.writeFile(path, JSON.stringify(data), "utf8", err => {
      this.options.callback({ ok: "ok" });
    });
  }

  processResponse(response) {
    let responseData = response.data ?? response, data = null
    if (
      this.options.middleCallback &&
      this.options.middleCallback(responseData) != null &&
      typeof this.options.middleCallback(responseData).then === 'function'
    ) {
      this.options.middleCallback(responseData).then(d => {
        data = d;
        if (this.options.caching) this.writeFile(data);
        //this.options.callback(data);
        this.res.json(data);
      });
    } else {
      data = this.options.middleCallback
        ? this.options.middleCallback(responseData)
        : responseData;
      if (this.options.caching) this.writeFile(data);
      //this.options.callback(data);
      this.res.json(data);
    }
  }

  cache() {
    fs.stat(this.options.file, (err, stat) => {
      if (err) {
        this.getData();
      } else {
        let now = new Date().getTime(),
          endTime = new Date(stat.ctime).getTime() + this.cacheTime;
        if (now > endTime) {
          this.getData();
        } else {
          //this.readFile();
          this.getData();
        }
      }
    });
  }
}











function cacheAndServeFile(options, middleCallback, callback) {
  let cacheTime = 3600000;

  let readFile = () => {
    fs.readFile(options.file, "utf8", function (err, data) {
      if (err) {
        console.log("err_1:" + err);
      } else {
        callback(JSON.parse(data));
      }
    });
  };

  let writeFile = data => {
    // __dirname + "/" + file
    fs.writeFile(options.file, JSON.stringify(data), "utf8", err => {
      if (err) console.log("err_2:" + err);
      callback({ ok: "ok" });
    });
  };

  let getData = () => {
    axios({
      method: options.method ? options.method : "GET",
      url: options.url,
      responseType: options.responseType ? options.responseType : "json",
      data: options.postData
    })
      .then(response => {
        let data;
        if (
          middleCallback &&
          middleCallback(response.data) != null &&
          typeof middleCallback(response.data).then === "function"
        ) {
          middleCallback(response.data).then(d => {
            data = d;
            writeFile(data);
            callback(data);
          });
        } else {
          data = middleCallback ? middleCallback(response.data) : response.data;
          writeFile(data);
          callback(data);
        }
      })
      .catch(err => {
        //callback({ error: err });
      });
  };

  fs.stat(options.file, function (err, stat) {
    if (err) {
      console.error(err);
      getData();
    } else {
      let now = new Date().getTime(),
        endTime = new Date(stat.ctime).getTime() + cacheTime;
      if (now > endTime) {
        getData();
      } else {
        readFile();
        //getData();
      }
    }
  });
}

module.exports = CacheService;
