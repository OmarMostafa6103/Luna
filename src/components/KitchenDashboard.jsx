import React, { useContext, useState, useEffect } from 'react';
import { OrdersContext } from '../contexts/OrdersContext';
import { CalendarDaysIcon, FireIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// دالة مساعدة لحساب بداية اليوم
const getToday = () => new Date().toISOString().slice(0, 10);

const KitchenDashboard = () => {
  const { orders } = useContext(OrdersContext);
  const today = getToday();

  // جلب جميع الطلبات التي لم يتم تنفيذها (تاريخها اليوم أو بعد اليوم)
  const pendingOrders = orders.filter(o => o.orderDate >= today);

  // حساب عدد الطلبات لكل منتج من الطلبات غير المنفذة
  const countByType = (ordersList) => {
    return ordersList.reduce((acc, order) => {
      order.products.forEach(p => {
        acc[p.type] = (acc[p.type] || 0) + Number(p.quantity);
      });
      return acc;
    }, {});
  };

  const pendingTotals = countByType(pendingOrders);

  // قائمة الوجبات مرتبة حسب النوع والكمية
  const mealList = Object.entries(pendingTotals).map(([type, qty]) => ({ type, qty })).sort((a, b) => b.qty - a.qty);

  // حالة عدد المنجز لكل وجبة (محفوظة في localStorage)
  const [doneCounts, setDoneCounts] = useState(() => {
    const saved = localStorage.getItem('kitchenDoneCounts');
    return saved ? JSON.parse(saved) : {};
  });

  // حفظ التغييرات في localStorage
  useEffect(() => {
    localStorage.setItem('kitchenDoneCounts', JSON.stringify(doneCounts));
  }, [doneCounts]);

  // تحديث عدد المنجز
  const handleDoneChange = (type, value) => {
    setDoneCounts({ ...doneCounts, [type]: Math.max(0, Number(value)) });
  };

  // حساب التقدم لكل نوع
  const getProgress = (type, total) => {
    const done = doneCounts[type] || 0;
    return Math.min(100, (done / total) * 100);
  };

  // حساب إجمالي المنجز
  const totalDone = Object.values(doneCounts).reduce((sum, count) => sum + count, 0);
  const totalPending = Object.values(pendingTotals).reduce((sum, count) => sum + count, 0);

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
            <FireIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">لوحة المطبخ</h1>
          <p className="text-brand-olive text-lg">إدارة الطلبات والإنتاج اليومي</p>
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
                <p className="text-2xl font-bold">{Math.max(0, totalPending - totalDone)}</p>
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
                  {totalPending > 0 ? Math.round((totalDone / totalPending) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص الطلبات غير المنفذة */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-dark">الطلبات غير المنفذة</h3>
              <p className="text-brand-olive text-sm">اليوم وما بعده</p>
            </div>
          </div>
          
          {Object.keys(pendingTotals).length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-brand-olive text-lg">لا يوجد طلبات غير منفذة</p>
              <p className="text-gray-500 text-sm">جميع الطلبات تم إنجازها بنجاح!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pendingTotals).map(([type, qty]) => (
                <div key={type} className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-orange-800 text-lg">{type}</span>
                    <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                      {qty} مطلوب
                    </span>
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
              <h3 className="text-xl font-bold text-brand-dark">قائمة الوجبات المطلوبة</h3>
              <p className="text-brand-olive text-sm">تتبع الإنجاز لكل نوع</p>
            </div>
          </div>
          
          {mealList.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-brand-olive text-lg">لا يوجد وجبات مطلوبة</p>
              <p className="text-gray-500 text-sm">جميع الطلبات تم إنجازها</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealList.map(meal => {
                const done = doneCounts[meal.type] || 0;
                const remaining = meal.qty - done;
                const progress = getProgress(meal.type, meal.qty);
                
                return (
                  <div key={meal.type} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-brand-dark">{meal.type}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-brown">{meal.qty}</div>
                        <div className="text-sm text-gray-500">إجمالي المطلوب</div>
                      </div>
                    </div>
                    
                    {/* شريط التقدم */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-600 font-semibold">تم الإنجاز: {done}</span>
                        <span className="text-orange-600 font-semibold">المتبقي: {remaining}</span>
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
                          value={doneCounts[meal.type] || ''}
                          onChange={e => handleDoneChange(meal.type, e.target.value)}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 text-center font-semibold"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-500">من {meal.qty}</span>
                      </div>
                    </div>
                    
                    {/* حالة الإنجاز */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {progress === 100 ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="font-semibold">مكتمل بنجاح!</span>
                        </div>
                      ) : progress > 50 ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <ClockIcon className="w-5 h-5" />
                          <span className="font-semibold">قيد الإنجاز</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600">
                          <ExclamationTriangleIcon className="w-5 h-5" />
                          <span className="font-semibold">يحتاج انتباه</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
    </div>
  );
};

export default KitchenDashboard; 