import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SystemState } from '../types';
import { Loader2 } from 'lucide-react';

// Fix for Leaflet default icon issues
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  state: Partial<SystemState>;
}

// Map Event Handler to fix grey/black tiles issue
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    // Force leaflet to recalculate its container size after a small delay
    // this fixes the issue when map starts in a hidden/animated container
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView(center, 16, { animate: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [center, map]);

  return null;
};

export const MapView: React.FC<Props> = ({ state }) => {
  const [mapReady, setMapReady] = useState(false);
  const incidentLocation = state.location?.coordinates || [38.9912, -76.9370];
  const isSecurityThreat = state.incident?.type.toLowerCase().includes('security') || state.incident?.type.toLowerCase().includes('枪');

  const incidentIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px #ef4444;" class="animate-pulse"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  const teamIcon = (type?: string) => new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${type === 'Security' ? '#3b82f6' : '#f59e0b'}; width: 12px; height: 12px; border-radius: 3px; border: 1px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border bg-black relative min-h-[400px]">
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-panel z-[1001] gap-3">
          <Loader2 className="animate-spin text-accent" size={32} />
          <span className="text-[10px] font-mono text-textMuted uppercase tracking-widest text-white">Initializing Tactical Grid...</span>
        </div>
      )}

      <div className="absolute top-3 right-3 z-[1000] bg-black/80 backdrop-blur-md border border-border p-2 rounded text-[10px] font-mono text-white pointer-events-none shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> INCIDENT
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_5px_#3b82f6]" /> SECURITY UNIT
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-yellow-500" /> SUPPORT UNIT
        </div>
      </div>

      <MapContainer 
        center={incidentLocation} 
        zoom={16} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenReady={() => setMapReady(true)}
      >
        <MapController center={incidentLocation} />
        
        {/* Dark Mode Tile Layer */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Incident Marker */}
        <Marker position={incidentLocation} icon={incidentIcon}>
          <Popup>
            <div className="text-xs font-bold text-red-600">{state.incident?.type}</div>
            <div className="text-[10px]">{state.location?.name}</div>
          </Popup>
        </Marker>

        {/* Threat Corridor */}
        {isSecurityThreat && (
          <Circle 
            center={incidentLocation} 
            radius={200} 
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 1, dashArray: '5, 10' }} 
          />
        )}

        {/* Teams and Routes */}
        {state.teams?.map(team => {
          if (!team.coordinates) return null;
          const isAssigned = team.status === 'Assigned' || team.status === 'En Route';
          
          return (
            <React.Fragment key={team.id}>
              <Marker position={team.coordinates} icon={teamIcon(team.type)}>
                <Popup>
                  <div className="text-xs font-bold">{team.name}</div>
                  <div className="text-[10px]">Status: {team.status}</div>
                </Popup>
              </Marker>
              
              {isAssigned && (
                <Polyline 
                  positions={[team.coordinates, incidentLocation]} 
                  pathOptions={{ 
                    color: team.type === 'Security' ? '#3b82f6' : '#f59e0b', 
                    weight: 3, 
                    dashArray: '10, 10',
                    opacity: 0.8
                  }} 
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Asset Markers */}
        {state.assets?.map(asset => {
          if (!asset.coordinates) return null;
          return (
            <Circle 
              key={asset.id}
              center={asset.coordinates} 
              radius={20} 
              pathOptions={{ 
                color: asset.status === 'Operational' ? '#22c55e' : '#ef4444', 
                fillColor: asset.status === 'Operational' ? '#22c55e' : '#ef4444', 
                fillOpacity: 0.3,
                weight: 1
              }} 
            />
          );
        })}
      </MapContainer>
    </div>
  );
};
