const fs = require('fs');

// Map provinces to their regions
const provinceToRegion = {
  // NCR
  "MetropolitanManila": { region: "NCR", name: "NCR", members: "4.2M", facilities: 892, coverage: "87%" },
  
  // CAR
  "Abra": { region: "CAR", name: "CAR", members: "0.8M", facilities: 134, coverage: "75%" },
  "Apayao": { region: "CAR", name: "CAR", members: "0.8M", facilities: 134, coverage: "75%" },
  "Benguet": { region: "CAR", name: "CAR", members: "0.8M", facilities: 134, coverage: "75%" },
  "Ifugao": { region: "CAR", name: "CAR", members: "0.8M", facilities: 134, coverage: "75%" },
  "Kalinga": { region: "CAR", name: "CAR", members: "0.8M", facilities: 134, coverage: "75%" },
  "MountainProvince": { region: "CAR", name: "CAR", members: "0.8M", facilities: 134, coverage: "75%" },
  
  // Region I - Ilocos
  "IlocosNorte": { region: "Region I", name: "Region I", members: "1.8M", facilities: 245, coverage: "82%" },
  "IlocosSur": { region: "Region I", name: "Region I", members: "1.8M", facilities: 245, coverage: "82%" },
  "LaUnion": { region: "Region I", name: "Region I", members: "1.8M", facilities: 245, coverage: "82%" },
  "Pangasinan": { region: "Region I", name: "Region I", members: "1.8M", facilities: 245, coverage: "82%" },
  
  // Region II - Cagayan Valley
  "Batanes": { region: "Region II", name: "Region II", members: "1.2M", facilities: 178, coverage: "79%" },
  "Cagayan": { region: "Region II", name: "Region II", members: "1.2M", facilities: 178, coverage: "79%" },
  "Isabela": { region: "Region II", name: "Region II", members: "1.2M", facilities: 178, coverage: "79%" },
  "NuevaVizcaya": { region: "Region II", name: "Region II", members: "1.2M", facilities: 178, coverage: "79%" },
  "Quirino": { region: "Region II", name: "Region II", members: "1.2M", facilities: 178, coverage: "79%" },
  
  // Region III - Central Luzon
  "Aurora": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  "Bataan": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  "Bulacan": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  "NuevaEcija": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  "Pampanga": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  "Tarlac": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  "Zambales": { region: "Region III", name: "Region III", members: "3.1M", facilities: 456, coverage: "85%" },
  
  // Region IV-A - CALABARZON
  "Batangas": { region: "Region IV-A", name: "Region IV-A", members: "4.5M", facilities: 623, coverage: "88%" },
  "Cavite": { region: "Region IV-A", name: "Region IV-A", members: "4.5M", facilities: 623, coverage: "88%" },
  "Laguna": { region: "Region IV-A", name: "Region IV-A", members: "4.5M", facilities: 623, coverage: "88%" },
  "Quezon": { region: "Region IV-A", name: "Region IV-A", members: "4.5M", facilities: 623, coverage: "88%" },
  "Rizal": { region: "Region IV-A", name: "Region IV-A", members: "4.5M", facilities: 623, coverage: "88%" },
  
  // Region IV-B - MIMAROPA
  "Marinduque": { region: "Region IV-B", name: "Region IV-B", members: "1.1M", facilities: 167, coverage: "78%" },
  "OccidentalMindoro": { region: "Region IV-B", name: "Region IV-B", members: "1.1M", facilities: 167, coverage: "78%" },
  "OrientalMindoro": { region: "Region IV-B", name: "Region IV-B", members: "1.1M", facilities: 167, coverage: "78%" },
  "Palawan": { region: "Region IV-B", name: "Region IV-B", members: "1.1M", facilities: 167, coverage: "78%" },
  "Romblon": { region: "Region IV-B", name: "Region IV-B", members: "1.1M", facilities: 167, coverage: "78%" },
  
  // Region V - Bicol
  "Albay": { region: "Region V", name: "Region V", members: "2.3M", facilities: 312, coverage: "81%" },
  "CamarinesNorte": { region: "Region V", name: "Region V", members: "2.3M", facilities: 312, coverage: "81%" },
  "CamarinesSur": { region: "Region V", name: "Region V", members: "2.3M", facilities: 312, coverage: "81%" },
  "Catanduanes": { region: "Region V", name: "Region V", members: "2.3M", facilities: 312, coverage: "81%" },
  "Masbate": { region: "Region V", name: "Region V", members: "2.3M", facilities: 312, coverage: "81%" },
  "Sorsogon": { region: "Region V", name: "Region V", members: "2.3M", facilities: 312, coverage: "81%" },
  
  // Region VI - Western Visayas
  "Aklan": { region: "Region VI", name: "Region VI", members: "2.8M", facilities: 398, coverage: "83%" },
  "Antique": { region: "Region VI", name: "Region VI", members: "2.8M", facilities: 398, coverage: "83%" },
  "Capiz": { region: "Region VI", name: "Region VI", members: "2.8M", facilities: 398, coverage: "83%" },
  "Guimaras": { region: "Region VI", name: "Region VI", members: "2.8M", facilities: 398, coverage: "83%" },
  "Iloilo": { region: "Region VI", name: "Region VI", members: "2.8M", facilities: 398, coverage: "83%" },
  "NegrosOccidental": { region: "Region VI", name: "Region VI", members: "2.8M", facilities: 398, coverage: "83%" },
  
  // Region VII - Central Visayas
  "Bohol": { region: "Region VII", name: "Region VII", members: "3.2M", facilities: 445, coverage: "86%" },
  "Cebu": { region: "Region VII", name: "Region VII", members: "3.2M", facilities: 445, coverage: "86%" },
  "NegrosOriental": { region: "Region VII", name: "Region VII", members: "3.2M", facilities: 445, coverage: "86%" },
  "Siquijor": { region: "Region VII", name: "Region VII", members: "3.2M", facilities: 445, coverage: "86%" },
  
  // Region VIII - Eastern Visayas
  "Biliran": { region: "Region VIII", name: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%" },
  "EasternSamar": { region: "Region VIII", name: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%" },
  "Leyte": { region: "Region VIII", name: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%" },
  "NorthernSamar": { region: "Region VIII", name: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%" },
  "Samar": { region: "Region VIII", name: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%" },
  "SouthernLeyte": { region: "Region VIII", name: "Region VIII", members: "1.9M", facilities: 267, coverage: "80%" },
  
  // Region IX - Zamboanga Peninsula
  "ZamboangadelNorte": { region: "Region IX", name: "Region IX", members: "1.5M", facilities: 223, coverage: "77%" },
  "ZamboangadelSur": { region: "Region IX", name: "Region IX", members: "1.5M", facilities: 223, coverage: "77%" },
  "ZamboangaSibugay": { region: "Region IX", name: "Region IX", members: "1.5M", facilities: 223, coverage: "77%" },
  
  // Region X - Northern Mindanao
  "Bukidnon": { region: "Region X", name: "Region X", members: "1.8M", facilities: 289, coverage: "81%" },
  "Camiguin": { region: "Region X", name: "Region X", members: "1.8M", facilities: 289, coverage: "81%" },
  "LanaodelNorte": { region: "Region X", name: "Region X", members: "1.8M", facilities: 289, coverage: "81%" },
  "MisamisOccidental": { region: "Region X", name: "Region X", members: "1.8M", facilities: 289, coverage: "81%" },
  "MisamisOriental": { region: "Region X", name: "Region X", members: "1.8M", facilities: 289, coverage: "81%" },
  
  // Region XI - Davao
  "CompostelaValley": { region: "Region XI", name: "Region XI", members: "2.1M", facilities: 334, coverage: "84%" },
  "DavaodelNorte": { region: "Region XI", name: "Region XI", members: "2.1M", facilities: 334, coverage: "84%" },
  "DavaodelSur": { region: "Region XI", name: "Region XI", members: "2.1M", facilities: 334, coverage: "84%" },
  "DavaoOriental": { region: "Region XI", name: "Region XI", members: "2.1M", facilities: 334, coverage: "84%" },
  
  // Region XII - SOCCSKSARGEN
  "NorthCotabato": { region: "Region XII", name: "Region XII", members: "1.3M", facilities: 198, coverage: "76%" },
  "Sarangani": { region: "Region XII", name: "Region XII", members: "1.3M", facilities: 198, coverage: "76%" },
  "SouthCotabato": { region: "Region XII", name: "Region XII", members: "1.3M", facilities: 198, coverage: "76%" },
  "SultanKudarat": { region: "Region XII", name: "Region XII", members: "1.3M", facilities: 198, coverage: "76%" },
  
  // Region XIII - Caraga
  "AgusandelNorte": { region: "Caraga", name: "Caraga", members: "1.1M", facilities: 167, coverage: "78%" },
  "AgusandelSur": { region: "Caraga", name: "Caraga", members: "1.1M", facilities: 167, coverage: "78%" },
  "DinagatIslands": { region: "Caraga", name: "Caraga", members: "1.1M", facilities: 167, coverage: "78%" },
  "SurigaodelNorte": { region: "Caraga", name: "Caraga", members: "1.1M", facilities: 167, coverage: "78%" },
  "SurigaodelSur": { region: "Caraga", name: "Caraga", members: "1.1M", facilities: 167, coverage: "78%" },
  
  // BARMM
  "Basilan": { region: "BARMM", name: "BARMM", members: "1.2M", facilities: 156, coverage: "72%" },
  "LanaodelSur": { region: "BARMM", name: "BARMM", members: "1.2M", facilities: 156, coverage: "72%" },
  "Maguindanao": { region: "BARMM", name: "BARMM", members: "1.2M", facilities: 156, coverage: "72%" },
  "Sulu": { region: "BARMM", name: "BARMM", members: "1.2M", facilities: 156, coverage: "72%" },
  "Tawi-Tawi": { region: "BARMM", name: "BARMM", members: "1.2M", facilities: 156, coverage: "72%" },
};

// Read GADM province data
const gadmData = JSON.parse(fs.readFileSync('./public/data/philippines-regions-accurate.json', 'utf8'));

// Group provinces by region
const regionFeatures = {};
const unmatchedProvinces = [];

gadmData.features.forEach(feature => {
  const provinceName = feature.properties.NAME_1;
  const regionInfo = provinceToRegion[provinceName];
  
  if (regionInfo) {
    const regionKey = regionInfo.region;
    
    if (!regionFeatures[regionKey]) {
      regionFeatures[regionKey] = {
        type: "Feature",
        properties: {
          name: regionInfo.name,
          region: regionKey,
          members: regionInfo.members,
          facilities: regionInfo.facilities,
          coverage: regionInfo.coverage
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: []
        }
      };
    }
    
    // Add province geometry to region
    if (feature.geometry.type === "MultiPolygon") {
      regionFeatures[regionKey].geometry.coordinates.push(...feature.geometry.coordinates);
    } else if (feature.geometry.type === "Polygon") {
      regionFeatures[regionKey].geometry.coordinates.push([feature.geometry.coordinates]);
    }
  } else {
    unmatchedProvinces.push(provinceName);
  }
});

// Create final GeoJSON
const output = {
  type: "FeatureCollection",
  features: Object.values(regionFeatures)
};

// Write to file
fs.writeFileSync('./public/data/philippines-regions-merged.json', JSON.stringify(output, null, 2));
console.log('Successfully merged provinces into regions!');
console.log(`Created ${Object.keys(regionFeatures).length} regions`);
if (unmatchedProvinces.length > 0) {
  console.log('Unmatched provinces:', unmatchedProvinces);
}
