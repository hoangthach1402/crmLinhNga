import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Helper function to handle duplicate headers
function processHeaders(sheet: any, columnCount: number): string[] {
  const headerValues: string[] = [];
  const seenHeaders = new Set<string>();
  
  for (let col = 0; col < Math.min(columnCount, 26); col++) {
    const cell = sheet.getCell(0, col);
    const value = cell.value;
    let headerName: string;
    
    if (value && typeof value === 'string' && value.trim() !== '') {
      headerName = value.trim();
      // Handle duplicate headers by adding suffix
      if (seenHeaders.has(headerName)) {
        let counter = 2;
        let uniqueName = `${headerName}_${counter}`;
        while (seenHeaders.has(uniqueName)) {
          counter++;
          uniqueName = `${headerName}_${counter}`;
        }
        headerName = uniqueName;
      }
      seenHeaders.add(headerName);
      headerValues.push(headerName);
    } else {
      headerName = `col_${col}`; // Fallback name for empty headers
      headerValues.push(headerName);
    }
  }
  
  return headerValues;
}

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
  designer30: string;       // Designer 30% (tên từ users)
  designer100: string;      // Designer 100% (tên từ users)
  designer60: string;       // Designer 60% (tên từ users)
  designer20: string;       // Designer 20% (tên từ users)
  designer20_2: string;     // Designer 20% thứ 2 (tên từ users)
  time_dap: number;         // Thời gian đập (số)
  status: string;           // Trạng thái
  time_dinh: number;        // Thời gian đính (số)
  team_dinh: string;        // Team đính
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
    
    // Debug: List all sheets
    for (let i = 0; i < doc.sheetsByIndex.length; i++) {
      const sheetDebug = doc.sheetsByIndex[i];
      console.log(`Sheet ${i}: "${sheetDebug.title}" (gid: ${sheetDebug.sheetId})`);
    }
      // Tìm sheet đầu tiên cho users (gid=0)
    const sheet = doc.sheetsByIndex[0]; // Sheet đầu tiên là users
    console.log('Selected sheet title:', sheet.title);
    console.log('Selected sheet gid:', sheet.sheetId);
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

