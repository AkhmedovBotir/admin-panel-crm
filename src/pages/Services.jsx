import React, { useState } from 'react';
import Pagination from '../components/Pagination';

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Namuna ma'lumotlar
  const [services, setServices] = useState([
    {
      id: 1,
      code: "SERVICE001",
      status: true,
      title: "HR xizmati",
      description: "Xodimlarni boshqarish xizmati",
      createdDate: "2025-01-24T00:03:17.6955742",
      updatedDate: "2025-01-24T00:03:17.6955742",
      departmentId: 1,
      visible: true
    },
    {
      id: 2,
      code: "SERVICE002",
      status: false,
      title: "IT xizmati",
      description: "Texnik yordam xizmati",
      createdDate: "2025-01-24T00:03:17.6955742",
      updatedDate: "2025-01-24T00:03:17.6955742",
      departmentId: 2,
      visible: true
    }
  ]);

  const [newService, setNewService] = useState({
    code: '',
    status: true,
    title: '',
    description: '',
    departmentId: '',
    visible: true
  });

  const [editingService, setEditingService] = useState(null);
  const [deletingService, setDeletingService] = useState(null);

  // Bo'limlar ro'yxati (keyinchalik API dan olinadi)
  const departments = [
    { id: 1, name: 'HR Bo\'limi' },
    { id: 2, name: 'IT Bo\'limi' },
    { id: 3, name: 'Moliya Bo\'limi' }
  ];

  // Yangi xizmat qo'shish
  const handleAddService = () => {
    setIsModalOpen(true);
    setNewService({
      code: '',
      status: true,
      title: '',
      description: '',
      departmentId: '',
      visible: true
    });
  };

  // Xizmatni saqlash
  const handleSaveService = () => {
    if (newService.title && newService.code) {
      const newServ = {
        id: services.length + 1,
        ...newService,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      setServices([...services, newServ]);
      setIsModalOpen(false);
    }
  };

  // Xizmatni tahrirlash
  const handleEditService = (service) => {
    setEditingService({ ...service });
    setIsEditModalOpen(true);
  };

  // Xizmatni yangilash
  const handleUpdateService = () => {
    if (editingService.title && editingService.code) {
      setServices(services.map(service =>
        service.id === editingService.id
          ? { ...editingService, updatedDate: new Date().toISOString() }
          : service
      ));
      setIsEditModalOpen(false);
      setEditingService(null);
    }
  };

  // Xizmatni o'chirish
  const handleDeleteService = (service) => {
    setDeletingService(service);
    setIsDeleteModalOpen(true);
  };

  // O'chirishni tasdiqlash
  const handleConfirmDelete = () => {
    setServices(services.filter(service => service.id !== deletingService.id));
    setIsDeleteModalOpen(false);
    setDeletingService(null);
  };

  // Xizmatni ko'rish
  const handleViewService = (service) => {
    setSelectedService(service);
  };

  // Qidiruv va filtrlash
  const filteredServices = services.filter(service =>
    (service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDepartment ? service.departmentId === parseInt(filterDepartment) : true) &&
    (filterStatus !== '' ? service.status === (filterStatus === 'true') : true)
  );

  // Pagination uchun ma'lumotlarni filtrlash
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Sahifani o'zgartirish
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Xizmatlar</h1>
        <button
          onClick={handleAddService}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Yangi xizmat
        </button>
      </div>

      {/* Qidiruv va filterlar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Xizmat nomi yoki kodi bo'yicha qidirish..."
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
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Barcha statuslar</option>
          <option value="true">Faol</option>
          <option value="false">Nofaol</option>
        </select>
      </div>

      {/* Xizmatlar jadvali */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bo'lim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yaratilgan sana</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {departments.find(dept => dept.id === service.departmentId)?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {service.status ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(service.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => handleViewService(service)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditService(service)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteService(service)}
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
      {filteredServices.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Yangi xizmat qo'shish modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Yangi xizmat qo'shish</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kod</label>
                <input
                  type="text"
                  value={newService.code}
                  onChange={(e) => setNewService({ ...newService, code: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomi</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bo'lim</label>
                <select
                  value={newService.departmentId}
                  onChange={(e) => setNewService({ ...newService, departmentId: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Tanlang</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newService.status}
                  onChange={(e) => setNewService({ ...newService, status: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Faol</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveService}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tahrirlash modali */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Xizmatni tahrirlash</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kod</label>
                <input
                  type="text"
                  value={editingService.code}
                  onChange={(e) => setEditingService({ ...editingService, code: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomi</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bo'lim</label>
                <select
                  value={editingService.departmentId}
                  onChange={(e) => setEditingService({ ...editingService, departmentId: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Tanlang</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingService.status}
                  onChange={(e) => setEditingService({ ...editingService, status: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Faol</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUpdateService}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xizmatni ko'rish modali */}
      {selectedService && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Xizmat ma'lumotlari</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kod</label>
                <p className="mt-1 text-sm text-gray-900">{selectedService.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomi</label>
                <p className="mt-1 text-sm text-gray-900">{selectedService.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif</label>
                <p className="mt-1 text-sm text-gray-900">{selectedService.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bo'lim</label>
                <p className="mt-1 text-sm text-gray-900">
                  {departments.find(dept => dept.id === selectedService.departmentId)?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedService.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {selectedService.status ? 'Faol' : 'Nofaol'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Yaratilgan sana</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedService.createdDate).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">O'zgartirilgan sana</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedService.updatedDate).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* O'chirish modali */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Xizmatni o'chirish</h2>
            <p className="text-gray-500 mb-4">
              Haqiqatan ham bu xizmatni o'chirmoqchimisiz?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Services;
