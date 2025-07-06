import React, { useContext, useState } from "react";
import { OrdersContext } from "../contexts/OrdersContext";
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// قائمة أنواع المنتجات المتاحة
const PRODUCT_TYPES = [
  { label: "كلاسيك", value: "Classic" },
  { label: "جولد", value: "Gold" },
  { label: "بايتس", value: "Bites" },
];

const OrderForm = () => {
  // جلب دالة إضافة الطلبات من السياق
  const { orders, setOrders } = useContext(OrdersContext);

  // حالة النموذج
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    orderDate: "",
    source: "",
    products: [{ type: "", quantity: 1, price: "" }],
  });

  // حالة لإظهار رسالة نجاح بعد الحفظ
  const [success, setSuccess] = useState(false);

  // حالة المصادر المقترحة
  const [sources, setSources] = useState(() => {
    // جلب المصادر من localStorage أو مصفوفة فارغة
    const saved = localStorage.getItem("orderSources");
    return saved ? JSON.parse(saved) : [];
  });
  // حالة لعرض الاقتراحات
  const [showSuggestions, setShowSuggestions] = useState(false);

  // حالة المنتجات المحفوظة (اسم وسعر)
  const [savedProducts, setSavedProducts] = useState(() => {
    const saved = localStorage.getItem("savedProducts");
    return saved ? JSON.parse(saved) : [];
  });

  // حالة إظهار اقتراحات المنتجات لكل منتج
  const [showProductSuggestions, setShowProductSuggestions] = useState([false]);

  // تحديث بيانات النموذج عند التغيير
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "source") {
      setShowSuggestions(true);
    }
  };

  // تحديث بيانات المنتجات داخل الطلب
  const handleProductChange = (idx, field, value) => {
    const updated = [...form.products];
    updated[idx][field] = value;
    // إذا تم تغيير اسم المنتج، جلب السعر تلقائيًا إذا كان محفوظًا
    if (field === "type") {
      const found = savedProducts.find((p) => p.type === value);
      if (found) {
        updated[idx].price = found.price;
      }
      // إظهار الاقتراحات عند الكتابة
      const showArr = [...showProductSuggestions];
      showArr[idx] = true;
      setShowProductSuggestions(showArr);
    }
    setForm({ ...form, products: updated });
  };

  // إضافة منتج جديد للنموذج
  const addProduct = () => {
    setForm({
      ...form,
      products: [...form.products, { type: "", quantity: 1, price: "" }],
    });
    setShowProductSuggestions([...showProductSuggestions, false]);
  };

  // حذف منتج من النموذج
  const removeProduct = (idx) => {
    const updated = form.products.filter((_, i) => i !== idx);
    setForm({ ...form, products: updated });
    setShowProductSuggestions(
      showProductSuggestions.filter((_, i) => i !== idx)
    );
  };

  // عند اختيار اقتراح
  const handleSuggestionClick = (suggestion) => {
    setForm({ ...form, source: suggestion });
    setShowSuggestions(false);
  };

  // عند إرسال النموذج
  const handleSubmit = (e) => {
    e.preventDefault();
    // حفظ المنتجات الجديدة في localStorage
    const newProducts = form.products.filter(
      (p) =>
        p.type && p.price && !savedProducts.some((sp) => sp.type === p.type)
    );
    if (newProducts.length > 0) {
      const updatedSaved = [
        ...savedProducts,
        ...newProducts.map((p) => ({ type: p.type, price: p.price })),
      ];
      setSavedProducts(updatedSaved);
      localStorage.setItem("savedProducts", JSON.stringify(updatedSaved));
    }
    // إضافة المصدر الجديد للمصادر إذا لم يكن موجودًا
    if (form.source && !sources.includes(form.source)) {
      const updatedSources = [...sources, form.source];
      setSources(updatedSources);
      localStorage.setItem("orderSources", JSON.stringify(updatedSources));
    }
    // إضافة الطلب الجديد إلى قائمة الطلبات
    setOrders([...orders, { ...form, id: Date.now() }]);
    // إعادة تعيين النموذج
    setForm({
      customerName: "",
      phone: "",
      address: "",
      orderDate: "",
      source: "",
      products: [{ type: "", quantity: 1, price: "" }],
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // فلترة الاقتراحات حسب أي حرف في النص
  const filteredSuggestions = form.source
    ? sources.filter((s) => s.toLowerCase().includes(form.source.toLowerCase()))
    : sources;

  let datePickerRef = null;

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        {/* عنوان الصفحة مع تصميم مميز */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-brown to-brand-dark rounded-full mb-4 shadow-lg">
            <PlusCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">إدخال طلب جديد</h1>
          <p className="text-brand-olive text-lg">أدخل تفاصيل الطلب الجديد</p>
        </div>

        {/* رسالة نجاح محسنة */}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg animate-fade-in-up">
            <div className="flex items-center justify-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-semibold text-lg">تم حفظ الطلب بنجاح!</span>
            </div>
          </div>
        )}

        {/* نموذج الطلب مع تصميم محسن */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-brand-olive/20 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-brown to-brand-dark p-6">
            <h2 className="text-2xl font-bold text-white text-center">معلومات العميل</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* معلومات العميل الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* اسم العميل */}
              <div className="group">
                <label className="block mb-3 font-semibold text-brand-dark flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  اسم العميل
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white text-brand-dark placeholder:text-gray-400"
                  required
                  placeholder="أدخل اسم العميل"
                />
              </div>

              {/* رقم الهاتف */}
              <div className="group">
                <label className="block mb-3 font-semibold text-brand-dark flex items-center gap-2 text-lg">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <PhoneIcon className="w-5 h-5 text-green-600" />
                  </div>
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white text-brand-dark placeholder:text-gray-400"
                  required
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>

            {/* العنوان */}
            <div className="group">
              <label className="block mb-3 font-semibold text-brand-dark flex items-center gap-2 text-lg">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <MapPinIcon className="w-5 h-5 text-purple-600" />
                </div>
                العنوان
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white text-brand-dark placeholder:text-gray-400 resize-none"
                rows="3"
                required
                placeholder="أدخل العنوان التفصيلي"
              />
            </div>

            {/* تاريخ الطلب والمصدر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* تاريخ الطلب */}
              <div className="group">
                <label className="block mb-3 font-semibold text-brand-dark flex items-center gap-2 text-lg">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <CalendarDaysIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  تاريخ الطلب
                </label>
                <DatePicker
                  selected={form.orderDate ? new Date(form.orderDate) : null}
                  onChange={(date) =>
                    setForm({
                      ...form,
                      orderDate: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  dateFormat="yyyy/MM/dd"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white text-brand-dark"
                  placeholderText="اختر التاريخ"
                  ref={(ref) => (datePickerRef = ref)}
                />
              </div>

              {/* مصدر الطلب */}
              <div className="group relative">
                <label className="block mb-3 font-semibold text-brand-dark flex items-center gap-2 text-lg">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <span className="text-red-600 text-lg">📱</span>
                  </div>
                  مصدر الطلب
                </label>
                <input
                  type="text"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white text-brand-dark placeholder:text-gray-400"
                  placeholder="مثال: واتساب، إنستغرام، هاتف"
                />
                {/* اقتراحات المصادر */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-brand-dark"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* قسم المنتجات */}
            <div className="bg-gradient-to-r from-brand-beige/30 to-white rounded-xl p-6 border border-brand-olive/20">
              <h3 className="text-xl font-bold text-brand-dark mb-6 text-center">المنتجات المطلوبة</h3>
              
              {form.products.map((product, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 mb-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* نوع المنتج */}
                    <div className="relative">
                      <label className="block mb-2 font-semibold text-brand-dark">نوع المنتج</label>
                      <input
                        type="text"
                        value={product.type}
                        onChange={e => handleProductChange(idx, "type", e.target.value)}
                        onFocus={() => {
                          const showArr = [...showProductSuggestions];
                          showArr[idx] = true;
                          setShowProductSuggestions(showArr);
                        }}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                        required
                        placeholder="اسم المنتج"
                        autoComplete="off"
                      />
                      {/* اقتراحات المنتجات */}
                      {showProductSuggestions[idx] && product.type && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {savedProducts.filter(p => p.type.toLowerCase().includes(product.type.toLowerCase())).map((p, i) => (
                            <div
                              key={i}
                              onMouseDown={() => {
                                handleProductChange(idx, "type", p.type);
                                handleProductChange(idx, "price", p.price);
                                const showArr = [...showProductSuggestions];
                                showArr[idx] = false;
                                setShowProductSuggestions(showArr);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-brand-dark"
                            >
                              {p.type} <span className="text-xs text-brand-olive">({p.price} جنيه)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* الكمية */}
                    <div>
                      <label className="block mb-2 font-semibold text-brand-dark">الكمية</label>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={e => handleProductChange(idx, "quantity", parseInt(e.target.value))}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    {/* السعر */}
                    <div>
                      <label className="block mb-2 font-semibold text-brand-dark">السعر</label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={e => handleProductChange(idx, "price", parseFloat(e.target.value))}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* زر حذف المنتج */}
                  {form.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(idx)}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm"
                    >
                      حذف المنتج
                    </button>
                  )}
                </div>
              ))}

              {/* زر إضافة منتج جديد */}
              <button
                type="button"
                onClick={addProduct}
                className="w-full py-3 bg-gradient-to-r from-brand-olive to-brand-brown text-white rounded-xl font-semibold hover:from-brand-brown hover:to-brand-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5 inline ml-2" />
                إضافة منتج جديد
              </button>
            </div>

            {/* زر الإرسال */}
            <div className="text-center">
              <button
                type="submit"
                className="px-12 py-4 bg-gradient-to-r from-brand-brown to-brand-dark text-white rounded-xl font-bold text-lg hover:from-brand-dark hover:to-brand-brown transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                حفظ الطلب
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
