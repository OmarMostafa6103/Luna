import React, { useContext } from 'react';
import { OrdersContext } from '../contexts/OrdersContext';
import { InventoryContext } from '../contexts/InventoryContext';
import { ProductsContext } from '../contexts/ProductsContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// صفحة التقارير والتحليلات
const ReportsAnalytics = () => {
  const { orders } = useContext(OrdersContext);
  const { inventory } = useContext(InventoryContext);
  const { products } = useContext(ProductsContext);

  // حساب عدد الطلبات المنجزة
  const completedOrders = orders.length;

  // المنتجات الأكثر طلبًا
  const productCounts = {};
  orders.forEach(order => {
    order.products.forEach(p => {
      productCounts[p.type] = (productCounts[p.type] || 0) + Number(p.quantity);
    });
  });
  const mostRequested = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);

  // تكلفة الإنتاج (تقديرية)
  let totalCost = 0;
  orders.forEach(order => {
    order.products.forEach(p => {
      const prod = products.find(prod => prod.name === p.type);
      if (prod) {
        prod.ingredients.forEach(ing => {
          const inv = inventory.find(i => i.name === ing.name);
          if (inv) {
            totalCost += Number(ing.quantity) * Number(inv.cost || 0) * Number(p.quantity);
          }
        });
      }
    });
  });

  // الربح (تقديري: الفرق بين سعر البيع والتكلفة، هنا نفترض سعر بيع ثابت لكل منتج)
  const salePrice = 10; // يمكنك تعديله حسب النظام
  const totalProfit = orders.reduce((acc, order) => {
    return acc + order.products.reduce((sum, p) => sum + salePrice * Number(p.quantity), 0);
  }, 0) - totalCost;

  // بيانات المخزون المتبقي
  const stockData = inventory.map(item => ({ name: item.name, value: Number(item.quantity) }));

  // ألوان للرسم البياني
  const COLORS = ['#2563eb', '#f59e42', '#10b981', '#f43f5e', '#a21caf', '#fbbf24', '#0ea5e9'];

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">التقارير والتحليلات</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* عدد الطلبات */}
        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow flex flex-col items-center">
          <div className="text-4xl font-extrabold text-blue-700 mb-2">{completedOrders}</div>
          <div className="text-gray-700 font-bold">عدد الطلبات المنجزة</div>
        </div>
        {/* أكثر المنتجات طلبًا */}
        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow">
          <div className="font-bold text-blue-700 mb-2">أكثر المنتجات طلبًا</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mostRequested.map(([name, value]) => ({ name, value }))}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* تكلفة الإنتاج مقابل الربح */}
        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow">
          <div className="font-bold text-blue-700 mb-2">تكلفة الإنتاج مقابل الربح</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { name: 'التكلفة', value: totalCost },
              { name: 'الربح', value: totalProfit },
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* المخزون المتبقي */}
        <div className="bg-white border border-blue-100 rounded-xl p-6 shadow">
          <div className="font-bold text-blue-700 mb-2">المخزون المتبقي</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={stockData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics; 