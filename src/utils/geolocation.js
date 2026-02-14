/**
 * IP-Geolocation – Standort über die IP-Adresse, keine Berechtigungen nötig.
 * Nutzt reallyfreegeoip.org (kostenlos, kein API-Key).
 */
const IP_GEO_URL = "https://reallyfreegeoip.org/json/";

export async function getLocationByIP() {
  try {
    const res = await fetch(IP_GEO_URL, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("IP-Geolocation fehlgeschlagen");
    const data = await res.json();
    return {
      lat: data.latitude ?? null,
      lng: data.longitude ?? null,
      city: data.city || null,
      region: data.region_name || null,
      country: data.country_name || null,
    };
  } catch (err) {
    console.warn("IP-Geolocation:", err);
    return {
      lat: null,
      lng: null,
      city: null,
      region: null,
      country: null,
    };
  }
}
