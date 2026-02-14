/**
 * Fordert Standort vom User an. Bei Mobilgeräten wird die Browser-Berechtigung abgefragt.
 */
export function requestLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation wird nicht unterstützt"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Reverse Geocoding via Nominatim (OpenStreetMap) - kostenlos
 */
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "Tuerk-O-Mat/1.0" } }
    );
    const data = await res.json();
    return {
      city: data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || "",
      region: data.address?.state || data.address?.county || "",
      country: data.address?.country || "",
    };
  } catch {
    return { city: "", region: "", country: "" };
  }
}
