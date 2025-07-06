// import React, { useContext, useState } from "react";
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
//   ImageRun,
//   AlignmentType,
// } from "docx";
// import { saveAs } from "file-saver";
// import logo from "../assets/luna-logo.png.png"; // تعديل الاستيراد ليشير إلى luna-logo.png.png

// const DeliveryReceipt = () => {
//   const { orders } = useContext(OrdersContext);
//   const [selectedId, setSelectedId] = useState("");
//   const selectedOrder = orders.find((o) => o.id === Number(selectedId));

//   const handleExportWord = async () => {
//     if (!selectedOrder || !Array.isArray(selectedOrder.products)) {
//       alert("برجاء اختيار طلب صحيح.");
//       return;
//     }

//     // تحويل الصورة إلى ArrayBuffer لاستخدامها في docx
//     const response = await fetch(logo);
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

//     // بناء المستند
//     const doc = new Document({
//       sections: [
//         {
//           properties: {
//             page: {
//               margin: { top: 720, bottom: 720, left: 720, right: 720 },
//             },
//           },
//           children: [
//             // إضافة الشعار
//             new Paragraph({
//               children: [
//                 new ImageRun({
//                   data: arrayBuffer,
//                   transformation: { width: 200, height: 100 },
//                 }),
//               ],
//               alignment: AlignmentType.CENTER,
//               spacing: { after: 300 },
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
//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, "receipt.docx");
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="container mx-auto py-10 print:bg-white">
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
//         <div className="print-receipt bg-white border border-blue-300 rounded-2xl p-8 shadow-2xl max-w-lg mb-8 print:border-0 print:shadow-none relative overflow-hidden">
//           <div
//             className="watermark-bg"
//             style={{
//               position: "absolute",
//               inset: 0,
//               width: "100%",
//               height: "100%",
//               backgroundImage: `url(${logo})`,
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center",
//               backgroundSize: "cover",
//               opacity: 0.22,
//               filter: "grayscale(1) contrast(1.2)",
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

// الطباعه مميزه جده

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

//   useEffect(() => {
//     if (printRef.current && selectedOrder) {
//       const watermark = new Image();
//       watermark.src = logo;
//       watermark.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = printRef.current.offsetWidth;
//         canvas.height = printRef.current.offsetHeight;
//         const ctx = canvas.getContext("2d");
//         ctx.globalAlpha = 0.15; // تقليل الشفافية لتبدو احترافية
//         ctx.filter = "grayscale(1) contrast(1.5)";
//         ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
//         printRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
//         printRef.current.style.backgroundRepeat = "repeat"; // تكرار الخلفية إذا لزم الأمر
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
//               margin: { top: 720, bottom: 720, left: 720, right: 720 },
//             },
//           },
//           children: [
//             // إضافة الخلفية المائية كصورة في الخلفية
//             new Paragraph({
//               children: [
//                 new ImageRun({
//                   data: arrayBuffer,
//                   transformation: { width: 500, height: 700 }, // تغطية الصفحة
//                   floating: {
//                     horizontalPosition: { relative: "margin", offset: 0 },
//                     verticalPosition: { relative: "margin", offset: 0 },
//                     behindDocument: true, // خلف النصوص
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
//               -webkit-print-color-adjust: exact; /* لضمان طباعة الخلفية */
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

// بدايه الورد
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

