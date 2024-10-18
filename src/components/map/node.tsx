import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Node as NodeData } from '@/lib/types'

// Props for the Node component
interface NodeProps {
  data: NodeData
  onClick: () => void
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
      position={[data.latitude, data.longitude]}
      icon={NodeIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div>
          <h3>{data.name}</h3>
          <p>{data.description}</p>
          <p>Type: {data.node_type}</p>
          <p>Location: {data.location}</p>
          {data.links.length > 0 && (
            <div>
              <p>Links:</p>
              <ul>
                {data.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

export default Node
