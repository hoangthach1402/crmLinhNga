import Link from 'next/link';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      name: 'Tổng Users',
      value: '2,543',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      href: '/users'
    },
    {
      name: 'Products',
      value: '1,429',
      change: '+8%',
      changeType: 'positive',
      icon: Package,
      href: '/products'
    },
    {
      name: 'Orders',
      value: '3,691',
      change: '+24%',
      changeType: 'positive',
      icon: ShoppingCart,
      href: '/orders'
    },
    {
      name: 'Revenue',
      value: '₫89.2M',
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
      href: '/reports'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng đến với CRM Linh Nga! 👋
        </h1>
        <p className="text-blue-100">
          Quản lý khách hàng, sản phẩm và đơn hàng một cách hiệu quả
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow border"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">từ tháng trước</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">User mới được thêm</p>
                <p className="text-xs text-gray-500">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Đơn hàng #1234 được cập nhật</p>
                <p className="text-xs text-gray-500">15 phút trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Sản phẩm mới được thêm</p>
                <p className="text-xs text-gray-500">1 giờ trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Liên kết nhanh
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/users"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Quản lý Users</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Sản phẩm</span>
            </Link>
            <Link
              href="/orders"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium">Đơn hàng</span>
            </Link>
            <Link
              href="/reports"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium">Báo cáo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Google Sheets Integration Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tình trạng kết nối Google Sheets
        </h3>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div>
            <p className="text-sm text-gray-900">
              Đang kết nối với Google Sheets...
            </p>
            <p className="text-xs text-gray-500">
              Cần cấu hình Service Account để kết nối thành công
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Hướng dẫn cấu hình Google Sheets API:
          </h4>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Tạo project trên Google Cloud Console</li>
            <li>Kích hoạt Google Sheets API</li>
            <li>Tạo Service Account và download JSON key</li>
            <li>Chia sẻ Google Sheets với email Service Account</li>
            <li>Cập nhật file .env.local với thông tin credentials</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
