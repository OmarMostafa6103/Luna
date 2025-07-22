// // import React, { useContext, useState, useEffect, useRef } from "react";
// // import { OrdersContext } from "../contexts/OrdersContext";
// // import {
// //   Document,
// //   Packer,
// //   Paragraph,
// //   TextRun,
// //   Table,
// //   TableRow,
// //   TableCell,
// //   WidthType,
// //   AlignmentType,
// //   ImageRun,
// // } from "docx";
// // import { saveAs } from "file-saver";
// // import logo from "../assets/luna-logo.png.png";

// // const DeliveryReceipt = () => {
// //   const { completedOrders } = useContext(OrdersContext);
// //   const [selectedId, setSelectedId] = useState("");
// //   const [govFilter, setGovFilter] = useState("");
// //   const [dateFilter, setDateFilter] = useState("");
// //   const printRef = useRef(null);
// //   // ترتيب الطلبات المنجزة من الأحدث إلى الأقدم
// //   const sortedOrders = [...completedOrders].sort((a, b) => {
// //     // إذا كان orderDate غير موجود، اعتبره أقدم
// //     if (!a.orderDate) return 1;
// //     if (!b.orderDate) return -1;
// //     // قارن التواريخ (يفضل أن تكون بصيغة YYYY-MM-DD)
// //     return new Date(b.orderDate) - new Date(a.orderDate);
// //   });
// //   const allGovernorates = Array.from(
// //     new Set(sortedOrders.map((o) => o.governorate).filter(Boolean))
// //   );
// //   const allDates = Array.from(
// //     new Set(sortedOrders.map((o) => o.orderDate).filter(Boolean))
// //   );
// //   // تصفية الطلبات حسب المحافظة والتاريخ
// //   const filteredOrders = govFilter
// //     ? sortedOrders.filter((o) => o.governorate === govFilter)
// //     : sortedOrders;
// //   const selectedOrder = filteredOrders.find((o) => o.id === Number(selectedId));
// //   const [whatsAppNumber, setWhatsAppNumber] = useState("");

// //   // أرقام الواتساب المحفوظة
// //   const [savedWhatsAppNumbers, setSavedWhatsAppNumbers] = useState(() => {
// //     const saved = localStorage.getItem("savedWhatsAppNumbers");
// //     return saved ? JSON.parse(saved) : [];
// //   });
// //   const [whatsAppName, setWhatsAppName] = useState("");

// //   // دالة توليد نص رسالة واتساب لكل طلب
// //   const getWhatsAppMessage = (order) => {
// //     if (!order) return "";
// //     let msg = `طلب جديد من ${order.customerName}\n`;
// //     msg += `رقم الهاتف: ${order.phone}\n`;
// //     msg += `العنوان: ${order.address}\n`;
// //     msg += `تاريخ الطلب: ${order.orderDate}\n`;
// //     msg += `--- المنتجات ---\n`;
// //     order.products.forEach((p, i) => {
// //       msg += `${i + 1}- ${p.type} × ${p.quantity} = ${
// //         p.price ? p.price + " جنيه" : "-"
// //       }\n`;
// //     });
// //     msg += `الإجمالي: ${order.products.reduce(
// //       (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
// //       0
// //     )} جنيه`;
// //     return msg;
// //   };

// //   // إرسال جميع الطلبات عبر واتساب
// //   const handleSendAllWhatsApp = () => {
// //     filteredOrders.forEach((order) => {
// //       const msg = encodeURIComponent(getWhatsAppMessage(order));
// //       const phone = order.phone.startsWith("+2")
// //         ? order.phone
// //         : `+2${order.phone}`;
// //       window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
// //     });
// //   };

// //   // طباعة جميع الإيصالات
// //   const handlePrintAll = () => {
// //     window.print(); // سيتم عرض جميع الإيصالات في صفحة الطباعة
// //   };

// //   // حفظ رقم جديد
// //   const handleSaveWhatsAppNumber = () => {
// //     const phone = whatsAppNumber.replace(/[^\d]/g, "");
// //     if (!phone || !whatsAppName) return;
// //     // لا تكرر الرقم
// //     if (savedWhatsAppNumbers.some((n) => n.phone === phone)) return;
// //     const updated = [...savedWhatsAppNumbers, { name: whatsAppName, phone }];
// //     setSavedWhatsAppNumbers(updated);
// //     localStorage.setItem("savedWhatsAppNumbers", JSON.stringify(updated));
// //     setWhatsAppNumber("");
// //     setWhatsAppName("");
// //   };

// //   // حذف رقم محفوظ
// //   const handleDeleteWhatsAppNumber = (phone) => {
// //     const updated = savedWhatsAppNumbers.filter((n) => n.phone !== phone);
// //     setSavedWhatsAppNumbers(updated);
// //     localStorage.setItem("savedWhatsAppNumbers", JSON.stringify(updated));
// //   };

// //   // عند اختيار رقم من القائمة
// //   const handleSelectSavedNumber = (e) => {
// //     const phone = e.target.value;
// //     const found = savedWhatsAppNumbers.find((n) => n.phone === phone);
// //     if (found) {
// //       setWhatsAppNumber(found.phone);
// //       setWhatsAppName(found.name);
// //     } else {
// //       setWhatsAppNumber("");
// //       setWhatsAppName("");
// //     }
// //   };

// //   useEffect(() => {
// //     if (printRef.current && selectedOrder) {
// //       const watermark = new Image();
// //       watermark.src = logo;
// //       watermark.onload = () => {
// //         const canvas = document.createElement("canvas");
// //         canvas.width = printRef.current.offsetWidth;
// //         canvas.height = printRef.current.offsetHeight;
// //         const ctx = canvas.getContext("2d");
// //         ctx.globalAlpha = 0.15;
// //         ctx.filter = "grayscale(1) contrast(1.5)";
// //         ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
// //         printRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
// //         printRef.current.style.backgroundRepeat = "repeat";
// //         printRef.current.style.backgroundPosition = "center";
// //       };
// //     }
// //   }, [selectedOrder]);

// //   const handleExportWord = async () => {
// //     if (!selectedOrder || !Array.isArray(selectedOrder.products)) {
// //       alert("برجاء اختيار طلب صحيح.");
// //       return;
// //     }

// //     // تحميل الصورة كـ ArrayBuffer
// //     const response = await fetch(logo);
// //     if (!response.ok) throw new Error("Failed to load logo image");
// //     const arrayBuffer = await response.arrayBuffer();

// //     // بناء جدول المنتجات
// //     const productRows = [
// //       new TableRow({
// //         children: [
// //           new TableCell({
// //             children: [
// //               new Paragraph({
// //                 text: "المنتج",
// //                 alignment: AlignmentType.CENTER,
// //               }),
// //             ],
// //             width: { size: 33, type: WidthType.PERCENTAGE },
// //           }),
// //           new TableCell({
// //             children: [
// //               new Paragraph({
// //                 text: "الكمية",
// //                 alignment: AlignmentType.CENTER,
// //               }),
// //             ],
// //             width: { size: 33, type: WidthType.PERCENTAGE },
// //           }),
// //           new TableCell({
// //             children: [
// //               new Paragraph({ text: "السعر", alignment: AlignmentType.CENTER }),
// //             ],
// //             width: { size: 34, type: WidthType.PERCENTAGE },
// //           }),
// //         ],
// //       }),
// //       ...selectedOrder.products.map(
// //         (p) =>
// //           new TableRow({
// //             children: [
// //               new TableCell({
// //                 children: [
// //                   new Paragraph({
// //                     text: String(p.type || ""),
// //                     alignment: AlignmentType.CENTER,
// //                   }),
// //                 ],
// //               }),
// //               new TableCell({
// //                 children: [
// //                   new Paragraph({
// //                     text: String(p.quantity || ""),
// //                     alignment: AlignmentType.CENTER,
// //                   }),
// //                 ],
// //               }),
// //               new TableCell({
// //                 children: [
// //                   new Paragraph({
// //                     text: p.price ? `${String(p.price)} جنيه` : "-",
// //                     alignment: AlignmentType.CENTER,
// //                   }),
// //                 ],
// //               }),
// //             ],
// //           })
// //       ),
// //     ];

