"use client"

import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { useState, useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

export default function Map({ pickup, destination }: { pickup: any, destination: any }) {
  const { isLoaded } = useGoogleMaps()

  const [directions, setDirections] = useState(null)

  useEffect(() => {
    if (pickup && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            // @ts-ignore
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [pickup, destination]);

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pickup || defaultCenter}
        zoom={15}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
  ) : <></>
}
