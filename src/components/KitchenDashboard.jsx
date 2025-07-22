// import React, { useContext, useState, useEffect } from "react";
// import { OrdersContext } from "../contexts/OrdersContext";
// import {
//   CalendarDaysIcon,
//   FireIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   ExclamationTriangleIcon,
// } from "@heroicons/react/24/outline";

// // دالة مساعدة لحساب بداية اليوم
// const getToday = () => new Date().toISOString().slice(0, 10);

// const KitchenDashboard = () => {
//   const {
//     orders,
//     completedOrders,
//     setOrders,
//     setCompletedOrders,
//     addCompletedOrder,
//   } = useContext(OrdersContext);
//   const today = getToday();

//   // جلب جميع الطلبات التي لم يتم تنفيذها (بدون فلترة التاريخ)
//   const completedIds = completedOrders.map((o) => o.id);
//   const pendingOrders = orders.filter((o) => !completedIds.includes(o.id));

//   // حساب عدد الطلبات لكل منتج من الطلبات غير المنفذة
//   const countByType = (ordersList) => {
//     return ordersList.reduce((acc, order) => {
//       order.products.forEach((p) => {
//         acc[p.type] = (acc[p.type] || 0) + Number(p.quantity);
//       });
//       return acc;
//     }, {});
//   };

//   const pendingTotals = countByType(pendingOrders);

//   // قائمة الوجبات مرتبة حسب النوع والكمية
//   const mealList = Object.entries(pendingTotals)
//     .map(([type, qty]) => ({ type, qty }))
//     .sort((a, b) => b.qty - a.qty);

//   // حالة فلتر المحافظة
//   const [govFilter, setGovFilter] = useState("");

//   // استخراج جميع المحافظات من الطلبات غير المنفذة
//   const allGovernorates = Array.from(
//     new Set(pendingOrders.map((o) => o.governorate).filter(Boolean))
//   );

//   // تصفية الطلبات غير المنفذة حسب المحافظة
//   const filteredPendingOrders = govFilter
//     ? pendingOrders.filter((o) => o.governorate === govFilter)
//     : pendingOrders;
//   const filteredTotals = countByType(filteredPendingOrders);
//   const filteredMealList = Object.entries(filteredTotals)
//     .map(([type, qty]) => ({ type, qty }))
//     .sort((a, b) => b.qty - a.qty);

//   // حالة الإنجاز لكل طلب (وليس لكل نوع)
//   const [orderDoneCounts, setOrderDoneCounts] = useState(() => {
//     try {
//       const saved = localStorage.getItem("kitchenOrderDoneCounts");
//       return saved ? JSON.parse(saved) : {};
//     } catch (e) {
//       return {};
//     }
//   });

//   // حفظ التغييرات في localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem(
//         "kitchenOrderDoneCounts",
//         JSON.stringify(orderDoneCounts)
//       );
//     } catch (e) {}
//   }, [orderDoneCounts]);

//   // تحديث عدد المنجز لمنتج معين في طلب معين
//   const handleOrderDoneChange = (orderId, type, value) => {
//     setOrderDoneCounts((prev) => {
//       const prevOrder = prev[orderId] || {};
//       return {
//         ...prev,
//         [orderId]: {
//           ...prevOrder,
//           [type]: Math.max(0, Number(value)),
//         },
//       };
//     });
//   };

//   // حالة لتتبع الطلبات التي تم إنجازها للتو
//   const [justCompleted, setJustCompleted] = useState([]);

//   // حالة لتتبع الطلبات التي تم نقلها تلقائياً
//   const [autoCompleted, setAutoCompleted] = useState([]);
//   const [toast, setToast] = useState(null);

//   const [kitchenCompletedOrders, setKitchenCompletedOrders] = useState(() => {
//     try {
//       const saved = localStorage.getItem("kitchenCompletedOrders");
//       const now = Date.now();
//       return saved
//         ? JSON.parse(saved).filter(
//             (o) => now - o.completedAt < 24 * 60 * 60 * 1000
//           )
//         : [];
//     } catch (e) {
//       return [];
//     }
//   });

//   // الإنجاز التلقائي للطلبات
//   useEffect(() => {
//     pendingOrders.forEach((order) => {
//       const doneForOrder = orderDoneCounts[order.id] || {};
//       const allDone = order.products.every((p) => {
//         const done = doneForOrder[p.type] || 0;
//         return done >= Number(p.quantity);
//       });
//       if (allDone && !autoCompleted.includes(order.id)) {
//         setOrders((prev) => prev.filter((o) => o.id !== order.id));
//         const completedOrder = { ...order, completedAt: Date.now() };
//         setKitchenCompletedOrders((prev) => [...prev, completedOrder]);
//         addCompletedOrder(completedOrder); // إضافة للطلبات المنجزة
//         setAutoCompleted((prev) => [...prev, order.id]);
//         setToast({
//           id: order.id,
//           customerName: order.customerName,
//           governorate: order.governorate,
//         });
//         setTimeout(() => setToast(null), 4000);
//       }
//     });
//   }, [
//     pendingOrders,
//     orderDoneCounts,
//     autoCompleted,
//     setOrders,
//     setKitchenCompletedOrders,
//     addCompletedOrder,
//   ]);

//   // إحصائيات جديدة بناءً على منطق الإنجاز لكل طلب
//   const totalPending = pendingOrders.reduce(
//     (sum, order) =>
//       sum + order.products.reduce((s, p) => s + Number(p.quantity), 0),
//     0
//   );
//   const totalDone = pendingOrders.reduce(
//     (sum, order) =>
//       sum +
//       order.products.reduce(
//         (s, p) =>
//           s +
//           Math.min(
//             orderDoneCounts[order.id]?.[p.type] || 0,
//             Number(p.quantity)
//           ),
//         0
//       ),
//     0
//   );

