// Dữ liệu mẫu cho bảng Users
// Cấu trúc dữ liệu theo format Excel với các cột từ A đến H

export const sampleUsersData = [
  // Hàng A2, B2, C2, D2, E2, F2, G2, H2
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@company.com",
    phone: "0901234567",
    company: "Công ty ABC",
    position: "Giám đốc",
    status: "active",
    created_at: "2024-01-15"
  },
  // Hàng A3, B3, C3, D3, E3, F3, G3, H3
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@company.com",
    phone: "0902345678",
    company: "Công ty XYZ",
    position: "Trưởng phòng",
    status: "active",
    created_at: "2024-01-16"
  },
  // Hàng A4, B4, C4, D4, E4, F4, G4, H4
  {
    id: 3,
    name: "Lê Văn Cường",
    email: "cuong.le@company.com",
    phone: "0903456789",
    company: "Công ty DEF",
    position: "Nhân viên",
    status: "inactive",
    created_at: "2024-01-17"
  },
  // Bạn có thể tiếp tục thêm dữ liệu từ hàng A5, A6... trở đi
];

// Cấu trúc mapping cột Excel
export const columnMapping = {
  A: 'id',        // Cột A: STT/ID
  B: 'name',      // Cột B: Họ và tên
  C: 'email',     // Cột C: Email
  D: 'phone',     // Cột D: Số điện thoại
  E: 'company',   // Cột E: Công ty
  F: 'position',  // Cột F: Chức vụ
  G: 'status',    // Cột G: Trạng thái
  H: 'created_at' // Cột H: Ngày tạo
};

// Hướng dẫn nhập dữ liệu
export const dataEntryGuide = {
  title: "Hướng dẫn nhập dữ liệu vào bảng Users",
  description: "Dữ liệu được nhập theo format Excel với cột được đánh số từ A đến H",
  startRow: "A2", // Bắt đầu từ hàng 2 (hàng 1 là header)
  columns: [
    { column: "A", field: "id", description: "Số thứ tự/ID (số nguyên)" },
    { column: "B", field: "name", description: "Họ và tên (văn bản)" },
    { column: "C", field: "email", description: "Địa chỉ email (định dạng email)" },
    { column: "D", field: "phone", description: "Số điện thoại (10-11 số)" },
    { column: "E", field: "company", description: "Tên công ty (văn bản)" },
    { column: "F", field: "position", description: "Chức vụ (văn bản)" },
    { column: "G", field: "status", description: "Trạng thái (active/inactive/pending)" },
    { column: "H", field: "created_at", description: "Ngày tạo (YYYY-MM-DD)" }
  ],
  example: {
    row: "A2:H2",
    data: ["1", "Nguyễn Văn An", "an.nguyen@company.com", "0901234567", "Công ty ABC", "Giám đốc", "active", "2024-01-15"]
  }
};
