import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { KMLReader, getSummary, getDetailedInfo } from "./KMLReader.jsx";

function App() {
  const [kmlData, setKmlData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const kmlContent = e.target.result;
        const parsedData = KMLReader(kmlContent);
        setKmlData(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleSummaryClick = () => {
    if (kmlData) {
      setSummary(getSummary(kmlData));
    }
  };

  const handleDetailedClick = () => {
    if (kmlData) {
      setDetailedInfo(getDetailedInfo(kmlData));
    }
  };

  return (
    <div>
      <h1>KML File Viewer</h1>
      <input type="file" accept=".kml" onChange={handleFileUpload} />
      <button onClick={handleSummaryClick}>Summary</button>
      <button onClick={handleDetailedClick}>Detailed</button>

      {summary && (
        <div>
          <h2>Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Element Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([type, count]) => (
                <tr key={type}>
                  <td>{type}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailedInfo && (
        <div>
          <h2>Detailed Information</h2>
          <ul>
            {detailedInfo.map((item, index) => (
              <li key={index}>
                {item.type}: {item.length.toFixed(2)} meters
              </li>
            ))}
          </ul>
        </div>
      )}

      {kmlData && (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON data={kmlData} />
        </MapContainer>
      )}
    </div>
  );
}

export default App;