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
        className="w-full h-[700px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700"
      />
      
      {/* Popup overlay */}
      <div
        ref={popupRef}
        className={`absolute bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-md shadow-lg border border-gray-200/30 dark:border-gray-700/30 p-2 min-w-[160px] transition-all duration-200 pointer-events-none ${
          popupInfo ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          transform: "translate(-50%, calc(-100% - 12px))",
        }}
      >
        {popupInfo && (
          <div className="space-y-1.5">
            <div className="border-b border-gray-200/30 dark:border-gray-700/30 pb-1 text-center">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                {popupInfo.name}
              </h3>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-gray-600 dark:text-gray-400">Coverage</p>
                <p className="text-xs font-bold text-[#009a3d] dark:text-[#06b04d]">99.5%</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-gray-600 dark:text-gray-400">Members</p>
                <p className="text-[10px] font-semibold text-gray-900 dark:text-white">36.2M</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Popup arrow */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/70 dark:border-t-gray-800/70"></div>
        </div>
      </div>
    </div>
  );
}
