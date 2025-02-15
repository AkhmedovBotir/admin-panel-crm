import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Statik ma'lumotlar
const staticEmployees = [
  { id: 1, firstName: "Ahror", lastName: "Ahmadov" },
  { id: 2, firstName: "Bobur", lastName: "Boboev" },
  { id: 3, firstName: "Davron", lastName: "Davronov" }
];

function CreateSuggestion() {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState({
    title: "",
    description: "",
    code: "",
    assignedToId: "",
    createdById: 1, // Hozircha static
    visible: true
  });

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: "Taklif tafsilotlarini kiriting...",
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
        setSuggestion(prev => ({ ...prev, description: content }));
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuggestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSuggestion = {
        ...suggestion,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        visible: true
      };

      console.log("Yangi taklif:", newSuggestion);
      
      toast.success("Taklif muvaffaqiyatli yaratildi");
      navigate("/suggestions");
    } catch (error) {
      console.error("Taklifni yaratishda xatolik:", error);
      toast.error("Taklifni yaratishda xatolik yuz berdi");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Yangi taklif yaratish</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Sarlavha
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={suggestion.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Taklif sarlavhasini kiriting"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Kod
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={suggestion.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Taklif kodini kiriting"
                  />
                </div>

                <div>
                  <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700 mb-2">
                    Tayinlangan xodim
                  </label>
                  <select
                    id="assignedToId"
                    name="assignedToId"
                    value={suggestion.assignedToId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Xodimni tanlang</option>
                    {staticEmployees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <div className="border border-gray-300 rounded-md">
                  <div ref={quillRef} style={{ height: '200px' }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/suggestions")}
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

export default CreateSuggestion;
