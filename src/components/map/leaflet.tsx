"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression, LatLng, Map as LeafletMap } from "leaflet";
import Node from "./node";
import { Node as NodeData } from "@/lib/types";
import posthog from "posthog-js";

// Define the maximum bounds (adjust these coordinates as needed)
const maxBounds: LatLngBoundsExpression = [
  [-90, -180], // Southwest coordinates
  [90, 180], // Northeast coordinates
];

const OVERLAP_THRESHOLD = 20; // pixels

function NodeManager({
  nodes,
  onNodeClick,
}: {
  nodes: NodeData[];
  onNodeClick: (node: NodeData, isOverlapping: boolean) => void;
}) {
  const map = useMap();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleZoomEnd = () => forceUpdate({});
    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  const isOverlapping = (node: NodeData) => {
    const pixelPosition = map.latLngToContainerPoint(new LatLng(node.latitude, node.longitude));
    return nodes.some((otherNode) => {
      if (otherNode.id === node.id) return false;
      const otherPixelPosition = map.latLngToContainerPoint(
        new LatLng(otherNode.latitude, otherNode.longitude),
      );
      return pixelPosition.distanceTo(otherPixelPosition) < OVERLAP_THRESHOLD;
    });
  };

  return (
    <>
      {nodes.map((node) => (
        <Node
          key={node.id}
          data={node}
          onClick={() => onNodeClick(node, isOverlapping(node))}
          isOverlapping={isOverlapping(node)}
        />
      ))}
    </>
  );
}

export default function WorldMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }
      const data = await response.json();
      setNodes(data);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
  };

  const handleNodeClick = (node: NodeData, isOverlapping: boolean) => {
    posthog.capture("node-clicked", {
      node: {
        name: node.name,
        location: node.location,
        node_type: node.node_type,
      },
      isOverlapping,
    });

    if (isOverlapping && mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      let zoomIncrement;

      if (currentZoom <= 3) {
        zoomIncrement = 5;
      } else if (currentZoom <= 5) {
        zoomIncrement = 4;
      } else if (currentZoom <= 7) {
        zoomIncrement = 3;
      } else if (currentZoom <= 9) {
        zoomIncrement = 2;
      } else {
        zoomIncrement = 1;
      }

      const newZoom = Math.min(currentZoom + zoomIncrement, mapRef.current.getMaxZoom());
      mapRef.current.setView([node.latitude, node.longitude], newZoom);
    }
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="h-screen w-full z-30">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={12}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <NodeManager nodes={nodes} onNodeClick={handleNodeClick} />
      </MapContainer>
    </div>
  );
}
