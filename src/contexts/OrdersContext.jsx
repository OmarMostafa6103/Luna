import React, { createContext, useState, useEffect } from 'react';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  // عند أول تحميل: جلب الطلبات من localStorage إذا وجدت
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // إضافة حالة الطلبات المنجزة
  const [completedOrders, setCompletedOrders] = useState(() => {
    const saved = localStorage.getItem('completedOrders');
    let arr = saved ? JSON.parse(saved) : [];
    // فلترة الطلبات القديمة (أكثر من 24 ساعة)
    const now = Date.now();
    arr = arr.filter(o => !o.completedAt || now - o.completedAt < 24*60*60*1000);
    return arr;
  });

  // عند أي تغيير في الطلبات: حفظها في localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // عند أي تغيير في الطلبات المنجزة: حفظها في localStorage مع حذف الطلبات القديمة
  useEffect(() => {
    const now = Date.now();
    const filtered = completedOrders.filter(o => !o.completedAt || now - o.completedAt < 24*60*60*1000);
    if (filtered.length !== completedOrders.length) {
      setCompletedOrders(filtered);
    }
    localStorage.setItem('completedOrders', JSON.stringify(filtered));
  }, [completedOrders]);

  // دالة مساعدة لإضافة completedAt عند نقل الطلب للمنجزين
  const addCompletedOrder = (order) => {
    setCompletedOrders(prev => [...prev, { ...order, completedAt: order.completedAt || Date.now() }]);
  };

  return (
    <OrdersContext.Provider value={{ orders, setOrders, completedOrders, setCompletedOrders, addCompletedOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}; 