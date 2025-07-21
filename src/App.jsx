import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import OrderTable from './components/OrderTable';
import KitchenDashboard from './components/KitchenDashboard';
import InventoryManager from './components/InventoryManager';
import ReportsAnalytics from './components/ReportsAnalytics';
import ProductForm from './components/ProductForm';
import Alerts from './components/Alerts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { OrdersProvider } from './contexts/OrdersContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { ProductsProvider } from './contexts/ProductsContext';
import DeliveryReceipt from './components/DeliveryReceipt';
import CustomerStats from './components/CustomerStats';
import OrdersMap from './pages/OrdersMap';
import CompletedOrders from './pages/CompletedOrders';
import NotedCustomers from './pages/NotedCustomers';
import './App.css';

function App() {
  return (
    <OrdersProvider>
      <InventoryProvider>
        <ProductsProvider>
          <HashRouter>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-brand-beige via-white to-brand-beige/30">
              {/* شريط التنقل العلوي */}
              <Navbar />
              
              {/* محتوى الصفحات */}
              <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Alerts />
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 animate-fadein">
                  <Routes>
                    <Route path="/" element={<OrderForm />} />
                    <Route path="/orders" element={<OrderTable />} />
                    <Route path="/kitchen" element={<KitchenDashboard />} />
                    <Route path="/inventory" element={<InventoryManager />} />
                    <Route path="/products" element={<ProductForm />} />
                    <Route path="/reports" element={<ReportsAnalytics />} />
                    <Route path="/receipt" element={<DeliveryReceipt />} />
                    <Route path="/customer-stats" element={<CustomerStats />} />
                    <Route path="/orders-map" element={<OrdersMap />} />
                    <Route path="/completed-orders" element={<CompletedOrders />} />
                    <Route path="/noted-customers" element={<NotedCustomers />} />
                  </Routes>
                </div>
              </main>
              
              {/* الفوتر السفلي */}
              <Footer />
            </div>
          </HashRouter>
        </ProductsProvider>
      </InventoryProvider>
    </OrdersProvider>
  );
}

export default App;
