import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from '../components/Pagination';

// Statik ma'lumotlar
const staticSuggestions = [
  {
    id: 1,
    title: "Ish joyini yaxshilash bo'yicha taklif",
    description: "Ofisga yangi stol-stullar sotib olish kerak",
    createdById: 1,
    assignedToId: 1,
    createdDate: "2025-01-24T00:06:01.6184883",
    updatedDate: "2025-01-24T00:06:01.6184883",
    code: "SUGGESTION001",
    status: "yangi",
    visible: true
  },
  {
    id: 2,
    title: "Internet tezligini oshirish",
    description: "Internet tezligi sekin, yangi provayder bilan shartnoma tuzish kerak",
    createdById: 2,
    assignedToId: 1,
    createdDate: "2025-01-23T00:06:01.6184883",
    updatedDate: "2025-01-23T00:06:01.6184883",
    code: "SUGGESTION002",
    status: "jarayonda",
    visible: true
  },
  {
    id: 3,
    title: "Ish vaqtini o'zgartirish",
    description: "Ish vaqtini 9:00 dan 18:00 gacha qilish taklifi",
    createdById: 3,
    assignedToId: 2,
    createdDate: "2025-01-22T00:06:01.6184883",
    updatedDate: "2025-01-22T00:06:01.6184883",
    code: "SUGGESTION003",
    status: "bajarildi",
    visible: true
  }
];

const staticEmployees = [
  { id: 1, firstName: "Ahror", lastName: "Ahmadov" },
  { id: 2, firstName: "Bobur", lastName: "Boboev" },
  { id: 3, firstName: "Davron", lastName: "Davronov" }
];

const statusOptions = [
  { value: "all", label: "Barchasi" },
  { value: "yangi", label: "Yangi" },
  { value: "jarayonda", label: "Jarayonda" },
  { value: "bajarildi", label: "Bajarildi" },
  { value: "rad_etildi", label: "Rad etildi" }
];

function Suggestions() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState(staticSuggestions);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSuggestion, setDeletingSuggestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState("all");
  const itemsPerPage = 5;

  const handleViewSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsViewModalOpen(true);
  };

  const handleDeleteSuggestion = (suggestion) => {
    setDeletingSuggestion(suggestion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    try {
      setSuggestions(suggestions.filter(s => s.id !== deletingSuggestion.id));
      toast.success("Taklif muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.error("Taklifni o'chirishda xatolik:", error);
      toast.error("Taklifni o'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingSuggestion(null);
    }
  };

  const getEmployeeName = (id) => {
    const employee = staticEmployees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Noma\'lum';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("uz-UZ");
  };

  // Qidiruv
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedStatus !== "all" && suggestion.status === selectedStatus)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuggestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);

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
        <h1 className="text-2xl font-bold text-gray-800">Takliflar</h1>
        <button
          onClick={() => navigate("/suggestions/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          + Yangi taklif
        </button>
      </div>

      {/* Qidiruv */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Taklif nomi yoki kodi bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ko'rish modali */}
      {isViewModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Taklif ma'lumotlari</h2>
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
                <p className="mt-1 text-sm text-gray-900">{selectedSuggestion.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSuggestion.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kod</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSuggestion.code}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Yaratgan</label>
                  <p className="mt-1 text-sm text-gray-900">{getEmployeeName(selectedSuggestion.createdById)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tayinlangan xodim</label>
                  <p className="mt-1 text-sm text-gray-900">{getEmployeeName(selectedSuggestion.assignedToId)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Yaratilgan sana</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSuggestion.createdDate)}</p>
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
      {isDeleteModalOpen && deletingSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Taklifni o'chirish</h2>
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
                Haqiqatan ham bu taklifni o'chirmoqchimisiz?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Taklif: {deletingSuggestion.title} ({deletingSuggestion.code})
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sarlavha
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yaratgan
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tayinlangan
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holat
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((suggestion) => (
              <tr key={suggestion.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {suggestion.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {suggestion.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {suggestion.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getEmployeeName(suggestion.createdById)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getEmployeeName(suggestion.assignedToId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${suggestion.status === 'yangi' ? 'bg-blue-100 text-blue-800' : 
                      suggestion.status === 'jarayonda' ? 'bg-yellow-100 text-yellow-800' : 
                      suggestion.status === 'bajarildi' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {statusOptions.find(option => option.value === suggestion.status)?.label || suggestion.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 text-right">
                  <button
                    onClick={() => handleViewSuggestion(suggestion)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate(`/suggestions/${suggestion.id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSuggestion(suggestion)}
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

export default Suggestions;
