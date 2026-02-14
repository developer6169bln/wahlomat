/**
 * Fordert Standort vom User an. Bei Mobilgeräten wird die Browser-Berechtigung abgefragt.
 * iOS Safari: Muss SYNCHRON in Reaktion auf Tap/Klick aufgerufen werden (User-Geste).
 * Kein setState/async vor dem Aufruf – sonst erscheint die Abfrage oft nicht.
 */
export function requestLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation wird nicht unterstützt"));
      return;
    }

    if (!window.isSecureContext) {
      reject(new Error("Standortzugriff erfordert HTTPS"));
      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      options
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
