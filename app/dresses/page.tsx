'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Edit, Trash2, Package, TrendingUp, AlertTriangle, DollarSign, Filter, X } from 'lucide-react';
import { useDresses, useDeleteDress, DressFilters } from '../hooks/useDresses';
import { useUsers } from '../hooks/useUsers';
import { Dress } from '../types';
import AddDressModal from '../components/AddDressModal';
import EditDressModal from '../components/EditDressModal';

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

export default function DressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize from URL params
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams?.get('page');
    return page ? parseInt(page) : 1;
  });
  const [filters, setFilters] = useState<DressFilters>(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    return {
      search: searchParams?.get('search') || '',
      month: searchParams?.get('month') || currentMonth, // Mặc định là tháng hiện tại
      designer: searchParams?.get('designer') || '',
      time_dap: searchParams?.get('time_dap') ? parseInt(searchParams.get('time_dap')!) : undefined,
      time_dinh: searchParams?.get('time_dinh') ? parseInt(searchParams.get('time_dinh')!) : undefined,
    };
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDress, setEditingDress] = useState<Dress | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 50;
  
  const { data, isLoading, error } = useDresses(currentPage, pageSize, filters);
  const { data: usersData } = useUsers();
  const deleteDataMutation = useDeleteDress();

  // Update URL when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    
    if (filters.search) params.set('search', filters.search);
    if (filters.month) params.set('month', filters.month);
    if (filters.designer) params.set('designer', filters.designer);
    if (filters.time_dap !== undefined) params.set('time_dap', filters.time_dap.toString());
    if (filters.time_dinh !== undefined) params.set('time_dinh', filters.time_dinh.toString());
    
    router.replace(`/dresses?${params.toString()}`, { scroll: false });
  }, [currentPage, filters, router]);
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof DressFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };  const clearFilters = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    setFilters({ 
      search: '', 
      month: currentMonth, // Reset về tháng hiện tại thay vì rỗng
      designer: '', 
      time_dap: undefined, 
      time_dinh: undefined 
    });
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    const totalPages = data?.totalPages || 1;
    setCurrentPage(totalPages);
  };

  const handleEditDress = (dress: Dress) => {
    setEditingDress(dress);
    setShowEditModal(true);
  };

  const handleDeleteDress = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa váy này?')) {
      try {
        await deleteDataMutation.mutateAsync(id);
        showToast('Xóa váy thành công!', 'success');
      } catch (error) {
        showToast('Có lỗi xảy ra khi xóa váy!', 'error');
        console.error('Delete error:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTypeColor = (type: string) => {
    if (type.includes('LUXURY')) return 'bg-purple-100 text-purple-800';
    if (type.includes('LIMITED')) return 'bg-blue-100 text-blue-800';
    if (type.includes('ĐI BÀN')) return 'bg-green-100 text-green-800';
    if (type.includes('ÁO DÀI')) return 'bg-red-100 text-red-800';
    if (type.includes('EM BÉ')) return 'bg-pink-100 text-pink-800';
    if (type.includes('2IN1')) return 'bg-yellow-100 text-yellow-800';
    if (type.includes('VÁY SỈ')) return 'bg-gray-100 text-gray-800';
    if (type.includes('PHỤ KIỆN')) return 'bg-indigo-100 text-indigo-800';
    if (type.includes('TRUNG BÌNH')) return 'bg-orange-100 text-orange-800';
    if (type.includes('HAUTE COUTURE')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case 'LINH NGA Hà Nội': return 'bg-blue-100 text-blue-800';
      case 'LINH NGA HCM': return 'bg-green-100 text-green-800';
      case 'KHÁCH SỈ TQ': return 'bg-purple-100 text-purple-800';
      case 'SHILA HVH': return 'bg-pink-100 text-pink-800';
      case 'SHILA NTMK': return 'bg-yellow-100 text-yellow-800';
      case 'KHÁC SỈ TQ': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Lỗi tải dữ liệu</h3>
          <p className="text-red-600">Không thể tải danh sách váy. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  const dresses = data?.dresses || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const hasNextPage = data?.hasNextPage || false;
  const hasPrevPage = data?.hasPrevPage || false;

  // Filter for stats (use current page data for quick calculation)
  const filteredDresses = dresses;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Váy cưới</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin váy cưới, thiết kế và chi nhánh
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm váy mới
          </button>
        </div>
      </div>      {/* Search and Filters */}
      <div className="space-y-4">        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã váy, mô tả, chi nhánh, loại váy..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </button>
        </div>

        {/* Quick Time Navigation */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">⚡ Thời gian nhanh:</span>
          {[
            { label: 'Tháng này', value: new Date().toISOString().slice(0, 7) },
            { label: 'Tháng trước', value: (() => {
              const date = new Date();
              date.setMonth(date.getMonth() - 1);
              return date.toISOString().slice(0, 7);
            })() },
            { label: 'Tháng 12/2024', value: '2024-12' },
            { label: 'Tháng 6/2024', value: '2024-06' },
            { label: 'Tháng 12/2021', value: '2021-12' },
          ].map((quickTime) => (
            <button
              key={quickTime.value}
              onClick={() => handleFilterChange('month', quickTime.value)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filters.month === quickTime.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {quickTime.label}
            </button>
          ))}
          <button
            onClick={() => handleFilterChange('month', '')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              !filters.month
                ? 'bg-gray-500 text-white border-gray-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tất cả
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Bộ lọc nâng cao</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xóa tất cả
              </button>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">              {/* Time Period Quick Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-blue-600 font-semibold">⏰ Thời gian xem dữ liệu</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  value={filters.month || ''}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                >
                  <option value="">📅 Tất cả thời gian</option>
                  <optgroup label="🌟 Năm 2025">
                    <option value="2025-06">🔥 Tháng 6/2025 (Hiện tại)</option>
                    <option value="2025-05">Tháng 5/2025</option>
                    <option value="2025-04">Tháng 4/2025</option>
                    <option value="2025-03">Tháng 3/2025</option>
                    <option value="2025-02">Tháng 2/2025</option>
                    <option value="2025-01">Tháng 1/2025</option>
                  </optgroup>
                  <optgroup label="📊 Năm 2024">
                    <option value="2024-12">Tháng 12/2024</option>
                    <option value="2024-11">Tháng 11/2024</option>
                    <option value="2024-10">Tháng 10/2024</option>
                    <option value="2024-09">Tháng 9/2024</option>
                    <option value="2024-08">Tháng 8/2024</option>
                    <option value="2024-07">Tháng 7/2024</option>
                    <option value="2024-06">Tháng 6/2024</option>
                    <option value="2024-05">Tháng 5/2024</option>
                    <option value="2024-04">Tháng 4/2024</option>
                    <option value="2024-03">Tháng 3/2024</option>
                    <option value="2024-02">Tháng 2/2024</option>
                    <option value="2024-01">Tháng 1/2024</option>
                  </optgroup>
                  <optgroup label="📈 Năm 2023">
                    <option value="2023-12">Tháng 12/2023</option>
                    <option value="2023-11">Tháng 11/2023</option>
                    <option value="2023-10">Tháng 10/2023</option>
                    <option value="2023-09">Tháng 9/2023</option>
                    <option value="2023-08">Tháng 8/2023</option>
                    <option value="2023-07">Tháng 7/2023</option>
                    <option value="2023-06">Tháng 6/2023</option>
                    <option value="2023-05">Tháng 5/2023</option>
                    <option value="2023-04">Tháng 4/2023</option>
                    <option value="2023-03">Tháng 3/2023</option>
                    <option value="2023-02">Tháng 2/2023</option>
                    <option value="2023-01">Tháng 1/2023</option>
                  </optgroup>
                  <optgroup label="📅 Năm 2022">
                    <option value="2022-12">Tháng 12/2022</option>
                    <option value="2022-11">Tháng 11/2022</option>
                    <option value="2022-10">Tháng 10/2022</option>
                    <option value="2022-09">Tháng 9/2022</option>
                    <option value="2022-08">Tháng 8/2022</option>
                    <option value="2022-07">Tháng 7/2022</option>
                    <option value="2022-06">Tháng 6/2022</option>
                    <option value="2022-05">Tháng 5/2022</option>
                    <option value="2022-04">Tháng 4/2022</option>
                    <option value="2022-03">Tháng 3/2022</option>
                    <option value="2022-02">Tháng 2/2022</option>
                    <option value="2022-01">Tháng 1/2022</option>
                  </optgroup>
                  <optgroup label="📝 Năm 2021">
                    <option value="2021-12">Tháng 12/2021</option>
                    <option value="2021-11">Tháng 11/2021</option>
                    <option value="2021-10">Tháng 10/2021</option>
                    <option value="2021-09">Tháng 9/2021</option>
                    <option value="2021-08">Tháng 8/2021</option>
                    <option value="2021-07">Tháng 7/2021</option>
                    <option value="2021-06">Tháng 6/2021</option>
                    <option value="2021-05">Tháng 5/2021</option>
                    <option value="2021-04">Tháng 4/2021</option>
                    <option value="2021-03">Tháng 3/2021</option>
                    <option value="2021-02">Tháng 2/2021</option>
                    <option value="2021-01">Tháng 1/2021</option>
                  </optgroup>
                </select>
              </div>

              {/* Designer Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thiết kế viên
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.designer || ''}
                  onChange={(e) => handleFilterChange('designer', e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {usersData?.users?.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Dap Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian đập (giờ)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.time_dap || ''}
                  onChange={(e) => handleFilterChange('time_dap', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Nhập số giờ"
                />
              </div>

              {/* Time Dinh Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian đính (giờ)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.time_dinh || ''}
                  onChange={(e) => handleFilterChange('time_dinh', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Nhập số giờ"
                />
              </div>
            </div>

            {/* Applied Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Tìm kiếm: {filters.search}
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.month && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tháng: {filters.month}
                  <button
                    onClick={() => handleFilterChange('month', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.designer && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Designer: {filters.designer}
                  <button
                    onClick={() => handleFilterChange('designer', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.time_dap !== undefined && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Thời gian đập: {filters.time_dap}h
                  <button
                    onClick={() => handleFilterChange('time_dap', undefined)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.time_dinh !== undefined && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  Thời gian đính: {filters.time_dinh}h
                  <button
                    onClick={() => handleFilterChange('time_dinh', undefined)}
                    className="ml-1 text-pink-600 hover:text-pink-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}      </div>

      {/* Time Period Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {filters.month ? (() => {
                  const [year, month] = filters.month.split('-');
                  const monthNames = [
                    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
                  ];
                  return `${monthNames[parseInt(month) - 1]} năm ${year}`;
                })() : 'Tất cả thời gian'}
              </h3>
              <p className="text-sm text-blue-700">
                Dữ liệu váy cưới - <span className="font-medium">{total.toLocaleString()}</span> kết quả
              </p>
            </div>
          </div>
          {filters.month && (
            <div className="text-right">
              <button
                onClick={() => handleFilterChange('month', '')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-600">{total.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Tổng số váy</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-600">
                {filteredDresses.filter(d => d.status === 'active').length}
              </h3>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-purple-600">
                {filteredDresses.filter(d => d.dress_type.includes('LUXURY')).length}
              </h3>
              <p className="text-sm text-gray-600">Luxury</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-orange-600">
                {filteredDresses.filter(d => d.dress_type.includes('LIMITED')).length}
              </h3>
              <p className="text-sm text-gray-600">Limited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã váy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi nhánh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại váy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">              {filteredDresses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Không có dữ liệu</p>                      <p className="text-sm">
                        {filters.search ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu váy'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (                filteredDresses.map((dress: Dress) => (
                  <tr key={dress.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dress.date || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dress.dress_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={dress.dress_description}>
                        {dress.dress_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBranchColor(dress.branch)}`}>
                        {dress.branch}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(dress.dress_type)}`}>
                        {dress.dress_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>30%: {dress.designer30 || 'N/A'}</div>
                        <div>100%: {dress.designer100 || 'N/A'}</div>
                        <div>60%: {dress.designer60 || 'N/A'}</div>
                        <div>20%: {dress.designer20 || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Đập: {dress.time_dap || 'N/A'}</div>
                        <div>Đính: {dress.time_dinh || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        dress.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {dress.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditDress(dress)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDress(dress.id)}
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
      </div>      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> của{' '}
              <span className="font-medium">{total}</span> kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, currentPage - 2) + i;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              {/* Last page shortcut */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-1 text-sm text-gray-500">...</span>
                  <button
                    onClick={goToLastPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddDressModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}          onSuccess={(message: string) => {
            showToast(message, 'success');
            setShowAddModal(false);
          }}
          onError={(message: string) => showToast(message, 'error')}
        />
      )}

      {showEditModal && editingDress && (
        <EditDressModal
          isOpen={showEditModal}
          dress={editingDress}
          onClose={() => {
            setShowEditModal(false);
            setEditingDress(null);
          }}          onSuccess={(message: string) => {
            showToast(message, 'success');
            setShowEditModal(false);
            setEditingDress(null);
          }}
          onError={(message: string) => showToast(message, 'error')}
        />
      )}      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
