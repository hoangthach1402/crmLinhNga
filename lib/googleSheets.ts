import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Thông tin cấu hình từ environment variables
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1nxxd_14iDyL7xQcc15RMnvd_TtHHuki6AUCsPC-tw8w';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Cấu hình service account authentication
const serviceAccountAuth = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ],
});

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

export async function getUsersFromSheet(): Promise<User[]> {
  try {
    console.log('=== Google Sheets Connection Debug ===');
    console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
    console.log('SERVICE_ACCOUNT_EMAIL:', SERVICE_ACCOUNT_EMAIL);
    console.log('PRIVATE_KEY available:', !!PRIVATE_KEY);
    console.log('PRIVATE_KEY length:', PRIVATE_KEY?.length || 0);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials in environment variables');
    }
    
    console.log('Creating Google Spreadsheet connection...');
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    
    console.log('Loading document info...');
    await doc.loadInfo();
    
    console.log('Document title:', doc.title);
    console.log('Number of sheets:', doc.sheetsByIndex.length);
    
    // Lấy sheet đầu tiên (gid=0)
    const sheet = doc.sheetsByIndex[0];
    console.log('Sheet title:', sheet.title);
    console.log('Sheet row count:', sheet.rowCount);
    console.log('Sheet column count:', sheet.columnCount);
    
    // Load headers
    await sheet.loadHeaderRow();
    console.log('Headers:', sheet.headerValues);
    
    // Lấy tất cả rows
    const rows = await sheet.getRows();
    console.log('Number of data rows:', rows.length);
      // Chuyển đổi thành format mong muốn
    const users: User[] = rows.map((row, index) => {
      // Mapping theo header names từ Google Sheets 
      const userData = {
        id: parseInt(row.get('id') || row.get('STT') || row.get('ID') || (index + 1).toString()) || (index + 1),
        name: row.get('name') || row.get('Họ và tên') || row.get('Name') || row.get('Tên') || '',
        email: row.get('email') || row.get('Email') || '',
        phone: row.get('phone') || row.get('Số điện thoại') || row.get('Phone') || row.get('SĐT') || '',
        company: row.get('company') || row.get('Công ty') || row.get('Company') || '',
        position: row.get('position') || row.get('Chức vụ') || row.get('Position') || row.get('Vị trí') || '',
        status: row.get('status') || row.get('Trạng thái') || row.get('Status') || 'active',
        created_at: row.get('created_at') || row.get('Ngày tạo') || row.get('Created') || row.get('Date') || new Date().toISOString().split('T')[0]
      };
      
      if (index < 3) { // Log first 3 users for debugging
        console.log(`User ${index + 1}:`, userData);
      }
      
      return userData;
    });
    
    // Lọc bỏ row trống (không có tên)
    const filteredUsers = users.filter(user => user.name && user.name.trim() !== '');
    console.log('Filtered users count:', filteredUsers.length);
    
    return filteredUsers;
  } catch (error) {
    console.error('=== Google Sheets Error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    // Fallback: Trả về dữ liệu mẫu nếu không kết nối được
    console.log('Returning fallback sample data...');
    return [
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
      {
        id: 3,
        name: "Lê Văn Cường",
        email: "cuong.le@company.com",
        phone: "0903456789",
        company: "Công ty DEF",
        position: "Nhân viên",
        status: "inactive",
        created_at: "2024-01-17"
      }
    ];
  }
}

export async function addUserToSheet(userData: Omit<User, 'id'>): Promise<User> {
  try {
    console.log('=== Adding User to Google Sheets ===');
    console.log('User data:', userData);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Lấy sheet đầu tiên
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    
    console.log('Current headers:', sheet.headerValues);
      // Lấy tất cả rows hiện tại
    const rows = await sheet.getRows();
    console.log('Current number of rows:', rows.length);
    
    // Tìm ID lớn nhất hiện có để tạo ID mới unique
    let maxId = 0;
    rows.forEach(row => {
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      if (!isNaN(rowId) && rowId > maxId) {
        maxId = rowId;
      }
    });
    
    // ID mới = max ID hiện tại + 1
    const newId = maxId + 1;
    console.log('Max ID found:', maxId);
    console.log('New ID will be:', newId);
    
    // Tạo user object với ID mới
    const newUser: User = {
      id: newId,
      ...userData
    };
      // Thêm row mới vào cuối sheet (sheet.addRow tự động thêm vào hàng trống cuối cùng)
    const newRow = await sheet.addRow({
      'id': newId,
      'name': userData.name,
      'email': userData.email,
      'phone': userData.phone,
      'company': userData.company,
      'position': userData.position,
      'status': userData.status,
      'created_at': userData.created_at
    });
    
    console.log('Successfully added new row with ID:', newId);
    console.log('New user:', newUser);
    
    return newUser;
  } catch (error) {
    console.error('Error adding user to Google Sheets:', error);
    throw new Error(`Failed to add user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateUserInSheet(userId: number, userData: Partial<User>): Promise<User> {
  try {
    console.log('=== Updating User in Google Sheets ===');
    console.log('User ID:', userId);
    console.log('Update data:', userData);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
      // Tìm row với ID tương ứng
    const rowIndex = rows.findIndex(row => {
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      return rowId === userId;
    });
    
    if (rowIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const row = rows[rowIndex];
    
    // Cập nhật dữ liệu
    if (userData.name !== undefined) row.set('name', userData.name);
    if (userData.email !== undefined) row.set('email', userData.email);
    if (userData.phone !== undefined) row.set('phone', userData.phone);
    if (userData.company !== undefined) row.set('company', userData.company);
    if (userData.position !== undefined) row.set('position', userData.position);
    if (userData.status !== undefined) row.set('status', userData.status);
    if (userData.created_at !== undefined) row.set('created_at', userData.created_at);
    
    await row.save();
    
    // Trả về user đã cập nhật
    const updatedUser: User = {
      id: userId,
      name: row.get('name') || '',
      email: row.get('email') || '',
      phone: row.get('phone') || '',
      company: row.get('company') || '',
      position: row.get('position') || '',
      status: row.get('status') || 'active',
      created_at: row.get('created_at') || ''
    };
    
    console.log('Updated user:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user in Google Sheets:', error);
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteUserFromSheet(userId: number): Promise<boolean> {
  try {
    console.log('=== Deleting User from Google Sheets ===');
    console.log('User ID:', userId);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
      // Tìm row với ID tương ứng
    const rowIndex = rows.findIndex(row => {
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      return rowId === userId;
    });
    
    if (rowIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const row = rows[rowIndex];
    await row.delete();
    
    console.log('Deleted user with ID:', userId);
    return true;
  } catch (error) {
    console.error('Error deleting user from Google Sheets:', error);
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
