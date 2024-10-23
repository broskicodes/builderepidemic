import { Marker, Popup } from 'react-leaflet'
import { NodeColorMap, Node as NodeData } from '@/lib/types'
import L from 'leaflet'

// Props for the Node component
interface NodeProps {
  data: NodeData
  onClick: () => void
  isOverlapping: boolean
}

// Custom icon for nodes
// const NodeIcon = L.icon({
//   iconUrl: '/node-icon.svg',
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -40],
// })

const createColoredNodeIcon = (color: string) => {  
  return L.icon({
    iconUrl: `/node-icon.svg?color=${color}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

  export default function Node({ data, onClick, isOverlapping }: NodeProps) {
    return (
    <Marker
      position={[data.latitude, data.longitude]}
      icon={createColoredNodeIcon(NodeColorMap[data.node_type])}
      eventHandlers={{
        click: onClick,
      }}
    >
      {!isOverlapping && (
        <Popup>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">{data.name}</h3>
              <span className="text-sm text-gray-500">{data.description}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm p-0 m-0"><span className="font-bold">Event Type:</span> {data.node_type.charAt(0).toUpperCase() + data.node_type.slice(1)}</span>
              <span className="text-sm p-0 m-0"><span className="font-bold">Location:</span> {data.location}</span>
              <div className="flex flex-col space-y-1">
              {data.links.length > 0 && (
                <div>
                  <span className="text-sm p-0 m-0"><span className="font-bold">Links:</span></span>
                  <ul className="list-disc list-inside space-y-1">
                    {data.links.map((link, index) => (
                      <li key={index} className="text-sm">
                        <a href={link.url} target="_blank" rel="noopener noreferrer"><span className="text-primary hover:underline">{link.name}</span></a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  )
}
