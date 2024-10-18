'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LatLngBoundsExpression } from 'leaflet'
import Node, { NodeData } from './node'

// Define the maximum bounds (adjust these coordinates as needed)
const maxBounds: LatLngBoundsExpression = [
  [-90, -180], // Southwest coordinates
  [90, 180]    // Northeast coordinates
];

// Sample data for nodes
const nodes: NodeData[] = [
  { id: 1, name: 'New York', lat: 40.7128, lng: -74.0060, info: 'The Big Apple' },
  { id: 2, name: 'London', lat: 51.5074, lng: -0.1278, info: 'Capital of England' },
  { id: 3, name: 'Tokyo', lat: 35.6762, lng: 139.6503, info: 'Capital of Japan' },
  { id: 4, name: 'Sydney', lat: -33.8688, lng: 151.2093, info: 'Largest city in Australia' },
  { id: 5, name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, info: 'Famous for Carnival' },
]

export function WorldMap() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // or a loading spinner
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[0, 0]}
        zoom={3}
        minZoom={2}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {nodes.map((node) => (
          <Node key={node.id} data={node} onClick={() => {}} />
        ))}
      </MapContainer>
    </div>
  )
}

// // Check if we're in a browser environment
// if (typeof window !== 'undefined') {
//   // Leaflet's default icon path is broken in production build
//   delete L.Icon.Default.prototype._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: '/marker-icon-2x.png',
//     iconUrl: '/marker-icon.png',
//     shadowUrl: '/marker-shadow.png',
//   });
// }

// export { L };
