import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// مكون شريط التنقل العلوي
const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // روابط النظام
  const links = [
    { to: '/', label: 'إدخال طلب', icon: '📝' },
    { to: '/orders', label: 'جدول الطلبات', icon: '📋' },
    { to: '/kitchen', label: 'لوحة المطبخ', icon: '👨‍🍳' },
    { to: '/inventory', label: 'المخزون', icon: '📦' },
    { to: '/products', label: 'المنتجات', icon: '🍽️' },
    { to: '/reports', label: 'التقارير والتحليلات', icon: '📊' },
    { to: '/receipt', label: 'إيصال المندوب', icon: '🧾' },
    { to: '/customer-stats', label: 'إحصائيات العملاء', icon: '��' }, // Added link
    { to: '/noted-customers', label: 'عملاء بملاحظات', icon: '🗒️' }, // رابط جديد
    { to: '/orders-map', label: 'خريطة الطلبات', icon: '��️' }, // رابط جديد
    { to: '/completed-orders', label: 'الطلبات المنجزة', icon: '✅' }, // رابط جديد للطلبات المنجزة
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-brand-brown to-brand-dark text-brand-beige shadow-2xl sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* اسم النظام مع الشعار */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex-shrink-0">
              <img 
                src="/src/assets/luna-logo.png" 
                alt="Luna Healthy" 
                className="h-10 w-10 rounded-full shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-white text-xl md:text-2xl font-extrabold tracking-wider drop-shadow-lg">
              Luna Healthy
            </div>
          </div>

          {/* روابط للشاشات الكبيرة */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-white font-semibold px-3 py-2 rounded-md text-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                    location.pathname === link.to 
                      ? 'bg-white/30 shadow-lg scale-105' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* زر القائمة للشاشات الصغيرة */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-white/20 rounded-md p-2 transition-colors duration-200"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة للشاشات الصغيرة */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-dark/95 backdrop-blur-sm rounded-b-lg shadow-xl">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-white/20 ${
                    location.pathname === link.to ? 'bg-white/30 shadow-md' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 