import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 39.8283, // Default center coordinates (United States)
  lng: -98.5795,
};

const MapContainer = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [filter, setFilter] = useState(null);




  // Function to handle marker click
  const handleMarkerClick = (marker) => {
    // Add your logic to display the treatment center details or navigate to its page
     setSelectedMarker(marker);
     getNearbyTreatmentCenters(marker.position, filter);
  };


  // Function to handle filter change
  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
  };


  // Function to retrieve nearby treatment centers based on the clicked location
 const getNearbyTreatmentCenters = async (location) => {
     const { lat, lng } = location;

 
    try{
      const response = await fetch(`/api/treatment-centers?lat=${lat}&lng=${lng}`);
    
     
      const data = await response.json();
      
      // Extract the coordinates of nearby treatment centers from the response
      const newMarkers = data.results.map((result) => ({
        id: result.place_id,
        name: result.name,
        address: result.vicinity,
        position: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        openingHours: result.opening_hours? result.opening_hours.open_now : null,
        photos: result.photos || [],
        businessStatus: result.business_status || null,
        types: result.types || null,


      
      }));

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error retrieving treatment centers:', error);
    }
  };

  // Function to handle map click
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    const newMarker = {
        id: null,
        name: null,
        address: null,
        position: { lat, lng },
        openingHours: null,
        photos: [],
        businessStatus: null,
        types: null,
 
      };
   
    setMarkers([...markers, newMarker]);

    const clickedLocation = { lat, lng };
    getNearbyTreatmentCenters(clickedLocation);
  };

  return (
    
   
    <LoadScript googleMapsApiKey="AIzaSyB8rftmN6uSRVTYRfpFPAFcR5w9qywKZY4">
       <div>
       <label htmlFor="filter">Select Filter:</label>
      <select id="filter" onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="health">Mental Health</option>
        <option value="health">Substance Use</option>
        <option value="health">Health Care Centers</option>
        <option value="health">Buprenorphine Practitioners</option>
        <option value="health">Opioid Treatment Programs</option>
      </select>

      <br />
      <br />
      
    </div>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4} onClick={handleMapClick}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              <p>{selectedMarker.address}</p>
             {selectedMarker.openingHours  && (
                    <div>
                      <h3>Opening Hours</h3>
                       <p>Open Now: {selectedMarker.openingHours.opening_hours.open_now ? 'Yes' : 'No'}</p> 
                    </div>
             )}
              {selectedMarker.photos.length > 0 && (
                <div>
                  <h4>Photos</h4>
                  <div>
                    {selectedMarker.photos.map((photo, index) => (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        key={index}
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyBGcMB5sQ7MZ7RpRLCWKqEdHzI3qj70EBM`}
                        alt={`Photo ${index + 1}`}
                        style={{ width: '100px', height: '100px', marginRight: '10px' }}
                      />
                    ))}
                    </div>
                </div>
              )}
                    {selectedMarker.businessStatus && (
                <p>Business Status: {selectedMarker.businessStatus}</p>
              )}
                    {selectedMarker.types && (
                <p>Types: {selectedMarker.types.join(', ')}</p>
              )}

            
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
    
  );
};

export default MapContainer;



