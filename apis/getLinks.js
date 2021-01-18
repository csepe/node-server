module.exports = app => {
    with (app) {

        app.get("/api/getLinks", (req, res) => {
            let url = req.query.url
            let maxPages = req.query.maxSubPages
            let domains = []
            let subpageIndex = 0
            let subpages = []
            let json = {
                domains: [],
                subpages: []
            }

            function mergeArrays(arr1, arr2) {
                let ids = new Set(arr1.map(d => d.name))
                let arr = [...arr1, ...arr2.filter(d => !ids.has(d.name))]
                return arr
            }
            getData(url).then(value => {
                console.log(value)
            },
                error => console.log(error)
            )

            function getData(url) {
                let promise = new Promise(function (resolve, reject) {
                    let options = {
                        url: url,
                        middleCallback: data => parseData(data, options),
                        callback: data => {

                            /*var stream = fs.createReadStream('./file.json');
                            stream.pipe(res);
        
                            stream.on('data', function(data) {
                              res.write(data);
                            });
                          
                            stream.on('end', function() {
                              res.end();
                            });*/

                            resolve(json)
                            //stream.write(json.toString());
                            //res.jsonStream(json)
                            //res.json(json)
                            /*mergeArrays(json.domains, data.domains)
                            mergeArrays(json.subpages, data.subpages)
                            console.log(json)
                            res.json(json)*/
                        }
                    }
                    cacheService.cacheAndServeFile(options)
                })

                let parseData = (data, options) => {
                    let root = parse(data),
                        elems = root.querySelectorAll('a')

                    let currentDomain = new URL(options.url).hostname
                    let disabledDomains = [currentDomain, 'facebook.com']

                    elems.forEach(elem => {
                        let link = elem.getAttribute('href')

                        if (link) {
                            let domain = new URL(link, options.url).hostname
                            let protocol = new URL(link, options.url).protocol

                            if (!domains.includes(domain) && !disabledDomains.includes(domain)) {
                                let jsonEl = {
                                    name: domain,
                                    url: protocol + '//' + domain
                                }
                                json.domains.push(jsonEl)
                                domains.push(domain)
                            }
                            if (domain == currentDomain && link != '/' && link != '#') {
                                let u = link
                                try {
                                    new URL(link)
                                }
                                catch (err) {
                                    u = protocol + '//' + domain + '/' + link
                                }
                                let jsonEl = {
                                    name: link,
                                    url: u
                                }
                                json.subpages.push(jsonEl)
                            }
                        }
                    })
                }

                if (subpageIndex < maxPages && subpages.length >= subpageIndex) {
                    console.log(subpageIndex)
                    getData(json.subpages[subpageIndex].url)
                    subpageIndex++
                } else {
                    console.log(subpages.length)
                    res.json(json)
                    res.end()
                }
                return promise
            }
        });
    }
}