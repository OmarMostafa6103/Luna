// ملف إعدادات لتصدير مفتاح Google Maps API من متغيرات البيئة
// يجب وضع المفتاح في ملف .env بهذا الشكل:
// VITE_GOOGLE_MAPS_API_KEY=your_key_here
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export default {
  GOOGLE_MAPS_API_KEY,
};
