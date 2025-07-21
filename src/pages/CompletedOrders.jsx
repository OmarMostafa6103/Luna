import React, { useContext, useState, useEffect } from 'react';
import { OrdersContext } from '../contexts/OrdersContext';
import * as XLSX from 'xlsx';

const LOCAL_KEY = "customer_stats_data";

const CompletedOrders = () => {
  const { completedOrders } = useContext(OrdersContext);
  const [customerNotes, setCustomerNotes] = useState({});

  // تحميل الملاحظات من localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      const notesObj = {};
      arr.forEach(c => { if (c.id) notesObj[c.id] = c.notes || ""; });
      setCustomerNotes(notesObj);
    }
  }, []);

  // تحديث الملاحظة في localStorage
  const handleNoteChange = (customerId, value, customerData) => {
    setCustomerNotes(prev => ({ ...prev, [customerId]: value }));
    // تحديث بيانات العميل في localStorage
    const saved = localStorage.getItem(LOCAL_KEY);
    let arr = saved ? JSON.parse(saved) : [];
    let found = arr.find(c => c.id === customerId);
    if (found) {
      found.notes = value;
    } else {
      // إذا لم يوجد العميل، أضفه (مثلاً من الطلب المنجز)
      arr.push({
        id: customerId,
        name: customerData.customerName,
        notes: value,
        status: "ordered",
        category: "",
      });
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
  };

  const handleExport = () => {
    const data = completedOrders.map(order => ({
      'اسم العميل': order.customerName,
      'رقم الهاتف': order.phone,
      'العنوان': order.address,
      'المحافظة': order.governorate || '',
      'تاريخ الطلب': order.orderDate,
      'مصدر الطلب': order.source || '',
      'المنتجات': order.products.map(p => `${p.type} (${p.quantity})`).join(', '),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات المنجزة');
    XLSX.writeFile(wb, 'completed_orders.xlsx');
  };

  const groupedByGov = completedOrders.reduce((acc, order) => {
    const gov = order.governorate || 'غير محدد';
    if (!acc[gov]) acc[gov] = [];
    acc[gov].push(order);
    return acc;
  }, {});

  const exportForGov = (gov) => {
    const data = (groupedByGov[gov] || []).map(order => ({
      'اسم العميل': order.customerName,
      'رقم الهاتف': order.phone,
      'العنوان': order.address,
      'المحافظة': order.governorate || '',
      'تاريخ الطلب': order.orderDate,
      'مصدر الطلب': order.source || '',
      'المنتجات': order.products.map(p => `${p.type} (${p.quantity})`).join(', '),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `طلبات ${gov}`);
    XLSX.writeFile(wb, `completed_orders_${gov}.xlsx`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-8 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-green-700 rounded-full mb-4 shadow-lg">
            <span className="text-2xl sm:text-3xl">✅</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-green-700 mb-2">الطلبات المنجزة</h1>
          <p className="text-green-800 text-base sm:text-lg">جميع الطلبات التي تم إنجازها</p>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow p-2 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2 justify-end">
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-3 sm:px-5 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-xs sm:text-base"
            >
              تصدير كل المحافظات Excel
            </button>
            {Object.keys(groupedByGov).map(gov => (
              <button
                key={gov}
                onClick={() => exportForGov(gov)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-3 sm:px-5 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-xs sm:text-base"
              >
                تصدير {gov} Excel
              </button>
            ))}
          </div>
          {Object.keys(groupedByGov).length === 0 && (
            <div className="py-12 text-center text-green-700 text-lg">
              لا توجد طلبات منجزة بعد
            </div>
          )}
          {Object.entries(groupedByGov).map(([gov, orders]) => (
            <div key={gov} className="mb-12">
              <h2 className="text-lg sm:text-2xl font-bold text-green-700 mb-4 text-center">طلبات محافظة {gov}</h2>
              <div className="overflow-x-auto rounded-xl border shadow-sm">
                <table className="min-w-[340px] sm:min-w-[600px] w-full text-center text-xs sm:text-base">
                  <thead>
                    <tr className="bg-green-50 text-green-900 text-xs sm:text-base">
                      <th className="px-2 sm:px-4 py-2">اسم العميل</th>
                      <th className="px-2 sm:px-4 py-2">رقم الهاتف</th>
                      <th className="px-2 sm:px-4 py-2">العنوان</th>
                      <th className="px-2 sm:px-4 py-2">المحافظة</th>
                      <th className="px-2 sm:px-4 py-2">تاريخ الطلب</th>
                      <th className="px-2 sm:px-4 py-2">مصدر الطلب</th>
                      <th className="px-2 sm:px-4 py-2">المنتجات</th>
                      <th className="px-2 sm:px-4 py-2">ملاحظة</th>
                      <th className="px-2 sm:px-4 py-2">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-semibold text-green-900 break-words max-w-[120px]">{order.customerName}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-800 break-words max-w-[110px]">{order.phone}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-700 font-semibold">{order.governorate}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-700 font-semibold">{order.orderDate}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-700 font-semibold">{order.source || ''}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {order.products.map((p, i) => (
                              <span key={i} className="bg-green-100 text-green-900 px-2 py-1 rounded text-xs">
                                {p.type} ({p.quantity})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-24 sm:w-32 text-xs sm:text-base"
                            value={customerNotes[order.id] || ""}
                            onChange={e => handleNoteChange(order.id, e.target.value, order)}
                            placeholder="أضف ملاحظة..."
                          />
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-green-800">
                          {order.products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0)} جنيه
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedOrders; 