// Shared types for the application

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
}

export interface Product {
  id: number;
  product_code: string;      // Mã hàng
  product_name: string;      // Tên hàng
  category: string;          // Loại (fabric, lace, beads)
  cost_price: number;        // Giá vốn
  stock_quantity: number;    // Tồn kho
  unit: string;             // ĐVT (piece, meter, kg)
  image_url: string;        // Hình ảnh
  supplier: string;         // Nhà cung cấp
  order_link: string;       // Link đặt hàng
  created_at: string;
}

export interface Dress {
  id: number;
  date: string;              // Ngày (cột đầu tiên)
  dress_code: string;        // Mã váy
  dress_description: string; // Mô tả váy
  branch: string;           // Chi nhánh: LINH NGA Hà Nội, LINH NGA HCM, KHÁCH SỈ TQ, SHILA HVH, SHILA NTMK, KHÁC SỈ TQ
  dress_type: string;       // Loại váy: LUXURY, LIMITED, ĐI BÀN, ÁO DÀI, EM BÉ, 2IN1, VÁY SỈ, PHỤ KIỆN, TRUNG BÌNH, HAUTE COUTURE
  designer30: string;       // Designer 30%
  designer100: string;      // Designer 100%
  designer60: string;       // Designer 60%
  designer20: string;       // Designer 20%
  designer20_2: string;     // Designer 20% (thứ 2)
  time_dap: number;         // Thời gian đáp (số)
  status: string;           // Trạng thái
  time_dinh: number;        // Thời gian định (số)
  team_dinh: string;        // Team định
  created_at: string;       // Ngày tạo
}
