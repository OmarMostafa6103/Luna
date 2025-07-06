import React, { useContext, useState } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import { PlusCircleIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// صفحة إدارة المخزون
const InventoryManager = () => {
  const { inventory, setInventory } = useContext(InventoryContext);
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    cost: '',
    min: '', // الحد الأدنى للتنبيه
  });
  const [editIndex, setEditIndex] = useState(null);

  // تحديث بيانات النموذج
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // حفظ المادة
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // تعديل مادة
      const updated = [...inventory];
      updated[editIndex] = form;
      setInventory(updated);
      setEditIndex(null);
    } else {
      // إضافة مادة جديدة
      setInventory([...inventory, form]);
    }
    setForm({ name: '', quantity: '', unit: '', cost: '', min: '' });
  };
  // بدء التعديل
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setForm(inventory[idx]);
  };
  // حذف مادة
  const handleDelete = (idx) => {
    setInventory(inventory.filter((_, i) => i !== idx));
    setEditIndex(null);
    setForm({ name: '', quantity: '', unit: '', cost: '', min: '' });
  };

  // تنبيه المواد القليلة
  const lowStock = inventory.filter(item => Number(item.quantity) <= Number(item.min));

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <PlusCircleIcon className="w-6 h-6 text-blue-400" /> إدارة المخزون
      </h2>
      {/* نموذج المادة */}
      <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-xl p-6 shadow mb-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">اسم المادة</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              placeholder="مثال: دقيق"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الكمية المتوفرة</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              placeholder="مثال: 5000"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الوحدة</label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              placeholder="جرام/لتر/صندوق..."
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">التكلفة للوحدة</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              placeholder="مثال: 2.5"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الحد الأدنى للتنبيه</label>
            <input
              type="number"
              name="min"
              value={form.min}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              placeholder="مثال: 100"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-500 transition">
          {editIndex !== null ? 'تحديث المادة' : 'إضافة المادة'}
        </button>
      </form>
      {/* تنبيهات المخزون المنخفض */}
      {lowStock.length > 0 && (
        <div className="mb-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded flex items-center gap-2 shadow">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
          <span>تنبيه: المواد التالية منخفضة الكمية:</span>
          {lowStock.map(item => (
            <span key={item.name} className="font-bold mx-2">{item.name} ({item.quantity} {item.unit})</span>
          ))}
        </div>
      )}
      {/* جدول المواد */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-blue-100 bg-white max-w-3xl mx-auto">
        <table className="min-w-full text-center">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="py-3 px-2">اسم المادة</th>
              <th className="py-3 px-2">الكمية</th>
              <th className="py-3 px-2">الوحدة</th>
              <th className="py-3 px-2">التكلفة للوحدة</th>
              <th className="py-3 px-2">الحد الأدنى</th>
              <th className="py-3 px-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-gray-400">لا توجد مواد في المخزون</td>
              </tr>
            )}
            {inventory.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50 transition">
                <td className="py-2 px-2 font-bold">{item.name}</td>
                <td className="py-2 px-2">{item.quantity}</td>
                <td className="py-2 px-2">{item.unit}</td>
                <td className="py-2 px-2">{item.cost}</td>
                <td className="py-2 px-2">{item.min}</td>
                <td className="py-2 px-2 flex gap-2 justify-center">
                  <button onClick={() => handleEdit(idx)} className="bg-yellow-400 text-white p-1 rounded hover:bg-yellow-500" title="تعديل">
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(idx)} className="bg-red-600 text-white p-1 rounded hover:bg-red-700" title="حذف">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager; 