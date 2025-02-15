import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Statik ma'lumotlar
const staticEmployees = [
  { id: 1, firstName: "Ahror", lastName: "Ahmadov" },
  { id: 2, firstName: "Bobur", lastName: "Boboev" },
  { id: 3, firstName: "Davron", lastName: "Davronov" }
];

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
    visible: true
  }
];

function EditSuggestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState(null);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const sugg = staticSuggestions.find(s => s.id === parseInt(id));
    if (sugg) {
      setSuggestion(sugg);
    } else {
      toast.error("Taklif topilmadi");
      navigate("/suggestions");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (quillRef.current && !editorRef.current && suggestion) {
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

      editorRef.current.root.innerHTML = suggestion.description;

      editorRef.current.on('text-change', () => {
        const content = editorRef.current.root.innerHTML;
        setSuggestion(prev => ({ ...prev, description: content }));
      });
    }
  }, [suggestion]);

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
      // API o'rniga console.log
      console.log("O'zgartirilgan taklif:", {
        ...suggestion,
        updatedDate: new Date().toISOString()
      });

      toast.success("Taklif muvaffaqiyatli o'zgartirildi");
      navigate("/suggestions");
    } catch (error) {
      console.error("Taklifni o'zgartirishda xatolik:", error);
      toast.error("Taklifni o'zgartirishda xatolik yuz berdi");
    }
  };

  if (!suggestion) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Taklifni tahrirlash</h1>
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

export default EditSuggestion;
