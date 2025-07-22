import React, { useContext, useState, useEffect } from "react";
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
  const { orders, completedOrders, setOrders, setCompletedOrders } =
    useContext(OrdersContext);
  const today = getToday();

  // جلب جميع الطلبات التي لم يتم تنفيذها (بدون فلترة التاريخ)
  const completedIds = completedOrders.map((o) => o.id);
  const pendingOrders = orders.filter((o) => !completedIds.includes(o.id));

  // حساب عدد الطلبات لكل منتج من الطلبات غير المنفذة
  const countByType = (ordersList) => {
    return ordersList.reduce((acc, order) => {
      order.products.forEach((p) => {
        acc[p.type] = (acc[p.type] || 0) + Number(p.quantity);
      });
      return acc;
    }, {});
  };

  const pendingTotals = countByType(pendingOrders);

  // قائمة الوجبات مرتبة حسب النوع والكمية
  const mealList = Object.entries(pendingTotals)
    .map(([type, qty]) => ({ type, qty }))
    .sort((a, b) => b.qty - a.qty);

  // حالة فلتر المحافظة
  const [govFilter, setGovFilter] = useState("");

  // استخراج جميع المحافظات من الطلبات غير المنفذة
  const allGovernorates = Array.from(
    new Set(pendingOrders.map((o) => o.governorate).filter(Boolean))
  );

  // تصفية الطلبات غير المنفذة حسب المحافظة
  const filteredPendingOrders = govFilter
    ? pendingOrders.filter((o) => o.governorate === govFilter)
    : pendingOrders;
  const filteredTotals = countByType(filteredPendingOrders);
  const filteredMealList = Object.entries(filteredTotals)
    .map(([type, qty]) => ({ type, qty }))
    .sort((a, b) => b.qty - a.qty);

  // حالة الإنجاز لكل طلب (وليس لكل نوع)
  const [orderDoneCounts, setOrderDoneCounts] = useState(() => {
    const saved = localStorage.getItem("kitchenOrderDoneCounts");
    return saved ? JSON.parse(saved) : {};
  });

  // حفظ التغييرات في localStorage
  useEffect(() => {
    localStorage.setItem(
      "kitchenOrderDoneCounts",
      JSON.stringify(orderDoneCounts)
    );
  }, [orderDoneCounts]);

  // تحديث عدد المنجز لمنتج معين في طلب معين
  const handleOrderDoneChange = (orderId, type, value) => {
    setOrderDoneCounts((prev) => {
      const prevOrder = prev[orderId] || {};
      return {
        ...prev,
        [orderId]: {
          ...prevOrder,
          [type]: Math.max(0, Number(value)),
        },
      };
    });
  };

  // حالة لتتبع الطلبات التي تم إنجازها للتو
  const [justCompleted, setJustCompleted] = useState([]);

  // حالة لتتبع الطلبات التي تم نقلها تلقائياً
  const [autoCompleted, setAutoCompleted] = useState([]);
  const [toast, setToast] = useState(null);

  // الإنجاز التلقائي للطلبات
  useEffect(() => {
    pendingOrders.forEach((order) => {
      const doneForOrder = orderDoneCounts[order.id] || {};
      const allDone = order.products.every((p) => {
        const done = doneForOrder[p.type] || 0;
        return done >= Number(p.quantity);
      });
      if (allDone && !autoCompleted.includes(order.id)) {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        setCompletedOrders((prev) => [...prev, order]);
        setAutoCompleted((prev) => [...prev, order.id]);
        setToast({
          id: order.id,
          customerName: order.customerName,
          governorate: order.governorate,
        });
        setTimeout(() => setToast(null), 4000);
      }
    });
  }, [
    pendingOrders,
    orderDoneCounts,
    autoCompleted,
    setOrders,
    setCompletedOrders,
  ]);

  // دالة لمتابعة الإنجاز التلقائي
  useEffect(() => {
    // لكل طلب غير منجز
    pendingOrders.forEach((order) => {
      // تحقق أن كل منتج في الطلب تم إنجازه بالكامل
      const allDone = order.products.every((p) => {
        const done = orderDoneCounts[order.id]?.[p.type] || 0;
        return done >= Number(p.quantity);
      });
      if (allDone && !autoCompleted.includes(order.id)) {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        setCompletedOrders((prev) => [...prev, order]);
        setAutoCompleted((prev) => [...prev, order.id]);
        setToast({
          id: order.id,
          customerName: order.customerName,
          governorate: order.governorate,
        });
        setTimeout(() => setToast(null), 4000);
      }
    });
  }, [
    pendingOrders,
    orderDoneCounts,
    autoCompleted,
    setOrders,
    setCompletedOrders,
  ]);

  // إحصائيات جديدة بناءً على منطق الإنجاز لكل طلب
  const totalPending = pendingOrders.reduce(
    (sum, order) =>
      sum + order.products.reduce((s, p) => s + Number(p.quantity), 0),
    0
  );
  const totalDone = pendingOrders.reduce(
    (sum, order) =>
      sum +
      order.products.reduce(
        (s, p) =>
          s +
          Math.min(
            orderDoneCounts[order.id]?.[p.type] || 0,
            Number(p.quantity)
          ),
        0
      ),
    0
  );

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        {/* فلتر المحافظة */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <label className="font-semibold text-brand-dark flex items-center gap-2 text-lg">
            <span className="bg-yellow-100 p-2 rounded-lg">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </span>
            تصفية حسب المحافظة:
          </label>
          <select
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark"
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
            <FireIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">
            لوحة المطبخ
          </h1>
          <p className="text-brand-olive text-lg">
            إدارة الطلبات والإنتاج اليومي
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">إجمالي المطلوب</p>
                <p className="text-2xl font-bold">{totalPending}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">تم الإنجاز</p>
                <p className="text-2xl font-bold">{totalDone}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">المتبقي</p>
                <p className="text-2xl font-bold">
                  {Math.max(0, totalPending - totalDone)}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">نسبة الإنجاز</p>
                <p className="text-2xl font-bold">
                  {totalPending > 0
                    ? Math.round((totalDone / totalPending) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص الطلبات غير المنفذة */}
        {govFilter === "" && allGovernorates.length > 0 ? (
          // تجميع حسب المحافظة
          allGovernorates.map((gov, idx) => {
            const govOrders = pendingOrders.filter(
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
                {/* ملخص الطلبات */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {govOrders.map((order) => {
                        const doneForOrder = orderDoneCounts[order.id] || {};
                        const allDone = order.products.every((p) => {
                          const done = doneForOrder[p.type] || 0;
                          return done >= Number(p.quantity);
                        });
                        return (
                          <div
                            key={order.id}
                            className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-2 mb-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-orange-800 text-lg">
                                  {order.products.map((p) => p.type).join(", ")}
                                </p>
                                <p className="text-sm text-gray-500">
                                  محافظة: {order.governorate}
                                </p>
                                <p className="text-sm text-gray-500">
                                  تاريخ: {order.date}
                                </p>
                              </div>
                              <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                                {order.products.reduce(
                                  (sum, p) => sum + Number(p.quantity),
                                  0
                                )}{" "}
                                مطلوب
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {order.products.map((p, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-sm font-semibold text-brand-dark">
                                    {p.type}:
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={p.quantity}
                                    value={doneForOrder[p.type] || ""}
                                    onChange={(e) =>
                                      handleOrderDoneChange(
                                        order.id,
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
                    </div>
                  )}
                </div>
                {/* قائمة الوجبات */}
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
                            {/* شريط التقدم */}
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
                            {/* حالة الإنجاز */}
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
            {/* ملخص الطلبات غير المنفذة */}
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
                  {filteredPendingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-orange-800 text-lg">
                          {order.products.map((p) => p.type).join(", ")}
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
                          {order.products.reduce(
                            (sum, p) => sum + Number(p.quantity),
                            0
                          )}{" "}
                          مطلوب
                        </span>
                        {(() => {
                          const allDone = order.products.every((p) => {
                            const done =
                              orderDoneCounts[order.id]?.[p.type] || 0;
                            return done >= Number(p.quantity);
                          });
                          if (allDone) {
                            return (
                              <span className="ml-2 text-green-700 font-bold">
                                مكتمل بنجاح!
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* قائمة الوجبات مع التقدم */}
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
                        {/* شريط التقدم */}
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
                        {/* إدخال الإنجاز */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-brand-dark">
                            تحديث الإنجاز:
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="0"
                              max={meal.qty}
                              value={
                                orderDoneCounts[order.id]?.[meal.type] || ""
                              }
                              onChange={(e) =>
                                handleOrderDoneChange(
                                  order.id,
                                  meal.type,
                                  e.target.value
                                )
                              }
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                              placeholder="0"
                            />
                            <span className="text-sm text-gray-500">
                              من {meal.qty}
                            </span>
                          </div>
                        </div>
                        {/* حالة الإنجاز */}
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

        {/* قائمة الوجبات مع التقدم */}
        {/* This section is now handled by the govFilter logic above */}

        {/* ملاحظات للمطبخ */}
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
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up">
          <CheckCircleIcon className="w-6 h-6 text-white" />
          <span>
            تم إنجاز الطلب للعميل <b>{toast.customerName}</b> (
            {toast.governorate})
          </span>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;
