import React, { useContext, useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { OrdersContext } from "../contexts/OrdersContext";
import config from "../config";
console.log('GOOGLE_MAPS_API_KEY:', config.GOOGLE_MAPS_API_KEY);

const containerStyle = {
  width: "100%",
  height: "45vh", // height responsive
  minHeight: "260px",
  maxHeight: "600px"
};

function haversineDistance(a, b) {
  // لحساب المسافة التقريبية بين نقطتين (بدون API)
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const aVal =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

export default function OrdersMap() {
  const { orders } = useContext(OrdersContext);
  const [locations, setLocations] = useState([]); // [{lat, lng, address, order}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [distances, setDistances] = useState([]); // [{distance, duration}]
  const [total, setTotal] = useState({ distance: 0, duration: 0 });

  // تحميل مكتبة Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: config.GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // تحويل العناوين إلى إحداثيات (Geocoding)
  useEffect(() => {
    if (!isLoaded || !orders.length) return;
    const fetchLocations = async () => {
      setLoading(true);
      setError("");
      const geocoder = new window.google.maps.Geocoder();
      const results = [];
      for (const order of orders) {
        try {
          const address = `${order.address}, ${order.governorate || ""}`;
          const res = await new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
              if (status === "OK" && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                reject(status);
              }
            });
          });
          results.push({
            lat: res.lat(),
            lng: res.lng(),
            address,
            order,
          });
        } catch (e) {
          setError((prev) => prev + `\nتعذر تحديد موقع العنوان: ${order.address}`);
        }
      }
      setLocations(results);
      setLoading(false);
    };
    fetchLocations();
  }, [isLoaded, orders]);

  // ترتيب الطلبات حسب المسافة الأقصر (حل تقريبي: أقرب جار)
  function sortByNearest(locations) {
    if (locations.length <= 2) return locations;
    const visited = Array(locations.length).fill(false);
    const route = [0];
    visited[0] = true;
    for (let step = 1; step < locations.length; step++) {
      let last = route[route.length - 1];
      let minDist = Infinity;
      let minIdx = -1;
      for (let i = 0; i < locations.length; i++) {
        if (!visited[i]) {
          const dist = haversineDistance(locations[last], locations[i]);
          if (dist < minDist) {
            minDist = dist;
            minIdx = i;
          }
        }
      }
      if (minIdx !== -1) {
        route.push(minIdx);
        visited[minIdx] = true;
      }
    }
    return route.map((i) => locations[i]);
  }

  // حساب المسافة والوقت بين كل نقطتين متتاليتين باستخدام Directions API
  useEffect(() => {
    if (!isLoaded || locations.length < 2) return;
    const sorted = sortByNearest(locations);
    setLocations(sorted); // تحديث الترتيب
    setDistances([]);
    setTotal({ distance: 0, duration: 0 });
    const service = new window.google.maps.DirectionsService();
    let totalDistance = 0;
    let totalDuration = 0;
    let promises = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const origin = sorted[i];
      const destination = sorted[i + 1];
      promises.push(
        new Promise((resolve) => {
          service.route(
            {
              origin: { lat: origin.lat, lng: origin.lng },
              destination: { lat: destination.lat, lng: destination.lng },
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK" && result.routes[0]) {
                const leg = result.routes[0].legs[0];
                totalDistance += leg.distance.value;
                totalDuration += leg.duration.value;
                resolve({
                  distance: leg.distance,
                  duration: leg.duration,
                  from: origin,
                  to: destination,
                });
              } else {
                resolve({ distance: { value: 0, text: "-" }, duration: { value: 0, text: "-" }, from: origin, to: destination });
              }
            }
          );
        })
      );
    }
    Promise.all(promises).then((results) => {
      setDistances(results);
      setTotal({
        distance: totalDistance / 1000, // m to km
        duration: Math.round(totalDuration / 60), // sec to min
      });
    });
    // eslint-disable-next-line
  }, [isLoaded, locations.length]);

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6 w-full">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 text-center text-brand-brown drop-shadow">خريطة الطلبات والمسافات</h2>
      {error && <div className="text-red-600 mb-2 whitespace-pre-line text-xs sm:text-base">{error}</div>}
      {loading && <div className="text-blue-600 mb-2 text-xs sm:text-base">جاري تحميل المواقع...</div>}
      {isLoaded && locations.length > 0 && (
        <div className="rounded-xl overflow-hidden shadow mb-6" style={{minHeight: '260px'}}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={locations[0]}
            zoom={11}
          >
            {locations.map((loc, idx) => (
              <Marker key={idx} position={{ lat: loc.lat, lng: loc.lng }} label={`${idx + 1}`} />
            ))}
            <Polyline
              path={locations.map(loc => ({ lat: loc.lat, lng: loc.lng }))}
              options={{ strokeColor: "#007bff", strokeWeight: 4 }}
            />
          </GoogleMap>
        </div>
      )}
      {/* ملخص الرحلة */}
      {distances.length > 0 && (
        <div className="my-4 sm:my-6 bg-brand-beige/40 rounded-xl p-2 sm:p-4 text-center shadow text-xs sm:text-base">
          <span className="font-bold text-brand-brown">إجمالي المسافة: </span>
          <span className="text-brand-dark font-bold">{total.distance.toFixed(2)} كم</span>
          <span className="mx-2 sm:mx-4 font-bold text-brand-brown">إجمالي الوقت: </span>
          <span className="text-brand-dark font-bold">{total.duration} دقيقة تقريباً</span>
        </div>
      )}
      {/* جدول الطلبات */}
      <div className="mt-6 sm:mt-8 overflow-x-auto rounded-xl border shadow bg-white">
        <table className="min-w-[340px] sm:min-w-[600px] w-full text-center text-xs sm:text-base">
          <thead>
            <tr className="bg-brand-brown/10 text-brand-brown text-xs sm:text-base">
              <th className="py-2 px-2 sm:px-4">#</th>
              <th className="py-2 px-2 sm:px-4">اسم العميل</th>
              <th className="py-2 px-2 sm:px-4">العنوان</th>
              <th className="py-2 px-2 sm:px-4">المحافظة</th>
              <th className="py-2 px-2 sm:px-4">المسافة للطلب التالي</th>
              <th className="py-2 px-2 sm:px-4">الوقت للطلب التالي</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2 px-2 sm:px-4 font-bold">{idx + 1}</td>
                <td className="py-2 px-2 sm:px-4 break-words max-w-[120px]">{loc.order.customerName}</td>
                <td className="py-2 px-2 sm:px-4 break-words max-w-[140px]">{loc.order.address}</td>
                <td className="py-2 px-2 sm:px-4 break-words max-w-[100px]">{loc.order.governorate}</td>
                <td className="py-2 px-2 sm:px-4 font-bold text-blue-700">
                  {distances[idx]?.distance?.text || (idx === locations.length - 1 ? "-" : "...")}
                </td>
                <td className="py-2 px-2 sm:px-4 font-bold text-green-700">
                  {distances[idx]?.duration?.text || (idx === locations.length - 1 ? "-" : "...")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 