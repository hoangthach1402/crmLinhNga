import { NextRequest, NextResponse } from 'next/server';
import { getUsersFromSheet, addUserToSheet, updateUserInSheet, deleteUserFromSheet } from '@/lib/googleSheets';

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
  try {
    console.log('API: Creating new user...');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validation
    if (!body.name || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Name and email are required'
      }, { status: 400 });
    }
    
    // Tạo user data với giá trị mặc định
    const userData = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      company: body.company?.trim() || '',
      position: body.position?.trim() || '',
      status: body.status || 'active',
      created_at: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };
    
    console.log('Processed user data:', userData);
    
    const newUser = await addUserToSheet(userData);
    
    console.log('API: Successfully created user with ID:', newUser.id);
    
    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API Error creating user:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API: Updating user...');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    console.log('Updating user ID:', id, 'with data:', body);
    
    const updatedUser = await updateUserInSheet(parseInt(id), body);
    
    console.log('API: Successfully updated user with ID:', id);
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('API Error updating user:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('API: Deleting user...');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    await deleteUserFromSheet(parseInt(id));
    
    console.log('API: Successfully deleted user with ID:', id);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('API Error deleting user:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
