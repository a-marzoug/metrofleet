export interface TaxiZone {
  id: number;
  borough: string;
  zone: string;
  serviceZone: string;
  lat: number;
  lng: number;
}

export const taxiZones: TaxiZone[] = [
  { id: 1, borough: "EWR", zone: "Newark Airport", serviceZone: "EWR", lat: 40.6895, lng: -74.1745 },
  { id: 4, borough: "Manhattan", zone: "Alphabet City", serviceZone: "Yellow Zone", lat: 40.7265, lng: -73.9815 },
  { id: 7, borough: "Queens", zone: "Astoria", serviceZone: "Boro Zone", lat: 40.7721, lng: -73.9176 },
  { id: 12, borough: "Manhattan", zone: "Battery Park", serviceZone: "Yellow Zone", lat: 40.7033, lng: -74.0170 },
  { id: 13, borough: "Manhattan", zone: "Battery Park City", serviceZone: "Yellow Zone", lat: 40.7116, lng: -74.0154 },
  { id: 24, borough: "Manhattan", zone: "Bloomingdale", serviceZone: "Yellow Zone", lat: 40.7980, lng: -73.9687 },
  { id: 33, borough: "Brooklyn", zone: "Brooklyn Heights", serviceZone: "Boro Zone", lat: 40.6960, lng: -73.9936 },
  { id: 43, borough: "Manhattan", zone: "Central Park", serviceZone: "Yellow Zone", lat: 40.7829, lng: -73.9654 },
  { id: 45, borough: "Manhattan", zone: "Chinatown", serviceZone: "Yellow Zone", lat: 40.7158, lng: -73.9970 },
  { id: 48, borough: "Manhattan", zone: "Clinton East", serviceZone: "Yellow Zone", lat: 40.7623, lng: -73.9874 },
  { id: 50, borough: "Manhattan", zone: "Clinton West", serviceZone: "Yellow Zone", lat: 40.7648, lng: -73.9936 },
  { id: 65, borough: "Brooklyn", zone: "Downtown Brooklyn/MetroTech", serviceZone: "Boro Zone", lat: 40.6930, lng: -73.9857 },
  { id: 68, borough: "Manhattan", zone: "East Chelsea", serviceZone: "Yellow Zone", lat: 40.7465, lng: -73.9960 },
  { id: 79, borough: "Manhattan", zone: "East Village", serviceZone: "Yellow Zone", lat: 40.7265, lng: -73.9815 },
  { id: 87, borough: "Manhattan", zone: "Financial District North", serviceZone: "Yellow Zone", lat: 40.7094, lng: -74.0110 },
  { id: 88, borough: "Manhattan", zone: "Financial District South", serviceZone: "Yellow Zone", lat: 40.7033, lng: -74.0120 },
  { id: 90, borough: "Manhattan", zone: "Flatiron", serviceZone: "Yellow Zone", lat: 40.7410, lng: -73.9896 },
  { id: 92, borough: "Queens", zone: "Flushing", serviceZone: "Boro Zone", lat: 40.7654, lng: -73.8318 },
  { id: 100, borough: "Manhattan", zone: "Garment District", serviceZone: "Yellow Zone", lat: 40.7536, lng: -73.9918 },
  { id: 107, borough: "Manhattan", zone: "Gramercy", serviceZone: "Yellow Zone", lat: 40.7368, lng: -73.9845 },
  { id: 113, borough: "Manhattan", zone: "Greenwich Village North", serviceZone: "Yellow Zone", lat: 40.7336, lng: -74.0027 },
  { id: 114, borough: "Manhattan", zone: "Greenwich Village South", serviceZone: "Yellow Zone", lat: 40.7295, lng: -74.0020 },
  { id: 125, borough: "Manhattan", zone: "Hudson Sq", serviceZone: "Yellow Zone", lat: 40.7270, lng: -74.0077 },
  { id: 129, borough: "Queens", zone: "Jackson Heights", serviceZone: "Boro Zone", lat: 40.7557, lng: -73.8831 },
  { id: 130, borough: "Queens", zone: "Jamaica", serviceZone: "Boro Zone", lat: 40.7028, lng: -73.7925 },
  { id: 132, borough: "Queens", zone: "JFK Airport", serviceZone: "Airports", lat: 40.6413, lng: -73.7781 },
  { id: 137, borough: "Manhattan", zone: "Kips Bay", serviceZone: "Yellow Zone", lat: 40.7420, lng: -73.9780 },
  { id: 138, borough: "Queens", zone: "LaGuardia Airport", serviceZone: "Airports", lat: 40.7769, lng: -73.8740 },
  { id: 140, borough: "Manhattan", zone: "Lenox Hill East", serviceZone: "Yellow Zone", lat: 40.7679, lng: -73.9590 },
  { id: 141, borough: "Manhattan", zone: "Lenox Hill West", serviceZone: "Yellow Zone", lat: 40.7679, lng: -73.9650 },
  { id: 142, borough: "Manhattan", zone: "Lincoln Square East", serviceZone: "Yellow Zone", lat: 40.7736, lng: -73.9832 },
  { id: 143, borough: "Manhattan", zone: "Lincoln Square West", serviceZone: "Yellow Zone", lat: 40.7736, lng: -73.9890 },
  { id: 144, borough: "Manhattan", zone: "Little Italy/NoLiTa", serviceZone: "Yellow Zone", lat: 40.7234, lng: -73.9955 },
  { id: 145, borough: "Queens", zone: "Long Island City/Hunters Point", serviceZone: "Boro Zone", lat: 40.7420, lng: -73.9560 },
  { id: 148, borough: "Manhattan", zone: "Lower East Side", serviceZone: "Yellow Zone", lat: 40.7150, lng: -73.9843 },
  { id: 151, borough: "Manhattan", zone: "Manhattan Valley", serviceZone: "Yellow Zone", lat: 40.7980, lng: -73.9650 },
  { id: 158, borough: "Manhattan", zone: "Meatpacking/West Village West", serviceZone: "Yellow Zone", lat: 40.7410, lng: -74.0080 },
  { id: 161, borough: "Manhattan", zone: "Midtown Center", serviceZone: "Yellow Zone", lat: 40.7549, lng: -73.9840 },
  { id: 162, borough: "Manhattan", zone: "Midtown East", serviceZone: "Yellow Zone", lat: 40.7549, lng: -73.9712 },
  { id: 163, borough: "Manhattan", zone: "Midtown North", serviceZone: "Yellow Zone", lat: 40.7614, lng: -73.9776 },
  { id: 164, borough: "Manhattan", zone: "Midtown South", serviceZone: "Yellow Zone", lat: 40.7484, lng: -73.9857 },
  { id: 166, borough: "Manhattan", zone: "Morningside Heights", serviceZone: "Yellow Zone", lat: 40.8100, lng: -73.9626 },
  { id: 170, borough: "Manhattan", zone: "Murray Hill", serviceZone: "Yellow Zone", lat: 40.7484, lng: -73.9776 },
  { id: 181, borough: "Brooklyn", zone: "Park Slope", serviceZone: "Boro Zone", lat: 40.6710, lng: -73.9814 },
  { id: 186, borough: "Manhattan", zone: "Penn Station/Madison Sq West", serviceZone: "Yellow Zone", lat: 40.7506, lng: -73.9935 },
  { id: 209, borough: "Manhattan", zone: "Seaport", serviceZone: "Yellow Zone", lat: 40.7068, lng: -74.0037 },
  { id: 211, borough: "Manhattan", zone: "SoHo", serviceZone: "Yellow Zone", lat: 40.7233, lng: -74.0030 },
  { id: 224, borough: "Manhattan", zone: "Stuy Town/Peter Cooper Village", serviceZone: "Yellow Zone", lat: 40.7317, lng: -73.9772 },
  { id: 229, borough: "Manhattan", zone: "Sutton Place/Turtle Bay North", serviceZone: "Yellow Zone", lat: 40.7580, lng: -73.9630 },
  { id: 230, borough: "Manhattan", zone: "Times Sq/Theatre District", serviceZone: "Yellow Zone", lat: 40.7580, lng: -73.9855 },
  { id: 231, borough: "Manhattan", zone: "TriBeCa/Civic Center", serviceZone: "Yellow Zone", lat: 40.7163, lng: -74.0086 },
  { id: 232, borough: "Manhattan", zone: "Two Bridges/Seward Park", serviceZone: "Yellow Zone", lat: 40.7134, lng: -73.9900 },
  { id: 233, borough: "Manhattan", zone: "UN/Turtle Bay South", serviceZone: "Yellow Zone", lat: 40.7489, lng: -73.9680 },
  { id: 234, borough: "Manhattan", zone: "Union Sq", serviceZone: "Yellow Zone", lat: 40.7359, lng: -73.9911 },
  { id: 236, borough: "Manhattan", zone: "Upper East Side North", serviceZone: "Yellow Zone", lat: 40.7794, lng: -73.9545 },
  { id: 237, borough: "Manhattan", zone: "Upper East Side South", serviceZone: "Yellow Zone", lat: 40.7679, lng: -73.9612 },
  { id: 238, borough: "Manhattan", zone: "Upper West Side North", serviceZone: "Yellow Zone", lat: 40.7957, lng: -73.9712 },
  { id: 239, borough: "Manhattan", zone: "Upper West Side South", serviceZone: "Yellow Zone", lat: 40.7870, lng: -73.9754 },
  { id: 246, borough: "Manhattan", zone: "West Chelsea/Hudson Yards", serviceZone: "Yellow Zone", lat: 40.7527, lng: -74.0020 },
  { id: 249, borough: "Manhattan", zone: "West Village", serviceZone: "Yellow Zone", lat: 40.7336, lng: -74.0027 },
  { id: 255, borough: "Brooklyn", zone: "Williamsburg (North Side)", serviceZone: "Boro Zone", lat: 40.7193, lng: -73.9533 },
  { id: 261, borough: "Manhattan", zone: "World Trade Center", serviceZone: "Yellow Zone", lat: 40.7127, lng: -74.0134 },
  { id: 262, borough: "Manhattan", zone: "Yorkville East", serviceZone: "Yellow Zone", lat: 40.7749, lng: -73.9495 },
  { id: 263, borough: "Manhattan", zone: "Yorkville West", serviceZone: "Yellow Zone", lat: 40.7749, lng: -73.9560 },
];

export const getZonesByBorough = () => {
  const grouped: Record<string, TaxiZone[]> = {};
  for (const zone of taxiZones) {
    if (!grouped[zone.borough]) grouped[zone.borough] = [];
    grouped[zone.borough].push(zone);
  }
  return grouped;
};

export const getZoneById = (id: number) => taxiZones.find((z) => z.id === id);

// Haversine formula to calculate distance between two points
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
