import React, { useContext, useState } from 'react';
import { OrdersContext } from '../contexts/OrdersContext';
import { ArrowDownTrayIcon, PencilIcon, TrashIcon, FunnelIcon, MagnifyingGlassIcon, CalendarIcon, UserIcon, PhoneIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

// جدول عرض الطلبات مع التصفية والتعديل والحذف والتصدير
const OrderTable = () => {
  // جلب الطلبات من السياق
  const { orders, setOrders, completedOrders, setCompletedOrders } = useContext(OrdersContext);

  // حالات التصفية
  const [filter, setFilter] = useState({
    customer: '',
    product: '',
    date: '',
    governorate: '',
  });

  // حالة التعديل
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // استخراج جميع المحافظات الموجودة في الطلبات
  const allGovernorates = Array.from(new Set(orders.map(o => o.governorate).filter(Boolean)));

  // تصفية الطلبات حسب الفلاتر
  const filteredOrders = orders.filter(order => {
    const byCustomer = filter.customer ? order.customerName.includes(filter.customer) : true;
    const byProduct = filter.product ? order.products.some(p => p.type === filter.product) : true;
    const byDate = filter.date ? order.orderDate === filter.date : true;
    const byGov = filter.governorate ? order.governorate === filter.governorate : true;
    return byCustomer && byProduct && byDate && byGov;
  }).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); // الترتيب حسب التاريخ (الأحدث أولاً)

  // حذف طلب
  const handleDelete = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  // بدء التعديل
  const handleEdit = (order) => {
    setEditId(order.id);
    setEditForm({ ...order });
  };

  // حفظ التعديل
  const handleSave = () => {
    setOrders(orders.map(order => order.id === editId ? editForm : order));
    setEditId(null);
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setEditId(null);
  };

  // تصدير الطلبات المعروضة إلى Excel
  const handleExport = () => {
    const data = filteredOrders.map(order => ({
      'اسم العميل': order.customerName,
      'رقم الهاتف': order.phone,
      'العنوان': order.address,
      'المحافظة': order.governorate || '',
      'تاريخ الطلب': order.orderDate,
      'مصدر الطلب': order.source || '',
      // المنتجات: اسم المنتج والكمية فقط بدون السعر
      'المنتجات': order.products.map(p => `${p.type} (${p.quantity})`).join(', '),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    XLSX.writeFile(wb, 'orders.xlsx');
  };

  // حساب إجمالي الطلبات لكل نوع منتج
  const productTotals = orders.reduce((acc, order) => {
    order.products.forEach(p => {
      acc[p.type] = (acc[p.type] || 0) + Number(p.quantity);
    });
    return acc;
  }, {});

  // إضافة دالة لإنجاز الطلب
  const handleComplete = (id) => {
    const orderToComplete = orders.find(order => order.id === id);
    if (orderToComplete) {
      setOrders(orders.filter(order => order.id !== id));
      setCompletedOrders([...completedOrders, orderToComplete]);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 md:px-8 w-full">
        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-brand-brown to-brand-dark rounded-full mb-4 shadow-lg">
            <FunnelIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-brand-dark mb-2">جدول الطلبات</h1>
          <p className="text-brand-olive text-base sm:text-lg">إدارة وعرض جميع الطلبات</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">إجمالي الطلبات</p>
                <p className="text-xl sm:text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">طلبات اليوم</p>
                <p className="text-xl sm:text-2xl font-bold">{orders.filter(o => o.orderDate === new Date().toISOString().split('T')[0]).length}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">كلاسيك</p>
                <p className="text-xl sm:text-2xl font-bold">{productTotals.Classic || 0}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🍽️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm">جولد</p>
                <p className="text-xl sm:text-2xl font-bold">{productTotals.Gold || 0}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🥇</span>
              </div>
            </div>
          </div>
        </div>

        {/* فلاتر التصفية */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-6 mb-8">
          <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-brand-brown" />
            تصفية الطلبات
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث باسم العميل..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark placeholder:text-gray-400"
                value={filter.customer}
                onChange={e => setFilter({ ...filter, customer: e.target.value })}
              />
            </div>
            <div className="relative">
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🍽️</span>
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark appearance-none"
                value={filter.product}
                onChange={e => setFilter({ ...filter, product: e.target.value })}
              >
                <option value="">كل المنتجات</option>
                <option value="Classic">كلاسيك</option>
                <option value="Gold">جولد</option>
                <option value="Bites">بايتس</option>
              </select>
            </div>
            <div className="relative">
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark"
                value={filter.date}
                onChange={e => setFilter({ ...filter, date: e.target.value })}
              />
            </div>
            <div className="relative">
              <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300 bg-white text-brand-dark appearance-none"
                value={filter.governorate}
                onChange={e => setFilter({ ...filter, governorate: e.target.value })}
              >
                <option value="">كل المحافظات</option>
                {allGovernorates.map((gov, i) => (
                  <option key={i} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleExport} 
              className="w-full bg-gradient-to-r from-brand-brown to-brand-dark text-white px-6 py-3 rounded-xl font-semibold hover:from-brand-dark hover:to-brand-brown transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span className="hidden sm:inline">تصدير Excel</span>
              <span className="sm:hidden">تصدير</span>
            </button>
          </div>
        </div>

        {/* عرض الطلبات مجمعة حسب المحافظة */}
        {allGovernorates.length > 0 && filter.governorate === '' && (
          <div className="space-y-12 mb-8">
            {allGovernorates.map((gov, idx) => {
              const govOrders = filteredOrders.filter(order => order.governorate === gov);
              if (govOrders.length === 0) return null;
              return (
                <div key={idx}>
                  <h2 className="text-2xl font-bold text-brand-brown mb-4 text-center">طلبات محافظة {gov}</h2>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-brand-brown to-brand-dark text-white">
                          <tr>
                            <th className="py-4 px-4 text-right font-semibold">اسم العميل</th>
                            <th className="py-4 px-4 text-right font-semibold">رقم الهاتف</th>
                            <th className="py-4 px-4 text-right font-semibold">العنوان</th>
                            <th className="py-4 px-4 text-right font-semibold">المحافظة</th>
                            <th className="py-4 px-4 text-right font-semibold">تاريخ الطلب</th>
                            <th className="py-4 px-4 text-right font-semibold">مصدر الطلب</th>
                            <th className="py-4 px-4 text-right font-semibold">المنتجات</th>
                            <th className="py-4 px-4 text-right font-semibold">الإجمالي</th>
                            <th className="py-4 px-4 text-center font-semibold">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {govOrders.map(order => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-semibold text-brand-dark">{order.customerName}</td>
                              <td className="py-3 px-4 text-brand-olive">{order.phone}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
                              <td className="py-3 px-4 text-brand-brown font-semibold">{order.governorate}</td>
                              <td className="py-3 px-4 text-brand-brown font-semibold">{order.orderDate}</td>
                              <td className="py-3 px-4">
                                <span className="bg-brand-olive/20 text-brand-dark px-3 py-1 rounded-full text-sm">
                                  {order.source || 'غير محدد'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {order.products.map((p, i) => (
                                    <span key={i} className="bg-brand-beige text-brand-dark px-2 py-1 rounded text-xs">
                                      {p.type} ({p.quantity})
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-brand-brown">
                                {order.products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0)} جنيه
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2 justify-center">
                                  <button 
                                    onClick={() => handleEdit(order)} 
                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                    title="تعديل"
                                  >
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(order.id)} 
                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                                    title="حذف"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleComplete(order.id)}
                                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                                    title="تم الإنجاز"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable; 