// //     // بناء المستند مع خلفية مائية احترافية
// //     const doc = new Document({
// //       sections: [
// //         {
// //           properties: {
// //             page: {
// //               margin: { top: 300, bottom: 300, left: 300, right: 300 }, // تقليل الهوامش لتغطية أكبر
// //             },
// //           },
// //           children: [
// //             // إضافة الخلفية المائية كصورة احترافية
// //             new Paragraph({
// //               children: [
// //                 new ImageRun({
// //                   data: arrayBuffer,
// //                   transformation: { width: 800, height: 1000 }, // زيادة الحجم لتغطية الصفحة
// //                   floating: {
// //                     horizontalPosition: { relative: "page", offset: 0 },
// //                     verticalPosition: { relative: "page", offset: 0 },
// //                     behindDocument: true,
// //                     allowOverlap: true,
// //                   },
// //                 }),
// //                 // إضافة صورة إضافية للتكرار (إذا لزم الأمر)
// //                 new ImageRun({
// //                   data: arrayBuffer,
// //                   transformation: { width: 400, height: 500 },
// //                   floating: {
// //                     horizontalPosition: { relative: "page", offset: 400 },
// //                     verticalPosition: { relative: "page", offset: 500 },
// //                     behindDocument: true,
// //                     allowOverlap: true,
// //                   },
// //                 }),
// //               ],
// //               spacing: { before: 0, after: 0 },
// //             }),
// //             new Paragraph({
// //               children: [
// //                 new TextRun({ text: "إيصال تسليم طلب", bold: true, size: 32 }),
// //               ],
// //               alignment: AlignmentType.CENTER,
// //               spacing: { after: 300 },
// //             }),
// //             new Paragraph({
// //               text: `اسم العميل: ${String(selectedOrder.customerName || "")}`,
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 100 },
// //             }),
// //             new Paragraph({
// //               text: `رقم الهاتف: ${String(selectedOrder.phone || "")}`,
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 100 },
// //             }),
// //             new Paragraph({
// //               text: `العنوان: ${String(selectedOrder.address || "")}`,
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 100 },
// //             }),
// //             new Paragraph({
// //               text: `تاريخ الطلب: ${String(selectedOrder.orderDate || "")}`,
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 200 },
// //             }),
// //             new Paragraph({
// //               text: "تفاصيل الطلب:",
// //               bold: true,
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 100 },
// //             }),
// //             new Table({
// //               width: { size: 100, type: WidthType.PERCENTAGE },
// //               rows: productRows,
// //               alignment: AlignmentType.CENTER,
// //             }),
// //             new Paragraph({
// //               text: `الإجمالي: ${selectedOrder.products.reduce(
// //                 (sum, p) =>
// //                   sum + Number(p.price || 0) * Number(p.quantity || 0),
// //                 0
// //               )} جنيه`,
// //               bold: true,
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 200 },
// //             }),
// //             new Paragraph({
// //               text: "توقيع المندوب: _______________",
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 100 },
// //             }),
// //             new Paragraph({
// //               text: "توقيع العميل: _______________",
// //               alignment: AlignmentType.RIGHT,
// //               spacing: { after: 100 },
// //             }),
// //           ],
// //         },
// //       ],
// //     });

// //     // تصدير المستند
// //     const blob = await Packer.toBlob(doc, { compress: false });
// //     saveAs(blob, "receipt.docx");
// //   };

