import React, { useContext, useState } from 'react';
import { OrdersContext } from '../contexts/OrdersContext';
import { ArrowDownTrayIcon, PencilIcon, TrashIcon, FunnelIcon, MagnifyingGlassIcon, CalendarIcon, UserIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

// جدول عرض الطلبات مع التصفية والتعديل والحذف والتصدير
const OrderTable = () => {
  // جلب الطلبات من السياق
  const { orders, setOrders } = useContext(OrdersContext);

  // حالات التصفية
  const [filter, setFilter] = useState({
    customer: '',
    product: '',
    date: '',
  });

  // حالة التعديل
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // تصفية الطلبات حسب الفلاتر
  const filteredOrders = orders.filter(order => {
    const byCustomer = filter.customer ? order.customerName.includes(filter.customer) : true;
    const byProduct = filter.product ? order.products.some(p => p.type === filter.product) : true;
    const byDate = filter.date ? order.orderDate === filter.date : true;
    return byCustomer && byProduct && byDate;
  });

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

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-brown to-brand-dark rounded-full mb-4 shadow-lg">
            <FunnelIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand-dark mb-2">جدول الطلبات</h1>
          <p className="text-brand-olive text-lg">إدارة وعرض جميع الطلبات</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">طلبات اليوم</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.orderDate === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">كلاسيك</p>
                <p className="text-2xl font-bold">{productTotals.Classic || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">جولد</p>
                <p className="text-2xl font-bold">{productTotals.Gold || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🥇</span>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

        {/* عرض الطلبات */}
        <div className="space-y-6">
          {/* عرض الجدول للشاشات الكبيرة */}
          <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-brand-brown to-brand-dark text-white">
                  <tr>
                    <th className="py-4 px-4 text-right font-semibold">اسم العميل</th>
                    <th className="py-4 px-4 text-right font-semibold">رقم الهاتف</th>
                    <th className="py-4 px-4 text-right font-semibold">العنوان</th>
                    <th className="py-4 px-4 text-right font-semibold">تاريخ الطلب</th>
                    <th className="py-4 px-4 text-right font-semibold">مصدر الطلب</th>
                    <th className="py-4 px-4 text-right font-semibold">المنتجات</th>
                    <th className="py-4 px-4 text-right font-semibold">الإجمالي</th>
                    <th className="py-4 px-4 text-center font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-brand-olive text-lg">
                        لا توجد طلبات مطابقة للبحث
                      </td>
                    </tr>
                  )}
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {editId === order.id ? (
                        // وضع التعديل
                        <>
                          <td className="py-3 px-4">
                            <input 
                              type="text" 
                              value={editForm.customerName} 
                              onChange={e => setEditForm({ ...editForm, customerName: e.target.value })} 
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="text" 
                              value={editForm.phone} 
                              onChange={e => setEditForm({ ...editForm, phone: e.target.value })} 
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="text" 
                              value={editForm.address} 
                              onChange={e => setEditForm({ ...editForm, address: e.target.value })} 
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="date" 
                              value={editForm.orderDate} 
                              onChange={e => setEditForm({ ...editForm, orderDate: e.target.value })} 
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="text" 
                              value={editForm.source || ''} 
                              onChange={e => setEditForm({ ...editForm, source: e.target.value })} 
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-2">
                              {editForm.products.map((p, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={p.type}
                                    onChange={e => {
                                      const updated = [...editForm.products];
                                      updated[i].type = e.target.value;
                                      setEditForm({ ...editForm, products: updated });
                                    }}
                                    className="flex-1 border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                                  />
                                  <input
                                    type="number"
                                    min="1"
                                    value={p.quantity}
                                    onChange={e => {
                                      const updated = [...editForm.products];
                                      updated[i].quantity = e.target.value;
                                      setEditForm({ ...editForm, products: updated });
                                    }}
                                    className="w-16 border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={p.price || ''}
                                    onChange={e => {
                                      const updated = [...editForm.products];
                                      updated[i].price = e.target.value;
                                      setEditForm({ ...editForm, products: updated });
                                    }}
                                    className="w-20 border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                                    placeholder="السعر"
                                  />
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-brand-brown">
                            {editForm.products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0)} جنيه
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={handleSave} 
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
                              >
                                حفظ
                              </button>
                              <button 
                                onClick={handleCancel} 
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 font-semibold"
                              >
                                إلغاء
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // وضع العرض العادي
                        <>
                          <td className="py-3 px-4 font-semibold text-brand-dark">{order.customerName}</td>
                          <td className="py-3 px-4 text-brand-olive">{order.phone}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
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
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* عرض البطاقات للشاشات الصغيرة */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 p-8 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-brand-olive text-lg">لا توجد طلبات مطابقة للبحث</p>
              </div>
            )}
            
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-olive/20 overflow-hidden hover:shadow-2xl transition-shadow">
                {editId === order.id ? (
                  // وضع التعديل للشاشات الصغيرة
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">اسم العميل</label>
                        <input 
                          type="text" 
                          value={editForm.customerName} 
                          onChange={e => setEditForm({ ...editForm, customerName: e.target.value })} 
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">رقم الهاتف</label>
                        <input 
                          type="text" 
                          value={editForm.phone} 
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })} 
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-brand-dark mb-2">العنوان</label>
                      <input 
                        type="text" 
                        value={editForm.address} 
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })} 
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">تاريخ الطلب</label>
                        <input 
                          type="date" 
                          value={editForm.orderDate} 
                          onChange={e => setEditForm({ ...editForm, orderDate: e.target.value })} 
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">مصدر الطلب</label>
                        <input 
                          type="text" 
                          value={editForm.source || ''} 
                          onChange={e => setEditForm({ ...editForm, source: e.target.value })} 
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-brand-dark mb-2">المنتجات</label>
                      <div className="space-y-2">
                        {editForm.products.map((p, i) => (
                          <div key={i} className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={p.type}
                              onChange={e => {
                                const updated = [...editForm.products];
                                updated[i].type = e.target.value;
                                setEditForm({ ...editForm, products: updated });
                              }}
                              className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                              placeholder="النوع"
                            />
                            <input
                              type="number"
                              min="1"
                              value={p.quantity}
                              onChange={e => {
                                const updated = [...editForm.products];
                                updated[i].quantity = e.target.value;
                                setEditForm({ ...editForm, products: updated });
                              }}
                              className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                              placeholder="الكمية"
                            />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={p.price || ''}
                              onChange={e => {
                                const updated = [...editForm.products];
                                updated[i].price = e.target.value;
                                setEditForm({ ...editForm, products: updated });
                              }}
                              className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition-all duration-300"
                              placeholder="السعر"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={handleSave} 
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
                      >
                        حفظ التعديلات
                      </button>
                      <button 
                        onClick={handleCancel} 
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 font-semibold"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  // وضع العرض العادي للشاشات الصغيرة
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-brand-dark mb-1">{order.customerName}</h3>
                        <p className="text-brand-olive flex items-center gap-1">
                          <PhoneIcon className="w-4 h-4" />
                          {order.phone}
                        </p>
                      </div>
                      <div className="flex gap-2">
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
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 text-brand-olive" />
                        <span className="flex-1">{order.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-brand-brown" />
                        <span className="font-semibold text-brand-brown">{order.orderDate}</span>
                        {order.source && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="bg-brand-olive/20 text-brand-dark px-2 py-1 rounded-full text-xs">
                              {order.source}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {order.products.map((p, i) => (
                            <span key={i} className="bg-brand-beige text-brand-dark px-3 py-1 rounded-lg text-sm font-medium">
                              {p.type} ({p.quantity})
                            </span>
                          ))}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-brand-brown">
                            الإجمالي: {order.products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0)} جنيه
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable; 