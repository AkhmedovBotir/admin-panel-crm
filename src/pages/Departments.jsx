import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Departments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ title: '', description: '', firstName: '', lastName: '', address: '', type: '' });
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');

  // Map backend types to Uzbek equivalents
  const departmentTypeMap = {
    ACADEMIC: 'Akademik',
    TECHNICAL: 'Texnik',
    FINANCIAL: 'Moliya',
    ADMINISTRATIVE: 'Ma\'muriy',
    SCIENTIFIC: 'Ilmiy'
  };

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, searchTerm]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://213.230.99.253:8080/department/paged?page=${currentPage}&size=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Bo\'limlarni yuklashda xatolik yuz berdi');
    }
  };

  const handleAddDepartment = () => {
    setIsModalOpen(true);
    setNewDepartment({ title: '', description: '', firstName: '', lastName: '', address: '', type: '' });
  };

  const handleSaveDepartment = async () => {
    try {
      const data = {
        title: newDepartment.title,
        description: newDepartment.description,
        headOfDepartment: `${newDepartment.firstName} ${newDepartment.lastName}`,
        address: newDepartment.address,
        type: newDepartment.type
      };
      await axios.post('http://213.230.99.253:8080/department', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsModalOpen(false);
      fetchDepartments();
      toast.success('Bo\'lim muvaffaqiyatli qo\'shildi');
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Bo\'lim qo\'shishda xatolik yuz berdi');
    }
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    const [firstName, lastName] = department.headOfDepartment.split(' ');
    setEditingDepartment({ ...department, firstName, lastName });
    setIsEditModalOpen(true);
  };

  const handleUpdateDepartment = async () => {
    try {
      const data = {
        title: editingDepartment.title,
        description: editingDepartment.description,
        headOfDepartment: `${editingDepartment.firstName} ${editingDepartment.lastName}`,
        address: editingDepartment.address,
        type: editingDepartment.type
      };
      await axios.put(`http://213.230.99.253:8080/department/${editingDepartment.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsEditModalOpen(false);
      fetchDepartments();
      toast.success('Bo\'lim muvaffaqiyatli yangilandi');
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Bo\'limni yangilashda xatolik yuz berdi');
    }
  };

  const handleDeleteDepartment = (department) => {
    setDeletingDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://213.230.99.253:8080/department/${deletingDepartment.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsDeleteModalOpen(false);
      fetchDepartments();
      toast.success('Bo\'lim muvaffaqiyatli o\'chirildi');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Bo\'limni o\'chirishda xatolik yuz berdi');
    }
  };

  const handleStatusChange = async (department) => {
    try {
      const newStatus = department.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await axios.put(
        `http://213.230.99.253:8080/department/${department.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchDepartments();
      toast.success(`Status muvaffaqiyatli o'zgartirildi: ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Statusni o\'zgartirishda xatolik yuz berdi');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Bo'limlar</h1>
          <button
            onClick={handleAddDepartment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yangi bo'lim
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Bo'limlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  №
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bo'lim nomi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bo'lim turi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {department.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{department.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{departmentTypeMap[department.type]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleStatusChange(department)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          department.status === 'ACTIVE' ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${
                            department.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="ml-3 text-sm text-gray-900">
                        {department.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewDepartment(department)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ko'rish"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditDepartment(department)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="O'zgartirish"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Pagination */}
        {departments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Yangi bo'lim qo'shish
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim nomi
                          </label>
                          <input
                            type="text"
                            id="departmentName"
                            value={newDepartment.title}
                            onChange={(e) => setNewDepartment({ ...newDepartment, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bo'lim nomini kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="departmentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Tavsif
                          </label>
                          <input
                            type="text"
                            id="departmentDescription"
                            value={newDepartment.description}
                            onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tavsifni kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="departmentFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                            Ism
                          </label>
                          <input
                            type="text"
                            id="departmentFirstName"
                            value={newDepartment.firstName}
                            onChange={(e) => setNewDepartment({ ...newDepartment, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ismni kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="departmentLastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Familiya
                          </label>
                          <input
                            type="text"
                            id="departmentLastName"
                            value={newDepartment.lastName}
                            onChange={(e) => setNewDepartment({ ...newDepartment, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Familiyani kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="departmentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Manzil
                          </label>
                          <input
                            type="text"
                            id="departmentAddress"
                            value={newDepartment.address}
                            onChange={(e) => setNewDepartment({ ...newDepartment, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Manzilni kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="departmentType" className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim turi
                          </label>
                          <select
                            id="departmentType"
                            value={newDepartment.type}
                            onChange={(e) => setNewDepartment({ ...newDepartment, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Bo'lim turini tanlang</option>
                            <option value="ACADEMIC">Akademik</option>
                            <option value="TECHNICAL">Texnik</option>
                            <option value="FINANCIAL">Moliya</option>
                            <option value="ADMINISTRATIVE">Ma'muriy</option>
                            <option value="SCIENTIFIC">Ilmiy</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSaveDepartment}
                    disabled={!newDepartment.title.trim()}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Qo'shish
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedDepartment && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsViewModalOpen(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center justify-between">
                        <span>Bo'lim ma'lumotlari</span>
                        <button
                          onClick={() => setIsViewModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim ID
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{selectedDepartment.id}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim nomi
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{selectedDepartment.title}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tavsif
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{selectedDepartment.description}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim boshlig'i
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{selectedDepartment.headOfDepartment}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Manzil
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{selectedDepartment.address}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim turi
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{departmentTypeMap[selectedDepartment.type]}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-900">{selectedDepartment.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingDepartment && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center justify-between">
                        <span>Bo'limni o'zgartirish</span>
                        <button
                          onClick={() => setIsEditModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="editDepartmentName" className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim nomi
                          </label>
                          <input
                            type="text"
                            id="editDepartmentName"
                            value={editingDepartment.title}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Bo'lim nomini kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="editDepartmentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Tavsif
                          </label>
                          <input
                            type="text"
                            id="editDepartmentDescription"
                            value={editingDepartment.description}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tavsifni kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="editDepartmentFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                            Ism
                          </label>
                          <input
                            type="text"
                            id="editDepartmentFirstName"
                            value={editingDepartment.firstName}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, firstName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ismni kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="editDepartmentLastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Familiya
                          </label>
                          <input
                            type="text"
                            id="editDepartmentLastName"
                            value={editingDepartment.lastName}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, lastName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Familiyani kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="editDepartmentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Manzil
                          </label>
                          <input
                            type="text"
                            id="editDepartmentAddress"
                            value={editingDepartment.address}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, address: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Manzilni kiriting"
                          />
                        </div>
                        <div>
                          <label htmlFor="editDepartmentType" className="block text-sm font-medium text-gray-700 mb-1">
                            Bo'lim turi
                          </label>
                          <select
                            id="editDepartmentType"
                            value={editingDepartment.type}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, type: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Bo'lim turini tanlang</option>
                            <option value="ACADEMIC">Akademik</option>
                            <option value="TECHNICAL">Texnik</option>
                            <option value="FINANCIAL">Moliya</option>
                            <option value="ADMINISTRATIVE">Ma'muriy</option>
                            <option value="SCIENTIFIC">Ilmiy</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleUpdateDepartment}
                    disabled={!editingDepartment.title.trim()}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && deletingDepartment && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Bo'limni o'chirish
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Siz rostdan ham "{deletingDepartment.title}" bo'limini o'chirmoqchimisiz? 
                          Bu bo'limga biriktirilgan barcha xodimlar ham olib tashlanadi. 
                          Bu amalni ortga qaytarib bo'lmaydi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    O'chirish
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;