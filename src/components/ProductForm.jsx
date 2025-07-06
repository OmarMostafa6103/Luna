import React, { useContext, useState } from 'react';
import { ProductsContext } from '../contexts/ProductsContext';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

// صفحة إدارة المنتجات (الوصفات)
const ProductForm = () => {
  const { products, setProducts } = useContext(ProductsContext);
  const [form, setForm] = useState({
    name: '',
    ingredients: [{ name: '', quantity: '' }],
    temperature: '',
    time: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  // تحديث بيانات النموذج
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // تحديث المكونات
  const handleIngredientChange = (idx, field, value) => {
    const updated = [...form.ingredients];
    updated[idx][field] = value;
    setForm({ ...form, ingredients: updated });
  };
  // إضافة مكون
  const addIngredient = () => {
    setForm({ ...form, ingredients: [...form.ingredients, { name: '', quantity: '' }] });
  };
  // حذف مكون
  const removeIngredient = (idx) => {
    setForm({ ...form, ingredients: form.ingredients.filter((_, i) => i !== idx) });
  };
  // حفظ المنتج
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // تعديل منتج
      const updated = [...products];
      updated[editIndex] = form;
      setProducts(updated);
      setEditIndex(null);
    } else {
      // إضافة منتج جديد
      setProducts([...products, form]);
    }
    setForm({ name: '', ingredients: [{ name: '', quantity: '' }], temperature: '', time: '' });
  };
  // بدء التعديل
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setForm(products[idx]);
  };
  // حذف منتج
  const handleDelete = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
    setEditIndex(null);
    setForm({ name: '', ingredients: [{ name: '', quantity: '' }], temperature: '', time: '' });
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <PlusCircleIcon className="w-6 h-6 text-blue-400" /> إدارة المنتجات (الوصفات)
      </h2>
      {/* نموذج المنتج */}
      <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-xl p-6 shadow mb-8 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">اسم المنتج</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            placeholder="مثال: جولد"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">المكونات</label>
          {form.ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ing.name}
                onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                className="border rounded px-2 py-1 w-40"
                placeholder="اسم المكون"
                required
              />
              <input
                type="text"
                value={ing.quantity}
                onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                className="border rounded px-2 py-1 w-32"
                placeholder="الكمية (جرام/مل/...)"
                required
              />
              {form.ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(idx)} className="text-red-500 font-bold text-xl hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center transition">
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="mt-2 text-blue-700 font-semibold hover:underline focus:outline-none flex items-center gap-1">
            <PlusCircleIcon className="w-5 h-5" /> إضافة مكون آخر
          </button>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">درجة الحرارة المطلوبة</label>
            <input
              type="text"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="مثال: 180°C"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الوقت المطلوب (دقيقة)</label>
            <input
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="مثال: 30"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-500 transition">
          {editIndex !== null ? 'تحديث المنتج' : 'إضافة المنتج'}
        </button>
      </form>
      {/* جدول المنتجات */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-blue-100 bg-white max-w-3xl mx-auto">
        <table className="min-w-full text-center">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="py-3 px-2">اسم المنتج</th>
              <th className="py-3 px-2">المكونات</th>
              <th className="py-3 px-2">درجة الحرارة</th>
              <th className="py-3 px-2">الوقت</th>
              <th className="py-3 px-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-gray-400">لا توجد منتجات</td>
              </tr>
            )}
            {products.map((prod, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50 transition">
                <td className="py-2 px-2 font-bold">{prod.name}</td>
                <td className="py-2 px-2">
                  {prod.ingredients.map((ing, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 m-1 text-xs">
                      {ing.name} ({ing.quantity})
                    </span>
                  ))}
                </td>
                <td className="py-2 px-2">{prod.temperature}</td>
                <td className="py-2 px-2">{prod.time}</td>
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

export default ProductForm; 