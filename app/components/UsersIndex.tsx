'use client';

import { useState } from 'react';
import { sampleUsersData } from '../data/usersData';
import DataEntryGuide from './DataEntryGuide';

// Interface cho User
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
}

export default function UsersIndex() {
  const [users, setUsers] = useState<User[]>(sampleUsersData);

  // Định nghĩa các cột với số thứ tự (như Excel)
  const columns = [
    { key: 'A', label: 'STT', field: 'id' },
    { key: 'B', label: 'Họ và tên', field: 'name' },
    { key: 'C', label: 'Email', field: 'email' },
    { key: 'D', label: 'Số điện thoại', field: 'phone' },
    { key: 'E', label: 'Công ty', field: 'company' },
    { key: 'F', label: 'Chức vụ', field: 'position' },
    { key: 'G', label: 'Trạng thái', field: 'status' },
    { key: 'H', label: 'Ngày tạo', field: 'created_at' },
  ];
  return (
    <div className="p-6">
      {/* Component hướng dẫn nhập dữ liệu */}
      <DataEntryGuide />

      {/* Bảng hiển thị dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-blue-600 font-bold">{column.key}1</span>
                    <span className="mt-1">{column.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-lg font-medium">Chưa có dữ liệu người dùng</p>
                    <p className="text-sm">Dữ liệu sẽ được hiển thị khi bạn bổ sung vào từ hàng A2</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="font-mono text-xs text-gray-500">A{index + 2}</span>
                    <br />
                    {user.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">B{index + 2}</span>
                    <br />
                    {user.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">C{index + 2}</span>
                    <br />
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">D{index + 2}</span>
                    <br />
                    {user.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">E{index + 2}</span>
                    <br />
                    {user.company}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">F{index + 2}</span>
                    <br />
                    {user.position}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-500">G{index + 2}</span>
                    <br />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">H{index + 2}</span>
                    <br />
                    {user.created_at}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Thông tin thống kê */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="text-sm font-medium text-gray-600">Tổng số người dùng</h4>
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="text-sm font-medium text-gray-600">Người dùng hoạt động</h4>
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="text-sm font-medium text-gray-600">Người dùng không hoạt động</h4>
            <p className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'inactive').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
