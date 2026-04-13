import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const InteractiveMap = () => {
    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const defaultCenter = {
        lat: 27.5330, // Example latitude for Sikkim
        lng: 88.6139  // Example longitude for Sikkim
    };

    const monasteries = [
        { id: 1, name: "Rumtek Monastery", location: { lat: 27.3350, lng: 88.6170 } },
        { id: 2, name: "Enchey Monastery", location: { lat: 27.3300, lng: 88.6120 } },
        { id: 3, name: "Pemayangtse Monastery", location: { lat: 27.2980, lng: 88.6350 } },
        // Add more monasteries as needed
    ];

    return (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={10}
                center={defaultCenter}
            >
                {monasteries.map(monastery => (
                    <Marker key={monastery.id} position={monastery.location} title={monastery.name} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default InteractiveMap;