import React, { useEffect, useState } from "react";

const LOCAL_KEY = "customer_stats_data";
const IMAGE_KEY = "customer_review_images";

export default function NotedCustomers() {
  const [customers, setCustomers] = useState([]);
  const [images, setImages] = useState({});
  const [modalCustomer, setModalCustomer] = useState(null);
  const [extraNote, setExtraNote] = useState("");

  // تحميل بيانات العملاء
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const all = JSON.parse(saved);
      setCustomers(all.filter(c => c.notes && c.notes.trim() !== "" && c.id));
    }
    // تحميل الصور
    const imgs = localStorage.getItem(IMAGE_KEY);
    if (imgs) setImages(JSON.parse(imgs));
  }, []);

  // عند رفع صورة
  const handleImageChange = (e, customerId) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = { ...images, [customerId]: ev.target.result };
      setImages(newImages);
      localStorage.setItem(IMAGE_KEY, JSON.stringify(newImages));
    };
    reader.readAsDataURL(file);
  };

  // حفظ ملاحظة إضافية
  const handleSaveExtraNote = (customerId) => {
    const saved = localStorage.getItem(LOCAL_KEY);
    let arr = saved ? JSON.parse(saved) : [];
    let found = arr.find(c => c.id === customerId);
    if (found) {
      found.extraNote = extraNote;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
      setCustomers(arr.filter(c => c.notes && c.notes.trim() !== "" && c.id));
    }
    setModalCustomer({ ...modalCustomer, extraNote });
  };

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4 md:p-6 w-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-brand-brown">العملاء ذوو الملاحظات</h2>
      {customers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">لا يوجد عملاء لديهم ملاحظات.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border bg-white/90">
          <table className="min-w-[340px] sm:min-w-[500px] md:min-w-[700px] w-full text-center text-xs sm:text-base">
            <thead>
              <tr className="bg-brand-brown/10 text-brand-brown text-xs sm:text-base">
                <th className="py-2 px-2 sm:px-4">الاسم</th>
                <th className="py-2 px-2 sm:px-4">الحالة</th>
                <th className="py-2 px-2 sm:px-4">التصنيف</th>
                <th className="py-2 px-2 sm:px-4">الملاحظة</th>
                <th className="py-2 px-2 sm:px-4">صورة</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={c.id || idx} className="border-t hover:bg-brand-brown/5 transition">
                  <td className="py-2 px-2 sm:px-4 font-semibold break-words max-w-[120px]">{c.name}</td>
                  <td className="py-2 px-2 sm:px-4 break-words max-w-[100px]">{c.status}</td>
                  <td className="py-2 px-2 sm:px-4 break-words max-w-[100px]">{c.category}</td>
                  <td className="py-2 px-2 sm:px-4 break-words max-w-[140px]">{c.notes}</td>
                  <td className="py-2 px-2 sm:px-4">
                    <div className="flex flex-col items-center gap-2">
                      {images[c.id] ? (
                        <img
                          src={images[c.id]}
                          alt="مراجعة"
                          className="rounded-full shadow border-2 border-brand-brown/30 w-12 h-12 object-cover cursor-pointer hover:scale-110 transition"
                          onClick={() => { setModalCustomer(c); setExtraNote(c.extraNote || ""); }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center text-brand-brown text-xl font-bold cursor-pointer border-2 border-brand-brown/20 hover:scale-110 transition" onClick={() => { setModalCustomer(c); setExtraNote(c.extraNote || ""); }}>
                          {c.name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* نافذة منبثقة لعرض التفاصيل */}
      {modalCustomer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30,20,10,0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setModalCustomer(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-3 sm:p-6 max-w-xs sm:max-w-md w-full relative animate-fadein flex flex-col items-center justify-center"
            style={{
              zIndex: 10000,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              minHeight: '320px',
              minWidth: '0',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-3xl sm:text-4xl text-brand-brown font-extrabold transition cursor-pointer"
              style={{zIndex: 10001, background: 'none', border: 'none', lineHeight: 1, padding: 0, boxShadow: 'none'}}
              onClick={() => setModalCustomer(null)}
              aria-label="إغلاق"
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(31,38,135,0.18)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-4 w-full">
              {images[modalCustomer.id] && (
                <div className="relative group mb-2">
                  <img src={images[modalCustomer.id]} alt="مراجعة" className="rounded-2xl shadow-lg border-4 border-brand-brown/40 max-h-60 max-w-[220px] object-cover bg-white" />
                  <label
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow cursor-pointer group-hover:bg-brand-brown/80 transition"
                    style={{zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    title="تغيير الصورة"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-brown group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageChange(e, modalCustomer.id)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      style={{width: '100%', height: '100%'}}
                    />
                  </label>
                </div>
              )}
              {!images[modalCustomer.id] && (
                <label className="w-32 h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-brand-brown/40 bg-brand-brown/5 cursor-pointer mb-2 hover:bg-brand-brown/10 transition" title="إضافة صورة">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(e, modalCustomer.id)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    style={{width: '100%', height: '100%'}}
                  />
                </label>
              )}
              <div className="text-2xl font-extrabold text-brand-brown mt-2">{modalCustomer.name}</div>
              <div className="text-base text-gray-700">الحالة: <span className="font-bold">{modalCustomer.status}</span></div>
              <div className="text-base text-gray-700">التصنيف: <span className="font-bold">{modalCustomer.category}</span></div>
              <div className="text-lg text-brand-dark font-semibold">الملاحظة: <span className="font-bold">{modalCustomer.notes}</span></div>
              <div className="w-full mt-2">
                <label className="block mb-1 text-brand-brown font-bold">ملاحظة إضافية:</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 min-h-[60px]"
                  value={extraNote}
                  onChange={e => setExtraNote(e.target.value)}
                  placeholder="أضف ملاحظة إضافية..."
                />
                <button
                  className="mt-2 bg-brand-brown text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-brand-dark transition"
                  onClick={() => handleSaveExtraNote(modalCustomer.id)}
                >حفظ الملاحظة</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 