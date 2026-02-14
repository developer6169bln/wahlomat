/**
 * Standort: Zuerst Browser-Geolocation (genauer, unterschiedlich pro Ort),
 * Fallback auf IP-Geolocation. Bei jedem Speichern wird neu abgefragt.
 */
const IP_GEO_URL = "https://reallyfreegeoip.org/json/";

function requestBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation || !window.isSecureContext) {
      reject(new Error("Geolocation nicht verfügbar"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          city: null,
          region: null,
          country: null,
        }),
      reject,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  });
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "Tuerk-O-Mat/1.0" }, cache: "no-store" }
    );
    const data = await res.json();
    return {
      city: data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || "",
      region: data.address?.state || data.address?.county || "",
      country: data.address?.country || "",
    };
  } catch {
    return { city: null, region: null, country: null };
  }
}

/**
 * Standort abfragen – bei jedem Aufruf neu (kein Cache).
 * Versucht zuerst Browser-Geolocation (unterschiedliche Positionen auch bei gleicher IP),
 * sonst IP-Geolocation.
 */
export async function getLocationByIP() {
  try {
    const loc = await requestBrowserLocation();
    const geo = await reverseGeocode(loc.lat, loc.lng);
    return { ...loc, ...geo };
  } catch {
    return getLocationByIPOnly();
  }
}

async function getLocationByIPOnly() {
  try {
    const url = `${IP_GEO_URL}?_=${Date.now()}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "Cache-Control": "no-cache", Pragma: "no-cache" },
      cache: "no-store",
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
