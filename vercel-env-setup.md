# Hướng dẫn setup Environment Variables cho Vercel

## Cách 1: Thêm thủ công trên Vercel Dashboard (Khuyến nghị)

1. **Truy cập Vercel Dashboard**: 
   - Vào https://vercel.com/dashboard
   - Chọn project của bạn

2. **Settings > Environment Variables**:
   - Click vào tab "Settings"
   - Click "Environment Variables" ở sidebar

3. **Thêm các biến sau**:

### SPREADSHEET_ID
```
Name: SPREADSHEET_ID
Value: 1nxxd_14iDyL7xQcc15RMnvd_TtHHuki6AUCsPC-tw8w
Environment: Production, Preview, Development
```

### GOOGLE_SERVICE_ACCOUNT_EMAIL
```
Name: GOOGLE_SERVICE_ACCOUNT_EMAIL
Value: crudlinhnga@linhngadb.iam.gserviceaccount.com
Environment: Production, Preview, Development
```

### GOOGLE_PRIVATE_KEY
```
Name: GOOGLE_PRIVATE_KEY
Value: [Copy từ file .env.local - toàn bộ private key including -----BEGIN PRIVATE KEY----- và -----END PRIVATE KEY-----]
Environment: Production, Preview, Development
```

## Cách 2: Sử dụng Vercel CLI

1. **Link project với Vercel**:
```bash
npx vercel link
```

2. **Thêm environment variables**:
```bash
# Thêm SPREADSHEET_ID
npx vercel env add SPREADSHEET_ID

# Thêm GOOGLE_SERVICE_ACCOUNT_EMAIL  
npx vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL

# Thêm GOOGLE_PRIVATE_KEY
npx vercel env add GOOGLE_PRIVATE_KEY
```

## Cách 3: Import từ .env.local (Chỉ cho development)

1. **Tạo file .env.example**:
```bash
cp .env.local .env.example
# Sau đó xóa values và chỉ giữ keys
```

2. **Sử dụng Vercel CLI để pull/push env**:
```bash
npx vercel env pull .env.local
npx vercel env push .env.local
```

## Lưu ý quan trọng:

1. **GOOGLE_PRIVATE_KEY** cần giữ nguyên format với `\n` cho line breaks
2. **Không commit** private key vào Git
3. **Test env variables** sau khi deploy:
   - Check logs của deployment
   - Test API endpoints

## Kiểm tra env variables:

1. **Trên Vercel Dashboard**: Settings > Environment Variables
2. **Sử dụng CLI**: `npx vercel env ls`
3. **Trong code**: `console.log('ENV check:', !!process.env.SPREADSHEET_ID)`
