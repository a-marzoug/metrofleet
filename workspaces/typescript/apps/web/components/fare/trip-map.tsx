"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TripMapProps {
  pickup: { lat: number; lng: number } | null;
  dropoff: { lat: number; lng: number } | null;
}

const createIcon = (color: string, label: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 0 15px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

export const TripMap = ({ pickup, dropoff }: TripMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [40.7128, -73.956],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(mapRef.current);

    layerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;

    layerRef.current.clearLayers();

    if (pickup) {
      L.marker([pickup.lat, pickup.lng], { icon: createIcon("#2dd4bf", "P") }).addTo(layerRef.current);
    }

    if (dropoff) {
      L.marker([dropoff.lat, dropoff.lng], { icon: createIcon("#a855f7", "D") }).addTo(layerRef.current);
    }

    if (pickup && dropoff) {
      L.polyline([[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]], {
        color: "#2dd4bf",
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 15",
        lineCap: "round",
      }).addTo(layerRef.current);

      const bounds = L.latLngBounds([[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]);
      mapRef.current.fitBounds(bounds, { padding: [60, 60] });
    } else if (pickup) {
      mapRef.current.setView([pickup.lat, pickup.lng], 13);
    } else if (dropoff) {
      mapRef.current.setView([dropoff.lat, dropoff.lng], 13);
    }
  }, [pickup, dropoff]);

  return (
    <div className="relative h-full rounded-xl overflow-hidden border border-border">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-4 text-xs border border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          <span>Dropoff</span>
        </div>
      </div>
    </div>
  );
};