// //   const handlePrint = () => {
// //     if (printRef.current) {
// //       window.print();
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto py-10 print:bg-white">
// //       <style>
// //         {`
// //           @media print {
// //             .print-receipt {
// //               background-image: url(${logo}) !important;
// //               background-repeat: repeat;
// //               background-size: cover;
// //               background-position: center;
// //               -webkit-print-color-adjust: exact; /* لضمان طباعة الخلفية */
// //               print-color-adjust: exact;
// //             }
// //             .watermark-bg {
// //               opacity: 0.15 !important;
// //               filter: grayscale(1) contrast(1.5) !important;
// //             }
// //           }
// //         `}
// //       </style>
// //       <h2 className="text-2xl font-bold text-blue-700 mb-6">إيصال المندوب</h2>
// //       {/* فلتر المحافظة */}
// //       <div className="mb-4 max-w-md">
// //         <label className="block mb-2 font-semibold text-gray-700">
// //           تصفية حسب المحافظة
// //         </label>
// //         <select
// //           className="border-2 border-brand-olive rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-brown bg-white text-brand-dark font-bold"
// //           value={govFilter}
// //           onChange={(e) => {
// //             setGovFilter(e.target.value);
// //             setSelectedId(""); // إعادة تعيين الطلب المختار عند تغيير المحافظة
// //           }}
// //         >
// //           <option value="">كل المحافظات</option>
// //           {allGovernorates.map((gov, i) => (
// //             <option key={i} value={gov}>
// //               {gov}
// //             </option>
// //           ))}
// //         </select>
// //       </div>
// //       {/* أزرار العمليات الجماعية */}
// //       {govFilter && filteredOrders.length > 0 && (
// //         <div className="flex flex-col gap-4 mb-8">
// //           <button
// //             onClick={handlePrintAll}
// //             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition w-full"
// //           >
// //             طباعة جميع الإيصالات
// //           </button>
// //           {/* قائمة الطلبات مع زر واتساب لكل طلب */}
// //           <div className="space-y-2">
// //             {filteredOrders.map((order) => (
// //               <div
// //                 key={order.id}
// //                 className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2"
// //               >
// //                 <span className="flex-1 font-bold text-brand-dark">
// //                   {order.customerName} - {order.phone}
// //                 </span>
// //                 <button
// //                   onClick={() => {
// //                     const msg = encodeURIComponent(getWhatsAppMessage(order));
// //                     const phone = order.phone.startsWith("+2")
// //                       ? order.phone
// //                       : `+2${order.phone}`;
// //                     window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
// //                   }}
// //                   className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold shadow hover:bg-green-700 transition"
// //                 >
// //                   إرسال عبر واتساب
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //       {/* عرض جميع الإيصالات عند اختيار محافظة */}
// //       {govFilter && filteredOrders.length > 0 && (
// //         <>
// //           {console.log("طلبات المحافظة المختارة:", filteredOrders)}
// //           <div className="space-y-8 print:space-y-0">
// //             {filteredOrders.map((order) => (
// //               <div
// //                 key={order.id}
// //                 ref={order.id === Number(selectedId) ? printRef : null}
// //                 className="print-receipt bg-white border border-blue-300 rounded-2xl p-8 shadow-2xl max-w-lg mb-8 print:border-0 print:shadow-none relative overflow-hidden page-break-after print:page-break-after-always"
// //               >
// //                 <div
// //                   className="watermark-bg"
// //                   style={{
// //                     position: "absolute",
// //                     inset: 0,
// //                     width: "100%",
// //                     height: "100%",
// //                     backgroundImage: `url(${logo})`,
// //                     backgroundRepeat: "repeat",
// //                     backgroundPosition: "center",
// //                     backgroundSize: "cover",
// //                     opacity: 0.15,
// //                     filter: "grayscale(1) contrast(1.5)",
// //                     zIndex: 1,
// //                     pointerEvents: "none",
// //                   }}
// //                 />
// //                 <div style={{ position: "relative", zIndex: 2 }}>
// //                   <h3 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-wide">
// //                     إيصال تسليم طلب
// //                   </h3>
// //                   <div
// //                     className="mb-6 flex flex-col gap-2 text-lg text-gray-900 text-right"
// //                     dir="rtl"
// //                   >
// //                     <div className="flex items-center gap-1">
// //                       <span className="font-bold text-blue-900">
// //                         اسم العميل:
// //                       </span>
// //                       <span className="text-gray-900">
// //                         {order.customerName}
// //                       </span>
// //                     </div>
// //                     <div className="flex items-center gap-1">
// //                       <span className="font-bold text-blue-900">
// //                         رقم الهاتف:
// //                       </span>
// //                       <span className="text-gray-900">{order.phone}</span>
// //                     </div>
// //                     <div className="flex items-center gap-1">
// //                       <span className="font-bold text-blue-900">العنوان:</span>
// //                       <span className="text-gray-900">{order.address}</span>
// //                     </div>
// //                     <div className="flex items-center gap-1">
// //                       <span className="font-bold text-blue-900">
// //                         تاريخ الطلب:
// //                       </span>
// //                       <span className="text-gray-900">{order.orderDate}</span>
// //                     </div>
// //                   </div>
// //                   <div className="mb-2 font-bold mt-6 text-blue-700 text-lg">
// //                     تفاصيل الطلب:
// //                   </div>
// //                   <table className="w-full mb-6 border border-blue-200 rounded-xl overflow-hidden print:border-none">
// //                     <thead>
// //                       <tr className="bg-blue-100 text-blue-900 text-lg">
// //                         <th className="py-3 px-2 border-b border-blue-200">
// //                           المنتج
// //                         </th>
// //                         <th className="py-3 px-2 border-b border-blue-200">
// //                           الكمية
// //                         </th>
// //                         <th className="py-3 px-2 border-b border-blue-200">
// //                           السعر
// //                         </th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {order.products.map((p, i) => (
// //                         <tr key={i} className="even:bg-blue-50">
// //                           <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-gray-900">
// //                             {p.type}
// //                           </td>
// //                           <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-blue-900">
// //                             {p.quantity}
// //                           </td>
// //                           <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-green-800">
// //                             {p.price ? p.price + " جنيه" : "-"}
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                   <div className="text-xl font-extrabold text-green-700 text-right mb-6">
// //                     الإجمالي:{" "}
// //                     {order.products.reduce(
// //                       (sum, p) =>
// //                         sum + Number(p.price || 0) * Number(p.quantity || 0),
// //                       0
// //                     )}{" "}
// //                     جنيه
// //                   </div>
// //                   <div className="flex justify-between mt-10 print:mt-4 text-lg text-gray-900">
// //                     <div className="font-bold">
// //                       توقيع المندوب: _______________
// //                     </div>
// //                     <div className="font-bold">
// //                       توقيع العميل: _______________
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </>
// //       )}
// //       {/* الوضع القديم: اختيار طلب واحد */}
// //       {!govFilter && (
// //         <div className="mb-6 max-w-md">
// //           <label className="block mb-2 font-semibold text-gray-700">
// //             اختر الطلب
// //           </label>
// //           <select
// //             className="border-2 border-brand-olive rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-brown bg-white text-brand-dark font-bold"
// //             value={selectedId}
// //             onChange={(e) => setSelectedId(e.target.value)}
// //           >
// //             <option value="">-- اختر طلبًا --</option>
// //             {filteredOrders.map((order) => (
// //               <option key={order.id} value={order.id}>
// //                 {order.customerName} - {order.phone} - {order.orderDate}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       )}
// //       {/* عرض إيصال واحد فقط إذا لم يتم اختيار محافظة */}
// //       {!govFilter && selectedOrder && (
// //         <div
// //           ref={printRef}
// //           className="print-receipt bg-white border border-blue-300 rounded-2xl p-8 shadow-2xl max-w-lg mb-8 print:border-0 print:shadow-none relative overflow-hidden"
// //         >
// //           <div
// //             className="watermark-bg"
// //             style={{
// //               position: "absolute",
// //               inset: 0,
// //               width: "100%",
// //               height: "100%",
// //               backgroundImage: `url(${logo})`,
// //               backgroundRepeat: "repeat",
// //               backgroundPosition: "center",
// //               backgroundSize: "cover",
// //               opacity: 0.15,
// //               filter: "grayscale(1) contrast(1.5)",
// //               zIndex: 1,
// //               pointerEvents: "none",
// //             }}
// //           />
// //           <div style={{ position: "relative", zIndex: 2 }}>
// //             <h3 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-wide">
// //               إيصال تسليم طلب
// //             </h3>
// //             <div
// //               className="mb-6 flex flex-col gap-2 text-lg text-gray-900 text-right"
// //               dir="rtl"
// //             >
// //               <div className="flex items-center gap-1">
// //                 <span className="font-bold text-blue-900">اسم العميل:</span>
// //                 <span className="text-gray-900">
// //                   {selectedOrder.customerName}
// //                 </span>
// //               </div>
// //               <div className="flex items-center gap-1">
// //                 <span className="font-bold text-blue-900">رقم الهاتف:</span>
// //                 <span className="text-gray-900">{selectedOrder.phone}</span>
// //               </div>
// //               <div className="flex items-center gap-1">
// //                 <span className="font-bold text-blue-900">العنوان:</span>
// //                 <span className="text-gray-900">{selectedOrder.address}</span>
// //               </div>
// //               <div className="flex items-center gap-1">
// //                 <span className="font-bold text-blue-900">تاريخ الطلب:</span>
// //                 <span className="text-gray-900">{selectedOrder.orderDate}</span>
// //               </div>
// //             </div>
// //             <div className="mb-2 font-bold mt-6 text-blue-700 text-lg">
// //               تفاصيل الطلب:
// //             </div>
// //             <table className="w-full mb-6 border border-blue-200 rounded-xl overflow-hidden print:border-none">
// //               <thead>
// //                 <tr className="bg-blue-100 text-blue-900 text-lg">
// //                   <th className="py-3 px-2 border-b border-blue-200">المنتج</th>
// //                   <th className="py-3 px-2 border-b border-blue-200">الكمية</th>
// //                   <th className="py-3 px-2 border-b border-blue-200">السعر</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {selectedOrder.products.map((p, i) => (
// //                   <tr key={i} className="even:bg-blue-50">
// //                     <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-gray-900">
// //                       {p.type}
// //                     </td>
// //                     <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-blue-900">
// //                       {p.quantity}
// //                     </td>
// //                     <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-green-800">
// //                       {p.price ? p.price + " جنيه" : "-"}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //             <div className="text-xl font-extrabold text-green-700 text-right mb-6">
// //               الإجمالي:{" "}
// //               {selectedOrder.products.reduce(
// //                 (sum, p) =>
// //                   sum + Number(p.price || 0) * Number(p.quantity || 0),
// //                 0
// //               )}{" "}
// //               جنيه
// //             </div>
// //             <div className="flex justify-between mt-10 print:mt-4 text-lg text-gray-900">
// //               <div className="font-bold">توقيع المندوب: _______________</div>
// //               <div className="font-bold">توقيع العميل: _______________</div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       {selectedOrder && (
// //         <div className="flex gap-4">
// //           <button
// //             onClick={handleExportWord}
// //             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
// //           >
// //             تصدير إلى Word
// //           </button>
// //           <button
// //             onClick={handlePrint}
// //             className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition print:hidden"
// //           >
// //             طباعة
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DeliveryReceipt;