export async function getProductsFromSheet(page: number = 1, limit: number = 50, search: string = ''): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
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
    
    // Debug: List all sheets
    for (let i = 0; i < doc.sheetsByIndex.length; i++) {
      const sheetDebug = doc.sheetsByIndex[i];
      console.log(`Sheet ${i}: "${sheetDebug.title}" (gid: ${sheetDebug.sheetId})`);
    }
    
    // Tìm sheet có tên hoặc gid phù hợp với products
    let targetSheet = null;
    
    // Tìm sheet theo tên
    targetSheet = doc.sheetsByTitle['products'] || doc.sheetsByTitle['Products'] || doc.sheetsByTitle['Sản phẩm'];
    
    // Nếu không tìm thấy theo tên, thử theo gid (544808463)
    if (!targetSheet) {
      targetSheet = doc.sheetsById[544808463];
    }
    
    // Nếu vẫn không tìm thấy, dùng sheet thứ 2 (index 1)
    if (!targetSheet && doc.sheetsByIndex.length > 1) {
      targetSheet = doc.sheetsByIndex[1];
    }
    
    // Fallback về sheet đầu tiên
    if (!targetSheet) {
      targetSheet = doc.sheetsByIndex[0];
    }
      const sheet = targetSheet;
    console.log('Selected sheet title:', sheet.title);
    console.log('Selected sheet gid:', sheet.sheetId);
    console.log('Sheet row count:', sheet.rowCount);
    console.log('Sheet column count:', sheet.columnCount);
    
    // Load headers với xử lý lỗi duplicate
    let headerValues: string[] = [];
    let useManualHeaders = false;
    
    try {
      await sheet.loadHeaderRow();
      headerValues = sheet.headerValues;
      console.log('Headers:', headerValues);
    } catch (error) {      console.log('Header loading error - using manual approach:', error);
      useManualHeaders = true;
      
      // Load cells thủ công để đọc header
      await sheet.loadCells('A1:Z1');
      headerValues = processHeaders(sheet, sheet.columnCount);
      console.log('Manual headers:', headerValues);
    }
      // Lấy tất cả rows
    let rows;
    let products: Product[] = [];
      if (useManualHeaders) {
      // Load a smaller range của cells để tránh lỗi memory
      const maxRows = Math.min(sheet.rowCount, 100); // Chỉ load 100 rows đầu tiên để test
      await sheet.loadCells(`A2:Z${maxRows}`);
      
      console.log(`Loading manual data from A2:Z${maxRows}`);
      
      // Tạo products từ cells thủ công
      for (let row = 1; row < maxRows && row < 50; row++) { // Limit 50 rows để test
        const productData: any = {};
        let hasData = false;
        
        // Map theo position của các headers
        for (let col = 0; col < headerValues.length && col < 26; col++) {
          const cell = sheet.getCell(row, col);
          const header = headerValues[col];
          const value = cell.value;
          
          if (value !== null && value !== undefined && value !== '') {
            hasData = true;
            productData[header] = typeof value === 'string' ? value.trim() : value;
          }
        }
        
        // Chỉ thêm row nếu có data
        if (hasData) {
          const product = {
            id: parseInt(productData['id'] || productData['STT'] || productData['ID'] || row.toString()) || row,
            product_code: productData['product_code'] || productData['Mã hàng'] || '',
            product_name: productData['product_name'] || productData['Tên hàng'] || productData['MML427'] || productData['VÁY CD JUSTINE'] || '',
            category: productData['category'] || productData['Loại'] || '',
            cost_price: parseFloat(productData['cost_price'] || productData['Giá vốn'] || '0') || 0,
            stock_quantity: parseInt(productData['stock_quantity'] || productData['Tồn kho'] || '0') || 0,
            unit: productData['unit'] || productData['ĐVT'] || '',
            image_url: productData['image_url'] || productData['Hình ảnh'] || '',
            supplier: productData['supplier'] || productData['Nhà cung cấp'] || '',
            order_link: productData['order_link'] || productData['Link đặt hàng'] || '',
            created_at: productData['created_at'] || productData['CREATED_AT'] || productData['Ngày tạo'] || productData['Created'] || productData['Date'] || new Date().toISOString().split('T')[0]
          };
          
          // Log first few products for debugging
          if (products.length < 5) {
            console.log(`Manual Product ${products.length + 1}:`, product);
          }
          
          // Chỉ thêm nếu có tên sản phẩm
          if (product.product_name && product.product_name.trim() !== '') {
            products.push(product);
          }
        }
      }
      
      console.log('Manual data rows processed:', products.length);
    } else {
      // Sử dụng phương pháp thông thường với getRows
      rows = await sheet.getRows();
      console.log('Number of data rows:', rows.length);
      
      // Chuyển đổi thành format mong muốn
      products = rows.map((row, index) => {
        // Mapping theo header names từ Google Sheets 
        const productData = {
          id: parseInt(row.get('id') || row.get('STT') || row.get('ID') || (index + 1).toString()) || (index + 1),
          product_code: row.get('product_code') || row.get('Mã hàng') || '',
          product_name: row.get('product_name') || row.get('Tên hàng') || '',
          category: row.get('category') || row.get('Loại') || '',
          cost_price: parseFloat(row.get('cost_price') || row.get('Giá vốn') || '0') || 0,
          stock_quantity: parseInt(row.get('stock_quantity') || row.get('Tồn kho') || '0') || 0,
          unit: row.get('unit') || row.get('ĐVT') || '',
          image_url: row.get('image_url') || row.get('Hình ảnh') || '',
          supplier: row.get('supplier') || row.get('Nhà cung cấp') || '',
          order_link: row.get('order_link') || row.get('Link đặt hàng') || '',
          created_at: row.get('created_at') || row.get('CREATED_AT') || row.get('Ngày tạo') || row.get('Created') || row.get('Date') || new Date().toISOString().split('T')[0]
        };
        
        if (index < 3) { // Log first 3 products for debugging
          console.log(`Product ${index + 1}:`, productData);
        }
        
        return productData;
      }).filter(product => product.product_name && product.product_name.trim() !== '');
    }    // Lọc bỏ row trống (không có tên hàng) - đã được xử lý ở trên
    let allFilteredProducts = products.filter(product => product.product_name && product.product_name.trim() !== '');
    console.log('Final filtered products count:', allFilteredProducts.length);
    
    // Apply search filter if provided
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase().trim();
      allFilteredProducts = allFilteredProducts.filter(product => 
        product.product_code.toLowerCase().includes(searchLower) ||
        product.product_name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.supplier.toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', allFilteredProducts.length, 'products found');
    }
    
    // Calculate pagination
    const total = allFilteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = allFilteredProducts.slice(startIndex, endIndex);
    
    console.log(`Pagination: page ${page}/${totalPages}, showing ${paginatedProducts.length}/${total} products`);
    
    return {
      products: paginatedProducts,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  } catch (error) {
    console.error('=== Google Sheets Error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
      // Fallback: Trả về dữ liệu mẫu nếu không kết nối được
    console.log('Returning fallback sample data...');
    const fallbackProducts = [
      {
        id: 1,
        product_code: "SP001",
        product_name: "Sản phẩm 1",
        category: "fabric",
        cost_price: 10000,
        stock_quantity: 50,
        unit: "meter",
        image_url: "http://example.com/image1.jpg",
        supplier: "Nhà cung cấp A",
        order_link: "http://example.com/order1",
        created_at: "2024-01-15"
      },
      {
        id: 2,
        product_code: "SP002",
        product_name: "Sản phẩm 2",
        category: "lace",
        cost_price: 20000,
        stock_quantity: 30,
        unit: "piece",
        image_url: "http://example.com/image2.jpg",
        supplier: "Nhà cung cấp B",
        order_link: "http://example.com/order2",
        created_at: "2024-01-16"
      },
      {
        id: 3,
        product_code: "SP003",
        product_name: "Sản phẩm 3",
        category: "beads",
        cost_price: 15000,
        stock_quantity: 100,
        unit: "kg",
        image_url: "http://example.com/image3.jpg",
        supplier: "Nhà cung cấp C",
        order_link: "http://example.com/order3",
        created_at: "2024-01-17"
      }
    ];
    
    return {
      products: fallbackProducts,
      total: fallbackProducts.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    };
  }
}

