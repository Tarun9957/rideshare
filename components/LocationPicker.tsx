"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation2, Search } from "lucide-react"

export default function LocationPicker() {
  const router = useRouter()
  const [pickup, setPickup] = useState("Current Location")
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
        // @ts-ignore
        handleSearch(description, lat, lng);
      });
    };

  const handleSearch = (destination: string, lat: number, lng: number) => {
    if (!destination.trim()) return
    
    const params = new URLSearchParams({
      pickup: pickup,
      destination: destination,
      destinationLat: lat.toString(),
      destinationLng: lng.toString(),
    })
    
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        params.set("pickupLat", latitude.toString());
        params.set("pickupLng", longitude.toString());
        router.push(`/booking?${params.toString()}`)
      });
    } else {
      router.push(`/booking?${params.toString()}`)
    }
  }

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <Card className="card-glass border-0 p-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Pickup Location</label>
            <Input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="mt-1 border-gray-200 focus:ring-blue-500"
              placeholder="Enter pickup location"
            />
          </div>
        </div>
        
        <div className="ml-4 border-l-2 border-gray-200 h-6"></div>
        
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
            <Navigation2 className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Destination</label>
            <div className="flex space-x-2 mt-1">
              <Input
                value={value}
                onChange={handleInput}
                disabled={!ready}
                className="flex-1 border-gray-200 focus:ring-blue-500"
                placeholder="Where are you going?"
              />
            </div>
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
          </div>
        </div>
      </div>
    </Card>
  )
}