// import React, { useContext, useState, useEffect, useRef } from "react";
// import { OrdersContext } from "../contexts/OrdersContext";
// import {
//   Document,
//   Packer,
//   Paragraph,
//   TextRun,
//   Table,
//   TableRow,
//   TableCell,
//   WidthType,
//   AlignmentType,
//   ImageRun,
// } from "docx";
// import { saveAs } from "file-saver";
// import logo from "../assets/luna-logo.png.png";

// const DeliveryReceipt = () => {
//   const { orders } = useContext(OrdersContext);
//   const [selectedId, setSelectedId] = useState("");
//   const selectedOrder = orders.find((o) => o.id === Number(selectedId));
//   const printRef = useRef(null);
//   const [whatsAppNumber, setWhatsAppNumber] = useState("");

//   // أرقام الواتساب المحفوظة
//   const [savedWhatsAppNumbers, setSavedWhatsAppNumbers] = useState(() => {
//     const saved = localStorage.getItem("savedWhatsAppNumbers");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [whatsAppName, setWhatsAppName] = useState("");

//   // توليد نص الرسالة للواتساب
//   const getWhatsAppMessage = () => {
//     if (!selectedOrder) return "";
//     const total = selectedOrder.products.reduce(
//       (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
//       0
//     );
//     // المنتجات كسطر واحد
//     const productsText = selectedOrder.products
//       .map((p) => p.type)
//       .filter(Boolean)
//       .join(" + ");
//     return (
//       `إيصال طلب جديد:\n` +
//       `اسم العميل: ${selectedOrder.customerName}\n` +
//       `رقم الموبايل: ${selectedOrder.phone}\n` +
//       `الطلب  :  ${productsText}\n` +
//       `العنوان: ${selectedOrder.address}\n` +
//       `السعر الكلي: ${total} جنيه\n`
//     );
//   };

//   // فتح واتساب مع الرسالة
//   const handleSendWhatsApp = () => {
//     if (!whatsAppNumber || !selectedOrder) return;
//     let phone = whatsAppNumber.replace(/[^\d]/g, "");
//     // إذا كان الرقم يبدأ بـ0 وعدده 11 رقم (مصر)، حوّله إلى دولي
//     if (phone.length === 11 && phone.startsWith("0")) {
//       phone = "2" + phone; // 2 هو أول رقم من كود مصر (20)
//     }
//     // إذا كان الرقم لا يبدأ بكود دولة، أضف كود مصر افتراضيًا
//     if (!phone.startsWith("20") && phone.length <= 11) {
//       phone = "20" + phone.replace(/^0/, "");
//     }
//     const msg = encodeURIComponent(getWhatsAppMessage());
//     window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
//   };

//   // حفظ رقم جديد
//   const handleSaveWhatsAppNumber = () => {
//     const phone = whatsAppNumber.replace(/[^\d]/g, "");
//     if (!phone || !whatsAppName) return;
//     // لا تكرر الرقم
//     if (savedWhatsAppNumbers.some((n) => n.phone === phone)) return;
//     const updated = [...savedWhatsAppNumbers, { name: whatsAppName, phone }];
//     setSavedWhatsAppNumbers(updated);
//     localStorage.setItem("savedWhatsAppNumbers", JSON.stringify(updated));
//     setWhatsAppNumber("");
//     setWhatsAppName("");
//   };

//   // حذف رقم محفوظ
//   const handleDeleteWhatsAppNumber = (phone) => {
//     const updated = savedWhatsAppNumbers.filter((n) => n.phone !== phone);
//     setSavedWhatsAppNumbers(updated);
//     localStorage.setItem("savedWhatsAppNumbers", JSON.stringify(updated));
//   };

//   // عند اختيار رقم من القائمة
//   const handleSelectSavedNumber = (e) => {
//     const phone = e.target.value;
//     const found = savedWhatsAppNumbers.find((n) => n.phone === phone);
//     if (found) {
//       setWhatsAppNumber(found.phone);
//       setWhatsAppName(found.name);
//     } else {
//       setWhatsAppNumber("");
//       setWhatsAppName("");
//     }
//   };

//   useEffect(() => {
//     if (printRef.current && selectedOrder) {
//       const watermark = new Image();
//       watermark.src = logo;
//       watermark.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = printRef.current.offsetWidth;
//         canvas.height = printRef.current.offsetHeight;
//         const ctx = canvas.getContext("2d");
//         ctx.globalAlpha = 0.15;
//         ctx.filter = "grayscale(1) contrast(1.5)";
//         ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
//         printRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
//         printRef.current.style.backgroundRepeat = "repeat";
//         printRef.current.style.backgroundPosition = "center";
//       };
//     }
//   }, [selectedOrder]);

//   const handleExportWord = async () => {
//     if (!selectedOrder || !Array.isArray(selectedOrder.products)) {
//       alert("برجاء اختيار طلب صحيح.");
//       return;
//     }

//     // تحميل الصورة كـ ArrayBuffer
//     const response = await fetch(logo);
//     if (!response.ok) throw new Error("Failed to load logo image");
//     const arrayBuffer = await response.arrayBuffer();

//     // بناء جدول المنتجات
//     const productRows = [
//       new TableRow({
//         children: [
//           new TableCell({
//             children: [
//               new Paragraph({
//                 text: "المنتج",
//                 alignment: AlignmentType.CENTER,
//               }),
//             ],
//             width: { size: 33, type: WidthType.PERCENTAGE },
//           }),
//           new TableCell({
//             children: [
//               new Paragraph({
//                 text: "الكمية",
//                 alignment: AlignmentType.CENTER,
//               }),
//             ],
//             width: { size: 33, type: WidthType.PERCENTAGE },
//           }),
//           new TableCell({
//             children: [
//               new Paragraph({ text: "السعر", alignment: AlignmentType.CENTER }),
//             ],
//             width: { size: 34, type: WidthType.PERCENTAGE },
//           }),
//         ],
//       }),
//       ...selectedOrder.products.map(
//         (p) =>
//           new TableRow({
//             children: [
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     text: String(p.type || ""),
//                     alignment: AlignmentType.CENTER,
//                   }),
//                 ],
//               }),
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     text: String(p.quantity || ""),
//                     alignment: AlignmentType.CENTER,
//                   }),
//                 ],
//               }),
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     text: p.price ? `${String(p.price)} جنيه` : "-",
//                     alignment: AlignmentType.CENTER,
//                   }),
//                 ],
//               }),
//             ],
//           })
//       ),
//     ];

