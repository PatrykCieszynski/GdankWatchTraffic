import { useState, useEffect } from "react";
import MapGL, {Marker, Popup} from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css'

function App() {

  const [viewport, setViewport] = useState({
    latitude: 54.372158,
    longitude: 18.638306,
    width: "100vw",
    height: "100vh",
    zoom: 11.3
  });

  const [vehicles, setVehicles] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const getVehicles = () => fetch(
    "https://ckan2.multimediagdansk.pl/gpsPositions").then(
      res => res.json()
      ).then(
        data => setVehicles(data.Vehicles)
        );

  useEffect(() => {
    getVehicles();
    const interval = setInterval(() => {
      getVehicles();
      console.log("Position updated")
    }, 20100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
    <MapGL
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1Ijoic2hlYWtpIiwiYSI6ImNrbmF0bW5zZTFrcHgydW54dzlic2QwdTAifQ.aKhzMet_3QnkP8_llj4uYQ"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={viewport => { setViewport(viewport); }}
    >
    {vehicles.map(vehicle => (
      vehicle.Line < 12 ?
      <Marker
      key={vehicle.VehicleCode}
      latitude={vehicle.Lat}
      longitude={vehicle.Lon}
      >
      <button className="ui icon button" style={{backgroundColor:"red", borderRadius: "75%", fontSize:"10px"}} onClick={marker => {
          marker.preventDefault();
          setSelectedMarker(vehicle);}}>
            <i className="train icon" style={{color:"white"}}>
      </i></button>
      </Marker> :
      <Marker
        key={vehicle.VehicleCode}
        latitude={vehicle.Lat}
        longitude={vehicle.Lon}
      >
      <button className="ui icon button" style={{backgroundColor:"red", borderRadius: "75%", fontSize:"10px"}} onClick={marker => {
            marker.preventDefault();
            setSelectedMarker(vehicle);}}>
              <i className="bus icon" style={{color:"white"}}>
        </i></button>
      </Marker>
    ))}
    {selectedMarker ? (
      <Popup
        latitude={selectedMarker.Lat}
        longitude={selectedMarker.Lon}
        onClose={() => { setSelectedMarker(null); }}
        >
      <div>
        <h2>Linia: {selectedMarker.Line}</h2>
        <p>Prędkość: {selectedMarker.Speed}</p>
        <p>Lat: {selectedMarker.Lon}</p>
        <p>Lon:{selectedMarker.Lat}</p>
      </div>
      </Popup>
      ) : null}
    </MapGL>
  </div>
  );
}

export default App;