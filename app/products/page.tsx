import { Package, Plus, Search, Filter } from 'lucide-react';

export default function ProductsPage() {
  const sampleProducts = [
    { id: 1, name: 'Sản phẩm A', price: '500,000đ', stock: 25, status: 'active' },
    { id: 2, name: 'Sản phẩm B', price: '750,000đ', stock: 12, status: 'active' },
    { id: 3, name: 'Sản phẩm C', price: '300,000đ', stock: 0, status: 'inactive' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
            <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm và kho hàng</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-blue-600">{sampleProducts.length}</h3>
          <p className="text-sm text-gray-600">Tổng sản phẩm</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {sampleProducts.filter(p => p.status === 'active').length}
          </h3>
          <p className="text-sm text-gray-600">Đang bán</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-red-600">
            {sampleProducts.filter(p => p.stock === 0).length}
          </h3>
          <p className="text-sm text-gray-600">Hết hàng</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-yellow-600">37</h3>
          <p className="text-sm text-gray-600">Tổng giá trị kho</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-blue-600" />
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{product.price}</p>
            <p className="text-sm text-gray-600">
              Tồn kho: <span className={product.stock === 0 ? 'text-red-600 font-medium' : ''}>{product.stock}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-yellow-400 text-2xl mr-3">🚧</div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Đang phát triển</h3>
            <p className="text-sm text-yellow-700">
              Module quản lý sản phẩm đang được phát triển. Sẽ tích hợp với Google Sheets trong phiên bản tiếp theo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
