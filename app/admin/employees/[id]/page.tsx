'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  salary: number;
  position: string;
  phone: string;
  status: string;
  hireDate: string;
}

function EditEmployeeContent() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    salary: '',
    position: 'Staff',
    phone: '',
    status: 'Active',
    hireDate: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

  const fetchEmployee = async () => {
    try {
      const response = await fetch('/api/employee');
      if (response.ok) {
        const employees = await response.json();
        const emp = employees.find((e: Employee) => e.id === parseInt(params.id as string));
        
        if (emp) {
          setEmployee(emp);
          setFormData({
            name: emp.name,
            email: emp.email,
            salary: emp.salary.toString(),
            position: emp.position,
            phone: emp.phone,
            status: emp.status,
            hireDate: new Date(emp.hireDate).toISOString().split('T')[0]
          });
        } else {
          alert('Employee not found');
          router.push('/admin/employees');
        }
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Failed to fetch employee data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/employee/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salary: parseInt(formData.salary),
        }),
      });

      if (response.ok) {
        router.push('/admin/employees');
      } else {
        const error = await response.json();
        alert('Error updating employee: ' + JSON.stringify(error.error));
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (fetchLoading) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-24 flex flex-col gap-y-6 w-full max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-24 flex flex-col gap-y-6 w-full max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Employee Not Found</h1>
            <Link href="/admin/employees" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Employees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-24 flex flex-col gap-y-6 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/employees" className="text-blue-600 hover:text-blue-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Edit Employee</h1>
          <span className="text-gray-500">{employee.employeeId}</span>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Staff">Staff</option>
                  <option value="Farm Manager">Farm Manager</option>
                  <option value="Quail Caretaker">Quail Caretaker</option>
                  <option value="Feed Specialist">Feed Specialist</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Admin Assistant">Admin Assistant</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Salary (IDR) *
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Hire Date */}
              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Hire Date
                </label>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Employee'}
              </button>
              
              <Link
                href="/admin/employees"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Employee ID Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Employee Information:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Employee ID: <strong>{employee.employeeId}</strong> (cannot be changed)</li>
            <li>• Email address must be unique and valid</li>
            <li>• Salary should be entered in Indonesian Rupiah (IDR)</li>
            <li>• All fields marked with * are required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-24 flex flex-col gap-y-6 w-full max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="h-96 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export default function EditEmployeePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditEmployeeContent />
    </Suspense>
  );
}