"use client";

import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import Overlay from "ol/Overlay";
import "ol/ol.css";

interface MapComponentProps {
  onRegionSelect: (region: string | null) => void;
}

interface RegionInfo {
  name: string;
  region: string;
  members: string;
  facilities: number;
  coverage: string;
}

export default function MapComponent({ onRegionSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [popupInfo, setPopupInfo] = useState<RegionInfo | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Unique color for each region
    const getColorByRegion = (regionName: string) => {
      const colorMap: { [key: string]: string } = {
        "NCR": "#009a3d",           // Dark Green
        "Region I": "#06b04d",      // Light Green
        "Region II": "#10b981",     // Emerald
        "Region III": "#14b8a6",    // Teal
        "Region IV-A": "#0ea5e9",   // Sky Blue
        "Region IV-B": "#3b82f6",   // Blue
        "Region V": "#6366f1",      // Indigo
        "Region VI": "#8b5cf6",     // Purple
        "Region VII": "#a855f7",    // Violet
        "Region VIII": "#d946ef",   // Fuchsia
        "Region IX": "#ec4899",     // Pink
        "Region X": "#f43f5e",      // Rose
        "Region XI": "#ef4444",     // Red
        "Region XII": "#f97316",    // Orange
        "Region XIII": "#f59e0b",   // Amber
        "CAR": "#eab308",           // Yellow
        "BARMM": "#84cc16",         // Lime
        "Caraga": "#22c55e"         // Green
      };
      
      return colorMap[regionName] || "#9ca3af"; // Gray fallback
    };

    // Create vector source and layer for regions
    const vectorSource = new VectorSource({
      url: "/data/philippines-regions-merged.json",
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const regionName = feature.get("name") || feature.get("region");
        const color = getColorByRegion(regionName);
        
        return new Style({
          fill: new Fill({
            color: color + "40", // Low opacity (0.25) for see-through effect
          }),
          stroke: new Stroke({
            color: "#ffffff",
            width: 1.5,
          }),
        });
      },
    });

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([121.7740, 12.8797]),
        zoom: 6,
      }),
    });

    mapInstanceRef.current = map;

    // Create popup overlay
    if (popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: false, // Disable auto-panning so map doesn't move
      });
      map.addOverlay(overlay);
      overlayRef.current = overlay;
    }

    // Add hover interaction to show popup
    let selectedFeature: any = null;

    map.on("pointermove", (evt) => {
      // Reset previous feature style
      if (selectedFeature) {
        selectedFeature.setStyle(undefined);
        selectedFeature = null;
      }

      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      
      if (feature) {
        selectedFeature = feature;
        const regionName = feature.get("name") || feature.get("region");
        const color = getColorByRegion(regionName);
        
        // Highlight on hover with slightly higher opacity
        (feature as any).setStyle(
          new Style({
            fill: new Fill({
              color: color + "70", // Medium opacity (0.44) on hover
            }),
            stroke: new Stroke({
              color: "#ffffff",
              width: 2,
            }),
          })
        );

        // Update popup info
        const name = feature.get("name");
        const region = feature.get("region");
        const members = feature.get("members");
        const facilities = feature.get("facilities");
        const coverageValue = feature.get("coverage");

        setPopupInfo({
          name,
          region,
          members,
          facilities,
          coverage: coverageValue,
        });

        if (overlayRef.current) {
          overlayRef.current.setPosition(evt.coordinate);
        }
        
        if (name) onRegionSelect(name);
      } else {
        // Hide popup when not hovering over any region
        setPopupInfo(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
        onRegionSelect(null);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [onRegionSelect]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[800px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700"
      />
      
      {/* Popup overlay */}
      <div
        ref={popupRef}
        className={`absolute bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl border-2 border-[#009a3d]/20 dark:border-[#06b04d]/20 p-3 min-w-[220px] transition-all duration-200 pointer-events-none ${
          popupInfo ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          transform: "translate(-50%, calc(-100% - 12px))",
        }}
      >
        {popupInfo && (
          <div className="space-y-2.5">
            {/* Region Header */}
            <div className="border-b-2 border-[#009a3d]/20 dark:border-[#06b04d]/20 pb-2">
              <h3 className="font-bold text-base text-gray-900 dark:text-white text-center">
                {popupInfo.name}
              </h3>
            </div>
            
            {/* Statistics Grid */}
            <div className="space-y-2">
              {/* Coverage */}
              <div className="flex items-center justify-between bg-[#009a3d]/5 dark:bg-[#06b04d]/10 rounded-md p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#009a3d] dark:bg-[#06b04d] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Coverage</p>
                </div>
                <p className="text-sm font-bold text-[#009a3d] dark:text-[#06b04d]">{popupInfo.coverage}</p>
              </div>
              
              {/* Members */}
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-md p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Members</p>
                </div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{popupInfo.members}</p>
              </div>
              
              {/* Facilities */}
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 rounded-md p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Facilities</p>
                </div>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{popupInfo.facilities?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Popup arrow */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
