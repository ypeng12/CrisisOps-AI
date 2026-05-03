import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SystemState } from '../types';

interface Props {
  state: Partial<SystemState>;
}

export const MapView: React.FC<Props> = ({ state }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const incidentLocation = state.location?.coordinates || [38.9912, -76.9370];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: incidentLocation,
      zoom: 16,
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

    const incidentIcon = L.divIcon({
      className: 'custom-incident-icon',
      html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px #ef4444;" class="animate-pulse"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker(incidentLocation, { icon: incidentIcon })
      .bindTooltip(`<b>${state.incident?.type || 'INCIDENT'}</b>`, { permanent: true, direction: 'top', className: 'tactical-tooltip' })
      .addTo(layerGroup);

    const isSecurityThreat = state.incident?.type.toLowerCase().includes('security') || state.incident?.type.toLowerCase().includes('枪');
    if (isSecurityThreat) {
      L.circle(incidentLocation, {
        radius: 200,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.1,
        weight: 1,
        dashArray: '5, 10'
      }).addTo(layerGroup);
    }

    const teamIcon = (type?: string) => L.divIcon({
      className: 'custom-team-icon',
      html: `<div style="background-color: ${type === 'Security' ? '#3b82f6' : type === 'Fire' ? '#f59e0b' : '#10b981'}; width: 12px; height: 12px; border-radius: 3px; border: 1px solid white;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    state.teams?.forEach(team => {
      if (!team.coordinates) return;
      
      L.marker(team.coordinates, { icon: teamIcon(team.type) })
        .bindTooltip(`${team.name}`, { permanent: false, direction: 'bottom', className: 'unit-tooltip' })
        .addTo(layerGroup);

      if (team.status === 'Assigned' || team.status === 'En Route') {
        L.polyline([team.coordinates, incidentLocation], {
          color: team.type === 'Security' ? '#3b82f6' : team.type === 'Fire' ? '#f59e0b' : '#10b981',
          weight: 2,
          dashArray: '5, 5',
          opacity: 0.8
        }).addTo(layerGroup);
      }
    });

    state.assets?.forEach(asset => {
      if (!asset.coordinates) return;
      L.circle(asset.coordinates, {
        radius: 12,
        color: asset.status === 'Operational' ? '#22c55e' : '#ef4444',
        fillOpacity: 0.3,
        weight: 1
      }).bindTooltip(`${asset.name}`, { permanent: false, direction: 'right' }).addTo(layerGroup);
    });

    map.panTo(incidentLocation, { animate: true });

  }, [state, incidentLocation]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border bg-[#111] relative min-h-[400px]">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      {/* TACTICAL LEGEND */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/85 backdrop-blur-md border border-white/10 p-3 rounded shadow-2xl pointer-events-none">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Tactical Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[9px] text-gray-300">INCIDENT SITE</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-sm bg-blue-500" />
             <span className="text-[9px] text-gray-300">SECURITY (POLICE)</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-sm bg-yellow-500" />
             <span className="text-[9px] text-gray-300">FIRE / INFRA</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-sm bg-green-500" />
             <span className="text-[9px] text-gray-300">MEDICAL UNITS</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-4 h-[1px] border-t border-dashed border-blue-400" />
             <span className="text-[9px] text-gray-300">ACTIVE DISPATCH ROUTE</span>
          </div>
        </div>
      </div>

      <style>{`
        .tactical-tooltip {
          background: rgba(239, 68, 68, 0.9) !important;
          color: white !important;
          border: none !important;
          font-weight: bold !important;
          font-size: 10px !important;
          border-radius: 2px !important;
          box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
        }
        .unit-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          color: #3b82f6 !important;
          border: 1px solid #3b82f6 !important;
          font-size: 8px !important;
          padding: 1px 4px !important;
        }
        .leaflet-container { background: #111 !important; }
      `}</style>
    </div>
  );
};
