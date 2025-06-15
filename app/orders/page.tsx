import { ShoppingCart, Plus, Search, Filter, Eye } from 'lucide-react';

export default function OrdersPage() {
  const sampleOrders = [
    { 
      id: '#ORD-001', 
      customer: 'Nguyễn Văn An', 
      total: '1,500,000đ', 
      status: 'completed',
      date: '2024-06-15'
    },
    { 
      id: '#ORD-002', 
      customer: 'Trần Thị Bình', 
      total: '2,200,000đ', 
      status: 'pending',
      date: '2024-06-14'
    },
    { 
      id: '#ORD-003', 
      customer: 'Lê Văn Cường', 
      total: '850,000đ', 
      status: 'processing',
      date: '2024-06-13'
    },
    { 
      id: '#ORD-004', 
      customer: 'Phạm Thị Dung', 
      total: '3,100,000đ', 
      status: 'cancelled',
      date: '2024-06-12'
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'completed': { class: 'bg-green-100 text-green-800', text: 'Hoàn thành' },
      'pending': { class: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      'processing': { class: 'bg-blue-100 text-blue-800', text: 'Đang xử lý' },
      'cancelled': { class: 'bg-red-100 text-red-800', text: 'Đã hủy' }
    };
    return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: 'Không xác định' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý các đơn hàng</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Tạo đơn hàng
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng theo ID hoặc tên khách hàng..."
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
          <h3 className="text-lg font-semibold text-blue-600">{sampleOrders.length}</h3>
          <p className="text-sm text-gray-600">Tổng đơn hàng</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {sampleOrders.filter(o => o.status === 'completed').length}
          </h3>
          <p className="text-sm text-gray-600">Hoàn thành</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-yellow-600">
            {sampleOrders.filter(o => o.status === 'pending').length}
          </h3>
          <p className="text-sm text-gray-600">Chờ xử lý</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-purple-600">7,650,000đ</h3>
          <p className="text-sm text-gray-600">Tổng doanh thu</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleOrders.map((order) => {
                const statusInfo = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ShoppingCart className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-yellow-400 text-2xl mr-3">🚧</div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Đang phát triển</h3>
            <p className="text-sm text-yellow-700">
              Module quản lý đơn hàng đang được phát triển. Sẽ tích hợp với Google Sheets trong phiên bản tiếp theo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
