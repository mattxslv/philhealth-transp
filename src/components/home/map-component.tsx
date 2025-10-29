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

    const getColor = (coverage: string) => {
      const coverageNum = parseInt(coverage);
      if (coverageNum >= 85) return "#009a3d"; // PhilHealth green
      if (coverageNum >= 80) return "#06b04d"; // Lighter green
      return "#f59e0b"; // Yellow/amber for low coverage
    };

    // Create vector source and layer for regions
    const vectorSource = new VectorSource({
      url: "/data/philippines-regions-merged.json",
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const coverage = feature.get("coverage");
        const color = coverage ? getColor(coverage) : "#9ca3af";
        
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
        const coverage = feature.get("coverage");
        const color = coverage ? getColor(coverage) : "#9ca3af";
        
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

  const getColorForCoverage = (coverage: string) => {
    const coverageNum = parseInt(coverage);
    if (coverageNum >= 85) return "text-[#009a3d]"; // PhilHealth green
    if (coverageNum >= 80) return "text-[#06b04d]"; // Lighter green
    return "text-amber-500"; // Yellow
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[700px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700"
      />
      
      {/* Popup overlay */}
      <div
        ref={popupRef}
        className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 p-4 min-w-[250px] transition-opacity pointer-events-none ${
          popupInfo ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translate(-50%, calc(-100% - 15px))",
        }}
      >
        {popupInfo && (
          <div className="space-y-2">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {popupInfo.name}
              </h3>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Members:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{popupInfo.members}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Facilities:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {popupInfo.facilities?.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                <span className={`font-bold ${getColorForCoverage(popupInfo.coverage)}`}>
                  {popupInfo.coverage}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Popup arrow */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
