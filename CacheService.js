const fs = require("fs"),
  mkdirp = require("mkdirp"),
  getDirName = require("path").dirname,
  HttpsProxyAgent = require("https-proxy-agent")
  //axios = require("axios")

const httpsAgent = new HttpsProxyAgent('http://cseszneki.peter:870717Piller7@fwsg.pillerkft.hu:8080')
const axios = require("axios").create({ httpsAgent });

class CacheService {
  constructor(options) {
    this.cacheTime = 3600000;
    if (options) this.options = options;
    if (options) this.cacheTime = options.cacheTime;
  }

  cacheAndServeFile(options) {
    if (options) this.options = options;
    if (options) this.cacheTime = options.cacheTime;
    if (options.caching) {
      this.cache();
    } else {
      this.getData();
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

  getData() {
    axios({
      method: this.options.method ? this.options.method : "GET",
      url: this.options.url,
      headers: this.options.headers ? this.options.headers : {},
      responseType: this.options.responseType
        ? this.options.responseType
        : "json",
      data: this.options.postData
    })
      .then(response => {
        let data;
        if (
          this.options.middleCallback &&
          this.options.middleCallback(response.data) != null &&
          typeof this.options.middleCallback(response.data).then === "function"
        ) {
          this.options.middleCallback(response.data).then(d => {
            data = d;
            if (this.options.caching) this.writeFile(data);
            this.options.callback(data);
          });
        } else {
          data = this.options.middleCallback
            ? this.options.middleCallback(response.data)
            : response.data;
          if (this.options.caching) this.writeFile(data);
          this.options.callback(data);
        }
      })
      .catch(err => {
        console.trace(err);
        this.options.callback({ error: err });
      });
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
        callback({ error: err });
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
