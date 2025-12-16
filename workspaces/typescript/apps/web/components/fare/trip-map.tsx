"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TripMapProps {
  pickup: { lat: number; lng: number } | null;
  dropoff: { lat: number; lng: number } | null;
}

export function TripMap({ pickup, dropoff }: TripMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ pickup?: L.CircleMarker; dropoff?: L.CircleMarker; line?: L.Polyline }>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [40.7128, -73.9560],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    if (markersRef.current.pickup) markersRef.current.pickup.remove();
    if (markersRef.current.dropoff) markersRef.current.dropoff.remove();
    if (markersRef.current.line) markersRef.current.line.remove();

    if (pickup) {
      markersRef.current.pickup = L.circleMarker([pickup.lat, pickup.lng], {
        radius: 12,
        fillColor: "#2dd4bf",
        color: "#2dd4bf",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(mapRef.current);

      // Add "P" label
      L.marker([pickup.lat, pickup.lng], {
        icon: L.divIcon({
          className: "custom-marker",
          html: '<div style="color:#042f2e;font-weight:bold;font-size:10px;text-align:center;line-height:24px;">P</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(mapRef.current);
    }

    if (dropoff) {
      markersRef.current.dropoff = L.circleMarker([dropoff.lat, dropoff.lng], {
        radius: 12,
        fillColor: "#f472b6",
        color: "#f472b6",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(mapRef.current);

      L.marker([dropoff.lat, dropoff.lng], {
        icon: L.divIcon({
          className: "custom-marker",
          html: '<div style="color:#042f2e;font-weight:bold;font-size:10px;text-align:center;line-height:24px;">D</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(mapRef.current);
    }

    if (pickup && dropoff) {
      markersRef.current.line = L.polyline(
        [
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng],
        ],
        { color: "#2dd4bf", weight: 3, opacity: 0.7, dashArray: "10, 10" }
      ).addTo(mapRef.current);

      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup) {
      mapRef.current.setView([pickup.lat, pickup.lng], 13);
    } else if (dropoff) {
      mapRef.current.setView([dropoff.lat, dropoff.lng], 13);
    }
  }, [pickup, dropoff]);

  return (
    <div className="relative h-full rounded-xl overflow-hidden border border-border">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-400" />
          <span>Dropoff</span>
        </div>
      </div>
    </div>
  );
}
