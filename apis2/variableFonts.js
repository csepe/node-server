
module.exports = {
    route: 'variableFonts',
    options: {
        url: "https://fonts.google.com/metadata/fonts",
        middleCallback: data => parseData(data)
    }
}

let parseData = data => {
    let fonts = data.familyMetadataList.filter(font => {
        return font.axes.length
    });
    return fonts;
};