'use client';

import { useState, useEffect } from 'react';
import { X, Package, DollarSign, Hash, Tag, Building, Ruler, Link, CheckCircle } from 'lucide-react';
import { useUpdateProduct, Product } from '../hooks/useProducts';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product | null;
}

interface ProductFormData {
  product_code: string;
  product_name: string;
  category: string;
  cost_price: number;
  stock_quantity: number;
  unit: string;
  image_url: string;
  supplier: string;
  order_link: string;
}

export default function EditProductModal({ isOpen, onClose, onProductUpdated, product }: EditProductModalProps) {
  const updateProductMutation = useUpdateProduct();
  
  const [formData, setFormData] = useState<ProductFormData>({
    product_code: '',
    product_name: '',
    category: 'fabric',
    cost_price: 0,
    stock_quantity: 0,
    unit: 'meter',
    image_url: '',
    supplier: '',
    order_link: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load product data when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        product_code: product.product_code,
        product_name: product.product_name,
        category: product.category,
        cost_price: product.cost_price,
        stock_quantity: product.stock_quantity,
        unit: product.unit,
        image_url: product.image_url || '',
        supplier: product.supplier,
        order_link: product.order_link || ''
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost_price' || name === 'stock_quantity' ? Number(value) : value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.product_code.trim()) {
      setError('Mã sản phẩm là bắt buộc');
      return false;
    }
    
    if (!formData.product_name.trim()) {
      setError('Tên sản phẩm là bắt buộc');
      return false;
    }

    if (formData.cost_price < 0) {
      setError('Giá vốn không thể âm');
      return false;
    }

    if (formData.stock_quantity < 0) {
      setError('Số lượng tồn kho không thể âm');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !product) return;

    setError(null);

    try {      console.log('Updating product data:', formData);
      
      const updateData = {
        id: product.id,
        productData: formData
      };

      await updateProductMutation.mutateAsync(updateData);
      
      setSuccess(true);
      console.log('Product updated successfully');

      // Show success message for 2 seconds then close
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onProductUpdated(); // Callback for parent
      }, 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Không thể cập nhật sản phẩm');
    }
  };

  const handleClose = () => {
    if (!updateProductMutation.isPending) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Chỉnh sửa Sản phẩm
            </h3>
            <button
              onClick={handleClose}
              disabled={updateProductMutation.isPending}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-6 bg-green-50 border-b border-green-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800">Sản phẩm đã được cập nhật thành công!</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Mã sản phẩm *
                </label>
                <input
                  type="text"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleInputChange}
                  placeholder="VD: FB001"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  placeholder="VD: Vải lụa cao cấp"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Loại sản phẩm
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                >
                  <option value="fabric">Fabric (Vải)</option>
                  <option value="lace">Lace (Ren)</option>
                  <option value="beads">Beads (Hạt cườm)</option>
                  <option value="accessories">Accessories (Phụ kiện)</option>
                </select>
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Giá vốn (VNĐ)
                </label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Đơn vị
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                >
                  <option value="meter">Meter (m)</option>
                  <option value="yard">Yard (yd)</option>
                  <option value="piece">Piece (cái)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="roll">Roll (cuộn)</option>
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Nhà cung cấp
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="VD: Công ty ABC"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>

              {/* Order Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Link className="w-4 h-4 inline mr-1" />
                  Link đặt hàng
                </label>
                <input
                  type="url"
                  name="order_link"
                  value={formData.order_link}
                  onChange={handleInputChange}
                  placeholder="https://example.com/order"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={updateProductMutation.isPending}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={updateProductMutation.isPending}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updateProductMutation.isPending}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                {updateProductMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
