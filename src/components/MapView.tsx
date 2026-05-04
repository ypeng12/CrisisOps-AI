import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SystemState } from '../types';
import { Wind, Thermometer, Droplets } from 'lucide-react';

interface Props {
  state: Partial<SystemState>;
}

export const MapView: React.FC<Props> = ({ state }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);

  const incidentLocation = state.location?.coordinates || [34.0628, -118.4414];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: incidentLocation,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    setTimeout(() => { map.invalidateSize(); }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Current Incident
    const incidentIcon = L.divIcon({
      className: 'custom-incident-icon',
      html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 20px #ef4444;" class="animate-pulse"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker(incidentLocation, { icon: incidentIcon })
      .bindTooltip(`<b>CURRENT SITE</b>`, { permanent: true, direction: 'top', className: 'tactical-tooltip' })
      .addTo(layerGroup);

    // PREDICTION LAYER (Visualizing fire spread or threat expansion)
    if (showPrediction) {
      L.circle(incidentLocation, {
        radius: 450,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.15,
        weight: 1,
        dashArray: '10, 10'
      }).bindTooltip('PREDICTED IMPACT (+15m)', { sticky: true }).addTo(layerGroup);
    }

    const teamIcon = (type?: string) => L.divIcon({
      className: 'custom-team-icon',
      html: `<div style="background-color: ${type === 'Security' ? '#3b82f6' : '#f59e0b'}; width: 12px; height: 12px; border-radius: 3px; border: 1px solid white;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    state.teams?.forEach(team => {
      if (!team.coordinates) return;
      L.marker(team.coordinates, { icon: teamIcon(team.type) })
        .bindTooltip(`${team.name}`, { direction: 'bottom' })
        .addTo(layerGroup);

      if (team.status === 'Assigned' || team.status === 'En Route') {
        L.polyline([team.coordinates, incidentLocation], {
          color: team.type === 'Security' ? '#3b82f6' : '#f59e0b',
          weight: 2,
          dashArray: '5, 5',
          opacity: 0.6
        }).addTo(layerGroup);
      }
    });

    state.assets?.forEach(asset => {
      if (!asset.coordinates) return;
      L.circle(asset.coordinates, {
        radius: 15,
        color: asset.status === 'Operational' ? '#22c55e' : '#ef4444',
        fillOpacity: 0.2,
        weight: 1
      }).addTo(layerGroup);
    });

    map.panTo(incidentLocation);

  }, [state, incidentLocation, showPrediction]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border bg-[#111] relative min-h-[400px]">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      {/* WEATHER OVERLAY */}
      <div className="absolute top-3 left-3 z-[1000] flex gap-2">
        <div className="bg-black/80 backdrop-blur-md border border-border p-2 rounded flex items-center gap-3 shadow-xl">
           <div className="flex items-center gap-1.5 text-blue-400">
             <Wind size={14} />
             <span className="text-[10px] font-mono font-bold">WNW 12mph</span>
           </div>
           <div className="w-px h-3 bg-white/10" />
           <div className="flex items-center gap-1.5 text-orange-400">
             <Thermometer size={14} />
             <span className="text-[10px] font-mono font-bold">78°F</span>
           </div>
           <div className="w-px h-3 bg-white/10" />
           <div className="flex items-center gap-1.5 text-cyan-400">
             <Droplets size={14} />
             <span className="text-[10px] font-mono font-bold">42%</span>
           </div>
        </div>
      </div>

      {/* TACTICAL CONTROLS */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => setShowPrediction(!showPrediction)}
          className={`px-3 py-1.5 rounded border text-[9px] font-bold tracking-widest transition-all ${showPrediction ? 'bg-orange-600 border-orange-500 text-white' : 'bg-black/80 border-border text-gray-400'}`}
        >
          {showPrediction ? 'DISABLE PROJECTION' : 'ENABLE PREDICTIVE LAYER'}
        </button>
      </div>

      <div className="absolute top-3 right-3 z-[1000] bg-black/80 backdrop-blur-md border border-border p-2 rounded text-[10px] font-mono text-white pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> TACTICAL SITE
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-blue-500" /> UNITS
        </div>
      </div>

      <style>{`
        .tactical-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          color: #ef4444 !important;
          border: 1px solid #ef4444 !important;
          font-weight: bold !important;
          font-size: 8px !important;
          padding: 1px 4px !important;
        }
        .leaflet-container { background: #111 !important; }
      `}</style>
    </div>
  );
};
