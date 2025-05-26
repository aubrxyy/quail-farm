'use client'

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Employee {
  id: number;           // Auto-incrementing primary key
  employeeId: string;   // Custom employee ID (e.g., "EMP001")
  name: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'Inactive';
  email: string;
  phone: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`/api/employee/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setEmployees(employees.filter(emp => emp.id !== id));
        } else {
          alert('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [employees, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
    const totalEmployees = employees.length;
    const totalSalary = employees
      .filter(emp => emp.status === 'Active')
      .reduce((sum, emp) => sum + emp.salary, 0);
    
    return {
      activeEmployees,
      totalEmployees,
      totalSalary
    };
  }, [employees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
          <Link href="/admin/employees/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Employee
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Total Employees</span>
              <span className='font-semibold text-2xl lg:text-3xl text-black'>{stats.totalEmployees}</span>
            </div>
            <div className="flex items-center">
              <Image src="/totalusers.svg" alt="total_employees" width={60} height={60}/>
            </div>
          </div>
          
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Active Employees</span>
              <span className='font-semibold text-2xl lg:text-3xl text-green-600'>{stats.activeEmployees}</span>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 lg:w-15 lg:h-15 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Monthly Salary Cost</span>
              <span className='font-semibold text-lg lg:text-xl text-black mt-1'>{formatCurrency(stats.totalSalary)}</span>
            </div>
            <div className="flex items-center">
              <Image src="/totalsales.svg" alt="salary_total" width={60} height={60}/>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2 bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full md:w-64"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Employee List</h2>
            <span className="text-sm text-gray-500">Showing {filteredEmployees.length} employees</span>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-4">No employees found</div>
              <p className="text-gray-400 mb-6">
                {employees.length === 0 
                  ? "Get started by adding your first employee." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link 
                href="/admin/employees/new" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Add First Employee
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Header - Updated to 6 columns (removed address) */}
              <div className="hidden lg:grid lg:grid-cols-6 gap-x-4 text-sm font-medium bg-gray-100 rounded-xl h-12 w-full p-4 items-center">
                <span>Name</span>
                <span>Position</span>
                <span>Salary</span>
                <span>Hire Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {/* Employee Rows - Updated to 6 columns */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-x-4 text-sm border border-gray-100 lg:border-b lg:border-x-0 lg:border-t-0 w-full p-4 lg:pb-4 lg:px-4 items-start lg:items-center hover:bg-gray-50 rounded lg:rounded-none">
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{employee.name.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{employee.name}</span>
                        <span className="text-xs text-gray-500">ID: {employee.id}</span>
                        <div className="text-xs text-gray-400 mt-1">
                          <div className="truncate">{employee.email}</div>
                          <div className="truncate">{employee.phone}</div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:mt-0 mt-2">
                      <span className="font-medium">{employee.position}</span>
                    </div>

                    <div className="lg:mt-0 mt-2">
                      <span className="font-medium">{formatCurrency(employee.salary)}</span>
                    </div>

                    <div className="lg:mt-0 mt-2">
                      <span className="text-sm">{formatDate(employee.hireDate)}</span>
                    </div>

                    <div className="lg:mt-0 mt-2">
                      <span className={`${employee.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} inline-block text-center font-semibold rounded-full px-3 py-1 text-xs`}>
                        {employee.status}
                      </span>
                    </div>

                    <div className="lg:mt-0 mt-2 flex gap-2">
                      <Link 
                        href={`/admin/employees/${employee.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        {employees.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/employees/new" className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors text-center">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span className="font-medium">Add New Employee</span>
              </div>
            </Link>
            
            <button 
              onClick={() => setStatusFilter('Active')}
              className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors text-center"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium">View Active Employees</span>
                <span className="text-sm">({stats.activeEmployees})</span>
              </div>
            </button>
            
            <Link href="/admin/finances" className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors text-center">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span className="font-medium">View Payroll</span>
                <span className="text-sm">{formatCurrency(stats.totalSalary)}</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}