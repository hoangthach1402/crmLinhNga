import { NextRequest, NextResponse } from 'next/server';
import { getDressesFromSheet, addDressToSheet, updateDressInSheet, deleteDressFromSheet } from '../../../lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching dresses from Google Sheets...');
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');    const limit = parseInt(url.searchParams.get('limit') || '50');    const search = url.searchParams.get('search') || '';
    const month = url.searchParams.get('month') || '';
    const designer = url.searchParams.get('designer') || '';
    const time_dap_param = url.searchParams.get('time_dap');
    const time_dinh_param = url.searchParams.get('time_dinh');
    
    // Convert string params to numbers for time filters
    const time_dap = time_dap_param ? parseInt(time_dap_param) : undefined;
    const time_dinh = time_dinh_param ? parseInt(time_dinh_param) : undefined;
    
    console.log('Query params:', { page, limit, search, month, designer, time_dap, time_dinh });
    
    const result = await getDressesFromSheet(page, limit, search, { month, designer, time_dap, time_dinh });
    
    console.log(`API: Successfully fetched ${result.dresses.length} dresses`);
    
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error fetching dresses:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dresses' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API: Creating new dress...');
    
    const body = await request.json();
    console.log('Request body:', body);

    // Validate required fields
    const requiredFields = ['dress_code', 'dress_description', 'branch', 'dress_type'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }    // Process the dress data
    const dressData = {
      date: body.date ? new Date(body.date).toLocaleDateString('en-CA') : '', // Format as YYYY-MM-DD
      dress_code: body.dress_code?.toString() || '',
      dress_description: body.dress_description?.toString() || '',
      branch: body.branch?.toString() || 'LINH NGA Hà Nội',
      dress_type: body.dress_type?.toString() || 'LUXURY - LÊN MỚI',
      designer30: body.designer30?.toString() || '',
      designer100: body.designer100?.toString() || '',
      designer60: body.designer60?.toString() || '',
      designer20: body.designer20?.toString() || '',
      designer20_2: body.designer20_2?.toString() || '',
      time_dap: body.time_dap ? parseInt(body.time_dap.toString()) || 0 : 0,
      time_dinh: body.time_dinh ? parseInt(body.time_dinh.toString()) || 0 : 0,
      status: body.status?.toString() || 'active',
      team_dinh: body.team_dinh?.toString() || '',
      created_at: new Date().toISOString().split('T')[0]
    };

    console.log('Processed dress data:', dressData);

    const newDress = await addDressToSheet(dressData);
    
    console.log(`API: Successfully created dress with ID: ${newDress.id}`);
    
    return NextResponse.json({
      success: true,
      dress: newDress,
      message: 'Dress created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API Error creating dress:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create dress' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API: Updating dress...');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Dress ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Update data:', body);    // Process the update data
    const updateData: any = {};
    
    if (body.date !== undefined) updateData.date = body.date.toString();
    if (body.dress_code !== undefined) updateData.dress_code = body.dress_code.toString();
    if (body.dress_description !== undefined) updateData.dress_description = body.dress_description.toString();
    if (body.branch !== undefined) updateData.branch = body.branch.toString();
    if (body.dress_type !== undefined) updateData.dress_type = body.dress_type.toString();
    if (body.designer30 !== undefined) updateData.designer30 = body.designer30.toString();
    if (body.designer100 !== undefined) updateData.designer100 = body.designer100.toString();
    if (body.designer60 !== undefined) updateData.designer60 = body.designer60.toString();
    if (body.designer20 !== undefined) updateData.designer20 = body.designer20.toString();
    if (body.designer20_2 !== undefined) updateData.designer20_2 = body.designer20_2.toString();    if (body.time_dap !== undefined) updateData.time_dap = parseInt(body.time_dap.toString()) || 0;
    if (body.time_dinh !== undefined) updateData.time_dinh = parseInt(body.time_dinh.toString()) || 0;
    if (body.status !== undefined) updateData.status = body.status.toString();
    if (body.team_dinh !== undefined) updateData.team_dinh = body.team_dinh.toString();

    const updatedDress = await updateDressInSheet(parseInt(id), updateData);
    
    console.log(`API: Successfully updated dress ID: ${id}`);
    
    return NextResponse.json({
      success: true,
      dress: updatedDress,
      message: 'Dress updated successfully'
    });
  } catch (error) {
    console.error('API Error updating dress:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update dress' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('API: Deleting dress...');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Dress ID is required' },
        { status: 400 }
      );
    }

    await deleteDressFromSheet(parseInt(id));
    
    console.log(`API: Successfully deleted dress ID: ${id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Dress deleted successfully'
    });
  } catch (error) {
    console.error('API Error deleting dress:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete dress' 
      },
      { status: 500 }
    );
  }
}
