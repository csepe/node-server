module.exports = {
    route: 'getMapData',
    description: 'getMapData?mapId=154PMzE5zZ847CD4JXJvcrcjQAiY',
    options: {
        urlKey: 'mapId',
        url: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=mapId',
        responseType: 'text',
        file: "data/mapId.json",
        middleCallback: data => {
            return kmlToJson.kmlToJson(data, options.mapId)
        }
    }
}