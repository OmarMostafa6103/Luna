import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { FaFileExcel, FaFileWord, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const DEFAULT_STATUS_OPTIONS = [
  { value: "menu_inquiry", label: "سأل عن المنيو" },
  { value: "ordered", label: "طلب" },
  { value: "unsupported_area", label: "منطقة غير مدعومة" },
  { value: "objection", label: "اعتراض" },
];
const STATUS_KEY = "customer_status_options";

const LOCAL_KEY = "customer_stats_data";

export default function CustomerStats() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", status: DEFAULT_STATUS_OPTIONS[0].value, notes: "", category: "", id: null });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusOptions, setStatusOptions] = useState(DEFAULT_STATUS_OPTIONS);
  const [newStatus, setNewStatus] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setCustomers(JSON.parse(saved));
    const savedStatuses = localStorage.getItem(STATUS_KEY);
    if (savedStatuses) {
      const parsed = JSON.parse(savedStatuses);
      setStatusOptions([...DEFAULT_STATUS_OPTIONS, ...parsed]);
    }
  }, []);
  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(customers));
  }, [customers]);

  // Add new status
  const handleAddStatus = () => {
    const trimmed = newStatus.trim();
    if (!trimmed) return;
    // Prevent duplicates
    if (statusOptions.some(opt => opt.label === trimmed)) return;
    const newOpt = { value: trimmed, label: trimmed };
    const customStatuses = statusOptions.filter(opt => !DEFAULT_STATUS_OPTIONS.some(def => def.value === opt.value && def.label === opt.label));
    const updatedCustom = [...customStatuses, newOpt];
    setStatusOptions([...DEFAULT_STATUS_OPTIONS, ...updatedCustom]);
    localStorage.setItem(STATUS_KEY, JSON.stringify(updatedCustom));
    setNewStatus("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editIndex !== null) {
      const updated = [...customers];
      // احتفظ بنفس id القديم
      updated[editIndex] = { ...form, id: customers[editIndex].id };
      setCustomers(updated);
      setEditIndex(null);
    } else {
      // أضف id جديد
      setCustomers([...customers, { ...form, id: Date.now() }]);
    }
    setForm({ name: "", status: statusOptions[0].value, notes: "", category: "", id: null });
  };

  const handleEdit = (idx) => {
    setForm(customers[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx) => {
    setCustomers(customers.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  };

  // Search & Filter
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter ? c.status === filter : true;
    const matchesCategory = categoryFilter ? (c.category || "").toLowerCase().includes(categoryFilter.toLowerCase()) : true;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Export to Excel
  const handleExport = () => {
    const data = customers.map((c) => ({
      "الاسم": c.name,
      "الحالة": statusOptions.find((opt) => opt.value === c.status)?.label,
      "التصنيف": c.category,
      "ملاحظات": c.notes,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "العملاء");
    XLSX.writeFile(wb, "customer_stats.xlsx");
  };

  // Export to Word
  const handleExportWord = async () => {
    const data = customers.map((c) => [
      c.name,
      statusOptions.find((opt) => opt.value === c.status)?.label || c.status,
      c.category,
      c.notes,
    ]);
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("الاسم")], width: { size: 25, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("الحالة")], width: { size: 25, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("التصنيف")], width: { size: 25, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("ملاحظات")], width: { size: 25, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...data.map(row => new TableRow({
        children: row.map(cell => new TableCell({ children: [new Paragraph(cell || "")] }))
      }))
    ];
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "جدول بيانات العملاء", heading: "Heading1", alignment: "CENTER" }),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_stats.docx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6 w-full">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold mb-2 text-center text-brand-brown drop-shadow">إدارة بيانات العملاء</h2>
      <p className="text-center text-gray-500 mb-4 sm:mb-6 text-xs sm:text-base">أضف، صنف، وعدل بيانات العملاء بسهولة واحترافية</p>
      <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-lg p-2 sm:p-4 md:p-6 mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 border border-brand-beige/40 w-full">
        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 w-full">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="اسم العميل"
            className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-base flex-1 focus:ring-2 focus:ring-brand-brown/30 transition"
            required
          />
          <div className="flex flex-col flex-1 min-w-[120px] sm:min-w-[180px]">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 mb-1 text-xs sm:text-base focus:ring-2 focus:ring-brand-brown/30 transition"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex gap-1 sm:gap-2 mt-1">
              <input
                type="text"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                placeholder="إضافة حالة جديدة..."
                className="border border-brand-brown/30 rounded-lg px-2 py-1 text-xs sm:text-base flex-1 focus:ring-2 focus:ring-brand-brown/30 transition"
              />
              <button
                type="button"
                onClick={handleAddStatus}
                className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1 shadow text-xs sm:text-base"
              >
                <FaPlus /> إضافة
              </button>
            </div>
          </div>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="تصنيف (اختياري)"
            className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-base flex-1 focus:ring-2 focus:ring-brand-brown/30 transition"
          />
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="ملاحظات (اختياري)"
            className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-base flex-1 focus:ring-2 focus:ring-brand-brown/30 transition"
          />
        </div>
        <button type="submit" className="bg-brand-brown text-white rounded-lg px-3 sm:px-6 py-2 self-end hover:bg-brand-dark transition flex items-center gap-2 shadow text-xs sm:text-base">
          {editIndex !== null ? <FaEdit /> : <FaPlus />} {editIndex !== null ? "تعديل" : "إضافة"}
        </button>
      </form>
      {/* أدوات البحث والتصفية والتصدير */}
      <div className="flex flex-col md:flex-row gap-2 sm:gap-4 mb-3 sm:mb-4 items-center justify-between w-full">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الملاحظات..."
          className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 w-full md:w-1/4 text-xs sm:text-base focus:ring-2 focus:ring-brand-brown/30 transition"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 w-full md:w-1/6 text-xs sm:text-base focus:ring-2 focus:ring-brand-brown/30 transition"
        >
          <option value="">كل الحالات</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          placeholder="تصفية حسب التصنيف..."
          className="border border-brand-brown/30 rounded-lg px-2 sm:px-3 py-2 w-full md:w-1/4 text-xs sm:text-base focus:ring-2 focus:ring-brand-brown/30 transition"
        />
        <div className="flex gap-1 sm:gap-2 w-full md:w-auto">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white rounded-lg px-2 sm:px-4 py-2 hover:bg-green-700 transition flex items-center gap-2 shadow w-full md:w-auto text-xs sm:text-base"
            type="button"
          >
            <FaFileExcel /> تصدير Excel
          </button>
          <button
            onClick={handleExportWord}
            className="bg-blue-700 text-white rounded-lg px-2 sm:px-4 py-2 hover:bg-blue-800 transition flex items-center gap-2 shadow w-full md:w-auto text-xs sm:text-base"
            type="button"
          >
            <FaFileWord /> تصدير Word
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-brand-beige/40 bg-white/90">
        <table className="min-w-[340px] sm:min-w-[600px] w-full text-center text-xs sm:text-base">
          <thead>
            <tr className="bg-brand-brown/10 text-brand-brown text-xs sm:text-lg">
              <th className="py-2 sm:py-3 px-2 sm:px-4">الاسم</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4">الحالة</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4">التصنيف</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4">ملاحظات</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 sm:py-6 text-gray-400">لا توجد بيانات مطابقة</td>
              </tr>
            ) : (
              filteredCustomers.map((c, idx) => (
                <tr key={idx} className="border-t hover:bg-brand-brown/5 transition">
                  <td className="py-1 sm:py-2 px-2 sm:px-4 font-semibold break-words max-w-[120px]">{c.name}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 break-words max-w-[100px]">{statusOptions.find(opt => opt.value === c.status)?.label || c.status}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 break-words max-w-[100px]">{c.category}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 break-words max-w-[140px]">{c.notes}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4 flex flex-col md:flex-row gap-1 sm:gap-2 justify-center items-center">
                    <button onClick={() => handleEdit(customers.indexOf(c))} className="bg-yellow-400 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-yellow-500 flex items-center gap-1 shadow text-xs sm:text-base"><FaEdit />تعديل</button>
                    <button onClick={() => handleDelete(customers.indexOf(c))} className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1 shadow text-xs sm:text-base"><FaTrash />حذف</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 