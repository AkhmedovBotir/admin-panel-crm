import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from '../components/Pagination';

// Statik ma'lumotlar
const staticApplications = [
  {
    id: 1,
    title: "Kompyuter ta'mirlash",
    description: "Kompyuter ishlamay qoldi",
    createdDate: "2025-01-24T00:04:07.0690247",
    updatedDate: "2025-01-24T00:04:07.0690247",
    code: "APP001",
    offeringId: 1,
    createdById: 1,
    assignedToId: 1,
    departmentId: 1,
    status: "SENT",
    completedWorkId: null,
    visible: true
  },
  {
    id: 2,
    title: "Printer sozlash",
    description: "Printer qog'ozni tishlab qolyapti",
    createdDate: "2025-01-23T00:04:07.0690247",
    updatedDate: "2025-01-23T00:04:07.0690247",
    code: "APP002",
    offeringId: 2,
    createdById: 1,
    assignedToId: 2,
    departmentId: 2,
    status: "IN_PROGRESS",
    completedWorkId: null,
    visible: true
  },
  {
    id: 3,
    title: "Internet sozlash",
    description: "Internet sekin ishlamoqda",
    createdDate: "2025-01-22T00:04:07.0690247",
    updatedDate: "2025-01-22T00:04:07.0690247",
    code: "APP003",
    offeringId: 3,
    createdById: 1,
    assignedToId: 3,
    departmentId: 1,
    status: "COMPLETED",
    completedWorkId: 1,
    visible: true
  }
];

const staticDepartments = [
  { id: 1, name: "IT Bo'limi" },
  { id: 2, name: "Texnik xizmat bo'limi" },
  { id: 3, name: "Moliya bo'limi" }
];

const staticOfferings = [
  { id: 1, name: "Kompyuter ta'mirlash" },
  { id: 2, name: "Printer xizmati" },
  { id: 3, name: "Internet xizmati" }
];

const staticEmployees = [
  { id: 1, firstName: "Ahror", lastName: "Ahmadov" },
  { id: 2, firstName: "Bobur", lastName: "Boboev" },
  { id: 3, firstName: "Davron", lastName: "Davronov" }
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApplication, setDeletingApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // API o'rniga statik ma'lumotlardan foydalanish
      setApplications(staticApplications);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SENT":
        return "Yuborilgan";
      case "IN_PROGRESS":
        return "Jarayonda";
      case "COMPLETED":
        return "Bajarilgan";
      case "REJECTED":
        return "Rad etilgan";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("uz-UZ");
  };

  const handleDeleteApplication = (application) => {
    setDeletingApplication(application);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    try {
      // API o'rniga to'g'ridan-to'g'ri state ni yangilash
      setApplications(applications.filter(app => app.id !== deletingApplication.id));
      toast.success("So'rov muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.error("So'rovni o'chirishda xatolik:", error);
      toast.error("So'rovni o'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingApplication(null);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  const getEmployeeName = (id) => {
    const employee = staticEmployees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Noma\'lum';
  };

  const getDepartmentName = (id) => {
    const department = staticDepartments.find(dep => dep.id === id);
    return department ? department.name : 'Noma\'lum';
  };

  const getOfferingName = (id) => {
    const offering = staticOfferings.find(off => off.id === id);
    return offering ? offering.name : 'Noma\'lum';
  };

  // Qidiruv va filtrlash
  const filteredApplications = staticApplications.filter(app =>
    (app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDepartment ? app.departmentId === parseInt(filterDepartment) : true) &&
    (filterStatus ? app.status === filterStatus : true)
  );

  // Pagination uchun ma'lumotlarni filtrlash
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Sahifani o'zgartirish
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Arizalar</h1>
        <button
          onClick={() => navigate("/applications/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          + Yangi ariza
        </button>
      </div>

      {/* Qidiruv va filterlar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Ariza nomi yoki kodi bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Barcha bo'limlar</option>
          {staticDepartments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Barcha holatlar</option>
          <option value="SENT">Yuborilgan</option>
          <option value="IN_PROGRESS">Jarayonda</option>
          <option value="COMPLETED">Bajarilgan</option>
          <option value="REJECTED">Rad etilgan</option>
        </select>
      </div>

      {/* Ko'rish modali */}
      {isViewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">So'rov ma'lumotlari</h2>
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
                <label className="block text-sm font-medium text-gray-700">Sarlavha</label>
                <p className="mt-1 text-sm text-gray-900">{selectedApplication.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif</label>
                <p className="mt-1 text-sm text-gray-900">{selectedApplication.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kod</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedApplication.code}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Holat</label>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusText(selectedApplication.status)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bo'lim</label>
                  <p className="mt-1 text-sm text-gray-900">{getDepartmentName(selectedApplication.departmentId)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Xizmat</label>
                  <p className="mt-1 text-sm text-gray-900">{getOfferingName(selectedApplication.offeringId)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tayinlangan xodim</label>
                  <p className="mt-1 text-sm text-gray-900">{getEmployeeName(selectedApplication.assignedToId)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Yaratilgan sana</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.createdDate)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* O'chirish modali */}
      {isDeleteModalOpen && deletingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">So'rovni o'chirish</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Haqiqatan ham bu so'rovni o'chirmoqchimisiz?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                So'rov: {deletingApplication.title} ({deletingApplication.code})
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sarlavha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yaratilgan sana
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(application.createdDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusText(application.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => handleViewApplication(application)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate(`/applications/${application.id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteApplication(application)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
    </div>
  );
}

export default Applications;
