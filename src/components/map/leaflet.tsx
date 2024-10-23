'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngBoundsExpression } from 'leaflet'
import Node from './node'
import { Node as NodeData } from '@/lib/types'
import posthog from 'posthog-js'

// Define the maximum bounds (adjust these coordinates as needed)
const maxBounds: LatLngBoundsExpression = [
  [-90, -180], // Southwest coordinates
  [90, 180]    // Northeast coordinates
];

export default function WorldMap() {
  const [isMounted, setIsMounted] = useState(false)
  const [nodes, setNodes] = useState<NodeData[]>([])

  useEffect(() => {
    setIsMounted(true)
    fetchNodes()
  }, [])

  const fetchNodes = async () => {
    try {
      const response = await fetch('/api/nodes')
      if (!response.ok) {
        throw new Error('Failed to fetch nodes')
      }
      const data = await response.json()
      setNodes(data)
    } catch (error) {
      console.error('Error fetching nodes:', error)
    }
  }

  const handleNodeClick = (node: NodeData) => {
    posthog.capture('node-clicked', { node: {
      name: node.name,
      location: node.location,
      node_type: node.node_type,
    } })
  }

  if (!isMounted) {
    return null // or a loading spinner
  }

  return (
    <div className="h-screen w-full z-30">
      <MapContainer
        center={[0, 0]}
        zoom={2}
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
          <Node key={node.id} data={node} onClick={() => { handleNodeClick(node) }} />
        ))}
      </MapContainer>
    </div>
  )
}