//     // معالجة الصورة لتطبيق تأثيرات احترافية (محاكاة)
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = new Image();
//     img.src = URL.createObjectURL(new Blob([arrayBuffer]));
//     await new Promise((resolve) => (img.onload = resolve));
//     canvas.width = 800;
//     canvas.height = 1000;
//     ctx.globalAlpha = 0.15; // شفافية منخفضة
//     ctx.filter = "grayscale(1) contrast(1.5)"; // تأثيرات احترافية
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     const processedArrayBuffer = await new Promise((resolve) =>
//       canvas.toBlob((blob) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.readAsArrayBuffer(blob);
//       }, "image/png")
//     );

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
//               margin: { top: 200, bottom: 200, left: 200, right: 200 }, // تقليل الهوامش لتغطية أكبر
//             },
//           },
//           children: [
//             // إضافة الخلفية المائية المعالجة
//             new Paragraph({
//               children: [
//                 new ImageRun({
//                   data: processedArrayBuffer,
//                   transformation: { width: 800, height: 1000 }, // حجم مثالي للصفحة
//                   floating: {
//                     horizontalPosition: { relative: "page", offset: 0 },
//                     verticalPosition: { relative: "page", offset: 0 },
//                     behindDocument: true,
//                     allowOverlap: true,
//                   },
//                 }),
//                 // صورة إضافية للتكرار
//                 new ImageRun({
//                   data: processedArrayBuffer,
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
  const selectedOrder = orders.find((o) => o.id === Number(selectedId));
  const printRef = useRef(null);

  useEffect(() => {
    if (printRef.current && selectedOrder) {
      const watermark = new Image();
      watermark.src = logo;
      watermark.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = printRef.current.offsetWidth;
        canvas.height = printRef.current.offsetHeight;
        const ctx = canvas.getContext("2d");
        ctx.globalAlpha = 0.15;
        ctx.filter = "grayscale(1) contrast(1.5)";
        ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
        printRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
        printRef.current.style.backgroundRepeat = "repeat";
        printRef.current.style.backgroundPosition = "center";
      };
    }
  }, [selectedOrder]);

  const handleExportWord = async () => {
    if (!selectedOrder || !Array.isArray(selectedOrder.products)) {
      alert("برجاء اختيار طلب صحيح.");
      return;
    }

    // تحميل الصورة كـ ArrayBuffer
    const response = await fetch(logo);
    if (!response.ok) throw new Error("Failed to load logo image");
    const arrayBuffer = await response.arrayBuffer();

    // بناء جدول المنتجات
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
              new Paragraph({ text: "السعر", alignment: AlignmentType.CENTER }),
            ],
            width: { size: 34, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      ...selectedOrder.products.map(
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

    // بناء المستند مع خلفية مائية احترافية
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 300, bottom: 300, left: 300, right: 300 }, // تقليل الهوامش لتغطية أكبر
            },
          },
          children: [
            // إضافة الخلفية المائية كصورة احترافية
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuffer,
                  transformation: { width: 800, height: 1000 }, // زيادة الحجم لتغطية الصفحة
                  floating: {
                    horizontalPosition: { relative: "page", offset: 0 },
                    verticalPosition: { relative: "page", offset: 0 },
                    behindDocument: true,
                    allowOverlap: true,
                  },
                }),
                // إضافة صورة إضافية للتكرار (إذا لزم الأمر)
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
                new TextRun({ text: "إيصال تسليم طلب", bold: true, size: 32 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: `اسم العميل: ${String(selectedOrder.customerName || "")}`,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `رقم الهاتف: ${String(selectedOrder.phone || "")}`,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `العنوان: ${String(selectedOrder.address || "")}`,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `تاريخ الطلب: ${String(selectedOrder.orderDate || "")}`,
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
              text: `الإجمالي: ${selectedOrder.products.reduce(
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

    // تصدير المستند
    const blob = await Packer.toBlob(doc, { compress: false });
    saveAs(blob, "receipt.docx");
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
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
          }
        `}
      </style>
      <h2 className="text-2xl font-bold text-blue-700 mb-6">إيصال المندوب</h2>
      <div className="mb-6 max-w-md">
        <label className="block mb-2 font-semibold text-gray-700">
          اختر الطلب
        </label>
        <select
          className="border-2 border-brand-olive rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-brown bg-white text-brand-dark font-bold"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- اختر طلبًا --</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.customerName} - {order.phone} - {order.orderDate}
            </option>
          ))}
        </select>
      </div>
      {selectedOrder && (
        <div
          ref={printRef}
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
                  {selectedOrder.customerName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">رقم الهاتف:</span>
                <span className="text-gray-900">{selectedOrder.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">العنوان:</span>
                <span className="text-gray-900">{selectedOrder.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-900">تاريخ الطلب:</span>
                <span className="text-gray-900">{selectedOrder.orderDate}</span>
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
                {selectedOrder.products.map((p, i) => (
                  <tr key={i} className="even:bg-blue-50">
                    <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-gray-900">
                      {p.type}
                    </td>
                    <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-blue-900">
                      {p.quantity}
                    </td>
                    <td className="py-2 px-2 border-b border-blue-100 text-center font-bold text-green-800">
                      {p.price ? p.price + " جنيه" : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xl font-extrabold text-green-700 text-right mb-6">
              الإجمالي:{" "}
              {selectedOrder.products.reduce(
                (sum, p) =>
                  sum + Number(p.price || 0) * Number(p.quantity || 0),
                0
              )}{" "}
              جنيه
            </div>
            <div className="flex justify-between mt-10 print:mt-4 text-lg text-gray-900">
              <div className="font-bold">توقيع المندوب: _______________</div>
              <div className="font-bold">توقيع العميل: _______________</div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="flex gap-4">
          <button
            onClick={handleExportWord}
            className="bg-blue-600 text-whitepx-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            تصدير إلى Word
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition print:hidden"
          >
            طباعة
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryReceipt;