//     // بناء المستند مع خلفية مائية احترافية
//     const doc = new Document({
//       sections: [
//         {
//           properties: {
//             page: {
//               margin: { top: 300, bottom: 300, left: 300, right: 300 }, // تقليل الهوامش لتغطية أكبر
//             },
//           },
//           children: [
//             // إضافة الخلفية المائية كصورة احترافية
//             new Paragraph({
//               children: [
//                 new ImageRun({
//                   data: arrayBuffer,
//                   transformation: { width: 800, height: 1000 }, // زيادة الحجم لتغطية الصفحة
//                   floating: {
//                     horizontalPosition: { relative: "page", offset: 0 },
//                     verticalPosition: { relative: "page", offset: 0 },
//                     behindDocument: true,
//                     allowOverlap: true,
//                   },
//                 }),
//                 // إضافة صورة إضافية للتكرار (إذا لزم الأمر)
//                 new ImageRun({
//                   data: arrayBuffer,
//                   transformation: { width: 400, height: 500 },
//                   floating: {
//                     horizontalPosition: { relative: "page", offset: 400 },
//                     verticalPosition: { relative: "page", offset: 500 },
//                     behindDocument: true,
//                     allowOverlap: true,
//                   },
//                 }),
//               ],
//               spacing: { before: 0, after: 0 },
//             }),
//             new Paragraph({
//               children: [
//                 new TextRun({ text: "إيصال تسليم طلب", bold: true, size: 32 }),
//               ],
//               alignment: AlignmentType.CENTER,
//               spacing: { after: 300 },
//             }),
//             new Paragraph({
//               text: `اسم العميل: ${String(selectedOrder.customerName || "")}`,
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               text: `رقم الهاتف: ${String(selectedOrder.phone || "")}`,
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               text: `العنوان: ${String(selectedOrder.address || "")}`,
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               text: `تاريخ الطلب: ${String(selectedOrder.orderDate || "")}`,
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 200 },
//             }),
//             new Paragraph({
//               text: "تفاصيل الطلب:",
//               bold: true,
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 100 },
//             }),
//             new Table({
//               width: { size: 100, type: WidthType.PERCENTAGE },
//               rows: productRows,
//               alignment: AlignmentType.CENTER,
//             }),
//             new Paragraph({
//               text: `الإجمالي: ${selectedOrder.products.reduce(
//                 (sum, p) =>
//                   sum + Number(p.price || 0) * Number(p.quantity || 0),
//                 0
//               )} جنيه`,
//               bold: true,
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 200 },
//             }),
//             new Paragraph({
//               text: "توقيع المندوب: _______________",
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 100 },
//             }),
//             new Paragraph({
//               text: "توقيع العميل: _______________",
//               alignment: AlignmentType.RIGHT,
//               spacing: { after: 100 },
//             }),
//           ],
//         },
//       ],
//     });

//     // تصدير المستند
//     const blob = await Packer.toBlob(doc, { compress: false });
//     saveAs(blob, "receipt.docx");
//   };

//   const handlePrint = () => {
//     if (printRef.current) {
//       window.print();
//     }
//   };

//   return (
//     <div className="container mx-auto py-10 print:bg-white">
//       <style>
//         {`
//           @media print {
//             .print-receipt {
//               background-image: url(${logo}) !important;
//               background-repeat: repeat;
//               background-size: cover;
//               background-position: center;
//               -webkit-print-color-adjust: exact;
//               print-color-adjust: exact;
//             }
//             .watermark-bg {
//               opacity: 0.15 !important;
//               filter: grayscale(1) contrast(1.5) !important;
//             }
//           }
//         `}
//       </style>
//       <h2 className="text-2xl font-bold text-blue-700 mb-6">إيصال المندوب</h2>
//       <div className="mb-6 max-w-md">
//         <label className="block mb-2 font-semibold text-gray-700">
//           اختر الطلب
//         </label>
//         <select
//           className="border-2 border-brand-olive rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-brown bg-white text-brand-dark font-bold"
//           value={selectedId}
//           onChange={(e) => setSelectedId(e.target.value)}
//         >
//           <option value="">-- اختر طلبًا --</option>
//           {orders.map((order) => (
//             <option key={order.id} value={order.id}>
//               {order.customerName} - {order.phone} - {order.orderDate}
//             </option>
//           ))}
//         </select>
//       </div>
//       {selectedOrder && (
//         <>
//           {/* ملخص بيانات الطلب للواتساب */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-lg mx-auto">
//             <h4 className="font-bold text-blue-800 mb-2 text-lg">
//               ملخص الطلب لإرساله عبر واتساب:
//             </h4>
//             <table className="w-full text-right mb-2">
//               <tbody>
//                 <tr>
//                   <td className="font-bold text-blue-900">اسم العميل:</td>
//                   <td>{selectedOrder.customerName}</td>
//                 </tr>
//                 <tr>
//                   <td className="font-bold text-blue-900">رقم الموبايل:</td>
//                   <td>{selectedOrder.phone}</td>
//                 </tr>
//                 <tr>
//                   <td className="font-bold text-blue-900">الطلب:</td>
//                   <td>
//                     {selectedOrder.products
//                       .map((p) => p.type)
//                       .filter(Boolean)
//                       .join(" + ")}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="font-bold text-blue-900">العنوان:</td>
//                   <td>{selectedOrder.address}</td>
//                 </tr>
//                 <tr>
//                   <td className="font-bold text-blue-900">السعر الكلي:</td>
//                   <td>
//                     {selectedOrder.products.reduce(
//                       (sum, p) =>
//                         sum +
//                         (Number(p.price) || 0) * (Number(p.quantity) || 0),
//                       0
//                     )}{" "}
//                     جنيه
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             {/* قائمة الأرقام المحفوظة */}
//             <div className="flex flex-col md:flex-row gap-2 items-stretch mt-2 w-full max-w-full">
//               <select
//                 className="border border-blue-300 rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 onChange={handleSelectSavedNumber}
//                 value={whatsAppNumber || ""}
//               >
//                 <option value="">اختر رقم محفوظ...</option>
//                 {savedWhatsAppNumbers.map((n) => (
//                   <option key={n.phone} value={n.phone}>
//                     {n.name} - {n.phone}
//                   </option>
//                 ))}
//               </select>
//               {/* زر حذف الرقم المحفوظ */}
//               {whatsAppNumber &&
//                 savedWhatsAppNumbers.some(
//                   (n) => n.phone === whatsAppNumber
//                 ) && (
//                   <button
//                     type="button"
//                     className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100 w-full md:w-auto"
//                     onClick={() => handleDeleteWhatsAppNumber(whatsAppNumber)}
//                   >
//                     حذف
//                   </button>
//                 )}
//             </div>
//             {/* إدخال اسم ورقم جديد وحفظهما */}
//             <div className="flex flex-col md:flex-row gap-2 items-stretch mt-2 w-full max-w-full">
//               <input
//                 type="text"
//                 className="border border-blue-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="اسم صاحب الرقم"
//                 value={whatsAppName}
//                 onChange={(e) => setWhatsAppName(e.target.value)}
//               />
//               <input
//                 type="text"
//                 className="border border-blue-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="رقم واتساب (مثال: 201234567890)"
//                 value={whatsAppNumber}
//                 onChange={(e) => setWhatsAppNumber(e.target.value)}
//               />
//               <button
//                 onClick={handleSaveWhatsAppNumber}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition w-full md:w-auto"
//                 type="button"
//                 disabled={!whatsAppName || !whatsAppNumber}
//               >
//                 حفظ الرقم
//               </button>
//             </div>
//             {/* زر إرسال إلى واتساب */}
//             <div className="flex flex-col md:flex-row gap-2 items-stretch mt-2 w-full max-w-full">
//               <button
//                 onClick={handleSendWhatsApp}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-600 transition w-full md:w-auto"
//                 disabled={!whatsAppNumber}
//                 type="button"
//               >
//                 إرسال إلى واتساب
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//       {selectedOrder && (
//         <div
//           ref={printRef}
//           className="print-receipt bg-white border border-blue-300 rounded-2xl p-8 shadow-2xl max-w-lg mb-8 print:border-0 print:shadow-none relative overflow-hidden"
//         >
//           <div
//             className="watermark-bg"
//             style={{
//               position: "absolute",
//               inset: 0,
//               width: "100%",
//               height: "100%",
//               backgroundImage: `url(${logo})`,
//               backgroundRepeat: "repeat",
//               backgroundPosition: "center",
//               backgroundSize: "cover",
//               opacity: 0.15,
//               filter: "grayscale(1) contrast(1.5)",
//               zIndex: 1,
//               pointerEvents: "none",
//             }}
//           />
//           <div style={{ position: "relative", zIndex: 2 }}>
//             <h3 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-wide">
//               إيصال تسليم طلب
//             </h3>
//             <div
//               className="mb-6 flex flex-col gap-2 text-lg text-gray-900 text-right"
//               dir="rtl"
//             >
//               <div className="flex items-center gap-1">
//                 <span className="font-bold text-blue-900">اسم العميل:</span>
//                 <span className="text-gray-900">
//                   {selectedOrder.customerName}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="font-bold text-blue-900">رقم الهاتف:</span>
//                 <span className="text-gray-900">{selectedOrder.phone}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="font-bold text-blue-900">العنوان:</span>
//                 <span className="text-gray-900">{selectedOrder.address}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="font-bold text-blue-900">تاريخ الطلب:</span>
//                 <span className="text-gray-900">{selectedOrder.orderDate}</span>
//               </div>
//             </div>
//             <div className="mb-2 font-bold mt-6 text-blue-700 text-lg">
//               تفاصيل الطلب:
//             </div>
//             <table className="w-full mb-6 border border-blue-200 rounded-xl overflow-hidden print:border-none">
//               <thead>
//                 <tr className="bg-blue-100 text-blue-900 text-lg">
//                   <th className="py-3 px-2 border-b border-blue-200">المنتج</th>
//                   <th className="py-3 px-2 border-b border-blue-200">الكمية</th>
//                   <th className="py-3 px-2 border-b border-blue-200">السعر</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedOrder.products.map((p, i) => (
//                   <tr key={i} className="even:bg-blue-50">
//                     <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-gray-900">
//                       {p.type}
//                     </td>
//                     <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-blue-900">
//                       {p.quantity}
//                     </td>
//                     <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-green-800">
//                       {p.price ? p.price + " جنيه" : "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="text-xl font-extrabold text-green-700 text-right mb-6">
//               الإجمالي:{" "}
//               {selectedOrder.products.reduce(
//                 (sum, p) =>
//                   sum + Number(p.price || 0) * Number(p.quantity || 0),
//                 0
//               )}{" "}
//               جنيه
//             </div>
//             <div className="flex justify-between mt-10 print:mt-4 text-lg text-gray-900">
//               <div className="font-bold">توقيع المندوب: _______________</div>
//               <div className="font-bold">توقيع العميل: _______________</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedOrder && (
//         <div className="flex gap-4">
//           <button
//             onClick={handleExportWord}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
//           >
//             تصدير إلى Word
//           </button>
//           <button
//             onClick={handlePrint}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition print:hidden"
//           >
//             طباعة
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryReceipt;

