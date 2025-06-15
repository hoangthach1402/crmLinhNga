'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Download, Plus, Search, Edit, Trash2, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { useProducts, useDeleteProduct, Product } from '../hooks/useProducts';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error, refetch } = useProducts(currentPage, pageSize, debouncedSearch);
  const deleteProductMutation = useDeleteProduct();

  const handleProductAdded = () => {
    // React Query sẽ tự động invalidate và refetch
  };

  const handleProductUpdated = () => {
    // React Query sẽ tự động invalidate và refetch
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(productId);
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa sản phẩm: ' + (err as Error).message);
    }
  };
  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const hasNextPage = data?.hasNextPage || false;
  const hasPrevPage = data?.hasPrevPage || false;
  const lastUpdated = data?.timestamp ? new Date(data.timestamp).toLocaleString('vi-VN') : '';
  
  // No client-side filtering needed since we're doing server-side filtering
  const filteredProducts = products;

  const getCategoryBadge = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'fabric': 'bg-blue-100 text-blue-800',
      'lace': 'bg-purple-100 text-purple-800',
      'beads': 'bg-pink-100 text-pink-800',
      'accessories': 'bg-green-100 text-green-800'
    };
    return categoryMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', label: 'Hết hàng' };
    if (stock < 10) return { color: 'text-yellow-600', label: 'Sắp hết' };
    return { color: 'text-green-600', label: 'Còn hàng' };
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
            <p className="text-gray-600 mt-1">
              Dữ liệu được đồng bộ từ Google Sheets
              {lastUpdated && (
                <span className="text-sm text-gray-500 ml-2">
                  (Cập nhật lần cuối: {lastUpdated})
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
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
              Thêm Sản phẩm
            </button>
          </div>
        </div>        {/* Search and Pagination Info */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã sản phẩm, tên, loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalProducts)} của {totalProducts} sản phẩm
            </div>
            
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={25}>25/trang</option>
              <option value={50}>50/trang</option>
              <option value={100}>100/trang</option>
            </select>
          </div>
        </div>
      </div>      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-600">
                {debouncedSearch ? filteredProducts.length : totalProducts}
              </h3>
              <p className="text-sm text-gray-600">
                {debouncedSearch ? 'Kết quả tìm kiếm' : 'Tổng sản phẩm'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-600">
                {filteredProducts.reduce((sum, p) => sum + (p.cost_price * p.stock_quantity), 0).toLocaleString()}đ
              </h3>
              <p className="text-sm text-gray-600">Tổng giá trị kho</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-600">
                {filteredProducts.filter(p => p.stock_quantity < 10).length}
              </h3>
              <p className="text-sm text-gray-600">Sắp hết hàng</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-600">
                {filteredProducts.filter(p => p.stock_quantity === 0).length}
              </h3>
              <p className="text-sm text-gray-600">Hết hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá vốn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhà cung cấp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Không có dữ liệu</p>
                      <p className="text-sm">
                        {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu sản phẩm'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: Product) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.product_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url && (
                          <img className="h-10 w-10 rounded-full mr-3 object-cover" src={product.image_url} alt={product.product_name} />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(product.category)}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.cost_price.toLocaleString()}đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${stockStatus.color}`}>
                        {product.stock_quantity} ({stockStatus.label})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.supplier}</div>
                      {product.order_link && (
                        <a href={product.order_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800">
                          Link đặt hàng
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })            )}
            </tbody>
          </table></div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={!hasPrevPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Đầu
              </button>
              
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!hasPrevPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
              
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={!hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Cuối
              </button>
            </div>
          </div>
        </div>
      )}

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
            href="https://docs.google.com/spreadsheets/d/1nxxd_14iDyL7xQcc15RMnvd_TtHHuki6AUCsPC-tw8w/edit?gid=1#gid=1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Mở Google Sheets
          </a>        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onProductUpdated={handleProductUpdated}
        product={selectedProduct}
      />
    </div>
  );
}