//   // حذف الطلبات المكتملة بعد 24 ساعة
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       setKitchenCompletedOrders((prev) =>
//         prev.filter((o) => now - o.completedAt < 24 * 60 * 60 * 1000)
//       );
//     }, 60 * 1000); // كل دقيقة
//     return () => clearInterval(interval);
//   }, []);
//   useEffect(() => {
//     try {
//       localStorage.setItem(
//         "kitchenCompletedOrders",
//         JSON.stringify(kitchenCompletedOrders)
//       );
//     } catch (e) {}
//   }, [kitchenCompletedOrders]);

//   return (
//     <div className="animate-fade-in-up">
//       <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-8 w-full">
//         {/* فلتر المحافظة */}
//         <div className="mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center w-full">
//           <label className="font-semibold text-brand-dark flex items-center gap-2 text-base sm:text-lg">
//             <span className="bg-yellow-100 p-2 rounded-lg">
//               <ClockIcon className="w-5 h-5 text-yellow-600" />
//             </span>
//             تصفية حسب المحافظة:
//           </label>
//           <select
//             className="border-2 border-gray-200 rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark text-xs sm:text-base"
//             value={govFilter}
//             onChange={(e) => setGovFilter(e.target.value)}
//           >
//             <option value="">كل المحافظات</option>
//             {allGovernorates.map((gov, i) => (
//               <option key={i} value={gov}>
//                 {gov}
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* عنوان الصفحة */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
//             <FireIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
//           </div>
//           <h1 className="text-xl sm:text-3xl font-bold text-brand-dark mb-2">
//             لوحة المطبخ
//           </h1>
//           <p className="text-brand-olive text-base sm:text-lg">
//             إدارة الطلبات والإنتاج اليومي
//           </p>
//         </div>

//         {/* إحصائيات سريعة */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8">
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-orange-100 text-xs sm:text-sm">
//                   إجمالي المطلوب
//                 </p>
//                 <p className="text-xl sm:text-2xl font-bold">{totalPending}</p>
//               </div>
//               <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <span className="text-xl sm:text-2xl">📋</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100 text-xs sm:text-sm">تم الإنجاز</p>
//                 <p className="text-xl sm:text-2xl font-bold">{totalDone}</p>
//               </div>
//               <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100 text-xs sm:text-sm">المتبقي</p>
//                 <p className="text-xl sm:text-2xl font-bold">
//                   {Math.max(0, totalPending - totalDone)}
//                 </p>
//               </div>
//               <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100 text-xs sm:text-sm">
//                   نسبة الإنجاز
//                 </p>
//                 <p className="text-xl sm:text-2xl font-bold">
//                   {totalPending > 0
//                     ? Math.round((totalDone / totalPending) * 100)
//                     : 0}
//                   %
//                 </p>
//               </div>
//               <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                 <span className="text-xl sm:text-2xl">📊</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ملخص الطلبات غير المنفذة */}
//         {govFilter === "" && allGovernorates.length > 0 ? (
//           // تجميع حسب المحافظة
//           allGovernorates.map((gov, idx) => {
//             const govOrders = pendingOrders.filter(
//               (o) => o.governorate === gov
//             );
//             const govTotals = countByType(govOrders);
//             const govMealList = Object.entries(govTotals)
//               .map(([type, qty]) => ({ type, qty }))
//               .sort((a, b) => b.qty - a.qty);
//             if (govOrders.length === 0) return null;
//             return (
//               <div key={idx} className="mb-12">
//                 <h2 className="text-2xl font-bold text-brand-brown mb-4 text-center">
//                   طلبات محافظة {gov}
//                 </h2>
//                 {/* ملخص الطلبات */}
//                 <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6 mb-8">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-orange-100 rounded-lg">
//                       <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-brand-dark">
//                         الطلبات غير المنفذة
//                       </h3>
//                       <p className="text-brand-olive text-sm">اليوم وما بعده</p>
//                     </div>
//                   </div>
//                   {Object.keys(govTotals).length === 0 ? (
//                     <div className="text-center py-8">
//                       <div className="text-6xl mb-4">🎉</div>
//                       <p className="text-brand-olive text-lg">
//                         لا يوجد طلبات غير منفذة
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         جميع الطلبات تم إنجازها بنجاح!
//                       </p>
//                     </div>
//                   ) : (
//                     <>
//                       {/* كروت على الموبايل */}
//                       <div className="block sm:hidden space-y-4">
//                         {govOrders.map((order, idx) => {
//                           const doneForOrder = orderDoneCounts[order.id] || {};
//                           const allDone = order.products.every((p) => {
//                             const done = doneForOrder[p.type] || 0;
//                             return done >= Number(p.quantity);
//                           });
//                           return (
//                             <div
//                               key={order?.id ? `order-${order.id}` : `row-${idx}`}
//                               className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2"
//                             >
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className="font-bold text-orange-800">
//                                   {order.products.map((p) => p.type).join(", ")}
//                                 </span>
//                                 <span className="bg-orange-200 text-orange-900 px-2 py-1 rounded text-xs">
//                                   {order.governorate}
//                                 </span>
//                               </div>
//                               <div className="text-xs text-gray-500 mb-1">
//                                 تاريخ: {order.date}
//                               </div>
//                               <div className="flex flex-wrap gap-2 mb-2">
//                                 {order.products && order.products.map((p, i) => (
//                                   <span
//                                     key={p.type + '-' + i}
//                                     className="bg-orange-100 text-orange-900 px-2 py-1 rounded text-xs"
//                                   >
//                                     {p.type}: {p.quantity}
//                                   </span>
//                                 ))}
//                               </div>
//                               <div className="flex flex-wrap gap-2">
//                                 {order.products && order.products.map((p, i) => (
//                                   <div
//                                     key={p.type + '-' + i}
//                                     className="flex items-center gap-1"
//                                   >
//                                     <span className="text-xs font-semibold text-brand-dark">
//                                       {p.type}:
//                                     </span>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       max={p.quantity}
//                                       value={doneForOrder[p.type] || ""}
//                                       onChange={(e) =>
//                                         handleOrderDoneChange(
//                                           order?.id ?? idx,
//                                           p.type,
//                                           e.target.value
//                                         )
//                                       }
//                                       className="w-14 border-2 border-gray-200 rounded-lg px-1 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
//                                       placeholder={`0 من ${p.quantity}`}
//                                       disabled={allDone}
//                                     />
//                                     <span className="text-xs text-gray-500">
//                                       من {p.quantity}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                               {allDone && (
//                                 <span className="mt-2 text-green-700 font-bold text-xs">
//                                   مكتمل بنجاح!
//                                 </span>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                       {/* شبكة (grid) على الشاشات الأكبر */}
//                       <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {govOrders.map((order, idx) => {
//                           const doneForOrder = orderDoneCounts[order.id] || {};
//                           const allDone = order.products.every((p) => {
//                             const done = doneForOrder[p.type] || 0;
//                             return done >= Number(p.quantity);
//                           });
//                           return (
//                             <div
//                               key={order?.id ? `order-${order.id}` : `row-${idx}`}
//                               className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2 mb-4"
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <p className="font-bold text-orange-800 text-lg">
//                                     {order.products
//                                       .map((p) => p.type)
//                                       .join(", ")}
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     محافظة: {order.governorate}
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     تاريخ: {order.date}
//                                   </p>
//                                 </div>
//                                 <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
//                                   {order.products.reduce(
//                                     (sum, p) => sum + Number(p.quantity),
//                                     0
//                                   )}{" "}
//                                   مطلوب
//                                 </span>
//                               </div>
//                               <div className="flex flex-wrap gap-4 mt-2">
//                                 {order.products && order.products.map((p, i) => (
//                                   <div
//                                     key={p.type + '-' + i}
//                                     className="flex items-center gap-2"
//                                   >
//                                     <span className="text-sm font-semibold text-brand-dark">
//                                       {p.type}:
//                                     </span>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       max={p.quantity}
//                                       value={doneForOrder[p.type] || ""}
//                                       onChange={(e) =>
//                                         handleOrderDoneChange(
//                                           order?.id ?? idx,
//                                           p.type,
//                                           e.target.value
//                                         )
//                                       }
//                                       className="w-20 border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
//                                       placeholder={`0 من ${p.quantity}`}
//                                       disabled={allDone}
//                                     />
//                                     <span className="text-xs text-gray-500">
//                                       من {p.quantity}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                               {allDone && (
//                                 <span className="mt-2 text-green-700 font-bold">
//                                   مكتمل بنجاح!
//                                 </span>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 {/* قائمة الوجبات */}
//                 <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <FireIcon className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-brand-dark">
//                         قائمة الوجبات المطلوبة
//                       </h3>
//                       <p className="text-brand-olive text-sm">
//                         تتبع الإنجاز لكل نوع
//                       </p>
//                     </div>
//                   </div>
//                   {govMealList.length === 0 ? (
//                     <div className="text-center py-8">
//                       <div className="text-6xl mb-4">🍽️</div>
//                       <p className="text-brand-olive text-lg">
//                         لا يوجد وجبات مطلوبة
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         جميع الطلبات تم إنجازها
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {govMealList.map((meal) => {
//                         const done = pendingOrders.reduce(
//                           (sum, order) =>
//                             sum + (orderDoneCounts[order.id]?.[meal.type] || 0),
//                           0
//                         );
//                         const remaining = meal.qty - done;
//                         const progress = Math.min(
//                           100,
//                           (done / Number(meal.qty)) * 100
//                         );

//                         return (
//                           <div
//                             key={meal.type}
//                             className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
//                           >
//                             <div className="flex items-center justify-between mb-4">
//                               <h4 className="text-xl font-bold text-brand-dark">
//                                 {meal.type}
//                               </h4>
//                               <div className="text-right">
//                                 <div className="text-2xl font-bold text-brand-brown">
//                                   {meal.qty}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   إجمالي المطلوب
//                                 </div>
//                               </div>
//                             </div>
//                             {/* شريط التقدم */}
//                             <div className="mb-4">
//                               <div className="flex justify-between text-sm mb-2">
//                                 <span className="text-green-600 font-semibold">
//                                   تم الإنجاز: {done}
//                                 </span>
//                                 <span className="text-orange-600 font-semibold">
//                                   المتبقي: {remaining}
//                                 </span>
//                               </div>
//                               <div className="w-full bg-gray-200 rounded-full h-3">
//                                 <div
//                                   className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
//                                   style={{ width: `${progress}%` }}
//                                 ></div>
//                               </div>
//                               <div className="text-center mt-1">
//                                 <span className="text-sm font-semibold text-brand-dark">
//                                   {Math.round(progress)}% مكتمل
//                                 </span>
//                               </div>
//                             </div>
//                             {/* حالة الإنجاز */}
//                             <div className="mt-4 pt-4 border-t border-gray-100">
//                               {progress === 100 ? (
//                                 <div className="flex items-center gap-2 text-green-600">
//                                   <CheckCircleIcon className="w-5 h-5" />
//                                   <span className="font-semibold">
//                                     مكتمل بنجاح!
//                                   </span>
//                                 </div>
//                               ) : progress > 50 ? (
//                                 <div className="flex items-center gap-2 text-blue-600">
//                                   <ClockIcon className="w-5 h-5" />
//                                   <span className="font-semibold">
//                                     قيد الإنجاز
//                                   </span>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-2 text-orange-600">
//                                   <ExclamationTriangleIcon className="w-5 h-5" />
//                                   <span className="font-semibold">
//                                     يحتاج انتباه
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <>
//             {/* ملخص الطلبات غير المنفذة */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6 mb-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-orange-100 rounded-lg">
//                   <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-brand-dark">
//                     الطلبات غير المنفذة
//                   </h3>
//                   <p className="text-brand-olive text-sm">اليوم وما بعده</p>
//                 </div>
//               </div>
//               {Object.keys(filteredTotals).length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="text-6xl mb-4">🎉</div>
//                   <p className="text-brand-olive text-lg">
//                     لا يوجد طلبات غير منفذة
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     جميع الطلبات تم إنجازها بنجاح!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {filteredPendingOrders.map((order, idx) => (
//                     <div
//                       key={order?.id ? `order-${order.id}` : `row-${idx}`}
//                       className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between"
//                     >
//                       <div>
//                         <p className="font-bold text-orange-800 text-lg">
//                           {order.products.map((p) => p.type).join(", ")}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           محافظة: {order.governorate}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           تاريخ: {order.date}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
//                           {order.products.reduce(
//                             (sum, p) => sum + Number(p.quantity),
//                             0
//                           )}{" "}
//                           مطلوب
//                         </span>
//                         {(() => {
//                           const allDone = order.products.every((p) => {
//                             const done =
//                               orderDoneCounts[order.id]?.[p.type] || 0;
//                             return done >= Number(p.quantity);
//                           });
//                           if (allDone) {
//                             return (
//                               <span className="ml-2 text-green-700 font-bold">
//                                 مكتمل بنجاح!
//                               </span>
//                             );
//                           }
//                           return null;
//                         })()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             {/* قائمة الوجبات مع التقدم */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <FireIcon className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-brand-dark">
//                     قائمة الوجبات المطلوبة
//                   </h3>
//                   <p className="text-brand-olive text-sm">
//                     تتبع الإنجاز لكل نوع
//                   </p>
//                 </div>
//               </div>
//               {filteredMealList.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="text-6xl mb-4">🍽️</div>
//                   <p className="text-brand-olive text-lg">
//                     لا يوجد وجبات مطلوبة
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     جميع الطلبات تم إنجازها
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredMealList.map((meal) => {
//                     const done = pendingOrders.reduce(
//                       (sum, order) =>
//                         sum + (orderDoneCounts[order.id]?.[meal.type] || 0),
//                       0
//                     );
//                     const remaining = meal.qty - done;
//                     const progress = Math.min(
//                       100,
//                       (done / Number(meal.qty)) * 100
//                     );

//                     return (
//                       <div
//                         key={meal.type}
//                         className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
//                       >
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-xl font-bold text-brand-dark">
//                             {meal.type}
//                           </h4>
//                           <div className="text-right">
//                             <div className="text-2xl font-bold text-brand-brown">
//                               {meal.qty}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               إجمالي المطلوب
//                             </div>
//                           </div>
//                         </div>
//                         {/* شريط التقدم */}
//                         <div className="mb-4">
//                           <div className="flex justify-between text-sm mb-2">
//                             <span className="text-green-600 font-semibold">
//                               تم الإنجاز: {done}
//                             </span>
//                             <span className="text-orange-600 font-semibold">
//                               المتبقي: {remaining}
//                             </span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-3">
//                             <div
//                               className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
//                               style={{ width: `${progress}%` }}
//                             ></div>
//                           </div>
//                           <div className="text-center mt-1">
//                             <span className="text-sm font-semibold text-brand-dark">
//                               {Math.round(progress)}% مكتمل
//                             </span>
//                           </div>
//                         </div>
//                         {/* إدخال الإنجاز */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-semibold text-brand-dark">
//                             تحديث الإنجاز:
//                           </label>
//                           <div className="flex items-center gap-3">
//                             <input
//                               type="number"
//                               min="0"
//                               max={meal.qty}
//                               value={
//                                 orderDoneCounts[order.id]?.[meal.type] || ""
//                               }
//                               onChange={(e) =>
//                                 handleOrderDoneChange(
//                                   order.id,
//                                   meal.type,
//                                   e.target.value
//                                 )
//                               }
//                               className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
//                               placeholder="0"
//                             />
//                             <span className="text-sm text-gray-500">
//                               من {meal.qty}
//                             </span>
//                           </div>
//                         </div>
//                         {/* حالة الإنجاز */}
//                         <div className="mt-4 pt-4 border-t border-gray-100">
//                           {progress === 100 ? (
//                             <div className="flex items-center gap-2 text-green-600">
//                               <CheckCircleIcon className="w-5 h-5" />
//                               <span className="font-semibold">
//                                 مكتمل بنجاح!
//                               </span>
//                             </div>
//                           ) : progress > 50 ? (
//                             <div className="flex items-center gap-2 text-blue-600">
//                               <ClockIcon className="w-5 h-5" />
//                               <span className="font-semibold">قيد الإنجاز</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center gap-2 text-orange-600">
//                               <ExclamationTriangleIcon className="w-5 h-5" />
//                               <span className="font-semibold">
//                                 يحتاج انتباه
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* قائمة الوجبات مع التقدم */}
//         {/* This section is now handled by the govFilter logic above */}

//         {/* ملاحظات للمطبخ */}
//         <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
//           <h4 className="text-lg font-bold text-brand-dark mb-3 flex items-center gap-2">
//             <span className="text-2xl">💡</span>
//             نصائح للمطبخ
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-dark">
//             <div className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               <span>راجع الطلبات المطلوبة قبل بدء الإنتاج</span>
//             </div>
//             <div className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               <span>حدث الإنجاز فور الانتهاء من كل دفعة</span>
//             </div>
//             <div className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               <span>ركز على الأنواع الأكثر طلباً أولاً</span>
//             </div>
//             <div className="flex items-start gap-2">
//               <span className="text-blue-600 font-bold">•</span>
//               <span>تأكد من جودة المنتج قبل التوصيل</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       {toast && (
//         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
//           <CheckCircleIcon className="w-6 h-6 text-white" />
//           <span>
//             تم إنجاز الطلب للعميل <b>{toast.customerName}</b> (
//             {toast.governorate})
//           </span>
//         </div>
//       )}
//       {kitchenCompletedOrders.length > 0 && (
//         <div className="mt-12">
//           <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
//             الطلبات المكتملة (آخر 24 ساعة)
//           </h2>
//           {/* عرض كروت على الموبايل وجدول على الشاشات الأكبر */}
//           <div className="block sm:hidden space-y-4">
//             {kitchenCompletedOrders.map((order, idx) => (
//               <div
//                 key={order?.id ? `order-${order.id}` : `row-${idx}`}
//                 className="bg-white rounded-xl shadow-lg border border-green-200 p-4 flex flex-col gap-2"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="font-bold text-green-900">
//                     {order.customerName}
//                   </span>
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                     {order.governorate}
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500 mb-1">
//                   {new Date(order.completedAt).toLocaleString()}
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {order.products && order.products.map((p, i) => (
//                     <span
//                       key={p.type + "-" + i}
//                       className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs"
//                     >
//                       {p.type} ({p.quantity})
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="hidden sm:block overflow-x-auto rounded-2xl shadow-lg border border-green-200 bg-white/90">
//             <table className="min-w-[320px] sm:min-w-[600px] w-full text-center text-xs sm:text-base">
//               <thead>
//                 <tr className="bg-green-100 text-green-800 text-base sm:text-lg">
//                   <th className="py-2 px-2 sm:px-4">اسم العميل</th>
//                   <th className="py-2 px-2 sm:px-4">المحافظة</th>
//                   <th className="py-2 px-2 sm:px-4">تاريخ الإنجاز</th>
//                   <th className="py-2 px-2 sm:px-4">المنتجات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {kitchenCompletedOrders.map((order, idx) => (
//                   <tr
//                     key={order?.id ? `order-${order.id}` : `row-${idx}`}
//                     className="border-t hover:bg-green-50 transition"
//                   >
//                     <td className="py-2 px-2 sm:px-4 font-semibold">
//                       {order.customerName}
//                     </td>
//                     <td className="py-2 px-2 sm:px-4">{order.governorate}</td>
//                     <td className="py-2 px-2 sm:px-4">
//                       {new Date(order.completedAt).toLocaleString()}
//                     </td>
//                     <td className="py-2 px-2 sm:px-4">
//                       {order.products && order.products.map((p, i) => (
//                         <span
//                           key={p.type + "-" + i}
//                           className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs mx-1"
//                         >
//                           {p.type} ({p.quantity})
//                         </span>
//                       ))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default KitchenDashboard;

import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { OrdersContext } from "../contexts/OrdersContext";
import {
  CalendarDaysIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// دالة مساعدة لحساب بداية اليوم
const getToday = () => new Date().toISOString().slice(0, 10);

const KitchenDashboard = () => {
  const {
    orders,
    completedOrders,
    setOrders,
    setCompletedOrders,
    addCompletedOrder,
  } = useContext(OrdersContext);
  const today = getToday();

  // جلب جميع الطلبات التي لم يتم تنفيذها
  const completedIds = useMemo(
    () => completedOrders.map((o) => o.id),
    [completedOrders]
  );
  const pendingOrders = useMemo(
    () => orders.filter((o) => !completedIds.includes(o.id)),
    [orders, completedIds]
  );

  // حساب عدد الطلبات لكل منتج
  const countByType = useCallback((ordersList) => {
    return ordersList.reduce((acc, order) => {
      (order.products || []).forEach((p) => {
        acc[p.type] = (acc[p.type] || 0) + Number(p.quantity);
      });
      return acc;
    }, {});
  }, []);

  const pendingTotals = useMemo(
    () => countByType(pendingOrders),
    [pendingOrders, countByType]
  );
  const mealList = useMemo(
    () =>
      Object.entries(pendingTotals)
        .map(([type, qty]) => ({ type, qty }))
        .sort((a, b) => b.qty - a.qty),
    [pendingTotals]
  );

  // حالة فلتر المحافظة
  const [govFilter, setGovFilter] = useState("");
  const allGovernorates = useMemo(
    () =>
      Array.from(
        new Set(pendingOrders.map((o) => o.governorate).filter(Boolean))
      ),
    [pendingOrders]
  );

  // تصفية الطلبات حسب المحافظة
  const filteredPendingOrders = useMemo(
    () =>
      govFilter && allGovernorates.includes(govFilter)
        ? pendingOrders.filter((o) => o.governorate === govFilter)
        : pendingOrders,
    [govFilter, allGovernorates, pendingOrders]
  );
  const filteredTotals = useMemo(
    () => countByType(filteredPendingOrders),
    [filteredPendingOrders, countByType]
  );
  const filteredMealList = useMemo(
    () =>
      Object.entries(filteredTotals)
        .map(([type, qty]) => ({ type, qty }))
        .sort((a, b) => b.qty - a.qty),
    [filteredTotals]
  );

  // حالة الإنجاز لكل طلب
  const [orderDoneCounts, setOrderDoneCounts] = useState(() => {
    try {
      const saved = localStorage.getItem("kitchenOrderDoneCounts");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error(
        "Failed to load kitchenOrderDoneCounts from localStorage:",
        e
      );
      return {};
    }
  });

  // حفظ التغييرات في localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "kitchenOrderDoneCounts",
        JSON.stringify(orderDoneCounts)
      );
    } catch (e) {
      console.error(
        "Failed to save kitchenOrderDoneCounts to localStorage:",
        e
      );
    }
  }, [orderDoneCounts]);

  // تحديث عدد المنجز لمنتج معين
  const handleOrderDoneChange = useCallback((orderId, type, value) => {
    const parsedValue = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(parsedValue)) return;

    setOrderDoneCounts((prev) => {
      const prevOrder = prev[orderId] || {};
      const newValue = Math.min(parsedValue, Number.MAX_SAFE_INTEGER);
      return {
        ...prev,
        [orderId]: {
          ...prevOrder,
          [type]: newValue,
        },
      };
    });
  }, []);

  // حالة لتتبع الطلبات التي تم إنجازها للتو
  const [justCompleted, setJustCompleted] = useState([]);
  const [autoCompleted, setAutoCompleted] = useState([]);
  const [toast, setToast] = useState(null);

  const [kitchenCompletedOrders, setKitchenCompletedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("kitchenCompletedOrders");
      const now = Date.now();
      return saved
        ? JSON.parse(saved).filter(
            (o) => now - o.completedAt < 24 * 60 * 60 * 1000
          )
        : [];
    } catch (e) {
      console.error(
        "Failed to load kitchenCompletedOrders from localStorage:",
        e
      );
      return [];
    }
  });

  // الإنجاز التلقائي للطلبات
  useEffect(() => {
    const updatedOrders = pendingOrders.filter((order) => {
      if (!order.id) return false;
      const doneForOrder = orderDoneCounts[order.id] || {};
      return (
        (order.products || []).every((p) => {
          const done = doneForOrder[p.type] || 0;
          return done >= Number(p.quantity);
        }) && !autoCompleted.includes(order.id)
      );
    });

    updatedOrders.forEach((order) => {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      const completedOrder = { ...order, completedAt: Date.now() };
      setKitchenCompletedOrders((prev) => [...prev, completedOrder]);
      addCompletedOrder(completedOrder);
      setAutoCompleted((prev) => [...prev, order.id]);
      setToast({
        id: order.id,
        customerName: order.customerName,
        governorate: order.governorate,
      });
      setTimeout(() => setToast(null), 4000);
    });
  }, [
    orderDoneCounts,
    pendingOrders,
    autoCompleted,
    setOrders,
    setKitchenCompletedOrders,
    addCompletedOrder,
  ]);

  // إحصائيات جديدة
  const totalPending = useMemo(
    () =>
      pendingOrders.reduce(
        (sum, order) =>
          sum +
          (order.products || []).reduce((s, p) => s + Number(p.quantity), 0),
        0
      ),
    [pendingOrders]
  );
  const totalDone = useMemo(
    () =>
      pendingOrders.reduce(
        (sum, order) =>
          sum +
          (order.products || []).reduce(
            (s, p) =>
              s +
              Math.min(
                orderDoneCounts[order.id]?.[p.type] || 0,
                Number(p.quantity)
              ),
            0
          ),
        0
      ),
    [pendingOrders, orderDoneCounts]
  );

  // حذف الطلبات المكتملة بعد 24 ساعة
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setKitchenCompletedOrders((prev) =>
        prev.filter((o) => now - o.completedAt < 24 * 60 * 60 * 1000)
      );
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // حفظ الطلبات المكتملة في localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "kitchenCompletedOrders",
        JSON.stringify(kitchenCompletedOrders)
      );
    } catch (e) {
      console.error(
        "Failed to save kitchenCompletedOrders to localStorage:",
        e
      );
    }
  }, [kitchenCompletedOrders]);

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-8 w-full">
        {/* فلتر المحافظة */}
        <div className="mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center w-full">
          <label className="font-semibold text-brand-dark flex items-center gap-2 text-base sm:text-lg">
            <span className="bg-yellow-100 p-2 rounded-lg">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </span>
            تصفية حسب المحافظة:
          </label>
          <select
            className="border-2 border-gray-200 rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark text-sm sm:text-base"
            value={govFilter}
            onChange={(e) => setGovFilter(e.target.value)}
          >
            <option value="">كل المحافظات</option>
            {allGovernorates.map((gov, i) => (
              <option key={i} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>
        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
            <FireIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-brand-dark mb-2">
            لوحة المطبخ
          </h1>
          <p className="text-brand-olive text-base sm:text-lg">
            إدارة الطلبات والإنتاج اليومي
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm">
                  إجمالي المطلوب
                </p>
                <p className="text-xl sm:text-2xl font-bold">{totalPending}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">تم الإنجاز</p>
                <p className="text-xl sm:text-2xl font-bold">{totalDone}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">المتبقي</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {Math.max(0, totalPending - totalDone)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">
                  نسبة الإنجاز
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {totalPending > 0
                    ? Math.min(
                        100,
                        Math.round((totalDone / totalPending) * 100)
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص الطلبات غير المنفذة */}
        {govFilter === "" && allGovernorates.length > 0 ? (
          allGovernorates.map((gov, idx) => {
            const govOrders = filteredPendingOrders.filter(
              (o) => o.governorate === gov
            );
            const govTotals = countByType(govOrders);
            const govMealList = Object.entries(govTotals)
              .map(([type, qty]) => ({ type, qty }))
              .sort((a, b) => b.qty - a.qty);
            if (govOrders.length === 0) return null;
            return (
              <div key={idx} className="mb-12">
                <h2 className="text-2xl font-bold text-brand-brown mb-4 text-center">
                  طلبات محافظة {gov}
                </h2>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">
                        الطلبات غير المنفذة
                      </h3>
                      <p className="text-brand-olive text-sm">اليوم وما بعده</p>
                    </div>
                  </div>
                  {Object.keys(govTotals).length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-brand-olive text-lg">
                        لا يوجد طلبات غير منفذة
                      </p>
                      <p className="text-gray-500 text-sm">
                        جميع الطلبات تم إنجازها بنجاح!
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* <div className="block sm:hidden space-y-4">
                        {govOrders.map((order, idx) => {
                          const doneForOrder =
                            order.id && orderDoneCounts[order.id]
                              ? orderDoneCounts[order.id]
                              : {};
                          const allDone = (order.products || []).every((p) => {
                            const done = doneForOrder[p.type] || 0;
                            return done >= Number(p.quantity);
                          });
                          return (
                            <div
                              key={
                                order.id ? `order-${order.id}` : `row-${idx}`
                              }
                              className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-orange-800">
                                  {(order.products || [])
                                    .map((p) => p.type)
                                    .join(", ")}
                                </span>
                                <span className="bg-orange-200 text-orange-900 px-2 py-1 rounded text-xs">
                                  {order.governorate}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                تاريخ: {order.date}
                              </div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(order.products || []).map((p, i) => (
                                  <span
                                    key={`${p.type}-${i}`}
                                    className="bg-orange-100 text-orange-900 px-2 py-1 rounded text-xs"
                                  >
                                    {p.type}: {p.quantity}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(order.products || []).map((p, i) => (
                                  <div
                                    key={`${p.type}-${i}`}
                                    className="flex items-center gap-1"
                                  >
                                    <span className="text-xs font-semibold text-brand-dark">
                                      {p.type}:
                                    </span>
                                    <input
                                      type="number"
                                      inputmode="numeric"
                                      min="0"
                                      max={p.quantity}
                                      value={doneForOrder[p.type] || ""}
                                      onChange={(e) =>
                                        handleOrderDoneChange(
                                          order.id ?? idx,
                                          p.type,
                                          e.target.value
                                        )
                                      }
                                      className="w-16 border-2 border-gray-200 rounded-lg px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                                      placeholder={`0 من ${p.quantity}`}
                                      disabled={allDone}
                                    />
                                    <span className="text-xs text-gray-500">
                                      من {p.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {allDone && (
                                <span className="mt-2 text-green-700 font-bold text-xs">
                                  مكتمل بنجاح!
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {govOrders.map((order, idx) => {
                          const doneForOrder =
                            order.id && orderDoneCounts[order.id]
                              ? orderDoneCounts[order.id]
                              : {};
                          const allDone = (order.products || []).every((p) => {
                            const done = doneForOrder[p.type] || 0;
                            return done >= Number(p.quantity);
                          });
                          return (
                            <div
                              key={
                                order.id ? `order-${order.id}` : `row-${idx}`
                              }
                              className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2 mb-4"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-orange-800 text-lg">
                                    {(order.products || [])
                                      .map((p) => p.type)
                                      .join(", ")}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    محافظة: {order.governorate}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    تاريخ: {order.date}
                                  </p>
                                </div>
                                <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                                  {(order.products || []).reduce(
                                    (sum, p) => sum + Number(p.quantity),
                                    0
                                  )}{" "}
                                  مطلوب
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-2">
                                {(order.products || []).map((p, i) => (
                                  <div
                                    key={`${p.type}-${i}`}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-sm font-semibold text-brand-dark">
                                      {p.type}:
                                    </span>
                                    <input
                                      type="number"
                                      inputmode="numeric"
                                      min="0"
                                      max={p.quantity}
                                      value={doneForOrder[p.type] || ""}
                                      onChange={(e) =>
                                        handleOrderDoneChange(
                                          order.id ?? idx,
                                          p.type,
                                          e.target.value
                                        )
                                      }
                                      className="w-20 border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                                      placeholder={`0 من ${p.quantity}`}
                                      disabled={allDone}
                                    />
                                    <span className="text-xs text-gray-500">
                                      من {p.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {allDone && (
                                <span className="mt-2 text-green-700 font-bold">
                                  مكتمل بنجاح!
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div> */}
                      // تعديل حقل الإدخال في قسم الموبايل
                      <div className="block sm:hidden space-y-4">
                        {govOrders.map((order, idx) => {
                          const doneForOrder =
                            order.id && orderDoneCounts[order.id]
                              ? orderDoneCounts[order.id]
                              : {};
                          const allDone = (order.products || []).every((p) => {
                            const done = doneForOrder[p.type] || 0;
                            console.log(
                              `Product: ${p.type}, Done: ${done}, Quantity: ${p.quantity}`
                            );
                            return done >= Number(p.quantity);
                          });
                          return (
                            <div
                              key={
                                order.id ? `order-${order.id}` : `row-${idx}`
                              }
                              className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-orange-800">
                                  {(order.products || [])
                                    .map((p) => p.type)
                                    .join(", ")}
                                </span>
                                <span className="bg-orange-200 text-orange-900 px-2 py-1 rounded text-xs">
                                  {order.governorate}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                تاريخ: {order.date}
                              </div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(order.products || []).map((p, i) => (
                                  <span
                                    key={`${p.type}-${i}`}
                                    className="bg-orange-100 text-orange-900 px-2 py-1 rounded text-xs"
                                  >
                                    {p.type}: {p.quantity}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(order.products || []).map((p, i) => (
                                  <div
                                    key={`${p.type}-${i}`}
                                    className="flex items-center gap-1"
                                  >
                                    <span className="text-xs font-semibold text-brand-dark">
                                      {p.type}:
                                    </span>

                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      value={
                                        doneForOrder[p.type] !== undefined
                                          ? doneForOrder[p.type]
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) {
                                          handleOrderDoneChange(
                                            order.id ?? idx,
                                            p.type,
                                            val
                                          );
                                        }
                                      }}
                                      className="w-20 border-2 border-gray-200 rounded-lg px-2 py-2 text-sm touch-action-manipulation focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                                      placeholder={`0 من ${p.quantity}`}
                                      disabled={allDone}
                                      onFocus={(e) => e.target.select()}
                                    />

                                    <span className="text-xs text-gray-500">
                                      من {p.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {allDone && (
                                <span className="mt-2 text-green-700 font-bold text-xs">
                                  مكتمل بنجاح!
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      // تعديل حقل الإدخال في قسم الشاشات الأكبر
                      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {govOrders.map((order, idx) => {
                          const doneForOrder =
                            order.id && orderDoneCounts[order.id]
                              ? orderDoneCounts[order.id]
                              : {};
                          const allDone = (order.products || []).every((p) => {
                            const done = doneForOrder[p.type] || 0;
                            console.log(
                              `Product: ${p.type}, Done: ${done}, Quantity: ${p.quantity}`
                            );
                            return done >= Number(p.quantity);
                          });
                          return (
                            <div
                              key={
                                order.id ? `order-${order.id}` : `row-${idx}`
                              }
                              className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2 mb-4"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-orange-800 text-lg">
                                    {(order.products || [])
                                      .map((p) => p.type)
                                      .join(", ")}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    محافظة: {order.governorate}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    تاريخ: {order.date}
                                  </p>
                                </div>
                                <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                                  {(order.products || []).reduce(
                                    (sum, p) => sum + Number(p.quantity),
                                    0
                                  )}{" "}
                                  مطلوب
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-2">
                                {(order.products || []).map((p, i) => (
                                  <div
                                    key={`${p.type}-${i}`}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-sm font-semibold text-brand-dark">
                                      {p.type}:
                                    </span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      value={
                                        doneForOrder[p.type] !== undefined
                                          ? doneForOrder[p.type]
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) {
                                          handleOrderDoneChange(
                                            order.id ?? idx,
                                            p.type,
                                            val
                                          );
                                        }
                                      }}
                                      className="w-20 border-2 border-gray-200 rounded-lg px-2 py-2 text-sm touch-action-manipulation focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                                      placeholder={`0 من ${p.quantity}`}
                                      disabled={allDone}
                                      onFocus={(e) => e.target.select()}
                                    />

                                    <span className="text-xs text-gray-500">
                                      من {p.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {allDone && (
                                <span className="mt-2 text-green-700 font-bold">
                                  مكتمل بنجاح!
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FireIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">
                        قائمة الوجبات المطلوبة
                      </h3>
                      <p className="text-brand-olive text-sm">
                        تتبع الإنجاز لكل نوع
                      </p>
                    </div>
                  </div>
                  {govMealList.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🍽️</div>
                      <p className="text-brand-olive text-lg">
                        لا يوجد وجبات مطلوبة
                      </p>
                      <p className="text-gray-500 text-sm">
                        جميع الطلبات تم إنجازها
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {govMealList.map((meal) => {
                        const done = pendingOrders.reduce(
                          (sum, order) =>
                            sum + (orderDoneCounts[order.id]?.[meal.type] || 0),
                          0
                        );
                        const remaining = meal.qty - done;
                        const progress = Math.min(
                          100,
                          (done / Number(meal.qty)) * 100
                        );

                        return (
                          <div
                            key={meal.type}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xl font-bold text-brand-dark">
                                {meal.type}
                              </h4>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-brand-brown">
                                  {meal.qty}
                                </div>
                                <div className="text-sm text-gray-500">
                                  إجمالي المطلوب
                                </div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-green-600 font-semibold">
                                  تم الإنجاز: {done}
                                </span>
                                <span className="text-orange-600 font-semibold">
                                  المتبقي: {remaining}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <div className="text-center mt-1">
                                <span className="text-sm font-semibold text-brand-dark">
                                  {Math.round(progress)}% مكتمل
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              {progress === 100 ? (
                                <div className="flex items-center gap-2 text-green-600">
                                  <CheckCircleIcon className="w-5 h-5" />
                                  <span className="font-semibold">
                                    مكتمل بنجاح!
                                  </span>
                                </div>
                              ) : progress > 50 ? (
                                <div className="flex items-center gap-2 text-blue-600">
                                  <ClockIcon className="w-5 h-5" />
                                  <span className="font-semibold">
                                    قيد الإنجاز
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-orange-600">
                                  <ExclamationTriangleIcon className="w-5 h-5" />
                                  <span className="font-semibold">
                                    يحتاج انتباه
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">
                    الطلبات غير المنفذة
                  </h3>
                  <p className="text-brand-olive text-sm">اليوم وما بعده</p>
                </div>
              </div>
              {Object.keys(filteredTotals).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-brand-olive text-lg">
                    لا يوجد طلبات غير منفذة
                  </p>
                  <p className="text-gray-500 text-sm">
                    جميع الطلبات تم إنجازها بنجاح!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPendingOrders.map((order, idx) => (
                    <div
                      key={order.id ? `order-${order.id}` : `row-${idx}`}
                      className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-orange-800 text-lg">
                          {(order.products || []).map((p) => p.type).join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          محافظة: {order.governorate}
                        </p>
                        <p className="text-sm text-gray-500">
                          تاريخ: {order.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                          {(order.products || []).reduce(
                            (sum, p) => sum + Number(p.quantity),
                            0
                          )}{" "}
                          مطلوب
                        </span>
                        {(order.products || []).every((p) => {
                          const done = orderDoneCounts[order.id]?.[p.type] || 0;
                          return done >= Number(p.quantity);
                        }) && (
                          <span className="ml-2 text-green-700 font-bold">
                            مكتمل بنجاح!
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FireIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">
                    قائمة الوجبات المطلوبة
                  </h3>
                  <p className="text-brand-olive text-sm">
                    تتبع الإنجاز لكل نوع
                  </p>
                </div>
              </div>
              {filteredMealList.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-brand-olive text-lg">
                    لا يوجد وجبات مطلوبة
                  </p>
                  <p className="text-gray-500 text-sm">
                    جميع الطلبات تم إنجازها
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMealList.map((meal) => {
                    const done = pendingOrders.reduce(
                      (sum, order) =>
                        sum + (orderDoneCounts[order.id]?.[meal.type] || 0),
                      0
                    );
                    const remaining = meal.qty - done;
                    const progress = Math.min(
                      100,
                      (done / Number(meal.qty)) * 100
                    );

                    return (
                      <div
                        key={meal.type}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-brand-dark">
                            {meal.type}
                          </h4>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-brand-brown">
                              {meal.qty}
                            </div>
                            <div className="text-sm text-gray-500">
                              إجمالي المطلوب
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-green-600 font-semibold">
                              تم الإنجاز: {done}
                            </span>
                            <span className="text-orange-600 font-semibold">
                              المتبقي: {remaining}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="text-center mt-1">
                            <span className="text-sm font-semibold text-brand-dark">
                              {Math.round(progress)}% مكتمل
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-brand-dark">
                            تحديث الإنجاز:
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              inputmode="numeric"
                              min="0"
                              max={meal.qty}
                              value={orderDoneCounts[meal.type] || ""}
                              onChange={(e) =>
                                handleOrderDoneChange(
                                  meal.type,
                                  meal.type,
                                  e.target.value
                                )
                              }
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                              placeholder="0"
                            />
                            <span className="text-sm text-gray-500">
                              من {meal.qty}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {progress === 100 ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircleIcon className="w-5 h-5" />
                              <span className="font-semibold">
                                مكتمل بنجاح!
                              </span>
                            </div>
                          ) : progress > 50 ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <ClockIcon className="w-5 h-5" />
                              <span className="font-semibold">قيد الإنجاز</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-orange-600">
                              <ExclamationTriangleIcon className="w-5 h-5" />
                              <span className="font-semibold">
                                يحتاج انتباه
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-brand-dark mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            نصائح للمطبخ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-dark">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>راجع الطلبات المطلوبة قبل بدء الإنتاج</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>حدث الإنجاز فور الانتهاء من كل دفعة</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>ركز على الأنواع الأكثر طلباً أولاً</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>تأكد من جودة المنتج قبل التوصيل</span>
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-100 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
          <CheckCircleIcon className="w-6 h-6 text-white" />
          <span>
            تم إنجاز الطلب للعميل <b>{toast.customerName}</b> (
            {toast.governorate})
          </span>
        </div>
      )}
      {kitchenCompletedOrders.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
            الطلبات المكتملة (آخر 24 ساعة)
          </h2>
          <div className="block sm:hidden space-y-4">
            {kitchenCompletedOrders.map((order, idx) => (
              <div
                key={order.id ? `order-${order.id}` : `row-${idx}`}
                className="bg-white rounded-xl shadow-lg border border-green-200 p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-green-900">
                    {order.customerName}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {order.governorate}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(order.completedAt).toLocaleString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(order.products || []).map((p, i) => (
                    <span
                      key={`${p.type}-${i}`}
                      className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs"
                    >
                      {p.type} ({p.quantity})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto rounded-2xl shadow-lg border border-green-200 bg-white/90">
            <table className="min-w-[320px] sm:min-w-[600px] w-full text-center text-xs sm:text-base">
              <thead>
                <tr className="bg-green-100 text-green-800 text-base sm:text-lg">
                  <th className="py-2 px-2 sm:px-4">اسم العميل</th>
                  <th className="py-2 px-2 sm:px-4">المحافظة</th>
                  <th className="py-2 px-2 sm:px-4">تاريخ الإنجاز</th>
                  <th className="py-2 px-2 sm:px-4">المنتجات</th>
                </tr>
              </thead>
              <tbody>
                {kitchenCompletedOrders.map((order, idx) => (
                  <tr
                    key={order.id ? `order-${order.id}` : `row-${idx}`}
                    className="border-t hover:bg-green-50 transition"
                  >
                    <td className="py-2 px-2 sm:px-4 font-semibold">
                      {order.customerName}
                    </td>
                    <td className="py-2 px-2 sm:px-4">{order.governorate}</td>
                    <td className="py-2 px-2 sm:px-4">
                      {new Date(order.completedAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-2 sm:px-4">
                      {(order.products || []).map((p, i) => (
                        <span
                          key={`${p.type}-${i}`}
                          className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs mx-1"
                        >
                          {p.type} ({p.quantity})
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;
