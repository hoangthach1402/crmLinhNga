import { NextRequest, NextResponse } from 'next/server';
import { getUsersFromSheet } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching users from Google Sheets...');
    
    const users = await getUsersFromSheet();
    
    console.log('API: Successfully fetched', users.length, 'users');
    
    return NextResponse.json({ 
      success: true,
      users, 
      total: users.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch data from Google Sheets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'POST method not implemented yet' 
  }, { status: 501 });
}
