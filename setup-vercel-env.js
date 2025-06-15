const fs = require('fs');
const { execSync } = require('child_process');

// Đọc file .env.local
if (!fs.existsSync('.env.local')) {
    console.log('❌ File .env.local không tồn tại!');
    process.exit(1);
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};

// Parse env variables
envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        let value = valueParts.join('=');
        
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        
        envVars[key.trim()] = value;
    }
});

console.log('🚀 Setting up Vercel Environment Variables...\n');

// Các env variables cần thiết cho production
const requiredVars = [
    'GOOGLE_SPREADSHEET_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL', 
    'GOOGLE_PRIVATE_KEY',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION'
];

requiredVars.forEach(varName => {
    if (envVars[varName]) {
        console.log(`📝 Setting ${varName}...`);
        try {
            // Escape special characters for shell
            const value = envVars[varName].replace(/"/g, '\\"');
            const command = `npx vercel env add ${varName} production <<< "${value}"`;
            execSync(command, { stdio: 'inherit' });
            console.log(`✅ ${varName} added successfully\n`);
        } catch (error) {
            console.log(`❌ Failed to add ${varName}: ${error.message}\n`);
        }
    } else {
        console.log(`⚠️  ${varName} not found in .env.local\n`);
    }
});

console.log('✅ Environment variables setup completed!');
console.log('🔗 Check your variables at: https://vercel.com/dashboard > [Your Project] > Settings > Environment Variables');