import React, { useContext, useState, useEffect, useRef } from "react";
import { OrdersContext } from "../contexts/OrdersContext";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import logo from "../assets/luna-logo.png.png";

const DeliveryReceipt = () => {
  const { orders } = useContext(OrdersContext);
  const [selectedId, setSelectedId] = useState("");
  const [govFilter, setGovFilter] = useState("");
  const printRefs = useRef({}); // استخدام كائن لتخزين مراجع متعددة
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [whatsAppName, setWhatsAppName] = useState("");
  const [error, setError] = useState("");

  // ترتيب الطلبات من الأحدث إلى الأقدم
  const sortedOrders = [...orders].sort((a, b) => {
    if (!a.orderDate) return 1;
    if (!b.orderDate) return -1;
    return new Date(b.orderDate) - new Date(a.orderDate);
  });

  // استخراج المحافظات الفريدة
  const allGovernorates = Array.from(
    new Set(sortedOrders.map((o) => o.governorate).filter(Boolean))
  );

  // تصفية الطلبات حسب المحافظة
  const filteredOrders = govFilter
    ? sortedOrders.filter((o) => o.governorate === govFilter)
    : sortedOrders;

  const selectedOrder = filteredOrders.find((o) => o.id === Number(selectedId));

  // أرقام الواتساب المحفوظة
  const [savedWhatsAppNumbers, setSavedWhatsAppNumbers] = useState(() => {
    const saved = localStorage.getItem("savedWhatsAppNumbers");
    return saved ? JSON.parse(saved) : [];
  });

  // توليد نص الرسالة للواتساب
  const getWhatsAppMessage = (order) => {
    if (!order || !Array.isArray(order.products)) return "";
    const total = order.products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
      0
    );
    const productsText = order.products
      .map((p) => p.type)
      .filter(Boolean)
      .join(" + ");
    return (
      `إيصال طلب جديد:\n` +
      `اسم العميل: ${order.customerName || "غير متوفر"}\n` +
      `رقم الموبايل: ${order.phone || "غير متوفر"}\n` +
      `الطلب: ${productsText || "غير متوفر"}\n` +
      `العنوان: ${order.address || "غير متوفر"}\n` +
      `السعر الكلي: ${total} جنيه\n`
    );
  };

  // فتح واتساب مع الرسالة
  const handleSendWhatsApp = (order) => {
    if (!whatsAppNumber || !order) {
      setError("يرجى إدخال رقم واتساب واختيار طلب.");
      return;
    }
    let phone = whatsAppNumber.replace(/[^\d]/g, "");
    if (phone.length === 11 && phone.startsWith("0")) {
      phone = "20" + phone.slice(1);
    } else if (!phone.startsWith("20") && phone.length <= 11) {
      phone = "20" + phone.replace(/^0/, "");
    } else if (phone.startsWith("+20")) {
      phone = phone.replace(/^\+/, "");
    }
    if (!/^\d{12}$/.test(phone)) {
      setError(
        "رقم واتساب غير صالح. يرجى إدخال رقم صحيح (مثال: 201234567890)."
      );
      return;
    }
    const msg = encodeURIComponent(getWhatsAppMessage(order));
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    setError("");
  };

  // إرسال جميع الطلبات عبر واتساب
  const handleSendAllWhatsApp = () => {
    if (!whatsAppNumber) {
      setError("يرجى إدخال رقم واتساب.");
      return;
    }
    filteredOrders.forEach((order) => {
      handleSendWhatsApp(order);
    });
  };

  // حفظ رقم جديد
  const handleSaveWhatsAppNumber = () => {
    const phone = whatsAppNumber.replace(/[^\d]/g, "");
    if (!phone || !whatsAppName) {
      setError("يرجى إدخال اسم ورقم واتساب.");
      return;
    }
    if (savedWhatsAppNumbers.some((n) => n.phone === phone)) {
      setError("هذا الرقم محفوظ بالفعل.");
      return;
    }
    const updated = [...savedWhatsAppNumbers, { name: whatsAppName, phone }];
    setSavedWhatsAppNumbers(updated);
    localStorage.setItem("savedWhatsAppNumbers", JSON.stringify(updated));
    setWhatsAppNumber("");
    setWhatsAppName("");
    setError("");
  };

  // حذف رقم محفوظ
  const handleDeleteWhatsAppNumber = (phone) => {
    const updated = savedWhatsAppNumbers.filter((n) => n.phone !== phone);
    setSavedWhatsAppNumbers(updated);
    localStorage.setItem("savedWhatsAppNumbers", JSON.stringify(updated));
    setWhatsAppNumber("");
    setWhatsAppName("");
    setError("");
  };

  // عند اختيار رقم من القائمة
  const handleSelectSavedNumber = (e) => {
    const phone = e.target.value;
    const found = savedWhatsAppNumbers.find((n) => n.phone === phone);
    if (found) {
      setWhatsAppNumber(found.phone);
      setWhatsAppName(found.name);
    } else {
      setWhatsAppNumber("");
      setWhatsAppName("");
    }
    setError("");
  };

  // طباعة جميع الإيصالات
  const handlePrintAll = () => {
    window.print();
  };

  // إعداد العلامة المائية
  useEffect(() => {
    if (selectedOrder || govFilter) {
      const applyWatermark = (element) => {
        if (!element) return;
        const watermark = new Image();
        watermark.src = logo;
        watermark.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = element.offsetWidth;
          canvas.height = element.offsetHeight;
          const ctx = canvas.getContext("2d");
          ctx.globalAlpha = 0.15;
          ctx.filter = "grayscale(1) contrast(1.5)";
          ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
          element.style.backgroundImage = `url(${canvas.toDataURL()})`;
          element.style.backgroundRepeat = "repeat";
          element.style.backgroundPosition = "center";
        };
      };

      if (selectedOrder && printRefs.current[selectedOrder.id]) {
        applyWatermark(printRefs.current[selectedOrder.id]);
      } else if (govFilter) {
        filteredOrders.forEach((order) => {
          if (printRefs.current[order.id]) {
            applyWatermark(printRefs.current[order.id]);
          }
        });
      }
    }
  }, [selectedOrder, govFilter, filteredOrders]);

  const handleExportWord = async (order) => {
    if (!order || !Array.isArray(order.products)) {
      setError("برجاء اختيار طلب صحيح.");
      return;
    }

    try {
      const response = await fetch(logo);
      if (!response.ok) throw new Error("فشل تحميل صورة الشعار");
      const arrayBuffer = await response.arrayBuffer();

      const productRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "المنتج",
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 33, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "الكمية",
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 33, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "السعر",
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 34, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...order.products.map(
          (p) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: String(p.type || ""),
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: String(p.quantity || ""),
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: p.price ? `${String(p.price)} جنيه` : "-",
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            })
        ),
      ];

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: { top: 300, bottom: 300, left: 300, right: 300 },
              },
            },
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: arrayBuffer,
                    transformation: { width: 800, height: 1000 },
                    floating: {
                      horizontalPosition: { relative: "page", offset: 0 },
                      verticalPosition: { relative: "page", offset: 0 },
                      behindDocument: true,
                      allowOverlap: true,
                    },
                  }),
                  new ImageRun({
                    data: arrayBuffer,
                    transformation: { width: 400, height: 500 },
                    floating: {
                      horizontalPosition: { relative: "page", offset: 400 },
                      verticalPosition: { relative: "page", offset: 500 },
                      behindDocument: true,
                      allowOverlap: true,
                    },
                  }),
                ],
                spacing: { before: 0, after: 0 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "إيصال تسليم طلب",
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              new Paragraph({
                text: `اسم العميل: ${String(
                  order.customerName || "غير متوفر"
                )}`,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `رقم الهاتف: ${String(order.phone || "غير متوفر")}`,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `العنوان: ${String(order.address || "غير متوفر")}`,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: `تاريخ الطلب: ${String(order.orderDate || "غير متوفر")}`,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: "تفاصيل الطلب:",
                bold: true,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: productRows,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `الإجمالي: ${order.products.reduce(
                  (sum, p) =>
                    sum + Number(p.price || 0) * Number(p.quantity || 0),
                  0
                )} جنيه`,
                bold: true,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: "توقيع المندوب: _______________",
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "توقيع العميل: _______________",
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc, { compress: false });
      saveAs(blob, `receipt_${order.id}.docx`);
      setError("");
    } catch (err) {
      setError("حدث خطأ أثناء تصدير المستند: " + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-10 print:bg-white">
      <style>
        {`
          @media print {
            .print-receipt {
              background-image: url(${logo}) !important;
              background-repeat: repeat;
              background-size: cover;
              background-position: center;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .watermark-bg {
              opacity: 0.15 !important;
              filter: grayscale(1) contrast(1.5) !important;
            }
          `}
      </style>
      <h2 className="text-2xl font-bold text-blue-700 mb-6">إيصال المندوب</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {/* فلتر المحافظة */}
      <div className="mb-4 max-w-md">
        <label className="block mb-2 font-semibold text-gray-700">
          تصفية حسب المحافظة
        </label>
        <select
          className="border-2 border-brand-olive rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-brown bg-white text-brand-dark font-bold"
          value={govFilter}
          onChange={(e) => {
            setGovFilter(e.target.value);
            setSelectedId("");
            setError("");
          }}
        >
          <option value="">كل المحافظات</option>
          {allGovernorates.map((gov, i) => (
            <option key={i} value={gov}>
              {gov}
            </option>
          ))}
        </select>
      </div>
      {/* إدخال/اختيار رقم واتساب */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-lg mx-auto">
        <h4 className="font-bold text-blue-800 mb-2 text-lg">
          إرسال إلى واتساب
        </h4>
        <div className="flex flex-col md:flex-row gap-2 items-stretch w-full max-w-full">
          <select
            className="border border-blue-300 rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleSelectSavedNumber}
            value={whatsAppNumber || ""}
          >
            <option value="">اختر رقم محفوظ...</option>
            {savedWhatsAppNumbers.map((n) => (
              <option key={n.phone} value={n.phone}>
                {n.name} - {n.phone}
              </option>
            ))}
          </select>
          {whatsAppNumber &&
            savedWhatsAppNumbers.some((n) => n.phone === whatsAppNumber) && (
              <button
                type="button"
                className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100 w-full md:w-auto"
                onClick={() => handleDeleteWhatsAppNumber(whatsAppNumber)}
              >
                حذف
              </button>
            )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-stretch mt-2 w-full max-w-full">
          <input
            type="text"
            className="border border-blue-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="اسم صاحب الرقم"
            value={whatsAppName}
            onChange={(e) => setWhatsAppName(e.target.value)}
          />
          <input
            type="text"
            className="border border-blue-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="رقم واتساب (مثال: 201234567890)"
            value={whatsAppNumber}
            onChange={(e) => setWhatsAppNumber(e.target.value)}
          />
          <button
            onClick={handleSaveWhatsAppNumber}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition w-full md:w-auto"
            type="button"
            disabled={!whatsAppName || !whatsAppNumber}
          >
            حفظ الرقم
          </button>
        </div>
      </div>
      {/* اختيار طلب واحد إذا لم يتم اختيار محافظة */}
      {!govFilter && (
        <div className="mb-6 max-w-md">
          <label className="block mb-2 font-semibold text-gray-700">
            اختر الطلب
          </label>
          <select
            className="border-2 border-brand-olive rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-brown bg-white text-brand-dark font-bold"
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setError("");
            }}
          >
            <option value="">-- اختر طلبًا --</option>
            {filteredOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.customerName || "غير متوفر"} -{" "}
                {order.phone || "غير متوفر"} - {order.orderDate || "غير متوفر"}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* عرض ملخص الطلب عند اختيار طلب واحد */}
      {!govFilter && selectedOrder && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-lg mx-auto">
          <h4 className="font-bold text-blue-800 mb-2 text-lg">ملخص الطلب</h4>
          <table className="w-full text-right mb-2">
            <tbody>
              <tr>
                <td className="font-bold text-blue-900">اسم العميل:</td>
                <td>{selectedOrder.customerName || "غير متوفر"}</td>
              </tr>
              <tr>
                <td className="font-bold text-blue-900">رقم الموبايل:</td>
                <td>{selectedOrder.phone || "غير متوفر"}</td>
              </tr>
              <tr>
                <td className="font-bold text-blue-900">الطلب:</td>
                <td>
                  {selectedOrder.products
                    ?.map((p) => p.type)
                    .filter(Boolean)
                    .join(" + ") || "غير متوفر"}
                </td>
              </tr>
              <tr>
                <td className="font-bold text-blue-900">العنوان:</td>
                <td>{selectedOrder.address || "غير متوفر"}</td>
              </tr>
              <tr>
                <td className="font-bold text-blue-900">السعر الكلي:</td>
                <td>
                  {selectedOrder.products?.reduce(
                    (sum, p) =>
                      sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
                    0
                  ) || 0}{" "}
                  جنيه
                </td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={() => handleSendWhatsApp(selectedOrder)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-600 transition w-full"
            disabled={!whatsAppNumber}
            type="button"
          >
            إرسال إلى واتساب
          </button>
        </div>
      )}
      {/* عرض جميع الإيصالات عند اختيار محافظة */}
      {govFilter && filteredOrders.length > 0 && (
        <>
          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={handlePrintAll}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition w-full"
            >
              طباعة جميع الإيصالات
            </button>
            <button
              onClick={handleSendAllWhatsApp}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition w-full"
              disabled={!whatsAppNumber}
            >
              إرسال جميع الطلبات عبر واتساب
            </button>
            <div className="space-y-2">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2"
                >
                  <span className="flex-1 font-bold text-brand-dark">
                    {order.customerName || "غير متوفر"} -{" "}
                    {order.phone || "غير متوفر"}
                  </span>
                  <button
                    onClick={() => handleSendWhatsApp(order)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold shadow hover:bg-green-700 transition"
                    disabled={!whatsAppNumber}
                  >
                    إرسال عبر واتساب
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8 print:space-y-0">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                ref={(el) => (printRefs.current[order.id] = el)}
                className="print-receipt bg-white border border-blue-300 rounded-2xl p-8 shadow-2xl max-w-lg mb-8 print:border-0 print:shadow-none relative overflow-hidden page-break-after print:page-break-after-always"
              >
                <div
                  className="watermark-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${logo})`,
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    opacity: 0.15,
                    filter: "grayscale(1) contrast(1.5)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <h3 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-wide">
                    إيصال تسليم طلب
                  </h3>
                  <div
                    className="mb-6 flex flex-col gap-2 text-lg text-gray-900 text-right"
                    dir="rtl"
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-blue-900">
                        اسم العميل:
                      </span>
                      <span className="text-gray-900">
                        {order.customerName || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-blue-900">
                        رقم الهاتف:
                      </span>
                      <span className="text-gray-900">
                        {order.phone || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-blue-900">العنوان:</span>
                      <span className="text-gray-900">
                        {order.address || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-blue-900">
                        تاريخ الطلب:
                      </span>
                      <span className="text-gray-900">
                        {order.orderDate || "غير متوفر"}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2 font-bold mt-6 text-blue-700 text-lg">
                    تفاصيل الطلب:
                  </div>
                  <table className="w-full mb-6 border border-blue-200 rounded-xl overflow-hidden print:border-none">
                    <thead>
                      <tr className="bg-blue-100 text-blue-900 text-lg">
                        <th className="py-3 px-2 border-b border-blue-200">
                          المنتج
                        </th>
                        <th className="py-3 px-2 border-b border-blue-200">
                          الكمية
                        </th>
                        <th className="py-3 px-2 border-b border-blue-200">
                          السعر
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products?.map((p, i) => (
                        <tr key={i} className="even:bg-blue-50">
                          <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-gray-900">
                            {p.type || "غير متوفر"}
                          </td>
                          <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-blue-900">
                            {p.quantity || "غير متوفر"}
                          </td>
                          <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-green-800">
                            {p.price ? p.price + " جنيه" : "-"}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-2 px-2 text-center text-gray-900"
                          >
                            لا توجد منتجات
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="text-xl font-extrabold text-green-700 text-right mb-6">
                    الإجمالي:{" "}
                    {order.products?.reduce(
                      (sum, p) =>
                        sum + Number(p.price || 0) * Number(p.quantity || 0),
                      0
                    ) || 0}{" "}
                    جنيه
                  </div>
                  <div className="flex justify-between mt-10 print:mt-4 text-lg text-gray-900">
                    <div className="font-bold">
                      توقيع المندوب: _______________
                    </div>
                    <div className="font-bold">
                      توقيع العميل: _______________
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 print:hidden">
                    <button
                      onClick={() => handleExportWord(order)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
                    >
                      تصدير إلى Word
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition"
                    >
                      طباعة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* عرض إيصال واحد فقط إذا لم يتم اختيار محافظة */}
      {!govFilter && selectedOrder && (
        <div
          ref={(el) => (printRefs.current[selectedOrder.id] = el)}
          className="print-receipt bg-white border border-blue-300 rounded-2xl p-8 shadow-2xl max-w-lg mb-8 print:border-0 print:shadow-none relative overflow-hidden"
        >
          <div
            className="watermark-bg"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${logo})`,
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              opacity: 0.15,
              filter: "grayscale(1) contrast(1.5)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h3 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-wide">
              إيصال تسليم طلب
            </h3>
            <div
              className="mb-6 flex flex-col gap-2 text-lg text-gray-900 text-right"
              dir="rtl"
            >
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">اسم العميل:</span>
                <span className="text-gray-900">
                  {selectedOrder.customerName || "غير متوفر"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">رقم الهاتف:</span>
                <span className="text-gray-900">
                  {selectedOrder.phone || "غير متوفر"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">العنوان:</span>
                <span className="text-gray-900">
                  {selectedOrder.address || "غير متوفر"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">تاريخ الطلب:</span>
                <span className="text-gray-900">
                  {selectedOrder.orderDate || "غير متوفر"}
                </span>
              </div>
            </div>
            <div className="mb-2 font-bold mt-6 text-blue-700 text-lg">
              تفاصيل الطلب:
            </div>
            <table className="w-full mb-6 border border-blue-200 rounded-xl overflow-hidden print:border-none">
              <thead>
                <tr className="bg-blue-100 text-blue-900 text-lg">
                  <th className="py-3 px-2 border-b border-blue-200">المنتج</th>
                  <th className="py-3 px-2 border-b border-blue-200">الكمية</th>
                  <th className="py-3 px-2 border-b border-blue-200">السعر</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products?.map((p, i) => (
                  <tr key={i} className="even:bg-blue-50">
                    <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-gray-900">
                      {p.type || "غير متوفر"}
                    </td>
                    <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-blue-900">
                      {p.quantity || "غير متوفر"}
                    </td>
                    <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-green-800">
                      {p.price ? p.price + " جنيه" : "-"}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-2 px-2 text-center text-gray-900"
                    >
                      لا توجد منتجات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="text-xl font-extrabold text-green-700 text-right mb-6">
              الإجمالي:{" "}
              {selectedOrder.products?.reduce(
                (sum, p) =>
                  sum + Number(p.price || 0) * Number(p.quantity || 0),
                0
              ) || 0}{" "}
              جنيه
            </div>
            <div className="flex justify-between mt-10 print:mt-4 text-lg text-gray-900">
              <div className="font-bold">توقيع المندوب: _______________</div>
              <div className="font-bold">توقيع العميل: _______________</div>
            </div>
            <div className="flex gap-4 mt-4 print:hidden">
              <button
                onClick={() => handleExportWord(selectedOrder)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
              >
                تصدير إلى Word
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition"
              >
                طباعة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryReceipt;
