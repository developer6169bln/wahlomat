/**
 * Fordert Standort vom User an. Bei Mobilgeräten wird die Browser-Berechtigung abgefragt.
 * iOS/Android: Muss in direkter Reaktion auf einen Klick/Tap aufgerufen werden (User-Geste).
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
      enableHighAccuracy: false, // Schneller auf Mobilgeräten, weniger Probleme mit iOS
      timeout: 20000,
      maximumAge: 0,
    };

    // watchPosition + clearWatch: Auf iOS oft zuverlässiger als getCurrentPosition
    let watchId = null;

    const onSuccess = (pos) => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    };

    const onError = (err) => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      reject(err);
    };

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    // Fallback-Timeout falls watchPosition hängt
    setTimeout(() => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        reject({ code: 3, message: "Zeitüberschreitung" });
      }
    }, options.timeout + 2000);
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
