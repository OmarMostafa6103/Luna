import React from "react";

// مكون الفوتر السفلي
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-brand-dark to-brand-brown text-brand-beige mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات الشركة */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-4 text-white">Luna Healthy</h3>
            <p className="text-sm text-brand-beige/80 leading-relaxed">
              نظام إدارة الطلبات والمخزون المتكامل
              <br />
              لخدمة أفضل لعملائنا الكرام
            </p>
          </div>

          {/* معلومات الاتصال */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4 text-white">
              معلومات الاتصال
            </h3>
            <div className="space-y-2 text-sm text-brand-beige/80">
              <p>📧 lunahealthy2001@gmail.com</p>
              <p>📞 +201551612195</p>
              <p>الزقازيق بهنباي فوق القهوه </p>
            </div>
          </div>

          {/* ساعات العمل */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4 text-white">ساعات العمل</h3>
            <div className="space-y-1 text-sm text-brand-beige/80">
              <p>الأحد - الخميس: 8:00 ص - 10:00 م</p>
              <p>الجمعة - السبت: 9:00 ص - 11:00 م</p>
            </div>
          </div>
        </div>

        {/* خط فاصل */}
        <div className="border-t border-brand-beige/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-brand-beige/70 text-center md:text-right">
              © {new Date().getFullYear()} Luna Healthy System. جميع الحقوق
              محفوظة.
            </p>
            <div className="flex space-x-4 space-x-reverse mt-4 md:mt-0">
              <span className="text-xs text-brand-beige/50">الإصدار 2.0</span>
              <span className="text-xs text-brand-beige/50">•</span>
              <span className="text-xs text-brand-beige/50">
                تم التطوير بـ Omar
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
