import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Statik ma'lumotlar
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

function CreateApplication() {
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [newApplication, setNewApplication] = useState({
    title: "",
    description: "",
    code: "",
    offeringId: "",
    departmentId: "",
    assignedToId: "",
  });

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: "Ariza tafsilotlarini kiriting...",
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      editorRef.current.on('text-change', () => {
        const content = editorRef.current.root.innerHTML;
        setNewApplication(prev => ({
          ...prev,
          description: content
        }));
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString();
      
      const newApp = {
        ...newApplication,
        id: Math.floor(Math.random() * 1000) + 4,
        createdDate: currentDate,
        updatedDate: currentDate,
        status: "SENT",
        createdById: 1,
        completedWorkId: null,
        visible: true
      };

      console.log("Yangi ariza:", newApp);
      
      toast.success("Ariza muvaffaqiyatli yaratildi");
      navigate("/applications");
    } catch (error) {
      console.error("Arizani yaratishda xatolik:", error);
      toast.error("Arizani yaratishda xatolik yuz berdi");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Yangi ariza yaratish</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sarlavha
                </label>
                <input
                  type="text"
                  name="title"
                  value={newApplication.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Ariza sarlavhasini kiriting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <div className="border border-gray-300 rounded-md shadow-sm">
                  <div ref={quillRef} className="min-h-[200px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kod
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={newApplication.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Ariza kodini kiriting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xizmat
                  </label>
                  <select
                    name="offeringId"
                    value={newApplication.offeringId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Tanlang</option>
                    {staticOfferings.map((offering) => (
                      <option key={offering.id} value={offering.id}>
                        {offering.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bo'lim
                  </label>
                  <select
                    name="departmentId"
                    value={newApplication.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Tanlang</option>
                    {staticDepartments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tayinlangan xodim
                  </label>
                  <select
                    name="assignedToId"
                    value={newApplication.assignedToId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Tanlang</option>
                    {staticEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/applications")}
                className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default CreateApplication;
