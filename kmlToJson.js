const DOMParser = require("xmldom").DOMParser;

// Get KML file
const kmlToJson = (kml, mapId) => {
  let getNodeValue = (node, item) => {
    let el = node.getElementsByTagName(item)[0];
    return el && el.childNodes[0] ? el.childNodes[0].nodeValue.trim() : "";
  };
  let getNodeType = node => {
    let types = ["Point", "LineString", "LinearRing"],
      ret;
    types.forEach(el => {
      if (node.getElementsByTagName(el)[0]) ret = el;
    });
    return ret;
  };
  let convertColor = kmlColor => {
    if (!kmlColor) return "";
    return (
      kmlColor[6] +
      kmlColor[7] +
      kmlColor[4] +
      kmlColor[5] +
      kmlColor[2] +
      kmlColor[3]
    );
  };
  let parser = new DOMParser(),
    xmlDoc = parser.parseFromString(kml, "text/xml"),
    output = {
      markers: []
    },
    markerObj;

  output.folders = [];
  let folders = xmlDoc.getElementsByTagName("Folder");
  for (var i = 0; i < folders.length; i++) {
    let folder = folders[i],
      markers = folder.getElementsByTagName("Placemark"),
        folderMarkers = [];
    
    for (var z = 0; z < markers.length; z++) {
      let marker = markers[z],
        type = getNodeType(marker),
        styleUrl = xmlDoc.getElementById(
          getNodeValue(marker, "styleUrl").substr(1) + "-normal"
        ),
        loc = [];

      if (type == "Point") {
        loc = {
          lat: getNodeValue(marker, "coordinates").split(",")[0],
          lng: getNodeValue(marker, "coordinates").split(",")[1]
        };
      } else {
        let lines = getNodeValue(marker, "coordinates").split("\n");
        lines.forEach(line => {
          loc.push({
            lat: line.split(",")[1].trim() * 1,
            lng: line.split(",")[0].trim() * 1
          });
        });
      }
      markerObj = {
        name: getNodeValue(marker, "name"),
        desc: getNodeValue(marker, "description"),
        loc: loc,
        type: type,
        color: convertColor(getNodeValue(styleUrl, "color")),
        width: getNodeValue(styleUrl, "width"),
        icon: getNodeValue(styleUrl, "href"),
        folder: getNodeValue(folder, "name")
      };
      output.markers.push(markerObj);
      folderMarkers.push(markerObj);
    }
    output.folders.push({
      title: getNodeValue(folder, "name"),
      total: markers.length,
      markers: folderMarkers
    });
  }
  output.description = getNodeValue(xmlDoc, "description");
  output.mapId = mapId;
  output.url = "https://www.google.com/maps/d/viewer?mid=" + mapId;
  output.kmlUrl =
    "https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=" + mapId;
  output.title = getNodeValue(xmlDoc, "name");
  output.markersTotal = output.markers.length;
  return output;
};

module.exports = {
  kmlToJson: kmlToJson
};
