// Curated London & UK pickup points with coordinates. These power instant
// suggestions and pricing; free-text addresses are geocoded on top of this list.
export const LOCATIONS = [
  // Airports
  { id: 'lhr', code: 'LHR', type: 'airport', name: 'Heathrow Airport', sub: 'Terminals 2, 3, 4 & 5', lat: 51.47, lng: -0.4543 },
  { id: 'lhr-t5', code: 'LHR', type: 'airport', name: 'Heathrow Terminal 5', sub: 'Heathrow Airport, TW6', lat: 51.4723, lng: -0.4887 },
  { id: 'lhr-t2', code: 'LHR', type: 'airport', name: 'Heathrow Terminal 2', sub: 'Heathrow Airport, TW6', lat: 51.4694, lng: -0.4513 },
  { id: 'lhr-t3', code: 'LHR', type: 'airport', name: 'Heathrow Terminal 3', sub: 'Heathrow Airport, TW6', lat: 51.4709, lng: -0.4589 },
  { id: 'lhr-t4', code: 'LHR', type: 'airport', name: 'Heathrow Terminal 4', sub: 'Heathrow Airport, TW6', lat: 51.4594, lng: -0.4466 },
  { id: 'lgw', code: 'LGW', type: 'airport', name: 'Gatwick Airport', sub: 'North & South Terminals', lat: 51.1537, lng: -0.1821 },
  { id: 'lcy', code: 'LCY', type: 'airport', name: 'London City Airport', sub: 'Royal Docks, E16', lat: 51.5048, lng: 0.0495 },
  { id: 'stn', code: 'STN', type: 'airport', name: 'Stansted Airport', sub: 'Essex, CM24', lat: 51.886, lng: 0.2389 },
  { id: 'ltn', code: 'LTN', type: 'airport', name: 'Luton Airport', sub: 'Bedfordshire, LU2', lat: 51.8747, lng: -0.3683 },
  { id: 'sen', code: 'SEN', type: 'airport', name: 'Southend Airport', sub: 'Essex, SS2', lat: 51.5714, lng: 0.6956 },
  { id: 'fab', code: 'FAB', type: 'fbo', name: 'Farnborough Airport (FBO)', sub: 'Private jet terminal, GU14', lat: 51.2758, lng: -0.7763 },
  { id: 'bqh', code: 'BQH', type: 'fbo', name: 'Biggin Hill Airport', sub: 'Private aviation, TN16', lat: 51.3308, lng: 0.0325 },
  { id: 'nht', code: 'NHT', type: 'fbo', name: 'RAF Northolt', sub: 'Private & state flights, UB5', lat: 51.553, lng: -0.4182 },
  { id: 'bhx', code: 'BHX', type: 'airport', name: 'Birmingham Airport', sub: 'West Midlands, B26', lat: 52.4539, lng: -1.748 },
  { id: 'man', code: 'MAN', type: 'airport', name: 'Manchester Airport', sub: 'Greater Manchester, M90', lat: 53.365, lng: -2.2728 },

  // Rail
  { id: 'stp', type: 'station', name: "St Pancras International", sub: 'Eurostar, N1C', lat: 51.5319, lng: -0.1263 },
  { id: 'kgx', type: 'station', name: "King's Cross Station", sub: 'Euston Road, N1', lat: 51.5308, lng: -0.1238 },
  { id: 'eus', type: 'station', name: 'Euston Station', sub: 'Euston Road, NW1', lat: 51.5282, lng: -0.1337 },
  { id: 'pad', type: 'station', name: 'Paddington Station', sub: 'Praed Street, W2', lat: 51.5154, lng: -0.1755 },
  { id: 'vic', type: 'station', name: 'Victoria Station', sub: 'Victoria, SW1', lat: 51.4952, lng: -0.1441 },
  { id: 'wat', type: 'station', name: 'Waterloo Station', sub: 'Waterloo, SE1', lat: 51.5031, lng: -0.1132 },
  { id: 'lst', type: 'station', name: 'Liverpool Street Station', sub: 'City of London, EC2', lat: 51.5178, lng: -0.0823 },
  { id: 'lbg', type: 'station', name: 'London Bridge Station', sub: 'Southwark, SE1', lat: 51.5052, lng: -0.0864 },

  // Ports
  { id: 'sou', type: 'port', name: 'Southampton Cruise Port', sub: 'Ocean, Mayflower, QEII & Horizon', lat: 50.8967, lng: -1.4044 },
  { id: 'dov', type: 'port', name: 'Dover Cruise Port', sub: 'Western Docks, CT17', lat: 51.1144, lng: 1.3047 },
  { id: 'pme', type: 'port', name: 'Portsmouth International Port', sub: 'Hampshire, PO2', lat: 50.8113, lng: -1.0907 },
  { id: 'har', type: 'port', name: 'Harwich International Port', sub: 'Essex, CO12', lat: 51.9471, lng: 1.2553 },
  { id: 'tlb', type: 'port', name: 'London Cruise Terminal, Tilbury', sub: 'Essex, RM18', lat: 51.4553, lng: 0.3561 },

  // Central London
  { id: 'mayfair', type: 'area', name: 'Mayfair', sub: 'Central London, W1J', lat: 51.5098, lng: -0.147 },
  { id: 'westminster', type: 'area', name: 'Westminster', sub: 'Central London, SW1A', lat: 51.4995, lng: -0.1248 },
  { id: 'knightsbridge', type: 'area', name: 'Knightsbridge', sub: 'Central London, SW1X', lat: 51.5014, lng: -0.1609 },
  { id: 'kensington', type: 'area', name: 'Kensington', sub: 'West London, W8', lat: 51.4991, lng: -0.1938 },
  { id: 'chelsea', type: 'area', name: 'Chelsea', sub: 'West London, SW3', lat: 51.4875, lng: -0.1687 },
  { id: 'soho', type: 'area', name: 'Soho & West End', sub: 'Central London, W1D', lat: 51.5136, lng: -0.1365 },
  { id: 'covent', type: 'area', name: 'Covent Garden', sub: 'Central London, WC2', lat: 51.5117, lng: -0.124 },
  { id: 'marylebone', type: 'area', name: 'Marylebone', sub: 'Central London, W1U', lat: 51.5185, lng: -0.1539 },
  { id: 'city', type: 'area', name: 'City of London (Bank)', sub: 'Financial district, EC2', lat: 51.5133, lng: -0.0886 },
  { id: 'canary', type: 'area', name: 'Canary Wharf', sub: 'Docklands, E14', lat: 51.5054, lng: -0.0235 },
  { id: 'shoreditch', type: 'area', name: 'Shoreditch', sub: 'East London, E1', lat: 51.5265, lng: -0.0798 },
  { id: 'camden', type: 'area', name: 'Camden Town', sub: 'North London, NW1', lat: 51.539, lng: -0.1426 },
  { id: 'hampstead', type: 'area', name: 'Hampstead', sub: 'North London, NW3', lat: 51.5557, lng: -0.1781 },
  { id: 'greenwich', type: 'area', name: 'Greenwich', sub: 'South East London, SE10', lat: 51.4826, lng: -0.0077 },
  { id: 'wimbledon', type: 'area', name: 'Wimbledon', sub: 'South West London, SW19', lat: 51.4214, lng: -0.2064 },
  { id: 'richmond', type: 'area', name: 'Richmond', sub: 'South West London, TW9', lat: 51.4613, lng: -0.3037 },
  { id: 'stratford', type: 'area', name: 'Stratford', sub: 'East London, E20', lat: 51.5416, lng: -0.0034 },
  { id: 'wembley', type: 'area', name: 'Wembley Stadium', sub: 'North West London, HA9', lat: 51.556, lng: -0.2796 },
  { id: 'hayes', type: 'area', name: 'Hayes', sub: 'West London, UB4', lat: 51.5127, lng: -0.4211 },

  // Hotels & landmarks
  { id: 'savoy', type: 'hotel', name: 'The Savoy', sub: 'Strand, WC2R', lat: 51.5104, lng: -0.1205 },
  { id: 'ritz', type: 'hotel', name: 'The Ritz London', sub: 'Piccadilly, W1J', lat: 51.507, lng: -0.1416 },
  { id: 'claridges', type: 'hotel', name: "Claridge's", sub: 'Brook Street, Mayfair, W1K', lat: 51.5126, lng: -0.1478 },
  { id: 'dorchester', type: 'hotel', name: 'The Dorchester', sub: 'Park Lane, W1K', lat: 51.5073, lng: -0.1527 },
  { id: 'shard', type: 'hotel', name: 'Shangri-La at The Shard', sub: 'London Bridge, SE1', lat: 51.5045, lng: -0.0865 },
  { id: 'o2', type: 'landmark', name: 'The O2 Arena', sub: 'Greenwich Peninsula, SE10', lat: 51.503, lng: 0.0032 },
  { id: 'excel', type: 'landmark', name: 'ExCeL London', sub: 'Royal Victoria Dock, E16', lat: 51.508, lng: 0.0295 },

  // Day trips & UK
  { id: 'windsor', type: 'landmark', name: 'Windsor Castle', sub: 'Windsor, SL4', lat: 51.4839, lng: -0.6044 },
  { id: 'oxford', type: 'landmark', name: 'Oxford City Centre', sub: 'Oxfordshire, OX1', lat: 51.752, lng: -1.2577 },
  { id: 'cambridge', type: 'landmark', name: 'Cambridge City Centre', sub: 'Cambridgeshire, CB2', lat: 52.2053, lng: 0.1218 },
  { id: 'bicester', type: 'landmark', name: 'Bicester Village', sub: 'Oxfordshire, OX26', lat: 51.8925, lng: -1.1564 },
  { id: 'stonehenge', type: 'landmark', name: 'Stonehenge', sub: 'Wiltshire, SP4', lat: 51.1789, lng: -1.8262 },
  { id: 'brighton', type: 'area', name: 'Brighton', sub: 'East Sussex, BN1', lat: 50.8225, lng: -0.1372 },
  { id: 'birmingham', type: 'area', name: 'Birmingham City Centre', sub: 'West Midlands, B1', lat: 52.4797, lng: -1.9026 },
  { id: 'manchester', type: 'area', name: 'Manchester City Centre', sub: 'Greater Manchester, M1', lat: 53.4808, lng: -2.2426 },
];

export const byId = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));

export const isAirportLike = (loc) => loc && ['airport', 'fbo'].includes(loc.type);

export function searchLocations(query, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return LOCATIONS.filter((l) => ['lhr', 'lgw', 'lcy', 'stn', 'ltn', 'mayfair', 'stp'].includes(l.id));
  const scored = [];
  for (const l of LOCATIONS) {
    const hay = `${l.code ?? ''} ${l.name} ${l.sub}`.toLowerCase();
    const idx = hay.indexOf(q);
    if (idx === -1 && !q.split(/\s+/).every((w) => hay.includes(w))) continue;
    const score = (l.code?.toLowerCase() === q ? -100 : 0) + (idx === -1 ? 50 : idx) + (l.type === 'airport' ? -2 : 0);
    scored.push([score, l]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, limit).map(([, l]) => l);
}
