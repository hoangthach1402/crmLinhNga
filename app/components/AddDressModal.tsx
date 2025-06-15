'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateDress } from '../hooks/useDresses';
import { User } from '../types';

interface AddDressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const BRANCHES = [
  'LINH NGA Hà Nội',
  'LINH NGA HCM',
  'KHÁCH SỈ TQ',
  'SHILA HVH',
  'SHILA NTMK',
  'KHÁC SỈ TQ'
];

const DRESS_TYPES = [
  'LUXURY - LÊN MỚI',
  'LUXURY - LÊN LẠI',
  'LIMITED - LÊN MỚI',
  'LIMITED - LÊN LẠI',
  'ĐI BÀN - LÊN MỚI',
  'ĐI BÀN - LÊN LẠI',
  'ÁO DÀI - LÊN MỚI',
  'ÁO DÀI - LÊN LẠI',
  'EM BÉ',
  '2IN1 - LÊN MỚI',
  '2IN1 - LÊN LẠI',
  'VÁY SỈ',
  'PHỤ KIỆN',
  'TRUNG BÌNH - LỄ LÊN MỚI',
  'TRUNG BÌNH - LỄ LÊN LẠI',
  'TRUNG BÌNH - BÀN LÊN MỚI',
  'TRUNG BÌNH - BÀN LÊN LẠI',
  'HAUTE COUTURE'
];

export default function AddDressModal({ isOpen, onClose, onSuccess, onError }: AddDressModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dress_code: '',
    dress_description: '',
    branch: '',
    dress_type: '',
    designer30: '',
    designer100: '',
    designer60: '',
    designer20: '',
    designer20_2: '',
    time_dap: '',
    status: 'active',
    time_dinh: '',
    team_dinh: '',
    created_at: new Date().toISOString().split('T')[0]
  });

  const [users, setUsers] = useState<Array<{id: number, name: string}>>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const addDressMutation = useCreateDress();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch('/api/users');
      const usersData = await response.json();
      if (usersData.success) {
        setUsers(usersData.users.map((user: User) => ({ id: user.id, name: user.name })));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dress_code.trim()) {
      onError('Vui lòng nhập mã váy');
      return;
    }    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        time_dap: formData.time_dap ? parseInt(formData.time_dap) : 0,
        time_dinh: formData.time_dinh ? parseInt(formData.time_dinh) : 0,
      };
      
      await addDressMutation.mutateAsync(submitData);
      onSuccess('Thêm váy thành công!');
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        dress_code: '',
        dress_description: '',
        branch: '',
        dress_type: '',
        designer30: '',
        designer100: '',
        designer60: '',
        designer20: '',
        designer20_2: '',
        time_dap: '',
        status: 'active',
        time_dinh: '',
        team_dinh: '',
        created_at: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      onError('Có lỗi xảy ra khi thêm váy!');
      console.error('Add dress error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Thêm Váy Mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dress Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã Váy <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dress_code"
                value={formData.dress_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chi Nhánh
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn chi nhánh</option>
                {BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả Váy
            </label>
            <textarea
              name="dress_description"
              value={formData.dress_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dress Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Váy
            </label>
            <select
              name="dress_type"
              value={formData.dress_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn loại váy</option>
              {DRESS_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Designers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designer 30%
              </label>
              <select
                name="designer30"
                value={formData.designer30}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingUsers}
              >
                <option value="">Chọn designer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designer 100%
              </label>
              <select
                name="designer100"
                value={formData.designer100}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingUsers}
              >
                <option value="">Chọn designer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designer 60%
              </label>
              <select
                name="designer60"
                value={formData.designer60}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingUsers}
              >
                <option value="">Chọn designer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designer 20% (1)
              </label>
              <select
                name="designer20"
                value={formData.designer20}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingUsers}
              >
                <option value="">Chọn designer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designer 20% (2)
              </label>
              <select
                name="designer20_2"
                value={formData.designer20_2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingUsers}
              >
                <option value="">Chọn designer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time Dap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời Gian Đập
              </label>
              <input
                type="date"
                name="time_dap"
                value={formData.time_dap}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng Thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Đang chờ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time Dinh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời Gian Đính
              </label>
              <input
                type="date"
                name="time_dinh"
                value={formData.time_dinh}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Team Dinh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Đính
              </label>
              <input
                type="text"
                name="team_dinh"
                value={formData.team_dinh}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên team đính"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={addDressMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {addDressMutation.isPending ? 'Đang thêm...' : 'Thêm Váy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
