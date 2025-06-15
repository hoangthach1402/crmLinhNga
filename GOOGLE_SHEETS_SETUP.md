# Hướng dẫn cấu hình Google Sheets API

## 🚀 Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Ghi nhớ Project ID

## 🔧 Bước 2: Kích hoạt Google Sheets API

1. Trong Google Cloud Console, vào **APIs & Services** > **Library**
2. Tìm kiếm "Google Sheets API"
3. Click **Enable** để kích hoạt

## 🔑 Bước 3: Tạo Service Account

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Điền thông tin:
   - Service account name: `crm-sheets-reader`
   - Service account ID: `crm-sheets-reader`
   - Description: `CRM Google Sheets Reader`
4. Click **Create and Continue**
5. Assign role: **Viewer** (hoặc **Editor** nếu cần ghi dữ liệu)
6. Click **Continue** và **Done**

## 📥 Bước 4: Tạo và tải JSON Key

1. Trong danh sách Service Accounts, click vào account vừa tạo
2. Vào tab **Keys**
3. Click **Add Key** > **Create New Key**
4. Chọn **JSON** và click **Create**
5. File JSON sẽ được tải về máy

## 📝 Bước 5: Cấu hình môi trường

1. Mở file JSON vừa tải, copy các thông tin:
   ```json
   {
     "client_email": "crm-sheets-reader@your-project.iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
   }
   ```

2. Cập nhật file `.env.local`:
   ```bash
   GOOGLE_SERVICE_ACCOUNT_EMAIL=crm-sheets-reader@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
   GOOGLE_SPREADSHEET_ID=1nxxd_14iDyL7xQcc15RMnvd_TtHHuki6AUCsPC-tw8w
   ```

## 🔗 Bước 6: Chia sẻ Google Sheets

1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/1nxxd_14iDyL7xQcc15RMnvd_TtHHuki6AUCsPC-tw8w/edit
2. Click nút **Share** (Chia sẻ)
3. Thêm email Service Account: `crm-sheets-reader@your-project.iam.gserviceaccount.com`
4. Quyền: **Viewer** (hoặc **Editor** nếu cần)
5. Bỏ tick "Notify people" và click **Share**

## 📊 Bước 7: Chuẩn bị dữ liệu trong Google Sheets

Đảm bảo Google Sheets có cấu trúc như sau:

| A1 (STT) | B1 (Họ và tên) | C1 (Email) | D1 (Số điện thoại) | E1 (Công ty) | F1 (Chức vụ) | G1 (Trạng thái) | H1 (Ngày tạo) |
|----------|----------------|------------|-------------------|--------------|--------------|-----------------|---------------|
| 1        | Nguyễn Văn An  | an@example.com | 0901234567 | Công ty ABC | Giám đốc | active | 2024-01-15 |
| 2        | Trần Thị Bình  | binh@example.com | 0902345678 | Công ty XYZ | Trưởng phòng | active | 2024-01-16 |

**Lưu ý quan trọng:**
- Hàng 1 là header (A1, B1, C1...)
- Dữ liệu bắt đầu từ hàng 2 (A2, B2, C2...)
- Cột G (Trạng thái) chỉ nhận: `active`, `inactive`, `pending`

## 🧪 Bước 8: Test kết nối

1. Restart development server:
   ```bash
   npm run dev
   ```

2. Truy cập: http://localhost:3000/users

3. Check console log để xem kết quả kết nối

## ❌ Xử lý lỗi thường gặp

### Lỗi 403: Forbidden
- **Nguyên nhân**: Chưa chia sẻ Google Sheets với Service Account
- **Giải pháp**: Thực hiện lại Bước 6

### Lỗi 404: Not Found
- **Nguyên nhân**: Sai GOOGLE_SPREADSHEET_ID
- **Giải pháp**: Kiểm tra lại ID trong URL Google Sheets

### Lỗi Private Key
- **Nguyên nhân**: Private key không đúng format
- **Giải pháp**: Đảm bảo copy đúng và có dấu ngoặc kép

### Lỗi Headers
- **Nguyên nhân**: Tên cột trong Google Sheets không khớp
- **Giải pháp**: Đảm bảo header đúng như hướng dẫn Bước 7

## 🔄 Cập nhật dữ liệu

Sau khi cấu hình thành công:
1. Thêm/sửa dữ liệu trực tiếp trong Google Sheets
2. Vào trang Users trong CRM
3. Click nút "Làm mới" để đồng bộ dữ liệu mới

## 🛡️ Bảo mật

- **Không commit** file JSON key vào Git
- Giữ Service Account email và private key bảo mật
- Chỉ cấp quyền tối thiểu cần thiết (Viewer thay vì Editor nếu có thể)
- Thường xuyên rotate keys nếu cần

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình cấu hình, hãy kiểm tra:
1. Console log trong browser (F12)
2. Terminal log khi chạy `npm run dev`
3. Đảm bảo tất cả các bước được thực hiện đúng thứ tự
