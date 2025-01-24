import React, { useState } from 'react';

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPosition, setFilterPosition] = useState('');

  // Mavjud lavozimlar ro'yxati
  const positions = [
    'Marketing Manager',
    'Software Developer',
    'HR Manager',
    'Sales Manager',
    'Financial Analyst',
    'Project Manager',
    'System Administrator'
  ];

  // Mavjud bo'limlar ro'yxati
  const departments = [
    'Marketing',
    'IT',
    'HR',
    'Sales',
    'Finance',
    'Operations',
    'Administration'
  ];

  // Mavjud rollar ro'yxati
  const roles = [
    'admin',
    'user'
  ];

  // Namuna ma'lumotlar (keyinchalik API dan olinadi)
  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      position: 'Marketing Manager',
      department: 'Marketing',
      username: 'john.doe',
      password: '********'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      position: 'Software Developer',
      department: 'IT',
      username: 'jane.smith',
      password: '********'
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    role: '',
    position: '',
    department: '',
    username: '',
    password: ''
  });

  // Yangi xodim qo'shish
  const handleAddEmployee = () => {
    setIsModalOpen(true);
    setNewEmployee({
      firstName: '',
      lastName: '',
      role: '',
      position: '',
      department: '',
      username: '',
      password: ''
    });
  };

  // Yangi xodimni saqlash
  const handleSaveEmployee = () => {
    if (newEmployee.firstName && newEmployee.lastName) {
      const newEmp = {
        id: employees.length + 1,
        ...newEmployee
      };
      setEmployees([...employees, newEmp]);
      setIsModalOpen(false);
    }
  };

  // Xodim ma'lumotlarini ko'rish
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  // Xodim ma'lumotlarini tahrirlash
  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
    setIsEditModalOpen(true);
  };

  // Tahrirlangan ma'lumotlarni saqlash
  const handleUpdateEmployee = () => {
    if (editingEmployee.firstName && editingEmployee.lastName) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? editingEmployee : emp
      ));
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    }
  };

  // Xodimni o'chirish
  const handleDeleteEmployee = (employee) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  // O'chirishni tasdiqlash
  const handleConfirmDelete = () => {
    setEmployees(employees.filter(emp => emp.id !== deletingEmployee.id));
    setIsDeleteModalOpen(false);
    setDeletingEmployee(null);
  };

  // Filterlarni tozalash
  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterDepartment('');
    setFilterPosition('');
  };

  // Xodimlarni filtrlash
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const matchesRole = !filterRole || employee.role === filterRole
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment
    const matchesPosition = !filterPosition || employee.position === filterPosition

    return matchesSearch && matchesRole && matchesDepartment && matchesPosition
  });

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Xodimlar</h1>
        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi xodim
        </button>
      </div>

      {/* Search va Filter */}
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-96">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 px-4 border border-gray-300 rounded-lg pl-10"
                placeholder="Qidirish..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div className="w-40">
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="appearance-none w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Barcha rollar</option>
                {roles.map((role) => (
                  <option key={role} value={role} className="py-2">
                    {role}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Department Filter */}
          <div className="w-44">
            <div className="relative">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="appearance-none w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Barcha bo'limlar</option>
                {departments.map((department) => (
                  <option key={department} value={department} className="py-2">
                    {department}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Position Filter */}
          <div className="w-44">
            <div className="relative">
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="appearance-none w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Barcha lavozimlar</option>
                {positions.map((position) => (
                  <option key={position} value={position} className="py-2">
                    {position}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filterRole || filterDepartment || filterPosition) && (
            <button
              onClick={clearFilters}
              className="h-10 px-4 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                F.I.O
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lavozim
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bo'lim
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foydalanuvchi
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {employee.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {employee.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee)}
                      className="text-red-600 hover:text-red-900"
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Yangi xodim qo'shish</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ism"
                value={newEmployee.firstName}
                onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Familiya"
                value={newEmployee.lastName}
                onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Xodim roli
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="appearance-none w-full h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Rolni tanlang</option>
                    {roles.map((role) => (
                      <option key={role} value={role} className="py-2">
                        {role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Lavozim
                </label>
                <div className="relative">
                  <select
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="appearance-none w-full h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Lavozimni tanlang</option>
                    {positions.map((position) => (
                      <option key={position} value={position} className="py-2">
                        {position}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Bo'lim
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="appearance-none w-full h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Bo'limni tanlang</option>
                    {departments.map((department) => (
                      <option key={department} value={department} className="py-2">
                        {department}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Foydalanuvchi nomi"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                placeholder="Parol"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveEmployee}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xodim ma'lumotlari</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">F.I.O</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <div className="mt-1 text-sm text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {selectedEmployee.role}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lavozim</label>
                <div className="mt-1 text-sm text-gray-900">{selectedEmployee.position}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bo'lim</label>
                <div className="mt-1 text-sm text-gray-900">{selectedEmployee.department}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Foydalanuvchi nomi</label>
                <div className="mt-1 text-sm text-gray-900">{selectedEmployee.username}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xodim ma'lumotlarini tahrirlash</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ism"
                value={editingEmployee.firstName}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Familiya"
                value={editingEmployee.lastName}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
              <div>
                <label htmlFor="editRole" className="block text-sm font-medium text-gray-700 mb-1">
                  Xodim roli
                </label>
                <div className="relative">
                  <select
                    id="editRole"
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    className="appearance-none w-full h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Rolni tanlang</option>
                    {roles.map((role) => (
                      <option key={role} value={role} className="py-2">
                        {role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="editPosition" className="block text-sm font-medium text-gray-700 mb-1">
                  Lavozim
                </label>
                <div className="relative">
                  <select
                    id="editPosition"
                    value={editingEmployee.position}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                    className="appearance-none w-full h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Lavozimni tanlang</option>
                    {positions.map((position) => (
                      <option key={position} value={position} className="py-2">
                        {position}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="editDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Bo'lim
                </label>
                <div className="relative">
                  <select
                    id="editDepartment"
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    className="appearance-none w-full h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Bo'limni tanlang</option>
                    {departments.map((department) => (
                      <option key={department} value={department} className="py-2">
                        {department}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Foydalanuvchi nomi"
                value={editingEmployee.username}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, username: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                placeholder="Parol"
                value={editingEmployee.password}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, password: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUpdateEmployee}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xodimni o'chirish</h3>
            <p className="text-sm text-gray-500">
              Haqiqatan ham {deletingEmployee.firstName} {deletingEmployee.lastName}ni o'chirmoqchimisiz?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;