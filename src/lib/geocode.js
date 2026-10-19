// Free-text address search via Photon (OpenStreetMap, built for search-as-you-type,
// no API key). Results are biased to London and limited to Great Britain.
const ENDPOINT = 'https://photon.komoot.io/api/';
const GB_BBOX = '-8.2,49.8,1.9,58.8';

export async function geocode(query, signal) {
  if (query.trim().length < 3) return [];
  const url = `${ENDPOINT}?q=${encodeURIComponent(query)}&lat=51.5074&lon=-0.1278&limit=5&lang=en&bbox=${GB_BBOX}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features || []).map((f) => {
    const p = f.properties;
    const [lng, lat] = f.geometry.coordinates;
    const label = p.name || [p.housenumber, p.street].filter(Boolean).join(' ') || p.city;
    const sub = [p.name && p.street ? [p.housenumber, p.street].filter(Boolean).join(' ') : null, p.district || p.city, p.postcode]
      .filter(Boolean)
      .join(', ');
    return { id: `osm-${p.osm_type}${p.osm_id}`, type: 'address', name: label, sub, lat, lng };
  });
}
