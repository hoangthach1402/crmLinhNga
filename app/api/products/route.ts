import { NextRequest, NextResponse } from 'next/server';
import { getProductsFromSheet, addProductToSheet, updateProductInSheet, deleteProductFromSheet } from '../../../lib/googleSheets';

export async function GET(request: Request) {
  try {
    console.log('API: Fetching products from Google Sheets...');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    
    console.log('Query params:', { page, limit, search });
    
    const result = await getProductsFromSheet(page, limit, search);
    
    console.log(`API: Successfully fetched ${result.products.length} products`);
    
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        products: [],
        total: 0,
        page: 1,
        totalPages: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API: Creating new product...');
    
    const body = await request.json();
    console.log('Request body:', body);

    // Validate required fields
    const requiredFields = ['product_code', 'product_name', 'category', 'cost_price', 'stock_quantity', 'unit'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Process the product data
    const productData = {
      product_code: body.product_code?.toString() || '',
      product_name: body.product_name?.toString() || '',
      category: body.category?.toString() || 'fabric',
      cost_price: Number(body.cost_price) || 0,
      stock_quantity: Number(body.stock_quantity) || 0,
      unit: body.unit?.toString() || 'piece',
      image_url: body.image_url?.toString() || '',
      supplier: body.supplier?.toString() || '',
      order_link: body.order_link?.toString() || '',
      created_at: new Date().toISOString().split('T')[0]
    };

    console.log('Processed product data:', productData);

    const newProduct = await addProductToSheet(productData);
    
    console.log(`API: Successfully created product with ID: ${newProduct.id}`);
    
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create product' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API: Updating product...');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Update data:', body);

    // Process the update data
    const updateData: any = {};
    
    if (body.product_code !== undefined) updateData.product_code = body.product_code.toString();
    if (body.product_name !== undefined) updateData.product_name = body.product_name.toString();
    if (body.category !== undefined) updateData.category = body.category.toString();
    if (body.cost_price !== undefined) updateData.cost_price = Number(body.cost_price);
    if (body.stock_quantity !== undefined) updateData.stock_quantity = Number(body.stock_quantity);
    if (body.unit !== undefined) updateData.unit = body.unit.toString();
    if (body.image_url !== undefined) updateData.image_url = body.image_url.toString();
    if (body.supplier !== undefined) updateData.supplier = body.supplier.toString();
    if (body.order_link !== undefined) updateData.order_link = body.order_link.toString();

    const updatedProduct = await updateProductInSheet(parseInt(id), updateData);
    
    console.log(`API: Successfully updated product ID: ${id}`);
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('API Error updating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update product' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('API: Deleting product...');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await deleteProductFromSheet(parseInt(id));
    
    console.log(`API: Successfully deleted product ID: ${id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('API Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete product' 
      },
      { status: 500 }
    );
  }
}
