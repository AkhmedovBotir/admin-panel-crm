import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Statik ma'lumotlar
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

const staticApplications = [
  { id: 1, title: "Ariza 1", code: "APP001" },
  { id: 2, title: "Ariza 2", code: "APP002" },
  { id: 3, title: "Ariza 3", code: "APP003" }
];

function CreateReport() {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    code: "",
    applicationId: "",
    departmentId: "",
    employeeId: "",
    description: "",
    visible: true
  });

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Hisobot haqida qo\'shimcha ma\'lumot...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      editorRef.current.on('text-change', () => {
        const content = editorRef.current.root.innerHTML;
        setReport(prev => ({ ...prev, description: content }));
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateCode = () => {
    const prefix = "CW";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setReport(prev => ({
      ...prev,
      code: `${prefix}${randomNum}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReport = {
        ...report,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      console.log("Yangi hisobot:", newReport);
      
      toast.success("Hisobot muvaffaqiyatli yaratildi");
      navigate("/reports");
    } catch (error) {
      console.error("Hisobotni yaratishda xatolik:", error);
      toast.error("Hisobotni yaratishda xatolik yuz berdi");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Yangi hisobot yaratish</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Kod
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={report.code}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Hisobot kodini kiriting"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Generatsiya
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
                    Ariza
                  </label>
                  <select
                    id="applicationId"
                    name="applicationId"
                    value={report.applicationId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Arizani tanlang</option>
                    {staticApplications.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.title} ({app.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Bo'lim
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={report.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Bo'limni tanlang</option>
                    {staticDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                    Xodim
                  </label>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={report.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Xodimni tanlang</option>
                    {staticEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Izoh
                </label>
                <div className="border border-gray-300 rounded-md">
                  <div ref={quillRef} style={{ height: '200px' }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/reports")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReport;
