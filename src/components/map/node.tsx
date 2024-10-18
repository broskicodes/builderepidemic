import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Define the type for our node data
export type NodeData = {
  id: number
  name: string
  lat: number
  lng: number
  info: string
}

// Props for the Node component
interface NodeProps {
  data: NodeData
  onClick: (node: NodeData) => void
}

// Custom icon for nodes
const NodeIcon = L.icon({
  iconUrl: '/node-icon.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

const Node: React.FC<NodeProps> = ({ data, onClick }) => {
  return (
    <Marker
      position={[data.lat, data.lng]}
      icon={NodeIcon}
      eventHandlers={{
        click: () => onClick(data),
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{data.name}</h3>
          <p>{data.info}</p>
        </div>
      </Popup>
    </Marker>
  )
}

export default Node
