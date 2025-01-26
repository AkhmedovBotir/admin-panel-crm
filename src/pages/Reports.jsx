import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Statik ma'lumotlar
const staticReports = [
  {
    id: 1,
    code: "CW1234",
    createdDate: "2025-01-24T00:05:09.3104012",
    updatedDate: "2025-01-24T00:05:09.3104012",
    applicationId: 1,
    departmentId: 1,
    employeeId: 1,
    visible: true
  },
  {
    id: 2,
    code: "CW1235",
    createdDate: "2025-01-24T00:05:09.3104012",
    updatedDate: "2025-01-24T00:05:09.3104012",
    applicationId: 2,
    departmentId: 2,
    employeeId: 2,
    visible: true
  }
];

const staticDepartments = [
  { id: 1, name: "IT Bo'limi" },
  { id: 2, name: "Moliya Bo'limi" },
  { id: 3, name: "HR Bo'limi" }
];

const staticEmployees = [
  { id: 1, firstName: "Ahror", lastName: "Ahmadov" },
  { id: 2, firstName: "Bobur", lastName: "Boboev" },
  { id: 3, firstName: "Davron", lastName: "Davronov" }
];

function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReport, setDeletingReport] = useState(null);

  const itemsPerPage = 10;

  // Ma'lumotlarni filtrlash
  const filteredReports = staticReports.filter(report => {
    const matchesSearch = report.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || report.departmentId === parseInt(selectedDepartment);
    const matchesEmployee = !selectedEmployee || report.employeeId === parseInt(selectedEmployee);
    const matchesDate = (!startDate || new Date(report.createdDate) >= new Date(startDate)) &&
      (!endDate || new Date(report.createdDate) <= new Date(endDate));

    return matchesSearch && matchesDepartment && matchesEmployee && matchesDate;
  });

  // Sahifalash uchun ma'lumotlarni kesish
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const totalItems = filteredReports.length;
  const startIndex = indexOfFirstItem + 1;
  const endIndex = Math.min(indexOfLastItem, totalItems);

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      
      // Sarlavha qo'shish
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Hisobotlar ro'yxati", 15, 15);
      
      // Jadval uchun ma'lumotlarni tayyorlash
      const tableData = currentItems.map(report => [
        report.code,
        staticDepartments.find(d => d.id === report.departmentId)?.name || '',
        `${staticEmployees.find(e => e.id === report.employeeId)?.firstName || ''} ${staticEmployees.find(e => e.id === report.employeeId)?.lastName || ''}`,
        new Date(report.createdDate).toLocaleString(),
        new Date(report.updatedDate).toLocaleString()
      ]);

      // Jadval yaratish
      doc.autoTable({
        startY: 25,
        head: [['Kod', 'Bo\'lim', 'Xodim', 'Yaratilgan sana', 'O\'zgartirilgan sana']],
        body: tableData,
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Fayl nomini generatsiya qilish
      const fileName = `hisobotlar_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // PDF ni yuklab olish
      doc.save(fileName);
      
      toast.success("PDF muvaffaqiyatli yuklandi");
    } catch (error) {
      console.error("PDF yaratishda xatolik:", error);
      toast.error("PDF yaratishda xatolik yuz berdi");
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleDeleteReport = (report) => {
    setDeletingReport(report);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // API o'rniga console.log
      console.log("O'chirilgan hisobot:", deletingReport);

      toast.success("Hisobot muvaffaqiyatli o'chirildi");
      setIsDeleteModalOpen(false);
      setDeletingReport(null);
    } catch (error) {
      console.error("Hisobotni o'chirishda xatolik:", error);
      toast.error("Hisobotni o'chirishda xatolik yuz berdi");
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Hisobotlar</h1>
            <div className="flex gap-2">
              <Link
                to="/reports/create"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Yangi hisobot
                </div>
              </Link>
              <button
                onClick={handleExport}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  PDF yuklab olish
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Kod bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Barcha bo'limlar</option>
                {staticDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Barcha xodimlar</option>
                {staticEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-48">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Boshlanish sanasi"
              />
            </div>
            <div className="w-full md:w-48">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tugash sanasi"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bo'lim</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xodim</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yaratilgan sana</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O'zgartirilgan sana</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staticDepartments.find(d => d.id === report.departmentId)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staticEmployees.find(e => e.id === report.employeeId)?.firstName} {" "}
                      {staticEmployees.find(e => e.id === report.employeeId)?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.createdDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.updatedDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Ko'rish"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <Link
                          to={`/reports/${report.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                          title="Tahrirlash"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteReport(report)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="O'chirish"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sahifalash */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Oldingi
              </button>
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Keyingi
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Jami <span className="font-medium">{totalItems}</span> ta yozuvdan{' '}
                  <span className="font-medium">{startIndex}</span> dan{' '}
                  <span className="font-medium">{endIndex}</span> gacha ko'rsatilmoqda
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    } border border-gray-300`}
                  >
                    <span className="sr-only">Oldingi</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    const isNearCurrentPage = 
                      Math.abs(pageNumber - currentPage) <= 1 || 
                      pageNumber === 1 || 
                      pageNumber === totalPages;

                    if (!isNearCurrentPage) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return (
                          <span
                            key={pageNumber}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 bg-white"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          isCurrentPage
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        } border border-gray-300`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    } border border-gray-300`}
                  >
                    <span className="sr-only">Keyingi</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isViewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Hisobot ma'lumotlari</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kod:</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReport.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bo'lim:</label>
                <p className="mt-1 text-sm text-gray-900">
                  {staticDepartments.find(d => d.id === selectedReport.departmentId)?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Xodim:</label>
                <p className="mt-1 text-sm text-gray-900">
                  {staticEmployees.find(e => e.id === selectedReport.employeeId)?.firstName} {" "}
                  {staticEmployees.find(e => e.id === selectedReport.employeeId)?.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Yaratilgan sana:</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(selectedReport.createdDate).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">O'zgartirilgan sana:</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(selectedReport.updatedDate).toLocaleString()}</p>
              </div>
              {selectedReport.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Izoh:</label>
                  <div className="mt-1 text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: selectedReport.description }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* O'chirish modali */}
      {isDeleteModalOpen && deletingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Hisobotni o'chirish</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-gray-600">Haqiqatan ham ushbu hisobotni o'chirmoqchimisiz?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  );
}

export default Reports;
