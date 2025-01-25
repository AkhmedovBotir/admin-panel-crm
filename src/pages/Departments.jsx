import React, { useState } from 'react'
import Pagination from '../components/Pagination';

const Departments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [deletingDepartment, setDeletingDepartment] = useState(null)
  const [newDepartment, setNewDepartment] = useState({ name: '', employees: [] })
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Marketing', employees: ['John Doe', 'Jane Smith'] },
    { id: 2, name: 'Moliya', employees: ['Alice Johnson'] },
    { id: 3, name: 'IT', employees: ['Bob Wilson', 'Charlie Brown', 'David Lee'] },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mavjud xodimlar ro'yxati (keyinchalik API dan olinadi)
  const allEmployees = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Wilson',
    'Charlie Brown',
    'David Lee',
    'Eva Green',
    'Frank Miller'
  ]

  const handleAddDepartment = () => {
    setIsModalOpen(true)
    setNewDepartment({ name: '', employees: [] })
  }

  const handleAddEmployee = () => {
    if (selectedEmployee && !newDepartment.employees.includes(selectedEmployee)) {
      setNewDepartment({
        ...newDepartment,
        employees: [...newDepartment.employees, selectedEmployee]
      })
      setSelectedEmployee('')
    }
  }

  const handleRemoveEmployee = (employeeToRemove) => {
    setNewDepartment({
      ...newDepartment,
      employees: newDepartment.employees.filter(emp => emp !== employeeToRemove)
    })
  }

  const handleSaveDepartment = () => {
    if (newDepartment.name.trim()) {
      const newDept = {
        id: departments.length + 1,
        name: newDepartment.name.trim(),
        employees: newDepartment.employees
      }
      setDepartments([...departments, newDept])
      setIsModalOpen(false)
      setNewDepartment({ name: '', employees: [] })
    }
  }

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department)
    setIsViewModalOpen(true)
  }

  const handleEditDepartment = (department) => {
    setEditingDepartment({
      id: department.id,
      name: department.name,
      employees: [...department.employees]
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateDepartment = () => {
    if (editingDepartment.name.trim()) {
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id ? editingDepartment : dept
      ))
      setIsEditModalOpen(false)
      setEditingDepartment(null)
    }
  }

  const handleEditEmployeeAdd = () => {
    if (selectedEmployee && !editingDepartment.employees.includes(selectedEmployee)) {
      setEditingDepartment({
        ...editingDepartment,
        employees: [...editingDepartment.employees, selectedEmployee]
      })
      setSelectedEmployee('')
    }
  }

  const handleEditEmployeeRemove = (employeeToRemove) => {
    setEditingDepartment({
      ...editingDepartment,
      employees: editingDepartment.employees.filter(emp => emp !== employeeToRemove)
    })
  }

  const handleDeleteDepartment = (department) => {
    setDeletingDepartment(department)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    setDepartments(departments.filter(dept => dept.id !== deletingDepartment.id))
    setIsDeleteModalOpen(false)
    setDeletingDepartment(null)
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination uchun ma'lumotlarni filtrlash
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  // Sahifani o'zgartirish
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
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
                Mas'ul xodimlar
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((department) => (
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
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex -space-x-2 relative">
                    {department.employees.slice(0, 3).map((employee, index) => (
                      <div
                        key={employee}
                        className="relative group"
                      >
                        <div
                          className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white"
                        >
                          <span className="text-sm font-medium text-blue-600">
                            {employee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                          {employee}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {department.employees.length > 3 && (
                      <div className="relative group">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white">
                          <span className="text-sm font-medium text-gray-600">
                            +{department.employees.length - 3}
                          </span>
                        </div>
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                          {department.employees.slice(3).join(', ')}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    )}
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
      {filteredDepartments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Ko'rish modali */}
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
                      {/* Bo'lim ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bo'lim ID
                        </label>
                        <div className="px-3 py-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-900">{selectedDepartment.id}</span>
                        </div>
                      </div>

                      {/* Bo'lim nomi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bo'lim nomi
                        </label>
                        <div className="px-3 py-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-900">{selectedDepartment.name}</span>
                        </div>
                      </div>

                      {/* Xodimlar ro'yxati */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mas'ul xodimlar
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {selectedDepartment.employees.map((employee) => (
                            <div
                              key={employee}
                              className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {employee.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{employee}</span>
                            </div>
                          ))}
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

      {/* Modal */}
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
                      {/* Bo'lim nomi */}
                      <div>
                        <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
                          Bo'lim nomi
                        </label>
                        <input
                          type="text"
                          id="departmentName"
                          value={newDepartment.name}
                          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Bo'lim nomini kiriting"
                        />
                      </div>

                      {/* Xodimlarni tanlash */}
                      <div>
                        <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                          Xodimlarni tayinlash
                        </label>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <select
                              id="employeeSelect"
                              value={selectedEmployee}
                              onChange={(e) => setSelectedEmployee(e.target.value)}
                              className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                              <option value="" className="text-gray-500">Xodimni tanlang</option>
                              {allEmployees
                                .filter(emp => !newDepartment.employees.includes(emp))
                                .map((employee) => (
                                  <option 
                                    key={employee} 
                                    value={employee}
                                    className="py-2 text-gray-700 hover:bg-blue-50"
                                  >
                                    {employee}
                                  </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddEmployee}
                            disabled={!selectedEmployee}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Tanlangan xodimlar */}
                      {newDepartment.employees.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanlangan xodimlar
                          </label>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {newDepartment.employees.map((employee) => (
                              <div
                                key={employee}
                                className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {employee.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{employee}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEmployee(employee)}
                                  className="text-gray-400 hover:text-red-600 transition-colors duration-150"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveDepartment}
                  disabled={!newDepartment.name.trim()}
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

      {/* O'zgartirish modali */}
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
                      {/* Bo'lim nomi */}
                      <div>
                        <label htmlFor="editDepartmentName" className="block text-sm font-medium text-gray-700 mb-1">
                          Bo'lim nomi
                        </label>
                        <input
                          type="text"
                          id="editDepartmentName"
                          value={editingDepartment.name}
                          onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Bo'lim nomini kiriting"
                        />
                      </div>

                      {/* Xodimlarni tanlash */}
                      <div>
                        <label htmlFor="editEmployeeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                          Xodimlarni tayinlash
                        </label>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <select
                              id="editEmployeeSelect"
                              value={selectedEmployee}
                              onChange={(e) => setSelectedEmployee(e.target.value)}
                              className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                              <option value="" className="text-gray-500">Xodimni tanlang</option>
                              {allEmployees
                                .filter(emp => !editingDepartment.employees.includes(emp))
                                .map((employee) => (
                                  <option 
                                    key={employee} 
                                    value={employee}
                                    className="py-2 text-gray-700 hover:bg-blue-50"
                                  >
                                    {employee}
                                  </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleEditEmployeeAdd}
                            disabled={!selectedEmployee}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Tanlangan xodimlar */}
                      {editingDepartment.employees.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanlangan xodimlar
                          </label>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {editingDepartment.employees.map((employee) => (
                              <div
                                key={employee}
                                className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {employee.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{employee}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleEditEmployeeRemove(employee)}
                                  className="text-gray-400 hover:text-red-600 transition-colors duration-150"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateDepartment}
                  disabled={!editingDepartment.name.trim()}
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

      {/* O'chirish modali */}
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
                        Siz rostdan ham "{deletingDepartment.name}" bo'limini o'chirmoqchimisiz? 
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
  )
}

export default Departments
