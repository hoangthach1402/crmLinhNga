# CRM System - Users Management

## Tổng quan
Đây là hệ thống CRM quản lý người dùng được xây dựng với Next.js và TypeScript. Hệ thống hiển thị dữ liệu users trong bảng với format cột được đánh số như Excel.

## Cấu trúc dữ liệu Users

### Định nghĩa cột (giống Excel)
```
A: STT/ID          (Số thứ tự)
B: Họ và tên       (Tên đầy đủ)
C: Email           (Địa chỉ email)
D: Số điện thoại   (10-11 số)
E: Công ty         (Tên công ty)
F: Chức vụ         (Vị trí công việc)
G: Trạng thái      (active/inactive/pending)
H: Ngày tạo        (Định dạng YYYY-MM-DD)
```

### Quy tắc nhập dữ liệu
- **Hàng 1 (A1:H1)**: Header của bảng (không thay đổi)
- **Từ hàng 2 trở đi (A2:H2, A3:H3...)**: Dữ liệu thực tế
- **Bắt đầu nhập từ**: A2, B2, C2, D2, E2, F2, G2, H2

### Ví dụ dữ liệu
```
| A2 | B2              | C2                    | D2         | E2        | F2        | G2     | H2         |
|----|-----------------|----------------------|------------|-----------|-----------|--------|------------|
| 1  | Nguyễn Văn An   | an.nguyen@company.com | 0901234567 | Công ty ABC | Giám đốc | active | 2024-01-15 |
| 2  | Trần Thị Bình   | binh.tran@company.com | 0902345678 | Công ty XYZ | Trưởng phòng | active | 2024-01-16 |
```

## Cấu trúc thư mục
```
my-app/
├── app/
│   ├── components/
│   │   ├── UsersIndex.tsx      # Component chính hiển thị bảng users
│   │   └── DataEntryGuide.tsx  # Component hướng dẫn nhập dữ liệu
│   ├── data/
│   │   └── usersData.ts        # File chứa dữ liệu và cấu hình
│   ├── page.tsx                # Trang chính
│   └── layout.tsx              # Layout chung
├── package.json
└── README.md
```

## Cách chạy ứng dụng

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## Tính năng hiện tại

### ✅ Đã hoàn thành
- [x] Hiển thị bảng users với cột được đánh số (A, B, C, D, E, F, G, H)
- [x] Hiển thị số thứ tự ô trong mỗi cell (A2, B2, C2...)
- [x] Hướng dẫn nhập dữ liệu chi tiết
- [x] Dữ liệu mẫu để test
- [x] Thống kê tổng quan (tổng số users, active, inactive)
- [x] Responsive design
- [x] Trạng thái hiển thị với màu sắc

### 🔄 Sẽ phát triển tiếp
- [ ] Kết nối database thực tế
- [ ] Form thêm/sửa/xóa users
- [ ] Import/Export Excel
- [ ] Tìm kiếm và lọc dữ liệu
- [ ] Phân quyền người dùng
- [ ] API endpoints

## Cách thêm dữ liệu mới

### Phương pháp 1: Thêm vào file usersData.ts
Mở file `app/data/usersData.ts` và thêm object mới vào array `sampleUsersData`:

```typescript
{
  id: 4,                           // A4
  name: "Tên người dùng mới",      // B4
  email: "email@example.com",      // C4
  phone: "0904567890",             // D4
  company: "Tên công ty",          // E4
  position: "Chức vụ",             // F4
  status: "active",                // G4
  created_at: "2024-01-18"         // H4
}
```

### Phương pháp 2: Kết nối database (sẽ phát triển sau)
- Kết nối với database MySQL/PostgreSQL
- Tạo API endpoints để CRUD
- Form nhập liệu trực tiếp trên web

## Ghi chú cho Developer

### TypeScript Interface
```typescript
interface User {
  id: number;        // A column
  name: string;      // B column  
  email: string;     // C column
  phone: string;     // D column
  company: string;   // E column
  position: string;  // F column
  status: string;    // G column (active|inactive|pending)
  created_at: string; // H column (YYYY-MM-DD)
}
```

### Styling
- Sử dụng Tailwind CSS
- Component-based architecture
- Responsive design cho mobile/tablet/desktop

### Performance
- Client-side rendering với useState
- Có thể nâng cấp lên Server-side rendering khi cần
- Lazy loading cho danh sách lớn
