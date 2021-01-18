module.exports = app => {
    with (app) {

        app.get("/api/mega", (req, res) => {
            /*let fileURL = "https://mega.nz/folder/CUFTHCwT#2-e8lR-g9Hx6FuBPrRHHUQ";
            fileURL = mega.file(fileURL);
            let htmlOutput = "",
                json = [];
                console.log(fileURL)
            fileURL.loadAttributes((error, file) => {
                
                let folders = file.children;
        
                folders.forEach((folder, i) => {
                    let jsonItem = {};
                    jsonItem.name = folder.name;
                    jsonItem.files = [];
                    jsonItem.links = [];
                    folder.children.forEach(folderItem => {
                        if (!folderItem.directory) {
                            folderItem.link(function (err, url) {
                                jsonItem.links.push(url);
                            });
                        }
                    });
                    json.push(jsonItem);
                });
                res.json(json);
            });*/
        });
        
    }}