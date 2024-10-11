import React, { useState } from 'react';
import AdminSidebar from '../components/Admin/AdminSidebar';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import './CreateRoute.css';

// Default marker icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function CreateRoute() {
  const [routeName, setRouteName] = useState('');
  const [driver, setDriver] = useState('');
  const [stops, setStops] = useState([]);

  // Function to add a new stop with lat and lng
  const addStop = (lat, lng) => {
    setStops([...stops, { lat, lng }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const routeData = { routeName, driver, stops };
    console.log('Route Created:', routeData);
    // Submit logic (e.g., API call) goes here
  };

  // Component to handle clicks on the map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        addStop(lat, lng); // Add stop to state when map is clicked
      },
    });
    return null;
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <h2>Create Route</h2>
        <form onSubmit={handleSubmit} className="route-form">
          <div className="form-group">
            <label htmlFor="routeName">Route Name:</label>
            <input
              type="text"
              id="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Enter route name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="driver">Assign Driver:</label>
            <select
              id="driver"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              required
            >
              <option value="">Select Driver</option>
              <option value="Driver 1">Driver 1</option>
              <option value="Driver 2">Driver 2</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stopping Places (click on the map to add stops):</label>
            <MapContainer center={[7.8731, 80.7718]} zoom={7} className="map-container">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {stops.map((stop, index) => (
                <Marker key={index} position={[stop.lat, stop.lng]} />
              ))}
            </MapContainer>
          </div>

          <button type="submit" className="submit-btn">Create Route</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoute;