export async function addProductToSheet(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    console.log('=== Adding Product to Google Sheets ===');
    console.log('Product data:', productData);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Lấy sheet thứ hai cho sản phẩm
    const sheet = doc.sheetsByIndex[1];
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
    
    // Tạo product object với ID mới
    const newProduct: Product = {
      id: newId,
      ...productData
    };    // Thêm row mới vào cuối sheet (sheet.addRow tự động thêm vào hàng trống cuối cùng)
    // Tự động detect header tên đúng
    const createdAtHeader = sheet.headerValues.find(h => 
      h.toLowerCase() === 'created_at' || h === 'CREATED_AT' || h === 'Ngày tạo'
    ) || 'created_at';
    
    const newRowData: any = {
      'product_code': productData.product_code,
      'product_name': productData.product_name,
      'category': productData.category,
      'cost_price': productData.cost_price,
      'stock_quantity': productData.stock_quantity,
      'unit': productData.unit,
      'image_url': productData.image_url,
      'supplier': productData.supplier,
      'order_link': productData.order_link
    };
    
    // Thêm ID nếu có trong headers
    if (sheet.headerValues.includes('id') || sheet.headerValues.includes('ID')) {
      newRowData['id'] = newId;
    }
    
    // Thêm created_at với header name đúng
    newRowData[createdAtHeader] = productData.created_at;
    
    const newRow = await sheet.addRow(newRowData);
    
    console.log('Successfully added new row with ID:', newId);
    console.log('New product:', newProduct);
    
    return newProduct;
  } catch (error) {
    console.error('Error adding product to Google Sheets:', error);
    throw new Error(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateProductInSheet(productId: number, productData: Partial<Product>): Promise<Product> {
  try {
    console.log('=== Updating Product in Google Sheets ===');
    console.log('Product ID:', productId);
    console.log('Update data:', productData);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Debug: List all sheets
    for (let i = 0; i < doc.sheetsByIndex.length; i++) {
      const sheetDebug = doc.sheetsByIndex[i];
      console.log(`Update Sheet ${i}: "${sheetDebug.title}" (gid: ${sheetDebug.sheetId})`);
    }
    
    // Tìm sheet có tên hoặc gid phù hợp với products
    let targetSheet = null;
    
    // Tìm sheet theo tên
    targetSheet = doc.sheetsByTitle['products'] || doc.sheetsByTitle['Products'] || doc.sheetsByTitle['Sản phẩm'];
    
    // Nếu không tìm thấy theo tên, thử theo gid (544808463)
    if (!targetSheet) {
      targetSheet = doc.sheetsById[544808463];
    }
    
    // Nếu vẫn không tìm thấy, dùng sheet thứ 2 (index 1)
    if (!targetSheet && doc.sheetsByIndex.length > 1) {
      targetSheet = doc.sheetsByIndex[1];
    }
    
    // Fallback về sheet đầu tiên
    if (!targetSheet) {
      targetSheet = doc.sheetsByIndex[0];
    }
      const sheet = targetSheet;
    console.log('Update - Selected sheet title:', sheet.title);
    console.log('Update - Selected sheet gid:', sheet.sheetId);
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    console.log('Total rows available:', rows.length);
    console.log('Looking for product ID:', productId);
    
    // Tìm row với ID tương ứng - products không có cột id riêng, dùng row index
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Kiểm tra các cách định danh có thể có
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      if (rowId === productId) {
        rowIndex = i;
        break;
      }
      // Fallback: sử dụng row index + 1 làm ID
      if ((i + 1) === productId) {
        rowIndex = i;
        break;
      }
    }
    
    console.log('Found at row index:', rowIndex);
    
    if (rowIndex === -1) {
      // Debug: Show first few rows to understand structure
      console.log('=== DEBUG: First few rows ===');
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const row = rows[i];
        console.log(`Row ${i + 1}:`, {
          id: row.get('id') || 'N/A',
          product_code: row.get('product_code') || 'N/A',
          product_name: row.get('product_name') || 'N/A'
        });
      }
      throw new Error(`Product with ID ${productId} not found`);
    }
      const row = rows[rowIndex];
    
    // Cập nhật dữ liệu - sử dụng header detection tự động
    if (productData.product_code !== undefined) row.set('product_code', productData.product_code);
    if (productData.product_name !== undefined) row.set('product_name', productData.product_name);
    if (productData.category !== undefined) row.set('category', productData.category);
    if (productData.cost_price !== undefined) row.set('cost_price', productData.cost_price);
    if (productData.stock_quantity !== undefined) row.set('stock_quantity', productData.stock_quantity);
    if (productData.unit !== undefined) row.set('unit', productData.unit);
    if (productData.image_url !== undefined) row.set('image_url', productData.image_url);
    if (productData.supplier !== undefined) row.set('supplier', productData.supplier);
    if (productData.order_link !== undefined) row.set('order_link', productData.order_link);
    
    // Tự động detect header cho created_at
    if (productData.created_at !== undefined) {
      const createdAtHeader = sheet.headerValues.find(h => 
        h.toLowerCase() === 'created_at' || h === 'CREATED_AT' || h === 'Ngày tạo'
      ) || 'CREATED_AT'; // Default to CREATED_AT as seen in logs      row.set(createdAtHeader, productData.created_at);
    }
    
    await row.save();
      // Trả về product đã cập nhật
    const createdAtHeader = sheet.headerValues.find(h => 
      h.toLowerCase() === 'created_at' || h === 'CREATED_AT' || h === 'Ngày tạo'
    ) || 'created_at';
    
    const updatedProduct: Product = {
      id: productId,
      product_code: row.get('product_code') || '',
      product_name: row.get('product_name') || '',
      category: row.get('category') || '',
      cost_price: parseFloat(row.get('cost_price') || '0') || 0,
      stock_quantity: parseInt(row.get('stock_quantity') || '0') || 0,
      unit: row.get('unit') || '',
      image_url: row.get('image_url') || '',
      supplier: row.get('supplier') || '',
      order_link: row.get('order_link') || '',
      created_at: row.get(createdAtHeader) || ''
    };
    
    console.log('Updated product:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product in Google Sheets:', error);
    throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteProductFromSheet(productId: number): Promise<boolean> {
  try {
    console.log('=== Deleting Product from Google Sheets ===');
    console.log('Product ID:', productId);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
      const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Tìm sheet có tên hoặc gid phù hợp với products (same logic as update)
    let targetSheet = null;
    
    // Tìm sheet theo tên
    targetSheet = doc.sheetsByTitle['products'] || doc.sheetsByTitle['Products'] || doc.sheetsByTitle['Sản phẩm'];
    
    // Nếu không tìm thấy theo tên, thử theo gid (544808463)
    if (!targetSheet) {
      targetSheet = doc.sheetsById[544808463];
    }
    
    // Nếu vẫn không tìm thấy, dùng sheet thứ 2 (index 1)
    if (!targetSheet && doc.sheetsByIndex.length > 1) {
      targetSheet = doc.sheetsByIndex[1];
    }
    
    // Fallback về sheet đầu tiên
    if (!targetSheet) {
      targetSheet = doc.sheetsByIndex[0];
    }
    
    const sheet = targetSheet;
    console.log('Delete - Selected sheet title:', sheet.title);
    console.log('Delete - Selected sheet gid:', sheet.sheetId);
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    console.log('Total rows available for delete:', rows.length);
    console.log('Looking for product ID to delete:', productId);
    
    // Tìm row với ID tương ứng - products không có cột id riêng, dùng row index
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Kiểm tra các cách định danh có thể có
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      if (rowId === productId) {
        rowIndex = i;
        break;
      }
      // Fallback: sử dụng row index + 1 làm ID
      if ((i + 1) === productId) {
        rowIndex = i;
        break;
      }
    }
    
    console.log('Found row to delete at index:', rowIndex);
    
    if (rowIndex === -1) {
      // Debug: Show first few rows to understand structure
      console.log('=== DEBUG DELETE: First few rows ===');
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const row = rows[i];
        console.log(`Row ${i + 1}:`, {
          id: row.get('id') || 'N/A',
          product_code: row.get('product_code') || 'N/A',
          product_name: row.get('product_name') || 'N/A'
        });
      }
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    const row = rows[rowIndex];
    await row.delete();
    
    console.log('Deleted product with ID:', productId);
    return true;
  } catch (error) {
    console.error('Error deleting product from Google Sheets:', error);
    throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getDressesFromSheet(
  page: number = 1, 
  limit: number = 50, 
  search: string = '',
  filters: {
    month?: string;
    designer?: string;
    time_dap?: number;
    time_dinh?: number;
  } = {}
): Promise<{
  dresses: Dress[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  try {
    console.log('=== Google Sheets Connection Debug for Dresses ===');
    console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
    console.log('SERVICE_ACCOUNT_EMAIL:', SERVICE_ACCOUNT_EMAIL);
    console.log('PRIVATE_KEY available:', !!PRIVATE_KEY);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials in environment variables');
    }
    
    console.log('Creating Google Spreadsheet connection...');
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    
    console.log('Loading document info...');
    await doc.loadInfo();
    console.log('Document title:', doc.title);
    console.log('Number of sheets:', doc.sheetsByIndex.length);
    
    // Debug: List all sheets
    for (let i = 0; i < doc.sheetsByIndex.length; i++) {
      const sheetDebug = doc.sheetsByIndex[i];
      console.log(`Sheet ${i}: "${sheetDebug.title}" (gid: ${sheetDebug.sheetId})`);
    }
    
    // Tìm sheet có tên hoặc gid phù hợp với dress
    let targetSheet = null;
    
    // Tìm sheet theo tên
    targetSheet = doc.sheetsByTitle['dress'] || doc.sheetsByTitle['Dress'] || doc.sheetsByTitle['DRESS'];
    
    // Nếu không tìm thấy theo tên, thử theo gid (728077449)
    if (!targetSheet) {
      targetSheet = doc.sheetsById[728077449];
    }
    
    // Fallback: tìm theo index
    if (!targetSheet && doc.sheetsByIndex.length > 2) {
      targetSheet = doc.sheetsByIndex[2]; // Thử sheet thứ 3
    }
    
    if (!targetSheet) {
      throw new Error('Dress sheet not found');
    }
    
    const sheet = targetSheet;
    console.log('Selected dress sheet title:', sheet.title);
    console.log('Selected dress sheet gid:', sheet.sheetId);
    console.log('Sheet row count:', sheet.rowCount);
    console.log('Sheet column count:', sheet.columnCount);
    
    // Load headers với xử lý lỗi duplicate
    let headerValues: string[] = [];
    let useManualHeaders = false;
    
    try {
      await sheet.loadHeaderRow();
      headerValues = sheet.headerValues;
      console.log('Headers:', headerValues);
    } catch (error) {
      console.log('Header loading error - using manual approach:', error);      useManualHeaders = true;
      
      // Load cells thủ công để đọc header
      await sheet.loadCells('A1:Z1');
      headerValues = processHeaders(sheet, sheet.columnCount);
      console.log('Manual headers:', headerValues);
    }
    
    // Lấy tất cả rows
    let rows;
    let dresses: Dress[] = [];
    
    if (useManualHeaders) {
      // Load a smaller range của cells để tránh lỗi memory
      const maxRows = Math.min(sheet.rowCount, 1000); // Chỉ load 1000 rows đầu tiên
      await sheet.loadCells(`A2:Z${maxRows}`);
      
      console.log(`Loading manual data from A2:Z${maxRows}`);
      
      // Tạo dresses từ cells thủ công
      for (let row = 1; row < maxRows; row++) {
        const dressData: any = {};
        let hasData = false;
        
        // Map theo position của các headers
        for (let col = 0; col < headerValues.length && col < 26; col++) {
          const cell = sheet.getCell(row, col);
          const header = headerValues[col];
          const value = cell.value;
          
          if (value !== null && value !== undefined && value !== '') {
            hasData = true;
            dressData[header] = typeof value === 'string' ? value.trim() : value;
          }
        }
          // Chỉ thêm row nếu có data
        if (hasData) {          const dress = {
            id: parseInt(dressData['id'] || dressData['STT'] || dressData['ID'] || row.toString()) || row,
            date: dressData['date'] || dressData['Date'] || dressData['Ngày'] || '',
            dress_code: dressData['dress_code'] || dressData['Mã váy'] || '',
            dress_description: dressData['dress_description'] || dressData['Mô tả váy'] || '',
            branch: dressData['branch'] || dressData['Chi nhánh'] || '',
            dress_type: dressData['dress_type'] || dressData['Loại váy'] || '',
            designer30: dressData['designer30'] || dressData['Designer30'] || '',
            designer100: dressData['designer100'] || dressData['Designer100'] || '',
            designer60: dressData['designer60'] || dressData['Designer60'] || '',
            designer20: dressData['designer20'] || dressData['Designer20'] || '',
            designer20_2: dressData['designer20_2'] || dressData['Designer20_2'] || dressData['designer20_2'] || '',            time_dap: parseInt(dressData['time_dap'] || dressData['TimeDap'] || '0') || 0,
            status: dressData['status'] || dressData['Status'] || dressData['Trạng thái'] || 'active',
            time_dinh: parseInt(dressData['time_dinh'] || dressData['TimeDinh'] || '0') || 0,
            team_dinh: dressData['team_dinh'] || dressData['TeamDinh'] || '',
            created_at: dressData['created_at'] || dressData['CREATED_AT'] || dressData['Ngày tạo'] || new Date().toISOString().split('T')[0]
          };
          
          // Log first few dresses for debugging
          if (dresses.length < 5) {
            console.log(`Manual Dress ${dresses.length + 1}:`, dress);
          }
          
          // Chỉ thêm nếu có mã váy
          if (dress.dress_code && dress.dress_code.trim() !== '') {
            dresses.push(dress);
          }
        }
      }
      
      console.log('Manual dress data rows processed:', dresses.length);
    } else {
      // Sử dụng phương pháp thông thường với getRows
      rows = await sheet.getRows();
      console.log('Number of dress data rows:', rows.length);
        // Chuyển đổi thành format mong muốn
      dresses = rows.map((row, index) => {        // Mapping theo header names từ Google Sheets 
        const dressData = {
          id: parseInt(row.get('id') || row.get('STT') || row.get('ID') || (index + 1).toString()) || (index + 1),
          date: row.get('date') || row.get('Date') || row.get('Ngày') || '',
          dress_code: row.get('dress_code') || row.get('Mã váy') || '',
          dress_description: row.get('dress_description') || row.get('Mô tả váy') || '',
          branch: row.get('branch') || row.get('Chi nhánh') || '',
          dress_type: row.get('dress_type') || row.get('Loại váy') || '',
          designer30: row.get('designer30') || row.get('Designer30') || '',
          designer100: row.get('designer100') || row.get('Designer100') || '',
          designer60: row.get('designer60') || row.get('Designer60') || '',
          designer20: row.get('designer20') || row.get('Designer20') || '',
          designer20_2: row.get('designer20_2') || row.get('Designer20_2') || '',          time_dap: parseInt(row.get('time_dap') || row.get('TimeDap') || '0') || 0,
          status: row.get('status') || row.get('Status') || row.get('Trạng thái') || 'active',
          time_dinh: parseInt(row.get('time_dinh') || row.get('TimeDinh') || '0') || 0,
          team_dinh: row.get('team_dinh') || row.get('TeamDinh') || '',
          created_at: row.get('created_at') || row.get('CREATED_AT') || row.get('Ngày tạo') || new Date().toISOString().split('T')[0]
        };
        
        if (index < 3) { // Log first 3 dresses for debugging
          console.log(`Dress ${index + 1}:`, dressData);
        }
        
        return dressData;
      }).filter(dress => dress.dress_code && dress.dress_code.trim() !== '');
    }
    
    // Lọc bỏ row trống (không có mã váy)
    let allFilteredDresses = dresses.filter(dress => dress.dress_code && dress.dress_code.trim() !== '');
    console.log('Final filtered dresses count:', allFilteredDresses.length);
      // Apply search filter if provided
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase().trim();
      allFilteredDresses = allFilteredDresses.filter(dress => 
        dress.dress_code.toLowerCase().includes(searchLower) ||
        dress.dress_description.toLowerCase().includes(searchLower) ||
        dress.branch.toLowerCase().includes(searchLower) ||
        dress.dress_type.toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', allFilteredDresses.length, 'dresses found');
    }
      // Apply additional filters
    if (filters.month && filters.month.trim() !== '') {
      const targetMonth = filters.month; // Format: YYYY-MM
      allFilteredDresses = allFilteredDresses.filter(dress => {
        if (dress.date) {
          try {
            let dressDate: Date;
            
            // Xử lý nhiều định dạng ngày
            if (dress.date.includes('/')) {
              // Format: dd/mm/yyyy
              const parts = dress.date.split('/');
              if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]);
                const year = parseInt(parts[2]);
                dressDate = new Date(year, month - 1, day); // month is 0-indexed
              } else {
                return false;
              }
            } else if (dress.date.includes('-')) {
              // Format: yyyy-mm-dd
              dressDate = new Date(dress.date);
            } else {
              return false;
            }
            
            if (!isNaN(dressDate.getTime())) {
              const monthYear = `${dressDate.getFullYear()}-${String(dressDate.getMonth() + 1).padStart(2, '0')}`;
              return monthYear === targetMonth;
            }
          } catch (error) {
            console.log('Date parsing error for:', dress.date, error);
          }
        }
        return false;
      });
      console.log('After month filter:', allFilteredDresses.length, 'dresses found');
    }
    
    if (filters.designer && filters.designer.trim() !== '') {
      const designerFilter = filters.designer.toLowerCase();
      allFilteredDresses = allFilteredDresses.filter(dress => 
        dress.designer30.toLowerCase().includes(designerFilter) ||
        dress.designer100.toLowerCase().includes(designerFilter) ||
        dress.designer60.toLowerCase().includes(designerFilter) ||
        dress.designer20.toLowerCase().includes(designerFilter) ||
        dress.designer20_2.toLowerCase().includes(designerFilter)
      );
      console.log('After designer filter:', allFilteredDresses.length, 'dresses found');
    }
      if (filters.time_dap !== undefined) {
      allFilteredDresses = allFilteredDresses.filter(dress => dress.time_dap === filters.time_dap);
      console.log('After time_dap filter:', allFilteredDresses.length, 'dresses found');
    }
    
    if (filters.time_dinh !== undefined) {
      allFilteredDresses = allFilteredDresses.filter(dress => dress.time_dinh === filters.time_dinh);
      console.log('After time_dinh filter:', allFilteredDresses.length, 'dresses found');
    }
    
    // Calculate pagination
    const total = allFilteredDresses.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDresses = allFilteredDresses.slice(startIndex, endIndex);
    
    console.log(`Pagination: page ${page}/${totalPages}, showing ${paginatedDresses.length}/${total} dresses`);
    
    return {
      dresses: paginatedDresses,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  } catch (error) {
    console.error('=== Google Sheets Error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    // Fallback: Trả về dữ liệu mẫu nếu không kết nối được
    console.log('Returning fallback sample dress data...');    const fallbackDresses = [
      {
        id: 1,
        date: "2025-06-15",
        dress_code: "DR001",
        dress_description: "Váy cưới luxury",
        branch: "LINH NGA Hà Nội",
        dress_type: "LUXURY - LÊN MỚI",
        designer30: "John Doe",
        designer100: "Jane Smith",
        designer60: "Mike Johnson",
        designer20: "Sarah Wilson",
        designer20_2: "Tom Brown",
        time_dap: 0,
        status: "active",
        time_dinh: 0,
        team_dinh: "Team A",
        created_at: "2025-06-15"
      }
    ];
    
    return {
      dresses: fallbackDresses,
      total: fallbackDresses.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    };
  }
}

export async function addDressToSheet(dressData: Omit<Dress, 'id'>): Promise<Dress> {
  try {
    console.log('=== Adding Dress to Google Sheets ===');
    console.log('Dress data:', dressData);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Tìm sheet dress
    let targetSheet = null;
    targetSheet = doc.sheetsByTitle['dress'] || doc.sheetsByTitle['Dress'] || doc.sheetsByTitle['DRESS'];
    
    if (!targetSheet) {
      targetSheet = doc.sheetsById[728077449];
    }
    
    if (!targetSheet) {
      throw new Error('Dress sheet not found');
    }
      const sheet = targetSheet;
    
    // Xử lý headers với duplicate detection
    let headerValues: string[] = [];
    try {
      await sheet.loadHeaderRow();
      headerValues = sheet.headerValues;
    } catch (error) {
      console.log('Header loading error - using manual approach for adding:', error);
      await sheet.loadCells('A1:Z1');
      headerValues = processHeaders(sheet, sheet.columnCount);
    }
    
    console.log('Current headers:', headerValues);
    
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
    
    // Tạo dress object với ID mới
    const newDress: Dress = {
      id: newId,
      ...dressData
    };
      // Thêm row mới vào cuối sheet - tự động detect header đúng
    const createdAtHeader = headerValues.find(h => 
      h.toLowerCase() === 'created_at' || h === 'CREATED_AT' || h === 'Ngày tạo'
    ) || 'created_at';const newRowData: any = {
      'date': dressData.date,
      'dress_code': dressData.dress_code,
      'dress_description': dressData.dress_description,
      'branch': dressData.branch,
      'dress_type': dressData.dress_type,
      'designer30': dressData.designer30,
      'designer100': dressData.designer100,
      'designer60': dressData.designer60,
      'designer20': dressData.designer20,
      'designer20_2': dressData.designer20_2,
      'time_dap': dressData.time_dap,
      'status': dressData.status,
      'time_dinh': dressData.time_dinh,
      'team_dinh': dressData.team_dinh    };
    
    // Thêm ID nếu có trong headers
    if (headerValues.includes('id') || headerValues.includes('ID')) {
      newRowData['id'] = newId;
    }
    
    // Thêm created_at với header name đúng
    newRowData[createdAtHeader] = dressData.created_at;
    
    const newRow = await sheet.addRow(newRowData);
    
    console.log('Successfully added new row with ID:', newId);
    console.log('New dress:', newDress);
    
    return newDress;
  } catch (error) {
    console.error('Error adding dress to Google Sheets:', error);
    throw new Error(`Failed to add dress: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateDressInSheet(dressId: number, dressData: Partial<Dress>): Promise<Dress> {
  try {
    console.log('=== Updating Dress in Google Sheets ===');
    console.log('Dress ID:', dressId);
    console.log('Update data:', dressData);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Debug: List all sheets
    for (let i = 0; i < doc.sheetsByIndex.length; i++) {
      const sheetDebug = doc.sheetsByIndex[i];
      console.log(`Update Sheet ${i}: "${sheetDebug.title}" (gid: ${sheetDebug.sheetId})`);
    }
    
    // Tìm sheet dress
    let targetSheet = null;
    targetSheet = doc.sheetsByTitle['dress'] || doc.sheetsByTitle['Dress'] || doc.sheetsByTitle['DRESS'];
    
    if (!targetSheet) {
      targetSheet = doc.sheetsById[728077449];
    }
    
    if (!targetSheet) {
      throw new Error('Dress sheet not found');
    }
      const sheet = targetSheet;
    console.log('Update - Selected sheet title:', sheet.title);
    console.log('Update - Selected sheet gid:', sheet.sheetId);
    
    // Xử lý headers với duplicate detection
    let headerValues: string[] = [];
    try {
      await sheet.loadHeaderRow();
      headerValues = sheet.headerValues;
    } catch (error) {
      console.log('Header loading error - using manual approach for update:', error);
      await sheet.loadCells('A1:Z1');
      headerValues = processHeaders(sheet, sheet.columnCount);
    }
    
    const rows = await sheet.getRows();
    console.log('Total rows available:', rows.length);
    console.log('Looking for dress ID:', dressId);
    
    // Tìm row với ID tương ứng
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Kiểm tra các cách định danh có thể có
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      if (rowId === dressId) {
        rowIndex = i;
        break;
      }
      // Fallback: sử dụng row index + 1 làm ID
      if ((i + 1) === dressId) {
        rowIndex = i;
        break;
      }
    }
    
    console.log('Found at row index:', rowIndex);
    
    if (rowIndex === -1) {
      // Debug: Show first few rows to understand structure
      console.log('=== DEBUG: First few rows ===');
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const row = rows[i];
        console.log(`Row ${i + 1}:`, {
          id: row.get('id') || 'N/A',
          dress_code: row.get('dress_code') || 'N/A',
          dress_description: row.get('dress_description') || 'N/A'
        });
      }
      throw new Error(`Dress with ID ${dressId} not found`);
    }
    
    const row = rows[rowIndex];    // Cập nhật dữ liệu
    if (dressData.date !== undefined) row.set('date', dressData.date);
    if (dressData.dress_code !== undefined) row.set('dress_code', dressData.dress_code);
    if (dressData.dress_description !== undefined) row.set('dress_description', dressData.dress_description);
    if (dressData.branch !== undefined) row.set('branch', dressData.branch);
    if (dressData.dress_type !== undefined) row.set('dress_type', dressData.dress_type);
    if (dressData.designer30 !== undefined) row.set('designer30', dressData.designer30);
    if (dressData.designer100 !== undefined) row.set('designer100', dressData.designer100);
    if (dressData.designer60 !== undefined) row.set('designer60', dressData.designer60);
    if (dressData.designer20 !== undefined) row.set('designer20', dressData.designer20);
    if (dressData.designer20_2 !== undefined) row.set('designer20_2', dressData.designer20_2);
    if (dressData.time_dap !== undefined) row.set('time_dap', dressData.time_dap);
    if (dressData.status !== undefined) row.set('status', dressData.status);
    if (dressData.time_dinh !== undefined) row.set('time_dinh', dressData.time_dinh);
    if (dressData.team_dinh !== undefined) row.set('team_dinh', dressData.team_dinh);
    
    // Tự động detect header cho created_at
    if (dressData.created_at !== undefined) {
      const createdAtHeader = sheet.headerValues.find(h => 
        h.toLowerCase() === 'created_at' || h === 'CREATED_AT' || h === 'Ngày tạo'
      ) || 'CREATED_AT'; // Default to CREATED_AT
      row.set(createdAtHeader, dressData.created_at);
    }
    
    await row.save();
    
    // Trả về dress đã cập nhật
    const createdAtHeader = sheet.headerValues.find(h => 
      h.toLowerCase() === 'created_at' || h === 'CREATED_AT' || h === 'Ngày tạo'
    ) || 'created_at';    const updatedDress: Dress = {
      id: dressId,
      date: row.get('date') || '',
      dress_code: row.get('dress_code') || '',
      dress_description: row.get('dress_description') || '',
      branch: row.get('branch') || '',
      dress_type: row.get('dress_type') || '',
      designer30: row.get('designer30') || '',
      designer100: row.get('designer100') || '',
      designer60: row.get('designer60') || '',
      designer20: row.get('designer20') || '',
      designer20_2: row.get('designer20_2') || '',      time_dap: parseInt(row.get('time_dap') || '0') || 0,
      status: row.get('status') || '',
      time_dinh: parseInt(row.get('time_dinh') || '0') || 0,
      team_dinh: row.get('team_dinh') || '',
      created_at: row.get(createdAtHeader) || ''
    };
    
    console.log('Updated dress:', updatedDress);
    return updatedDress;
  } catch (error) {
    console.error('Error updating dress in Google Sheets:', error);
    throw new Error(`Failed to update dress: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteDressFromSheet(dressId: number): Promise<boolean> {
  try {
    console.log('=== Deleting Dress from Google Sheets ===');
    console.log('Dress ID:', dressId);
    
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }
    
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Tìm sheet dress
    let targetSheet = null;
    targetSheet = doc.sheetsByTitle['dress'] || doc.sheetsByTitle['Dress'] || doc.sheetsByTitle['DRESS'];
    
    if (!targetSheet) {
      targetSheet = doc.sheetsById[728077449];
    }
    
    if (!targetSheet) {
      throw new Error('Dress sheet not found');
    }
      const sheet = targetSheet;
    console.log('Delete - Selected sheet title:', sheet.title);
    console.log('Delete - Selected sheet gid:', sheet.sheetId);
    
    // Xử lý headers với duplicate detection
    let headerValues: string[] = [];
    try {
      await sheet.loadHeaderRow();
      headerValues = sheet.headerValues;
    } catch (error) {
      console.log('Header loading error - using manual approach for delete:', error);
      await sheet.loadCells('A1:Z1');
      headerValues = processHeaders(sheet, sheet.columnCount);
    }
    
    const rows = await sheet.getRows();
    console.log('Total rows available for delete:', rows.length);
    console.log('Looking for dress ID to delete:', dressId);
    
    // Tìm row với ID tương ứng
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Kiểm tra các cách định danh có thể có
      const rowId = parseInt(row.get('id') || row.get('STT') || row.get('ID') || '0');
      if (rowId === dressId) {
        rowIndex = i;
        break;
      }
      // Fallback: sử dụng row index + 1 làm ID
      if ((i + 1) === dressId) {
        rowIndex = i;
        break;
      }
    }
    
    console.log('Found row to delete at index:', rowIndex);
    
    if (rowIndex === -1) {
      // Debug: Show first few rows to understand structure
      console.log('=== DEBUG DELETE: First few rows ===');
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const row = rows[i];
        console.log(`Row ${i + 1}:`, {
          id: row.get('id') || 'N/A',
          dress_code: row.get('dress_code') || 'N/A',
          dress_description: row.get('dress_description') || 'N/A'
        });
      }
      throw new Error(`Dress with ID ${dressId} not found`);
    }
    
    const row = rows[rowIndex];
    await row.delete();
    
    console.log('Deleted dress with ID:', dressId);
    return true;
  } catch (error) {
    console.error('Error deleting dress from Google Sheets:', error);
    throw new Error(`Failed to delete dress: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
