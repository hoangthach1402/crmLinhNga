'use client';

import { useState, useRef } from 'react';
import { RefreshCw, Download, Plus, Search, Edit, Trash2 } from 'lucide-react';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import { useUsers, useDeleteUser, User } from '../hooks/useUsers';

export default function UsersPage() {
  const { data, isLoading, error, refetch } = useUsers();
  const deleteUserMutation = useDeleteUser();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Ref to preserve scroll position
  const scrollRef = useRef<HTMLDivElement>(null);  const handleUserAdded = () => {
    // React Query sẽ tự động invalidate và refetch
    // Không cần làm gì thêm
  };

  const handleUserUpdated = () => {
    // React Query sẽ tự động invalidate và refetch
    // Không cần làm gì thêm
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa user này?')) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(userId);
      // Optimistic update sẽ tự động xử lý UI
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa user: ' + (err as Error).message);
    }
  };

  // Extract data from React Query
  const users = data?.users || [];
  const lastUpdated = data?.timestamp ? new Date(data.timestamp).toLocaleString('vi-VN') : '';
  
  const filteredUsers = users.filter((user: User) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getColumnLabel = (colIndex: number, rowIndex: number) => {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return `${columns[colIndex]}${rowIndex + 2}`;
  };
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu từ Google Sheets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-red-400 text-2xl mr-3">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="mt-1 text-red-700">{error.message}</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div ref={scrollRef} className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Users</h1>
            <p className="text-gray-600 mt-1">
              Dữ liệu được đồng bộ từ Google Sheets
              {lastUpdated && (
                <span className="text-sm text-gray-500 ml-2">
                  (Cập nhật lần cuối: {lastUpdated})
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">            <button 
              onClick={() => refetch()}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm User
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-blue-600">{filteredUsers.length}</h3>
          <p className="text-sm text-gray-600">Tổng users</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {filteredUsers.filter(u => u.status.toLowerCase() === 'active').length}
          </h3>
          <p className="text-sm text-gray-600">Đang hoạt động</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-yellow-600">
            {filteredUsers.filter(u => u.status.toLowerCase() === 'pending').length}
          </h3>
          <p className="text-sm text-gray-600">Chờ xử lý</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-red-600">
            {filteredUsers.filter(u => u.status.toLowerCase() === 'inactive').length}
          </h3>
          <p className="text-sm text-gray-600">Không hoạt động</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT (A1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên (B1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email (C1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại (D1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty (E1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức vụ (F1)
                </th>                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái (G1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo (H1)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">{filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p className="text-lg font-medium">Không có dữ liệu</p>
                      <p className="text-sm">
                        {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu người dùng'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {getColumnLabel(0, index)}: {user.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{getColumnLabel(1, index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">{getColumnLabel(2, index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                      <div className="text-xs text-gray-500">{getColumnLabel(3, index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company}</div>
                      <div className="text-xs text-gray-500">{getColumnLabel(4, index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.position}</div>
                      <div className="text-xs text-gray-500">{getColumnLabel(5, index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500 mb-1">{getColumnLabel(6, index)}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.created_at}</div>
                      <div className="text-xs text-gray-500">{getColumnLabel(7, index)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Sheets Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800">Nguồn dữ liệu</h3>
            <p className="text-sm text-blue-600">
              Dữ liệu được đồng bộ từ Google Sheets
            </p>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1nxxd_14iDyL7xQcc15RMnvd_TtHHuki6AUCsPC-tw8w/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Mở Google Sheets
          </a>        </div>
      </div>      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
        user={selectedUser}
      />
    </div>
  );
}
