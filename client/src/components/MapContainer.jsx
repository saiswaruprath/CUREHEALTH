import React, { useRef, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { Card, ListGroup } from 'react-bootstrap';
import './MapContainer.css'; 
import noimg from '../assets/images/no-img.png'

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  border: 'solid black 0.75px',
  width: '40%',
  minHeight: '300px',
  minWidth: '300px',
  margin: '0px',
};

const containerStyle_fullView = {
  display: 'flex',
  flexDirection: 'row',
  border: 'solid black 0.75px',
  width: '75%',
  minHeight: '300px',
  minWidth: '300px',
  margin: '0px',
  position: 'absolute',
  height: '100%',
  top: '0',
  left: '25%',
  zIndex: '0'
};


// const MapMarker = () => <div className="map-marker">📍</div>;
// const GOOGLE_MAPS_API_KEY = "AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU";

const MapContainer = () => {
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [autocomplete, setautocomplete] = useState(/** @type google.maps.places.Autocomplete */(null))
  const [viewMode, setViewMode] = useState('interactive');

  // var [selectedLocation, setSelectedLocation] = useRef(null);
  var selectedLocation = useRef();
  // eslint-disable-next-line no-unused-vars
  var viewModeRef = useRef();
  const [center] = useState({ lat: 39.8283, lng: -98.5795 });

  const [filter, setFilter] = useState(null);
  // const [libraries] = useState(['places']);

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: "AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU",
  //   libraries,

  // })

  // Function to handle marker click
  const handleMarkerClick = (marker) => {
    // Add your logic to display the treatment center details or navigate to its page
    setSelectedMarker(marker);
    // getNearbyTreatmentCenters(marker.position, filter);
  };


  // Function to handle filter change
  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
  };

  const changeMapMarkerLocation = (event) => {
    if (selectedLocation.current.value === "") {
      alert('User must enter location');
      return;
    }
    try {
      var place = autocomplete.getPlace();
      var selectedlat = place.geometry.location.lat();
      var selectedlng = place.geometry.location.lng();
    } catch (error) {
      alert('Please choose the location correctly');
      return;
    }
    map.panTo({ lat: selectedlat, lng: selectedlng });
    map.setZoom(10);
    getNearbyTreatmentCenters({ lat: selectedlat, lng: selectedlng }, filter);
  };

  const showPlaceDetails = async (place) => {
    // const { lat, lng } = place.position;
    // const user_input = place.name;
    // const response = await fetch(`/api/know-more-details?lat=${lat}&lng=${lng}&user_input=${user_input}`);
    // const data = await response.json();
    map.panTo(place.position);
    map.setZoom(15);
    setSelectedMarker(place);
  };

  const renderViewMode = (viewModeInput) => {
    viewModeRef = viewModeInput;
    setViewMode(viewModeInput);
    setMarkers([]);
  };


  // Function to retrieve nearby treatment centers based on the clicked location
  const getNearbyTreatmentCenters = async (location) => {
    const { lat, lng } = location;


    try {
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
        openingHours: result.openingHours ? 'Open' : 'Closed',
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
    var lat;
    var lng;
    if (event.lat && event.lng) {
      lat = event.lat;
      lng = event.lng;
    }
    else {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
    }

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

  // if (!isLoaded) {
  //   return <div>Is Loading!!</div>;
  // }

  return (
    <div className='findtreatment'>
      <div className="header">
        <div className="findtreatment--container-mode btn-group fit-content" role="group" aria-label="Find Treatment View Mode">
          <input type="radio" className="btn-check" name="viewMode" id="btnradio1" value="interactive" onClick={(e) => { renderViewMode(e.target.value) }} defaultChecked></input>
          <label className="btn btn-light btn-outline-dark p-1.5" htmlFor="btnradio1">Interactive View</label>
          <input type="radio" className="btn-check" name="viewMode" id="btnradio2" value="map" onChange={(e) => { renderViewMode(e.target.value) }}></input>
          <label className="btn btn-light btn-outline-dark p-1.5" htmlFor="btnradio2">Map View</label>
          {/* <input type="radio" className="btn-check" name="viewMode" id="btnradio3" value="view" onChange={(e) => { renderViewMode(e.target.value) }}></input>
          <label className="btn btn-light btn-outline-dark p-1.5" htmlFor="btnradio3">List View</label> */}
        </div>
        <div className='findtreatment-container--head'>
          <h3>Search Treatment Center</h3>
        </div>
      </div>
      {viewMode === 'interactive' ? <><div className='findtreatment-container'>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={3.5} onClick={handleMapClick} onLoad={map => setMap(map)}>
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
                {selectedMarker.openingHours && (
                  <div>
                    <h3>Opening Hours</h3>
                    <p>Open Now: {selectedMarker.openingHours === 'Open' ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {/* {selectedMarker.photos.length > 0 && (
                  <div>
                    <h4>Photos</h4>
                    <div>
                      {selectedMarker.photos.map((photo, index) => (
                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                        <img
                          key={index}
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photos[0].photo_reference}&key=AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU`}
                          alt={`Photo ${index + 1}`}
                          style={{ width: '100px', height: '100px', marginRight: '10px' }}
                        />
                      ))}
                    </div>
                  </div>
                )} */}
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
        <div className='findtreatment-location--container'>
          <div className='findtreatment-location--header'>
            <b>Enter your location here:</b>
          </div>
          <div className='findtreatment-location--seachbox'>
            <Autocomplete onLoad={autocomplete => setautocomplete(autocomplete)}>
              {/* <label htmlFor="search-treatment"> */}
              <input className='findtreatment-location--seachbox-input' id='search-treatment' type='text' ref={selectedLocation}></input>
              {/* </label> */}
            </Autocomplete>
            <button onClick={changeMapMarkerLocation}>Search</button>
          </div>
          {/* <div className='findtreatment-location--seachbox-advanced'>
            <label><input type='radio' name='distance' />State</label>
            <label><input type='radio' name='distance' />County</label>
            <div className='findtreatment-location--seachbox-distance'>
              <label><input type='radio' name='distance' />Distance</label>
              <select>
                <option value={5}>5miles</option>
                <option value={10}>10miles</option>
                <option value={15}>15miles</option>
                <option value={25}>25miles</option>
                <option value={50}>50miles</option>
                <option value={100}>100miles</option>
              </select>
            </div>
          </div> */}
          <div className='findtreatment-result--filter'>
            <label htmlFor="filter-type">Filter by:</label>
            <select id="filter-type" onChange={handleFilterChange}>
              <option value="">Choose a Facility Type(Default: All)</option>
              <option value="health">Mental Health</option>
              <option value="health">Substance Use</option>
              <option value="health">Health Care Centers</option>
              <option value="health">Buprenorphine Practitioners</option>
              <option value="health">Opioid Treatment Programs</option>
            </select>
          </div>
          {/* <div className='findtreatment-result--filter'>
            <label htmlFor="filter-type">Filter by:</label>
            <select id="filter-type" onChange={handleFilterChange}>
              <option value="">Choose a Facility Operation(Default: All)</option>
              <option value="topic">Public</option>
              <option value="topic">Private</option>
            </select>
          </div> */}
          {/* <div className='findtreatment-location--action'>
              <button>Search</button>
            </div> */}
        </div>
      </div>
        <hr></hr>
        <div className="findtreatment-result--container">
          <div className="findtreatment-result--title">
            {markers.length !== 0 ? <h3>Results</h3> : <div></div>}
          </div>
          <div className="findtreatment-result--title-caption">
            {markers.length !== 0 ? <i>{markers.length} results found</i> : <div></div>}
          </div>
          <div className="findtreatment-result--list-wrapper">
            {markers.map(function (e,index) {
              return <>
                <Card style={{ width: '30%' }} key={index}>
                  <Card.Body>
                    <Card.Title>{e.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{e.address}</Card.Subtitle>
                    {e.photos[0] !== undefined ? <Card.Img variant="top" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${e.photos[0]?.photo_reference}&key=AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU`} className='card-photo--present' /> : <Card.Img variant="top" src={noimg} height={200} className='border-bottom--075 min-height--50' />}
                    {/* <Card.Text>
                    Some quick example text to build on the card title.
                  </Card.Text> */}
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>Business Status: {e.businessStatus}</ListGroup.Item>
                      <ListGroup.Item>Is Open now? {e.openingHours === 'Open' ? 'Yes' : 'No'}</ListGroup.Item>
                    </ListGroup>
                    <br />
                    <Card.Link href="#">Know More</Card.Link>
                    {/* <Card.Link href="#">Another Link</Card.Link> */}
                  </Card.Body>
                </Card>
              </>;
            })}
          </div>
        </div></> : null}

      {viewMode === 'map' ? <><div className='findtreatment-container--mapView'>
        <GoogleMap
          mapContainerStyle={containerStyle_fullView}
          center={center}
          zoom={3.5}
          // onClick={handleMapClick}
          onLoad={map => setMap(map)}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}>
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
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{selectedMarker.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{selectedMarker.address}</Card.Subtitle>
                  {selectedMarker.openingHours && (<Card.Text>
                    <p>Open Now: {selectedMarker.openingHours === 'Open' ? 'Yes' : 'No'}</p>
                  </Card.Text>)}
                  {selectedMarker.types && (
                    <p>Types: {selectedMarker.types.join(', ')}</p>
                  )}
                  {/* <Card.Link href="#">Card Link</Card.Link> */}
                </Card.Body>
              </Card>
            </InfoWindow>
          )}
        </GoogleMap>
        <div className='findtreatment-location--mcontainer z-1'>
          <div className='findtreatment-location--seachbox'>
            <Autocomplete onLoad={autocomplete => setautocomplete(autocomplete)}>
              <input className='findtreatment-location--seachbox-input' id='search-treatment' type='text' ref={selectedLocation}></input>
            </Autocomplete>
            <button onClick={changeMapMarkerLocation}>Search</button>
          </div>
          <div className="findtreatment-result--container z-1">
            <div className="findtreatment-result--mtitle">
              {markers.length !== 0 ? <h3 className='m-0'>Results</h3> : <div></div>}
            </div>
            <div className="findtreatment-result--mtitle-caption">
              {markers.length !== 0 ? <small><i>{markers.length} results found</i></small> : <div></div>}
              <br /><br />
            </div>
            <div className="findtreatment-result--list-wrapper">
              {markers.map(function (e,index) {
                return <>
                  <div className="container p-0" key={index}>
                    <div className="card flex-row min-height-100">
                      <div className="card-header border-0 p-0">
                        {e.photos[0] !== undefined ? <Card.Img variant="right" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference=${e.photos[0]?.photo_reference}&key=AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU`} className='card-photo--mpresent mr-1' /> : <div className='card-photo--mnone m-1'><b>No photos found!</b></div>}
                      </div>
                      <div className="card-block p-0 w-100">
                        {/* <h4 className="card-title text-truncate max-width--250">{e.name}</h4> */}
                        {/* <p className="card-text mb-2 text-muted text-truncate max-width--250">{e.address}</p> */}
                        <Card.Title className='px-2'>{e.name}</Card.Title>
                        <Card.Subtitle className="px-2 mb-2 text-muted">{e.address}</Card.Subtitle>
                        <button className="btn btn-primary btn-sm flex flex-row know-more-btn" onClick={() => { showPlaceDetails(e) }}><i className="bi bi-info-circle"></i>go to</button>
                      </div>
                      {/* <div className="card-footer w-100 text-muted">
                        Is it Open Now? {e.openingHours === 'Open' ? 'Yes' : 'No'}
                      </div> */}
                    </div>
                  </div>
                </>;
              })}
            </div>
          </div>
        </div>
      </div>

      </> : null}
    </div>

  );
};

export default MapContainer;