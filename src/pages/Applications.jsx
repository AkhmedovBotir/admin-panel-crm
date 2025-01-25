import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">So'rovlar</h1>
        <button
          onClick={() => navigate("/applications/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          + Yangi so'rov
        </button>
      </div>

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
            {applications.map((application) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/applications/${application.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Ko'rish
                  </button>
                  <button
                    onClick={() => navigate(`/applications/${application.id}/edit`)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Tahrirlash
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applications;
