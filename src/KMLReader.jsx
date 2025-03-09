import { DOMParser } from "xmldom";

export const KMLReader = (kmlContent) => {
  const parser = new DOMParser();
  const kmlDoc = parser.parseFromString(kmlContent, "text/xml");

  const placemarks = kmlDoc.getElementsByTagName("Placemark");
  const features = [];

  for (let i = 0; i < placemarks.length; i++) {
    const placemark = placemarks[i];
    const name = placemark.getElementsByTagName("name")[0]?.textContent || "Unnamed";
    const lineString = placemark.getElementsByTagName("LineString")[0];
    if (lineString) {
      const coordinates = lineString.getElementsByTagName("coordinates")[0]?.textContent;
      if (coordinates) {
        const lineCoords = coordinates
          .trim()
          .split(" ")
          .map((coord) => coord.split(",").map(Number));
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: lineCoords,
          },
          properties: { name },
        });
      }
    }
  }

  return {
    type: "FeatureCollection",
    features,
  };
};

export const getSummary = (kmlData) => {
  const counts = {};
  kmlData.features.forEach((feature) => {
    const type = feature.geometry.type;
    counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
};

export const getDetailedInfo = (kmlData) => {
  return kmlData.features.map((feature) => {
    const type = feature.geometry.type;
    const length = calculateLength(feature.geometry.coordinates);
    return { type, length };
  });
};

const calculateLength = (coords) => {
  let length = 0;
  for (let i = 1; i < coords.length; i++) {
    const [x1, y1] = coords[i - 1];
    const [x2, y2] = coords[i];
    length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  return length;
};